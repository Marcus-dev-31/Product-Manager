import { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth.middleware.js";

const updateBusinessSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .trim(),
});

export const updateBusiness = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const parsed = updateBusinessSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const updated = await prisma.business.update({
    where: { id: req.user!.businessId },
    data: { name: parsed.data.name },
  });

  res.json({ businessName: updated.name });
};
