import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { Card, PageHeader } from "../components/ui/Card";
import { LoadingBlock } from "../components/ui/StateBlocks";
import { Alert } from "../components/ui/Alert";

type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  subforums: {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: string;
    _count: { threads: number };
  }[];
};

export function ForumPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["forum", "categories"],
    queryFn: () => apiFetch<{ categories: Category[] }>("/forum/categories"),
  });

  if (isLoading) return <LoadingBlock label="Cargando foro…" />;
  if (error) {
    return (
      <main className="container page">
        <Alert variant="error">No se pudo cargar el foro. ¿Está la API en marcha?</Alert>
      </main>
    );
  }

  return (
    <main className="container page">
      <Card style={{ marginBottom: "1.25rem" }}>
        <PageHeader
          eyebrow="Comunidad"
          title="Foro Capital V"
          description="Departamentos, empresas, reportes públicos y soporte — estructura del esqueleto original, ahora con hilos reales."
        />
      </Card>

      {data?.categories.map((cat) => (
        <section key={cat.id} className="forum-category card">
          <div className="forum-category__head">
            <h2 className="title-font">
              {cat.icon} {cat.title}
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              {cat.description}
            </p>
          </div>
          <div className="subforum-grid">
            {cat.subforums.map((sub) => (
              <Link key={sub.id} to={`/foro/${cat.slug}/${sub.slug}`} className="card flat interactive">
                <strong>
                  {sub.icon} {sub.title}
                </strong>
                <p className="muted" style={{ margin: "0.35rem 0 0.5rem", fontSize: "0.9rem" }}>
                  {sub.description}
                </p>
                <span className="badge">{sub._count.threads} hilos</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}