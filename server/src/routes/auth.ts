import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { WebRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { getPermissionsForRole } from "../lib/permissions.js";
import { authRequired, signToken } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, username, password } = parsed.data;
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (exists) {
    res.status(409).json({ error: "Email o usuario ya registrado" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, username, passwordHash, role: WebRole.USER },
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || user.banned) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

authRouter.get("/me", authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }
  const permissions = await getPermissionsForRole(user.role);
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt,
    },
    permissions,
  });
});