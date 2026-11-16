import { WebRole } from "@prisma/client";
import { prisma } from "./prisma.js";

const roleRank: Record<WebRole, number> = {
  USER: 1,
  SUPPORT: 2,
  ADMIN: 3,
  OWNER: 4,
};

export function hasMinRole(userRole: WebRole, minRole: WebRole): boolean {
  return roleRank[userRole] >= roleRank[minRole];
}

export async function userHasPermission(userId: string, permissionKey: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.banned) return false;

  const rolePerm = await prisma.rolePermission.findFirst({
    where: {
      role: user.role,
      permission: { key: permissionKey },
    },
  });
  return Boolean(rolePerm);
}

export async function getPermissionsForRole(role: WebRole): Promise<string[]> {
  const rows = await prisma.rolePermission.findMany({
    where: { role },
    include: { permission: true },
  });
  return rows.map((r) => r.permission.key);
}