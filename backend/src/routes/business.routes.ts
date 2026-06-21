import { Router } from "express";
import { updateBusiness } from "../controllers/business.controller.js";
import {
  authenticate,
  requireAdmin,
  verifyCsrf,
} from "../middleware/auth.middleware.js";

export const businessRouter = Router();

businessRouter.patch(
  "/",
  authenticate,
  verifyCsrf,
  requireAdmin,
  updateBusiness,
);
