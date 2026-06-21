import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from "../schemas/auth.schema.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { ZodError } from "zod";
import crypto from "crypto";

const setAuthCookie = (res: Response, token: string) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "lax",
    domain: isProd ? ".marcusveliz.dev" : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "lax" : "lax",
    domain: isProd ? ".marcusveliz.dev" : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data: RegisterInput = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      res.status(400).json({ error: "El email ya está registrado" });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Unirse a un negocio existente con inviteCode
    if (data.inviteCode) {
      const business = await prisma.business.findUnique({
        where: { inviteCode: data.inviteCode },
      });

      if (!business) {
        res.status(400).json({ error: "Código de invitación inválido" });
        return;
      }

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "EDITOR",
          businessId: business.id,
        },
      });

      const token = jwt.sign(
        { userId: user.id, businessId: business.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

      setAuthCookie(res, token);

      res.status(201).json({
        businessName: business.name,
        role: user.role,
        businessId: business.id,
      });
      return;
    }

    //Crear negocio nuevo
    if (!data.businessName) {
      res.status(400).json({ error: "El nombre del negocio es requerido" });
      return;
    }

    const business = await prisma.business.create({
      data: {
        name: data.businessName,
        users: {
          create: {
            email: data.email,
            password: hashedPassword,
            role: "ADMIN",
          },
        },
      },
      include: { users: true },
    });

    const user = business.users[0];

    const token = jwt.sign(
      { userId: user.id, businessId: business.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    setAuthCookie(res, token);

    res.status(201).json({
      businessName: business.name,
      role: user.role,
      businessId: business.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(500).json({ error: "Error del servidor" });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data: LoginInput = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { business: true },
    });

    if (!user) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, businessId: user.businessId, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    setAuthCookie(res, token);

    res.status(200).json({
      businessName: user.business.name,
      role: user.role,
      businessId: user.businessId,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(500).json({ error: "Error del servidor" });
  }
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    domain: isProd ? ".marcusveliz.dev" : undefined,
  });
  res.clearCookie("csrfToken", {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    domain: isProd ? ".marcusveliz.dev" : undefined,
  });
  res.json({ message: "Sesión cerrada correctamente" });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: { business: true },
  });

  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json({
    businessName: user.business.name,
    role: user.role,
    businessId: user.businessId,
  });
}
