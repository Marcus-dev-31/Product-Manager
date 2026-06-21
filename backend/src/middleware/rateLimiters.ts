import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Demasiados intentos. Esperá 15 minutos antes de intentar de nuevo.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: "Demasiados mensajes enviados. Intentá de nuevo en 1 hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
