import { Link } from "react-router-dom";
import { HeroSlider } from "../components/home/HeroSlider";
import { PlaySteps } from "../components/home/PlaySteps";
import { RolePathsSection } from "../components/home/RolePathsSection";
import { StreamersSection } from "../components/home/StreamersSection";
import { BusinessSection } from "../components/home/BusinessSection";
import { Card } from "../components/ui/Card";
import { linkBtnClass } from "../components/ui/Button";

export function HomePage() {
  return (
    <main>
      <HeroSlider />
      <RolePathsSection />
      <StreamersSection />
      <BusinessSection />

      <section id="como-jugar">
        <PlaySteps />
      </section>

      <section className="container page">
        <Card style={{ textAlign: "center" }}>
          <h2 className="title-font" style={{ marginTop: 0 }}>
            ¿Preparado para entrar a la ciudad?
          </h2>
          <p className="muted" style={{ maxWidth: 520, margin: "0 auto 1rem" }}>
            Únete a Capital V, conoce a la comunidad en el foro y reserva tu lugar cuando abramos whitelist.
          </p>
          <Link to="/cuenta" className={linkBtnClass("primary")}>
            Crear cuenta
          </Link>
        </Card>
      </section>
    </main>
  );
}