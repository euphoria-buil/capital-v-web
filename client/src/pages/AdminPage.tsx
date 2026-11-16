import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type WebRole } from "../api/client";
import { RequirePermission } from "../components/RequirePermission";
import { useAuth } from "../context/AuthContext";
import { Card, PageHeader } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";

type UserRow = {
  id: string;
  email: string;
  username: string;
  role: WebRole;
  banned: boolean;
};

export function AdminPage() {
  const { hasPermission } = useAuth();
  const qc = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () =>
      apiFetch<{ users: number; threads: number; reportsOpen: number; packs: number }>("/admin/stats"),
    enabled: hasPermission("admin.access"),
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiFetch<{ users: UserRow[] }>("/admin/users"),
    enabled: hasPermission("users.manage"),
  });

  async function patchUser(id: string, patch: Partial<Pick<UserRow, "role" | "banned">>) {
    await apiFetch(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await qc.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  if (!hasPermission("admin.access")) {
    return (
      <main className="container page">
        <Alert variant="error">Sin acceso al panel de administración</Alert>
      </main>
    );
  }

  return (
    <main className="container page">
      <PageHeader title="Administración" description="Resumen del servidor web y gestión de usuarios." />

      <div className="grid-2" style={{ margin: "1.25rem 0 1.5rem" }}>
        <StatCard label="Usuarios" value={statsQuery.data?.users} />
        <StatCard label="Hilos foro" value={statsQuery.data?.threads} />
        <StatCard label="Reportes abiertos" value={statsQuery.data?.reportsOpen} />
        <StatCard label="Packs activos" value={statsQuery.data?.packs} />
      </div>

      <RequirePermission permission="users.manage">
        <Card className="table-wrap">
          <h2 className="title-font" style={{ marginTop: 0 }}>
            Usuarios
          </h2>
          <table className="data">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Baneado</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.data?.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => patchUser(u.id, { role: e.target.value as WebRole })}>
                      {(["USER", "SUPPORT", "ADMIN", "OWNER"] as WebRole[]).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input type="checkbox" checked={u.banned} onChange={(e) => patchUser(u.id, { banned: e.target.checked })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </RequirePermission>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <Card>
      <span className="badge">{label}</span>
      <div className="title-font" style={{ fontSize: "2.2rem", marginTop: "0.35rem" }}>
        {value ?? "—"}
      </div>
    </Card>
  );
}