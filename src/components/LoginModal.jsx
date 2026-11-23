
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginModal.css";

function LoginModal({ abierto, cerrar }) {
  const { registrar, iniciarSesion } = useAuth();

  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (!abierto) return null;

  function cambiarModo() {
    setModoRegistro(!modoRegistro);
    setMensaje("");
    setPassword("");
  }

  function enviarFormulario(evento) {
    evento.preventDefault();

    if (modoRegistro) {
      const resultado = registrar(nombre, correo, password);

      setMensaje(resultado.mensaje);

      if (resultado.ok) {
        setModoRegistro(false);
        setPassword("");
      }

    } else {
      const resultado = iniciarSesion(correo, password);

      setMensaje(resultado.mensaje);

      if (resultado.ok) {
        setNombre("");
        setCorreo("");
        setPassword("");
        setMensaje("");
        cerrar();
      }
    }
  }

  return (
    <div className="login-fondo" onClick={cerrar}>
      <div
        className="login-caja"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-titulo"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="login-cerrar"
          onClick={cerrar}
          aria-label="Cerrar ventana"
        >
          ×
        </button>

        <img
          src="/logo-capital-v.png"
          alt="Capital V Roleplay"
          className="login-logo"
        />

        <h2 id="login-titulo">
          {modoRegistro
            ? "Crear cuenta"
            : "Bienvenido a Capital V"}
        </h2>

        <p>
          {modoRegistro
            ? "Únete a nuestra comunidad de roleplay."
            : "Inicia sesión para acceder a tu cuenta."}
        </p>

        <form onSubmit={enviarFormulario}>
          {modoRegistro && (
            <>
              <label htmlFor="login-nombre">
                Nombre de usuario
              </label>

              <input
                id="login-nombre"
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                minLength={3}
                required
              />
            </>
          )}

          <label htmlFor="login-correo">
            Correo electrónico
          </label>

          <input
            id="login-correo"
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
          />

          <label htmlFor="login-password">
            Contraseña
          </label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            required
          />

          {modoRegistro && (
            <p className="login-ayuda">
              La contraseña debe tener mínimo 8 caracteres,
              comenzar con mayúscula e incluir un número
              y un carácter especial.
            </p>
          )}

          <button
            type="submit"
            className="login-enviar"
          >
            {modoRegistro
              ? "Registrarse"
              : "Iniciar sesión"}
          </button>
        </form>

        {mensaje && (
          <p className="login-mensaje" role="status">
            {mensaje}
          </p>
        )}

        <button
          type="button"
          className="login-cambiar"
          onClick={cambiarModo}
        >
          {modoRegistro
            ? "¿Ya tienes cuenta? Iniciar sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
