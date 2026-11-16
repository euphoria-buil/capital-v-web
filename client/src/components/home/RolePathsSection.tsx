import { useState } from "react";
import { PromoCard } from "./PromoCard";

const LEGAL = [
  {
    title: "LSPD & seguridad",
    tag: "Legal",
    description: "Patrullas, investigación y cadena de mando. Construye carrera dentro del cuerpo.",
  },
  {
    title: "EMS & sanidad",
    tag: "Legal",
    description: "Salva vidas en Los Santos: protocolos, ambulancias y hospital con rol serio.",
  },
  {
    title: "Gobierno & justicia",
    tag: "Legal",
    description: "Leyes, trámites y política urbana. Dale forma a la ciudad desde instituciones.",
  },
  {
    title: "Empresas registradas",
    tag: "Legal",
    description: "Abre negocio con permisos, contratos y economía regulada por la administración.",
  },
] as const;

const ILLEGAL = [
  {
    title: "Organizaciones criminales",
    tag: "Ilegal",
    description: "Territorio, economía paralela y conflictos con otras facciones — con reglas del servidor.",
  },
  {
    title: "Bandas de barrio",
    tag: "Ilegal",
    description: "Identidad de calle, respeto y guerras de barrio con narrativa y consecuencias IC.",
  },
  {
    title: "Contrabando & rutas",
    tag: "Ilegal",
    description: "Mueve mercancía, evita la ley y negocia con contactos bajo riesgo constante.",
  },
  {
    title: "Motor clubs & crews",
    tag: "Ilegal",
    description: "Hermandad sobre ruedas, talleres propios y eventos de convoy nocturno.",
  },
] as const;

export function RolePathsSection() {
  const [mode, setMode] = useState<"legal" | "illegal">("legal");
  const items = mode === "legal" ? LEGAL : ILLEGAL;

  return (
    <section className="promo-section promo-section--band" aria-labelledby="role-paths-title">
      <div className="container">
        <header className="promo-section__head">
          <span className="badge">Tu historia</span>
          <h2 id="role-paths-title" className="title-font">
            Elige tu camino en Capital V
          </h2>
          <p className="muted">
            Organizaciones legales e ilegales con espacio propio en la ciudad. Cada tarjeta es un estilo de vida
            distinto — tú decides si proteges Los Santos o lo cambias desde las sombras.
          </p>
        </header>

        <div className="promo-tabs" role="tablist" aria-label="Tipo de organización">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "legal"}
            className={`btn sm ${mode === "legal" ? "" : "secondary"}`}
            onClick={() => setMode("legal")}
          >
            Legales
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "illegal"}
            className={`btn sm ${mode === "illegal" ? "" : "secondary"}`}
            onClick={() => setMode("illegal")}
          >
            Ilegales
          </button>
        </div>

        <div className="promo-grid" key={mode}>
          {items.map((item) => (
            <PromoCard key={item.title} tone={mode} title={item.title} tag={item.tag} description={item.description} />
          ))}
        </div>
      </div>
    </section>
  );
}