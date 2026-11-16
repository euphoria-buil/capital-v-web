import { Router } from "express";
import { z } from "zod";
import { ReportStatus, ReportType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { authRequired, requirePermission } from "../middleware/auth.js";

export const reportsRouter = Router();

const createSchema = z.object({
  type: z.nativeEnum(ReportType),
  title: z.string().min(5).max(120),
  description: z.string().min(10).max(10000),
  evidenceUrl: z.string().url().optional().or(z.literal("")),
});

reportsRouter.get("/mine", authRequired, async (req, res) => {
  const reports = await prisma.report.findMany({
    where: { authorId: req.user!.id },
    orderBy: { createdAt: "desc" },
    include: {
      assignee: { select: { id: true, username: true, role: true } },
    },
  });
  res.json({ reports });
});

reportsRouter.post("/", authRequired, requirePermission("reports.create"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const report = await prisma.report.create({
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description,
      evidenceUrl: parsed.data.evidenceUrl || null,
      authorId: req.user!.id,
    },
  });

  res.status(201).json({ report });
});

reportsRouter.get("/", authRequired, requirePermission("reports.manage"), async (req, res) => {
  const status = req.query.status as ReportStatus | undefined;
  const reports = await prisma.report.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, email: true } },
      assignee: { select: { id: true, username: true, role: true } },
    },
  });
  res.json({ reports });
});

const updateSchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
  staffNotes: z.string().max(5000).optional(),
});

reportsRouter.patch("/:id", authRequired, requirePermission("reports.manage"), async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: {
      status: parsed.data.status,
      assigneeId: parsed.data.assigneeId,
      staffNotes: parsed.data.staffNotes,
    },
    include: {
      author: { select: { id: true, username: true } },
      assignee: { select: { id: true, username: true, role: true } },
    },
  });

  res.json({ report });
});