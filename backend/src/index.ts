import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import productsRouter from "./routes/products.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { businessRouter } from "./routes/business.routes.js";
import { teamRouter } from "./routes/team.routes.js";
import { emailRouter } from "./routes/email.routes.js";
import { contactRouter } from "./routes/contact.routes.js";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://precify-eta.vercel.app",
      "https://productmanager.marcusveliz.dev",
    ],
  }),
);

app.use(express.json());

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 requests por IP por hora
  message: {
    error: "Demasiados mensajes enviados. Intentá de nuevo en 1 hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/products", productsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRouter);
app.use("/api/team", teamRouter);
app.use("/api/email", emailRouter);
app.use("/api/contact", contactRouter);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
