const FRAMES = ["/imagenes/portada1.jpg", "/imagenes/portada2.jpg", "/imagenes/portada3.jpg"];

export function PromoCard({
  title,
  description,
  tag,
  tone,
}: {
  title: string;
  description: string;
  tag: string;
  tone: "legal" | "illegal";
}) {
  return (
    <article className={`promo-card promo-card--${tone}`}>
      <div className="promo-card__media" aria-hidden="true">
        <div className="promo-card__media-track">
          {FRAMES.map((src) => (
            <div key={`${title}-${src}`} className="promo-card__frame" style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
      </div>
      <div className="promo-card__body">
        <span className={`badge promo-card__tag`}>{tag}</span>
        <h3 className="title-font">{title}</h3>
        <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
          {description}
        </p>
      </div>
    </article>
  );
}