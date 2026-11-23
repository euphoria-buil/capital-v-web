
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Perfil.css";
import "./PerfilExtra.css";

function cargarImagen(evento, cambiar, maxAncho) {
  const archivo = evento.target.files?.[0];
  if (!archivo) return;
  if (!archivo.type.startsWith("image/") || archivo.size > 8 * 1024 * 1024) { alert("Selecciona una imagen de máximo 8 MB."); return; }
  const url = URL.createObjectURL(archivo);
  const imagen = new Image();
  imagen.onload = () => {
    const escala = Math.min(1, maxAncho / imagen.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(imagen.width * escala);
    canvas.height = Math.round(imagen.height * escala);
    canvas.getContext("2d").drawImage(imagen, 0, 0, canvas.width, canvas.height);
    cambiar(canvas.toDataURL("image/jpeg", .65));
    URL.revokeObjectURL(url);
  };
  imagen.onerror = () => URL.revokeObjectURL(url);
  imagen.src = url;
}

function Perfil() {
  const { usuario, actualizarPerfil, obtenerPerfilPublico } = useAuth();
  const { id } = useParams();
  const propio = !id || usuario?.id === id;
  const perfil = propio ? usuario : obtenerPerfilPublico(id);

  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [mensaje, setMensaje] = useState("");
  const [biografia, setBiografia] = useState(usuario?.biografia || "");
  const [foto, setFoto] = useState(usuario?.foto || "");
  const [portada, setPortada] = useState(usuario?.portada || "");

  if (!perfil) {
    return (
      <main className="perfil-pagina">
        <div className="perfil-contenedor">
          <h1>Debes iniciar sesión</h1>
          <p>Inicia sesión para acceder a tu perfil.</p>
          <Link to="/" className="perfil-volver">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const fechaRegistro = perfil.fechaRegistro
    ? new Date(usuario.fechaRegistro).toLocaleDateString(
        "es-ES",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : "No disponible";

  function guardarCambios(evento) {
    evento.preventDefault();

    const resultado = actualizarPerfil({ nombre, biografia, foto, portada });
    setMensaje(resultado.mensaje);

    if (resultado.ok) {
      setEditando(false);
    }
  }

  return (
    <main className="perfil-pagina">
      <div className="perfil-contenedor">

        <Link to="/" className="perfil-volver">
          ← Volver al inicio
        </Link>

        <div className="perfil-tarjeta">
          <div className="perfil-portada" style={perfil.portada ? { backgroundImage: `url(${perfil.portada})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />

          <div className="perfil-cuerpo">
            <div className="perfil-encabezado">
              <div className="perfil-avatar">
                {perfil.foto ? <img src={perfil.foto} alt="Foto de perfil" className="perfil-v2-foto" /> : perfil.nombre.charAt(0).toUpperCase()}
              </div>

              <div className="perfil-identidad">
                <h1>{perfil.nombre}</h1>
                <p>
                  {perfil.rol === "fundador"
                    ? "Fundador de Capital V"
                    : "Miembro de Capital V"}
                </p>
              </div>

              <span className="perfil-rango">
                {perfil.rol === "fundador"
                  ? "Fundador"
                  : "Usuario"}
              </span>
            </div>

            <p className="perfil-v2-bio">{perfil.biografia || "Sin biografía todavía."}</p>
            <div className="perfil-v2-stats"><div><small>Temas</small><strong>—</strong></div><div><small>Respuestas</small><strong>—</strong></div><div><small>Reacciones</small><strong>—</strong></div></div>
            <p className="perfil-v2-nota">Estadísticas pendientes de conectar con el foro.</p>
            <div className="perfil-estadisticas">
              <div>
                <small>Fecha de registro</small>
                <strong>{fechaRegistro}</strong>
              </div>

              <div>
                <small>Estado de cuenta</small>
                <strong className="perfil-activa">
                  ● Activa
                </strong>
              </div>
            </div>

            <section className="perfil-seccion">
              <div className="perfil-seccion-titulo">
                <div>
                  <h2>Información personal</h2>
                  <p>Consulta y actualiza tu perfil.</p>
                </div>

                {propio && !editando && (
                  <button
                    type="button"
                    className="perfil-editar"
                    onClick={() => {
                      setNombre(perfil.nombre);
                      setBiografia(perfil.biografia || "");
                      setFoto(perfil.foto || "");
                      setPortada(perfil.portada || "");
                      setMensaje("");
                      setEditando(true);
                    }}
                  >
                    Editar perfil
                  </button>
                )}
              </div>

              {propio && editando ? (
                <form
                  className="perfil-formulario"
                  onSubmit={guardarCambios}
                >
                  <label htmlFor="perfil-nombre">
                    Nombre de usuario
                  </label>

                  <input
                    id="perfil-nombre"
                    type="text"
                    value={nombre}
                    minLength={3}
                    maxLength={30}
                    onChange={e => setNombre(e.target.value)}
                    required
                  />

                  <label htmlFor="perfil-bio">Biografía</label>
                  <textarea id="perfil-bio" value={biografia} maxLength={300} rows={4} onChange={e => setBiografia(e.target.value)} />
                  <label htmlFor="perfil-foto">Foto de perfil</label>
                  <input id="perfil-foto" type="file" accept="image/*" onChange={e => cargarImagen(e, setFoto, 320)} />
                  {foto && <img className="perfil-v2-mini" src={foto} alt="Vista previa de avatar" />}
                  <label htmlFor="perfil-portada">Portada</label>
                  <input id="perfil-portada" type="file" accept="image/*" onChange={e => cargarImagen(e, setPortada, 1000)} />
                  {portada && <img className="perfil-v2-banner" src={portada} alt="Vista previa de portada" />}
                  <div className="perfil-acciones">
                    <button
                      type="submit"
                      className="perfil-guardar"
                    >
                      Guardar cambios
                    </button>

                    <button
                      type="button"
                      className="perfil-cancelar"
                      onClick={() => setEditando(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="perfil-datos">
                  <div>
                    <small>Nombre de usuario</small>
                    <strong>{perfil.nombre}</strong>
                  </div>

                  {propio && <div>
                    <small>Correo electrónico</small>
                    <strong>{perfil.correo}</strong>
                  </div>}

                  <div>
                    <small>Rango</small>
                    <strong>
                      {perfil.rol === "fundador"
                        ? "Fundador"
                        : "Usuario"}
                    </strong>
                  </div>
                </div>
              )}

              {mensaje && (
                <p className="perfil-mensaje" role="status">
                  {mensaje}
                </p>
              )}
            </section>

            <section className="perfil-seccion">
              <h2>{propio ? "Compartir perfil" : "Perfil público"}</h2>
              {propio && <Link to={`/usuario/${perfil.id}`}>Ver mi perfil público</Link>}
              <p className="perfil-v2-nota">Esta versión funciona solo con cuentas guardadas en este navegador.</p>
              <h2>Mi cuenta</h2>
              <p className="perfil-nota">
                Puedes personalizar tu foto, portada y biografía desde Editar perfil.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Perfil;
