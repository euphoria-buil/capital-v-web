import { Router } from "express";
import { z } from "zod";
import { WebRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  authRequired,
  requireMinRole,
  requirePermission,
} from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(authRequired, requirePermission("admin.access"));

adminRouter.get("/stats", async (_req, res) => {
  const [users, threads, reportsOpen, packs] = await Promise.all([
    prisma.user.count(),
    prisma.forumThread.count(),
    prisma.report.count({ where: { status: "OPEN" } }),
    prisma.shopPack.count({ where: { active: true } }),
  ]);
  res.json({ users, threads, reportsOpen, packs });
});

adminRouter.get("/users", requirePermission("users.manage"), async (req, res) => {
  const q = String(req.query.q ?? "");
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      banned: true,
      createdAt: true,
    },
  });
  res.json({ users });
});

const userPatchSchema = z.object({
  role: z.nativeEnum(WebRole).optional(),
  banned: z.boolean().optional(),
});

adminRouter.patch("/users/:id", requirePermission("users.manage"), async (req, res) => {
  const parsed = userPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  if (parsed.data.role === WebRole.OWNER && req.user!.role !== WebRole.OWNER) {
    res.status(403).json({ error: "Solo el owner puede asignar rol OWNER" });
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: parsed.data,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      banned: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "user.update",
      userId: req.user!.id,
      meta: { targetUserId: user.id, changes: parsed.data },
    },
  });

  res.json({ user });
});

/** Matriz de permisos — solo owner */
adminRouter.get(
  "/permissions",
  requireMinRole(WebRole.OWNER),
  requirePermission("permissions.manage"),
  async (_req, res) => {
    const [permissions, rolePermissions] = await Promise.all([
      prisma.permission.findMany({ orderBy: { key: "asc" } }),
      prisma.rolePermission.findMany(),
    ]);
    res.json({ permissions, rolePermissions });
  }
);

const permUpdateSchema = z.object({
  role: z.nativeEnum(WebRole),
  permissionId: z.string().cuid(),
  enabled: z.boolean(),
});

adminRouter.post(
  "/permissions",
  requireMinRole(WebRole.OWNER),
  requirePermission("permissions.manage"),
  async (req, res) => {
    const parsed = permUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { role, permissionId, enabled } = parsed.data;

    if (enabled) {
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role, permissionId } },
        update: {},
        create: { role, permissionId },
      });
    } else {
      await prisma.rolePermission.deleteMany({ where: { role, permissionId } });
    }

    await prisma.auditLog.create({
      data: {
        action: "permissions.update",
        userId: req.user!.id,
        meta: { role, permissionId, enabled },
      },
    });

    res.json({ ok: true });
  }
);