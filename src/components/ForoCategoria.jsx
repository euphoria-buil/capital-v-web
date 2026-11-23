
import { useState } from "react";
import { Link } from "react-router-dom";

function FlechaCategoria({ abierta = false, desplegable = false }) {
  return (
    <span
      className="cvf-flecha-circulo"
      aria-hidden="true"
    >
      <svg
        className={abierta ? "girada" : ""}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {desplegable ? (
          <path d="m6 9 6 6 6-6" />
        ) : (
          <path d="m9 18 6-6-6-6" />
        )}
      </svg>
    </span>
  );
}

export default function ForoCategoria({
  titulo,
  descripcion,
  icono,
  id,
  hijos,
  busqueda = ""
}) {
  const [abierto, setAbierto] = useState(false);

  const textoBusqueda = busqueda.toLowerCase().trim();
  const coincideGrupo = `${titulo} ${descripcion}`
    .toLowerCase()
    .includes(textoBusqueda);

  if (hijos) {
    const visibles = hijos.filter(h =>
      `${h.titulo} ${h.descripcion || ""}`
        .toLowerCase()
        .includes(textoBusqueda)
    );

    if (
      textoBusqueda &&
      !coincideGrupo &&
      visibles.length === 0
    ) {
      return null;
    }

    const estaAbierto = abierto || Boolean(textoBusqueda);

    const categoriasMostrar = coincideGrupo
      ? hijos
      : visibles;

    return (
      <div className="cvf-grupo">
        <button
          type="button"
          className="cvf-categoria"
          aria-expanded={estaAbierto}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="cvf-icono">
            {icono}
          </span>

          <span className="cvf-info">
            <strong>{titulo}</strong>
            <small>{descripcion}</small>
          </span>

          <FlechaCategoria
            abierta={estaAbierto}
            desplegable
          />
        </button>

        {estaAbierto && (
          <div className="cvf-hijos">
            {categoriasMostrar.map(h => (
              <Link
                key={h.id}
                to={`/foro/categoria/${h.id}`}
                className="cvf-hijo"
              >
                {h.icono} {h.titulo}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!coincideGrupo) {
    return null;
  }

  return (
    <Link
      className="cvf-categoria"
      to={`/foro/categoria/${id}`}
    >
      <span className="cvf-icono">
        {icono}
      </span>

      <span className="cvf-info">
        <strong>{titulo}</strong>
        <small>{descripcion}</small>
      </span>

      <FlechaCategoria />
    </Link>
  );
}
