import { Request, Response } from "express";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.email("Email inválido"),
  type: z.enum(["peticion", "consulta", "proyecto"]),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const sendContact = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { name, email, type, message } = parsed.data;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const typeLabel = {
    peticion: "Peticion",
    consulta: "Consulta",
    proyecto: "Proyecto personalizado",
  }[type];

  try {
    await resend.emails.send({
      from: "Precify <noreply@marcusveliz.dev>",
      to: "marcus.devprojects@gmail.com",
      subject: `[Precify] ${typeLabel} de ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #E8590C;">Nuevo mensaje de Precify</h2>
            <p><strong>Tipo:</strong> ${typeLabel}</p>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${safeMessage}</p>
        </div>
      `,
    });

    res.json({ message: "Mensaje enviado correctamente" });
  } catch {
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};
