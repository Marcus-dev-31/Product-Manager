import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Precify <onboarding@resend.dev>",
    to: email,
    subject: "Verificá tu email — Precify",
    html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #E8590C;">Verificá tu email</h2>
                <p>Gracias por registrarte en Precify. Hacé click en el botón para verificar tu email:</p>
                <a href="${url}" style="display: inline-block; background: #E8590C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                    Verificar email
                </a>
                <p style="color: #888; font-size: 12px;">Este link expira en 24 horas. Si no creaste una cuenta en Precify, ignorá este email.</p>
            </div>
        `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Precify <onboarding@resend.dev>",
    to: email,
    subject: "Recuperar contraseña — Precify",
    html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #E8590C;">Recuperar contraseña</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña. Hacé click en el botón para continuar:</p>
                <a href="${url}" style="display: inline-block; background: #E8590C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                    Restablecer contraseña
                </a>
                <p style="color: #888; font-size: 12px;">Este link expira en 1 hora. Si no solicitaste restablecer tu contraseña, ignorá este email.</p>
            </div>
        `,
  });
};
