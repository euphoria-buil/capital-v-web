import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { WebRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { hasMinRole, userHasPermission } from "../lib/permissions.js";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: WebRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export function signToken(user: AuthUser): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn } as jwt.SignOptions
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub || !payload.email || !payload.username || !payload.role) return null;
    return {
      id: String(payload.sub),
      email: String(payload.email),
      username: String(payload.username),
      role: payload.role as WebRole,
    };
  } catch {
    return null;
  }
}

export async function authOptional(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const user = verifyToken(header.slice(7));
    if (user) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser && !dbUser.banned) {
        req.user = {
          id: dbUser.id,
          email: dbUser.email,
          username: dbUser.username,
          role: dbUser.role,
        };
      }
    }
  }
  next();
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }
  next();
}

export function requireMinRole(minRole: WebRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }
    if (!hasMinRole(req.user.role, minRole)) {
      res.status(403).json({ error: "Permisos insuficientes" });
      return;
    }
    next();
  };
}

export function requirePermission(permissionKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }
    const ok = await userHasPermission(req.user.id, permissionKey);
    if (!ok) {
      res.status(403).json({ error: "Permiso denegado", permission: permissionKey });
      return;
    }
    next();
  };
}