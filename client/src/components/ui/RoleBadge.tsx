import type { WebRole } from "../../api/client";

export function RoleBadge({
  role,
  label,
  className = "",
}: {
  role: WebRole | string;
  label?: string;
  className?: string;
}) {
  return <span className={[`badge role-${role}`, className].filter(Boolean).join(" ")}>{label ?? role}</span>;
}