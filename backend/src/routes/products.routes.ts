import { Router } from "express";
import { authenticate, verifyCsrf } from "../middleware/auth.middleware.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductHistory,
} from "../controllers/products.controller.js";

const router = Router();

router.use(authenticate);
router.use(verifyCsrf);

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id/history", getProductHistory);

export default router;
