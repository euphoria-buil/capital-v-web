import { Card } from "../ui/Card";
import { linkBtnClass } from "../ui/Button";

const STEPS = [
  {
    n: 1,
    title: "Instala GTA V",
    text: "Copia original en Steam, Epic Games o Rockstar Launcher.",
    img: "/imagenes/gta-logo.png",
    tags: ["Steam", "Epic", "Rockstar"],
  },
  {
    n: 2,
    title: "Instala FiveM",
    text: "Cliente gratuito desde fivem.net para jugar en servidores personalizados.",
    img: "/imagenes/fivem.png",
    href: "https://fivem.net/",
    cta: "Descargar FiveM",
  },
  {
    n: 3,
    title: "Únete a Capital V",
    text: "Crea tu cuenta web, entra al foro y conecta cuando el servidor esté publicado en la lista.",
    img: "/imagenes/lossantos-mapa.png",
    cta: "Próximamente",
  },
];

export function PlaySteps() {
  return (
    <section className="container page">
      <header className="page-header" style={{ textAlign: "center", marginInline: "auto" }}>
        <span className="badge">Tutorial</span>
        <h1 className="title-font">¿Cómo jugar?</h1>
        <p>Tres pasos para empezar tu historia en Los Santos.</p>
      </header>

      <div className="grid-3">
        {STEPS.map((step) => (
          <Card key={step.n} className="step-card">
            <div className="step-num">{step.n}</div>
            <h3 className="title-font" style={{ margin: "0.35rem 0" }}>
              {step.title}
            </h3>
            <p className="muted" style={{ marginTop: 0 }}>
              {step.text}
            </p>
            {step.tags && (
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {step.tags.map((t) => (
                  <span key={t} className="badge">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {step.href && (
              <a className={linkBtnClass("primary", "sm")} href={step.href} target="_blank" rel="noreferrer">
                {step.cta}
              </a>
            )}
            {step.cta && !step.href && <span className="badge">{step.cta}</span>}
            <img src={step.img} alt="" loading="lazy" />
          </Card>
        ))}
      </div>
    </section>
  );
}