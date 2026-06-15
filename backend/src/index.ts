import "dotenv/config";
import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { businessRouter } from "./routes/business.routes.js";
import { teamRouter } from "./routes/team.routes.js";
import { emailRouter } from "./routes/email.routes.js";
import { contactRouter } from "./routes/contact.routes.js";

const app = express();
const PORT = 3000;

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://precify-eta.vercel.app",
        "https://productmanager.marcusveliz.dev",
      ]
    : [
        "http://localhost:5173",
        "https://precify-eta.vercel.app",
        "https://productmanager.marcusveliz.dev",
      ];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

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
