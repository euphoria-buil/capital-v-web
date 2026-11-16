import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authRequired, requirePermission } from "../middleware/auth.js";

export const shopRouter = Router();

shopRouter.get("/", async (_req, res) => {
  const packs = await prisma.shopPack.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
  res.json({ packs });
});

const packSchema = z.object({
  slug: z.string().min(2).max(40),
  name: z.string().min(2).max(80),
  description: z.string().min(2).max(2000),
  priceCents: z.number().int().min(0),
  currency: z.string().default("EUR"),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

shopRouter.post("/", authRequired, requirePermission("shop.manage"), async (req, res) => {
  const parsed = packSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const pack = await prisma.shopPack.create({ data: parsed.data });
  res.status(201).json({ pack });
});

shopRouter.patch("/:id", authRequired, requirePermission("shop.manage"), async (req, res) => {
  const parsed = packSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const pack = await prisma.shopPack.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json({ pack });
});