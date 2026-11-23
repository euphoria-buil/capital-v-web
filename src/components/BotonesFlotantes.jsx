
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BotonesFlotantes.css";

export default function BotonesFlotantes() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const revisarScroll = () => {
      setVisible(window.scrollY > 300);
    };

    revisarScroll();

    window.addEventListener("scroll", revisarScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", revisarScroll);
    };
  }, []);

  const volverArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`cv-botones-flotantes ${
        visible ? "cv-flotantes-visibles" : ""
      }`}
    >
      <Link
        to="/foro"
        className="cv-boton-foro"
        aria-label="Ir al foro de Capital V"
      >
        <span aria-hidden="true">💬</span>
        <span>Ir al foro</span>
      </Link>

      <button
        type="button"
        className="cv-boton-arriba"
        onClick={volverArriba}
        aria-label="Volver al inicio de la página"
        title="Volver arriba"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
