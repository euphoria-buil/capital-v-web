import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type WebRole } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Card, PageHeader } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { LoadingBlock } from "../components/ui/StateBlocks";

const ROLES: WebRole[] = ["USER", "SUPPORT", "ADMIN", "OWNER"];

export function OwnerPermissionsPage() {
  const { user, hasPermission } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: () =>
      apiFetch<{
        permissions: { id: string; key: string; label: string }[];
        rolePermissions: { role: WebRole; permissionId: string }[];
      }>("/admin/permissions"),
    enabled: user?.role === "OWNER" && hasPermission("permissions.manage"),
  });

  const enabledSet = useMemo(() => {
    const set = new Set<string>();
    query.data?.rolePermissions.forEach((rp) => set.add(`${rp.role}:${rp.permissionId}`));
    return set;
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: (body: { role: WebRole; permissionId: string; enabled: boolean }) =>
      apiFetch("/admin/permissions", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "permissions"] }),
  });

  if (user?.role !== "OWNER" || !hasPermission("permissions.manage")) {
    return (
      <main className="container page">
        <Alert variant="error">Solo el owner puede gestionar permisos web</Alert>
      </main>
    );
  }

  if (query.isLoading) return <LoadingBlock label="Cargando matriz de permisos…" />;

  return (
    <main className="container page">
      <Card style={{ marginBottom: "1rem" }}>
        <PageHeader
          title="Permisos por rol"
          description="Activa o desactiva capacidades para USER, SUPPORT, ADMIN y OWNER sin desplegar código."
        />
      </Card>

      <Card className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Permiso</th>
              {ROLES.map((r) => (
                <th key={r}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {query.data?.permissions.map((perm) => (
              <tr key={perm.id}>
                <td>
                  <strong>{perm.label}</strong>
                  <br />
                  <span className="badge">{perm.key}</span>
                </td>
                {ROLES.map((role) => {
                  const on = enabledSet.has(`${role}:${perm.id}`);
                  return (
                    <td key={role}>
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={mutation.isPending}
                        onChange={(e) =>
                          mutation.mutate({
                            role,
                            permissionId: perm.id,
                            enabled: e.target.checked,
                          })
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}