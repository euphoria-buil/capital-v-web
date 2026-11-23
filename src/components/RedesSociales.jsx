
import "./RedesSociales.css";

const redes = [
  {
    nombre: "Discord",
    enlace: "#",
    icono: "🎮",
  },
  {
    nombre: "Instagram",
    enlace: "#",
    icono: "◎",
  },
  {
    nombre: "TikTok",
    enlace: "#",
    icono: "♪",
  },
  {
    nombre: "YouTube",
    enlace: "#",
    icono: "▶",
  },
  {
    nombre: "X",
    enlace: "#",
    icono: "𝕏",
  },
];

export default function RedesSociales() {
  return (
    <footer className="capital-footer">
      <h2>CAPITAL V ROLEPLAY</h2>

      <p>Síguenos en nuestras redes sociales</p>

      <div className="capital-redes">
        {redes.map((red) => (
          <a
            key={red.nombre}
            href={red.enlace}
            className="capital-red-social"
            aria-label={red.nombre}
            title={red.nombre}
            onClick={(evento) => {
              if (red.enlace === "#") {
                evento.preventDefault();
              }
            }}
          >
            <span aria-hidden="true">{red.icono}</span>
          </a>
        ))}
      </div>

      <div className="capital-footer-linea" />

      <p className="capital-copyright">
        © {new Date().getFullYear()} Capital V Roleplay.
        Todos los derechos reservados.
      </p>
    </footer>
  );
}
