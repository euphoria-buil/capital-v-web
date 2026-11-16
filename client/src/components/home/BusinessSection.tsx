import { Link } from "react-router-dom";
import { linkBtnClass } from "../ui/Button";

const IDEAS = [
  "Talleres, concesionarios y importación de vehículos",
  "Bares, restaurantes y locales nocturnos con personal contratado",
  "Empresas de seguridad, logística y construcción",
  "Startups con socios IC: inversión, nóminas y crecimiento real",
];

export function BusinessSection() {
  return (
    <section className="promo-section promo-section--band" aria-labelledby="business-title">
      <div className="container business-showcase">
        <BusinessVisual />
        <div>
          <span className="badge">Economía RP</span>
          <h2 id="business-title" className="title-font">
            Monta tu negocio con tus amigos
          </h2>
          <p className="muted">
            En Capital V la economía no es decoración: registra tu empresa, contrata, factura y compite con el resto de
            Los Santos. Ideal para grupos que quieren jugar en equipo con objetivos claros.
          </p>
          <ul className="business-list">
            {IDEAS.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            <Link to="/foro" className={linkBtnClass("primary")}>
              Foro de empresas
            </Link>
            <Link to="/cuenta" className={linkBtnClass("secondary")}>
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessVisual() {
  return (
    <div className="business-showcase__visual" aria-hidden="true">
      <img src="/imagenes/fondo.jpg" alt="" loading="lazy" />
    </div>
  );
}