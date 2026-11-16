import { useAuth } from "../context/AuthContext";

export function RequirePermission({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasPermission, loading } = useAuth();
  if (loading) return null;
  if (!hasPermission(permission)) return fallback;
  return children;
}