import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, WebRole } from "@prisma/client";
import {
  DEFAULT_ROLE_PERMISSIONS,
  FORUM_CATEGORIES,
  PERMISSIONS,
  SHOP_PACKS,
} from "./seed-data/forum.js";

const prisma = new PrismaClient();

async function main() {
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { label: perm.label, description: perm.description },
      create: perm,
    });
  }

  const allPerms = await prisma.permission.findMany();
  const permByKey = Object.fromEntries(allPerms.map((p) => [p.key, p.id]));

  for (const [role, keys] of Object.entries(DEFAULT_ROLE_PERMISSIONS) as [WebRole, string[]][]) {
    for (const key of keys) {
      const permissionId = permByKey[key];
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role, permissionId } },
        update: {},
        create: { role, permissionId },
      });
    }
  }

  let order = 0;
  for (const [slug, cat] of Object.entries(FORUM_CATEGORIES)) {
    const category = await prisma.forumCategory.upsert({
      where: { slug },
      update: {
        title: cat.titulo,
        description: cat.descripcion,
        icon: cat.icono,
        sortOrder: order,
      },
      create: {
        slug,
        title: cat.titulo,
        description: cat.descripcion,
        icon: cat.icono,
        sortOrder: order,
      },
    });
    order += 1;

    for (const [subSlug, title, description, icon] of cat.subforos) {
      await prisma.forumSubforum.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: subSlug } },
        update: { title, description, icon },
        create: {
          slug: subSlug,
          title,
          description,
          icon,
          categoryId: category.id,
        },
      });
    }
  }

  for (const pack of SHOP_PACKS) {
    await prisma.shopPack.upsert({
      where: { slug: pack.slug },
      update: pack,
      create: pack,
    });
  }

  const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@capitalv.local";
  const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? "Owner123!";
  const ownerUsername = process.env.SEED_OWNER_USERNAME ?? "owner";

  const passwordHash = await bcrypt.hash(ownerPassword, 12);
  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { role: WebRole.OWNER, passwordHash, username: ownerUsername },
    create: {
      email: ownerEmail,
      username: ownerUsername,
      passwordHash,
      role: WebRole.OWNER,
    },
  });

  console.log("Seed completado. Owner:", ownerEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());