import { Router } from "express";
import { updateBusiness } from "../controllers/business.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

export const businessRouter = Router();

businessRouter.patch("/", authenticate, requireAdmin, updateBusiness);