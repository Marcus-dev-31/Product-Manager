import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;
