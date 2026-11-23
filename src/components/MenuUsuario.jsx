
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MenuUsuario.css";

function MenuUsuario() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);

  useEffect(() => {
    function cerrarFuera(evento) {
      if (
        contenedor.current &&
        !contenedor.current.contains(evento.target)
      ) {
        setAbierto(false);
      }
    }

    function cerrarEscape(evento) {
      if (evento.key === "Escape") {
        setAbierto(false);
      }
    }

    document.addEventListener("mousedown", cerrarFuera);
    document.addEventListener("keydown", cerrarEscape);

    return () => {
      document.removeEventListener("mousedown", cerrarFuera);
      document.removeEventListener("keydown", cerrarEscape);
    };
  }, []);

  if (!usuario) return null;

  function salir() {
    cerrarSesion();
    setAbierto(false);
    navigate("/");
  }

  function irAlPerfil() {
    setAbierto(false);
    navigate("/perfil");
  }

  return (
    <div className="menu-usuario" ref={contenedor}>
      <button
        type="button"
        className={`menu-usuario-boton ${abierto ? "activo" : ""}`}
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-haspopup="true"
      >
        <span className="menu-usuario-avatar">
          {usuario.foto ? <img src={usuario.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : usuario.nombre.charAt(0).toUpperCase()}
        </span>

        <span className="menu-usuario-datos">
          <strong>{usuario.nombre}</strong>
          <small>
            {usuario.rol === "fundador"
              ? "Fundador"
              : "Miembro"}
          </small>
        </span>

        <span className="menu-usuario-icono" aria-hidden="true">
          <svg
            className={abierto ? "girado" : ""}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {abierto && (
        <div className="menu-usuario-desplegable">
          <div className="menu-usuario-info">
            <strong>{usuario.nombre}</strong>
            <small>
              {usuario.rol === "fundador"
                ? "Fundador"
                : "Miembro de Capital V"}
            </small>
          </div>

          <button type="button" onClick={irAlPerfil}>
            👤 Mi perfil
          </button>

          <button
            type="button"
            onClick={() => {
              setAbierto(false);
              navigate("/configuracion");
            }}
          >
            ⚙️ Configuración
          </button>

          {usuario.rol === "fundador" && (
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                alert("Panel de administración próximamente.");
              }}
            >
              🛡️ Panel de administración
            </button>
          )}

          <div className="menu-usuario-separador" />

          <button
            type="button"
            className="menu-usuario-salir"
            onClick={salir}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuUsuario;
