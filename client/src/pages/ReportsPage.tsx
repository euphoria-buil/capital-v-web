import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { RequirePermission } from "../components/RequirePermission";
import { Card, PageHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const TYPES = [
  { value: "PLAYER", label: "Jugador" },
  { value: "APPEAL", label: "Apelación" },
  { value: "BUG", label: "Bug" },
  { value: "OTHER", label: "Otro" },
] as const;

const STATUSES = ["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"] as const;

type Report = {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  author?: { username: string; email?: string };
};

export function ReportsPage() {
  const { hasPermission } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"mine" | "staff">("mine");

  const mineQuery = useQuery({
    queryKey: ["reports", "mine"],
    queryFn: () => apiFetch<{ reports: Report[] }>("/reports/mine"),
  });

  const staffQuery = useQuery({
    queryKey: ["reports", "staff"],
    queryFn: () => apiFetch<{ reports: Report[] }>("/reports"),
    enabled: hasPermission("reports.manage"),
  });

  const activeList = tab === "mine" ? mineQuery.data?.reports : staffQuery.data?.reports;

  async function createReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await apiFetch("/reports", {
      method: "POST",
      body: JSON.stringify({
        type: fd.get("type"),
        title: fd.get("title"),
        description: fd.get("description"),
        evidenceUrl: fd.get("evidenceUrl") || "",
      }),
    });
    e.currentTarget.reset();
    await qc.invalidateQueries({ queryKey: ["reports"] });
  }

  async function updateReport(id: string, status: string) {
    await apiFetch(`/reports/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await qc.invalidateQueries({ queryKey: ["reports"] });
  }

  return (
    <main className="container page">
      <Card style={{ marginBottom: "1rem" }}>
        <PageHeader
          title="Reportes in-game"
          description="Describe incidencias con jugadores, apela sanciones o reporta bugs del servidor."
        />
      </Card>

      <div className="tabs" style={{ marginBottom: "1rem" }}>
        <Button variant={tab === "mine" ? "primary" : "secondary"} onClick={() => setTab("mine")}>
          Mis reportes
        </Button>
        <RequirePermission permission="reports.manage">
          <Button variant={tab === "staff" ? "primary" : "secondary"} onClick={() => setTab("staff")}>
            Panel staff
          </Button>
        </RequirePermission>
      </div>

      <Card style={{ marginBottom: "1rem" }}>
        <h2 className="title-font" style={{ marginTop: 0 }}>
          Nuevo reporte
        </h2>
        <form className="form-stack" onSubmit={createReport}>
          <select name="type" required defaultValue="PLAYER">
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input name="title" placeholder="Título breve" required minLength={5} />
          <textarea name="description" rows={5} placeholder="Qué ocurrió, cuándo y quién estaba involucrado" required minLength={10} />
          <input name="evidenceUrl" type="url" placeholder="Enlace a clip o captura (opcional)" />
          <button className="btn" type="submit">
            Enviar reporte
          </button>
        </form>
      </Card>

      <Card className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Estado</th>
              {tab === "staff" && <th>Autor</th>}
              <th>Fecha</th>
              {tab === "staff" && <th>Gestión</th>}
            </tr>
          </thead>
          <tbody>
            {activeList?.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.type}</td>
                <td>
                  <span className={`status-${r.status}`}>{r.status}</span>
                </td>
                {tab === "staff" && <td>{r.author?.username}</td>}
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                {tab === "staff" && (
                  <td>
                    <select defaultValue={r.status} onChange={(e) => updateReport(r.id, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}