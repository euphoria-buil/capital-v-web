import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { linkBtnClass } from "../ui/Button";

const SLIDES = [
  { src: "/imagenes/portada1.jpg", alt: "Ciudad de Los Santos" },
  { src: "/imagenes/portada2.jpg", alt: "Vida en el servidor" },
  { src: "/imagenes/portada3.jpg", alt: "Comunidad Capital V" },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="home-hero" aria-label="Portada">
      <div className="home-hero__slides" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`home-hero__slide ${i === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.src})` }}
          />
        ))}
      </div>
      <div className="home-hero__overlay" aria-hidden="true" />

      <div className="home-hero__content">
        <span className="badge dot">Los Santos · FiveM</span>
        <h1 className="graffiti">CAPITAL V</h1>
        <h2 className="title-font">ROLEPLAY</h2>
        <p>Tu historia comienza en Los Santos. Facciones, negocios, eventos y una comunidad que vive el rol cada día.</p>
        <div className="home-hero__actions">
          <a href="#como-jugar" className={linkBtnClass("primary")}>
            Empezar a jugar
          </a>
          <Link to="/foro" className={linkBtnClass("secondary")}>
            Comunidad
          </Link>
        </div>
      </div>

      <div className="home-hero__dots" role="tablist" aria-label="Diapositivas">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={slide.alt}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}