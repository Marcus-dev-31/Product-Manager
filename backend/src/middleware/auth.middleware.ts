import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    businessId: string;
    role: string;
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      businessId: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Acceso restringido a administradores" });
    return;
  }
  next();
}

export function verifyCsrf(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const mutatingMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (!mutatingMethods.includes(req.method)) {
    next();
    return;
  }

  const csrfCookie = req.cookies?.csrfToken;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    res.status(403).json({ error: "Token CSRF inválido" });
    return;
  }

  next();
}
