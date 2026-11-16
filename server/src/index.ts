import "dotenv/config";
import cors from "cors";
import express from "express";
import { authOptional } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { forumRouter } from "./routes/forum.js";
import { reportsRouter } from "./routes/reports.js";
import { shopRouter } from "./routes/shop.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(authOptional);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "capital-v-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/forum", forumRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/shop", shopRouter);
app.use("/api/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(port, () => {
  console.log(`Capital V API escuchando en http://localhost:${port}`);
});