import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import { Card, PageHeader } from "../components/ui/Card";
import { LoadingBlock } from "../components/ui/StateBlocks";

type Pack = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  featured: boolean;
};

export function ShopPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["shop"],
    queryFn: () => apiFetch<{ packs: Pack[] }>("/shop"),
  });

  if (isLoading) return <LoadingBlock label="Cargando tienda…" />;

  return (
    <main className="container page">
      <Card style={{ marginBottom: "1.25rem" }}>
        <PageHeader
          eyebrow="Membresías"
          title="Tienda oficial"
          description="Packs cargados desde PostgreSQL. La pasarela de pago se puede conectar en una fase posterior."
        />
      </Card>

      <div className="grid-3">
        {data?.packs.map((pack) => (
          <Card key={pack.id} className={`shop-pack ${pack.featured ? "featured" : ""}`}>
            {pack.featured && <span className="badge">Destacado</span>}
            <h2 className="title-font" style={{ margin: "0.35rem 0" }}>
              {pack.name}
            </h2>
            <p className="muted" style={{ marginTop: 0, flex: 1 }}>
              {pack.description}
            </p>
            <p className="shop-pack__price">
              {(pack.priceCents / 100).toFixed(2)} {pack.currency}
            </p>
            <button type="button" className="btn secondary" disabled>
              Comprar (próximamente)
            </button>
          </Card>
        ))}
      </div>
    </main>
  );
}