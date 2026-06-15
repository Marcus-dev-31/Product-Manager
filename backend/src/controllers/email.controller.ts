import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
  email: z.email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

// Genera un token aleatorio seguro
const generateToken = () => crypto.randomBytes(32).toString("hex");

export const sendVerification = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
  });

  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  if (user.emailVerified) {
    res.status(400).json({ error: "El email ya está verificado" });
    return;
  }

  // Eliminar tokens anteriores del mismo tipo
  await prisma.token.deleteMany({
    where: { userId: user.id, type: "EMAIL_VERIFICATION" },
  });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  await prisma.token.create({
    data: { token, type: "EMAIL_VERIFICATION", expiresAt, userId: user.id },
  });

  await sendVerificationEmail(user.email, token);

  res.json({ message: "Email de verificación enviado" });
};

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.query as { token: string };

  if (!token) {
    res.status(400).json({ error: "Token requerido" });
    return;
  }

  const tokenRecord = await prisma.token.findUnique({
    where: { token },
  });

  if (!tokenRecord || tokenRecord.type !== "EMAIL_VERIFICATION") {
    res.status(400).json({ error: "Token inválido" });
    return;
  }

  if (tokenRecord.expiresAt < new Date()) {
    res.status(400).json({ error: "El token expiró" });
    return;
  }

  if (tokenRecord.usedAt) {
    res.status(400).json({ error: "El token ya fue usado" });
    return;
  }

  await prisma.token.delete({
    where: { token },
  });

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { emailVerified: true },
  });

  res.json({ message: "Email verificado correctamente" });
};

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = forgotPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // Siempre respondemos OK aunque el email no exista — seguridad
  if (!user) {
    res.json({ message: "Si el email existe, recibirás un link" });
    return;
  }

  await prisma.token.deleteMany({
    where: { userId: user.id, type: "PASSWORD_RESET" },
  });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.token.create({
    data: { token, type: "PASSWORD_RESET", expiresAt, userId: user.id },
  });

  await sendPasswordResetEmail(user.email, token);

  res.json({ message: "Si el email existe, recibirás un link" });
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = resetPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const tokenRecord = await prisma.token.findUnique({
    where: { token: parsed.data.token },
  });

  if (!tokenRecord || tokenRecord.type !== "PASSWORD_RESET") {
    res.status(400).json({ error: "Token inválido" });
    return;
  }

  if (tokenRecord.expiresAt < new Date()) {
    res.status(400).json({ error: "El token expiró" });
    return;
  }

  if (tokenRecord.usedAt) {
    res.status(400).json({ error: "El token ya fue usado" });
    return;
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  await prisma.token.delete({
    where: { token: parsed.data.token },
  });

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  res.json({ message: "Contraseña actualizada correctamente" });
};
