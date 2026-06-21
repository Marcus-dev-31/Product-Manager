import { Router } from "express";
import {
  sendVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/email.controller.js";
import { authenticate, verifyCsrf } from "../middleware/auth.middleware.js";

export const emailRouter = Router();

emailRouter.post(
  "/send-verification",
  authenticate,
  verifyCsrf,
  sendVerification,
);
emailRouter.get("/verify", verifyEmail);
emailRouter.post("/forgot-password", forgotPassword);
emailRouter.post("/reset-password", resetPassword);
