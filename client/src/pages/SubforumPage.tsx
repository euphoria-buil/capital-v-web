import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Card, PageHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { LoadingBlock } from "../components/ui/StateBlocks";
import { RoleBadge } from "../components/ui/RoleBadge";

export function SubforumPage() {
  const { categorySlug = "", subSlug = "" } = useParams();
  const { hasPermission } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["forum", "subforum", categorySlug, subSlug],
    queryFn: () =>
      apiFetch<{
        subforum: { title: string; description: string; category: { title: string; slug: string } };
        threads: {
          id: string;
          title: string;
          pinned: boolean;
          locked: boolean;
          updatedAt: string;
          author: { username: string; role: string };
          _count: { posts: number };
        }[];
      }>(`/forum/subforums/${categorySlug}/${subSlug}`),
  });

  async function createThread(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch(`/forum/subforums/${categorySlug}/${subSlug}/threads`, {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
      setTitle("");
      setContent("");
      setShowForm(false);
      await qc.invalidateQueries({ queryKey: ["forum", "subforum", categorySlug, subSlug] });
    } catch {
      setError("No se pudo crear el hilo. Revisa que tengas sesión y permiso forum.post.");
    }
  }

  if (isLoading) return <LoadingBlock />;
  if (!data) {
    return (
      <main className="container page">
        <Alert variant="error">Subforo no encontrado</Alert>
      </main>
    );
  }

  return (
    <main className="container page">
      <p className="breadcrumbs">
        <Link to="/foro">Foro</Link> / {data.subforum.category.title}
      </p>

      <Card style={{ marginBottom: "1rem" }}>
        <PageHeader title={data.subforum.title} description={data.subforum.description} />
      </Card>

      {hasPermission("forum.post") && (
        <div style={{ marginBottom: "1rem" }}>
          <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "Nuevo hilo"}</Button>
          {showForm && (
            <Card flat style={{ marginTop: "1rem" }}>
              <form className="form-stack" onSubmit={createThread}>
                <input placeholder="Título del hilo" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea
                  placeholder="Primer mensaje"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                {error && <Alert variant="error">{error}</Alert>}
                <button className="btn" type="submit">
                  Publicar
                </button>
              </form>
            </Card>
          )}
        </div>
      )}

      <Card className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Hilo</th>
              <th>Autor</th>
              <th>Mensajes</th>
              <th>Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {data.threads.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link to={`/foro/hilo/${t.id}`}>
                    {t.pinned && "📌 "}
                    {t.locked && "🔒 "}
                    {t.title}
                  </Link>
                </td>
                <td>
                  <RoleBadge role={t.author.role} label={t.author.username} />
                </td>
                <td>{t._count.posts}</td>
                <td>{new Date(t.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}