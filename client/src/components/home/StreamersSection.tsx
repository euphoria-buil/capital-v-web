import { Card } from "../ui/Card";
import { linkBtnClass } from "../ui/Button";

const OFFICIAL = [
  { name: "CapitalV_Live", role: "Directo del servidor", avatar: "/imagenes/portada2.jpg" },
  { name: "LSPD_RP", role: "Policía en directo", avatar: "/imagenes/portada1.jpg" },
  { name: "NightCity_RP", role: "Vida nocturna & eventos", avatar: "/imagenes/portada3.jpg" },
] as const;

const HIGHLIGHTS = [
  "Best moments de la semana",
  "Eventos comunitarios en vivo",
  "Entrevistas a facciones y negocios",
  "Guías para nuevos jugadores",
];

export function StreamersSection() {
  return (
    <section className="promo-section" aria-labelledby="streamers-title">
      <div className="container">
        <header className="promo-section__head">
          <span className="badge">En directo</span>
          <h2 id="streamers-title" className="title-font">
            Streamers oficiales
          </h2>
          <p className="muted">
            Sigue la acción en Twitch y YouTube. Contenido curado del servidor y creadores de la comunidad Capital V.
          </p>
        </header>

        <div className="streamer-grid">
          {OFFICIAL.map((s) => (
            <Card key={s.name} className="streamer-card">
              <div className="streamer-card__avatar" style={{ backgroundImage: `url(${s.avatar})` }} />
              <span className="badge">Oficial</span>
              <h3 className="title-font">{s.name}</h3>
              <p className="muted" style={{ margin: "0 0 0.75rem", fontSize: "0.88rem" }}>
                {s.role}
              </p>
              <a className={linkBtnClass("secondary", "sm")} href="https://twitch.tv/" target="_blank" rel="noreferrer">
                Ver canal
              </a>
            </Card>
          ))}
        </div>

        <Card style={{ marginTop: "1.25rem" }}>
          <h3 className="title-font" style={{ marginTop: 0 }}>
            Contenido destacado
          </h3>
          <ul className="business-list" style={{ marginBottom: 0 }}>
            {HIGHLIGHTS.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}