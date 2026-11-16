import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingBlock } from "../components/ui/StateBlocks";
import { RoleBadge } from "../components/ui/RoleBadge";

export function ThreadPage() {
  const { threadId = "" } = useParams();
  const { hasPermission } = useAuth();
  const qc = useQueryClient();
  const [reply, setReply] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["forum", "thread", threadId],
    queryFn: () =>
      apiFetch<{
        thread: {
          id: string;
          title: string;
          pinned: boolean;
          locked: boolean;
          subforum: { slug: string; category: { slug: string; title: string } };
          author: { username: string; role: string };
          posts: {
            id: string;
            content: string;
            createdAt: string;
            author: { username: string; role: string };
          }[];
        };
      }>(`/forum/threads/${threadId}`),
  });

  async function sendReply(e: FormEvent) {
    e.preventDefault();
    await apiFetch(`/forum/threads/${threadId}/posts`, {
      method: "POST",
      body: JSON.stringify({ content: reply }),
    });
    setReply("");
    await qc.invalidateQueries({ queryKey: ["forum", "thread", threadId] });
  }

  async function moderate(patch: { pinned?: boolean; locked?: boolean }) {
    await apiFetch(`/forum/threads/${threadId}`, { method: "PATCH", body: JSON.stringify(patch) });
    await qc.invalidateQueries({ queryKey: ["forum", "thread", threadId] });
  }

  if (isLoading) return <LoadingBlock />;
  if (!data) {
    return (
      <main className="container page">
        <p className="muted">Hilo no encontrado</p>
      </main>
    );
  }

  const t = data.thread;

  return (
    <main className="container page">
      <p className="breadcrumbs">
        <Link to={`/foro/${t.subforum.category.slug}/${t.subforum.slug}`}>← Volver al subforo</Link>
      </p>

      <Card>
        <h1 className="title-font" style={{ marginTop: 0 }}>
          {t.title}
        </h1>
        <p className="muted">
          por <RoleBadge role={t.author.role} label={t.author.username} /> · {t.subforum.category.title}
        </p>

        {hasPermission("forum.moderate") && (
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <Button variant="secondary" size="sm" onClick={() => moderate({ pinned: !t.pinned })}>
              {t.pinned ? "Quitar pin" : "Fijar"}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => moderate({ locked: !t.locked })}>
              {t.locked ? "Reabrir" : "Cerrar"}
            </Button>
          </div>
        )}

        <div>
          {t.posts.map((p) => (
            <article key={p.id} className="thread-post" style={{ marginBottom: "0.75rem" }}>
              <header className="thread-post__meta">
                <RoleBadge role={p.author.role} label={p.author.username} />
                <span className="badge">{new Date(p.createdAt).toLocaleString()}</span>
              </header>
              <p className="thread-post__body">{p.content}</p>
            </article>
          ))}
        </div>

        {hasPermission("forum.post") && !t.locked && (
          <form className="form-stack" style={{ marginTop: "1.25rem" }} onSubmit={sendReply}>
            <textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} required placeholder="Escribe tu respuesta…" />
            <button className="btn" type="submit">
              Responder
            </button>
          </form>
        )}
      </Card>
    </main>
  );
}