import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authOptional, authRequired, requirePermission } from "../middleware/auth.js";

export const forumRouter = Router();

forumRouter.use(authOptional);

forumRouter.get("/categories", async (_req, res) => {
  const categories = await prisma.forumCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      subforums: {
        orderBy: { title: "asc" },
        include: { _count: { select: { threads: true } } },
      },
    },
  });
  res.json({ categories });
});

forumRouter.get("/subforums/:categorySlug/:subSlug", async (req, res) => {
  const category = await prisma.forumCategory.findUnique({
    where: { slug: req.params.categorySlug },
  });
  if (!category) {
    res.status(404).json({ error: "Categoría no encontrada" });
    return;
  }

  const subforum = await prisma.forumSubforum.findUnique({
    where: { categoryId_slug: { categoryId: category.id, slug: req.params.subSlug } },
    include: { category: true },
  });
  if (!subforum) {
    res.status(404).json({ error: "Subforo no encontrado" });
    return;
  }

  const threads = await prisma.forumThread.findMany({
    where: { subforumId: subforum.id },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    include: {
      author: { select: { id: true, username: true, role: true } },
      _count: { select: { posts: true } },
    },
  });

  res.json({ subforum, threads });
});

forumRouter.get("/threads/:threadId", async (req, res) => {
  const thread = await prisma.forumThread.findUnique({
    where: { id: req.params.threadId },
    include: {
      author: { select: { id: true, username: true, role: true } },
      subforum: { include: { category: true } },
      posts: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, username: true, role: true } } },
      },
    },
  });
  if (!thread) {
    res.status(404).json({ error: "Hilo no encontrado" });
    return;
  }
  res.json({ thread });
});

const threadSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(3).max(20000),
});

forumRouter.post(
  "/subforums/:categorySlug/:subSlug/threads",
  authRequired,
  requirePermission("forum.post"),
  async (req, res) => {
    const parsed = threadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const category = await prisma.forumCategory.findUnique({
      where: { slug: req.params.categorySlug },
    });
    if (!category) {
      res.status(404).json({ error: "Categoría no encontrada" });
      return;
    }

    const subforum = await prisma.forumSubforum.findUnique({
      where: { categoryId_slug: { categoryId: category.id, slug: req.params.subSlug } },
    });
    if (!subforum) {
      res.status(404).json({ error: "Subforo no encontrado" });
      return;
    }

    const thread = await prisma.forumThread.create({
      data: {
        title: parsed.data.title,
        subforumId: subforum.id,
        authorId: req.user!.id,
        posts: {
          create: {
            content: parsed.data.content,
            authorId: req.user!.id,
          },
        },
      },
      include: { author: { select: { id: true, username: true, role: true } } },
    });

    res.status(201).json({ thread });
  }
);

const replySchema = z.object({ content: z.string().min(1).max(20000) });

forumRouter.post(
  "/threads/:threadId/posts",
  authRequired,
  requirePermission("forum.post"),
  async (req, res) => {
    const parsed = replySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const thread = await prisma.forumThread.findUnique({ where: { id: req.params.threadId } });
    if (!thread) {
      res.status(404).json({ error: "Hilo no encontrado" });
      return;
    }
    if (thread.locked) {
      res.status(403).json({ error: "Hilo cerrado" });
      return;
    }

    const post = await prisma.forumPost.create({
      data: {
        content: parsed.data.content,
        threadId: thread.id,
        authorId: req.user!.id,
      },
      include: { author: { select: { id: true, username: true, role: true } } },
    });

    await prisma.forumThread.update({
      where: { id: thread.id },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ post });
  }
);

forumRouter.patch(
  "/threads/:threadId",
  authRequired,
  requirePermission("forum.moderate"),
  async (req, res) => {
    const schema = z.object({
      pinned: z.boolean().optional(),
      locked: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const thread = await prisma.forumThread.update({
      where: { id: req.params.threadId },
      data: parsed.data,
    });
    res.json({ thread });
  }
);