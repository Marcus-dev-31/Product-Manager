import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { businessRouter } from "./routes/business.routes.js";
import { teamRouter } from "./routes/team.routes.js";
import { emailRouter } from "./routes/email.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { authLimiter, contactLimiter } from "./middleware/rateLimiters.js";

const app = express();
app.set("trust proxy", 1);
const PORT = 3000;

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://productmanager.marcusveliz.dev",
        "https://product-manager-puce-three.vercel.app",
      ]
    : [
        "http://localhost:5173",
        "https://productmanager.marcusveliz.dev",
        "https://product-manager-puce-three.vercel.app",
      ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/products", productsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRouter);
app.use("/api/team", teamRouter);
app.use("/api/email", authLimiter, emailRouter);
app.use("/api/contact", contactLimiter, contactRouter);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
