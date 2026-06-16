import { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["EDITOR", "VIEWER"]),
});

export const getTeam = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const users = await prisma.user.findMany({
    where: { businessId: req.user!.businessId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  res.json(users);
};

export const getInviteCode = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const business = await prisma.business.findUnique({
    where: { id: req.user!.businessId },
    select: { inviteCode: true },
  });
  res.json({ inviteCode: business!.inviteCode });
};

export const updateRole = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const id = req.params.id as string;
  const parsed = updateRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || user.businessId !== req.user!.businessId) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  if (user.role === "ADMIN") {
    res.status(403).json({ error: "No podés cambiar el rol del admin" });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, email: true, role: true },
  });

  res.json(updated);
};

export const removeUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const id = req.params.id as string;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || user.businessId !== req.user!.businessId) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  if (user.role === "ADMIN") {
    res.status(403).json({ error: "No podés eliminar al admin" });
    return;
  }

  await prisma.user.delete({ where: { id } });
  res.json({ message: "Usuario eliminado" });
};
