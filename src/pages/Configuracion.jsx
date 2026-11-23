import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Configuracion.css";

const valoresIniciales = {
  perfilPublico: true, mostrarEnLinea: true, permitirMensajes: true,
  notificarRespuestas: true, notificarMenciones: true, notificarAnuncios: true,
  tema: "oscuro", reducirAnimaciones: false
};
const secciones = [
  ["cuenta", "👤", "Mi cuenta"], ["seguridad", "🛡️", "Seguridad"],
  ["privacidad", "🔒", "Privacidad"], ["notificaciones", "🔔", "Notificaciones"],
  ["apariencia", "🎨", "Apariencia"], ["peligro", "⚠️", "Zona de peligro"]
];
function Opcion({ titulo, detalle, activo, cambiar }) {
  return <label className="cfg-opcion"><span><strong>{titulo}</strong><small>{detalle}</small></span>
    <input type="checkbox" checked={activo} onChange={e => cambiar(e.target.checked)} /></label>;
}
export default function Configuracion() {
  const { usuario, actualizarConfiguracion, cambiarCorreo, cambiarClaveDemo, eliminarCuentaDemo } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState("cuenta");
  const [preferencias, setPreferencias] = useState(valoresIniciales);
  const [correo, setCorreo] = useState("");
  const [claveActual, setClaveActual] = useState("");
  const [claveNueva, setClaveNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  useEffect(() => {
    if (usuario) {
      setPreferencias({ ...valoresIniciales, ...usuario.configuracion });
      setCorreo(usuario.correo || "");
    }
  }, [usuario]);
  useEffect(() => {
    document.body.classList.toggle("cv-reducir-animaciones", !!usuario?.configuracion?.reducirAnimaciones);
    document.body.classList.toggle("cv-tema-claro", usuario?.configuracion?.tema === "claro");
    return () => { document.body.classList.remove("cv-reducir-animaciones", "cv-tema-claro"); };
  }, [usuario?.configuracion?.reducirAnimaciones, usuario?.configuracion?.tema]);
  if (!usuario) return <main className="cfg-pagina"><div className="cfg-panel"><h1>Inicia sesión</h1><p>Debes iniciar sesión para administrar tu cuenta.</p><Link to="/">Volver al inicio</Link></div></main>;
  const cambiar = (campo, valor) => { setPreferencias(p => ({ ...p, [campo]: valor })); setMensaje(""); };
  const guardar = () => { const r = actualizarConfiguracion(preferencias); setMensaje(r.mensaje); };
  const guardarCorreo = e => { e.preventDefault(); setMensaje(cambiarCorreo(correo).mensaje); };
  const guardarClave = e => { e.preventDefault(); if (claveNueva !== confirmar) { setMensaje("Las contraseñas nuevas no coinciden."); return; } const r = cambiarClaveDemo(claveActual, claveNueva); setMensaje(r.mensaje); if (r.ok) { setClaveActual(""); setClaveNueva(""); setConfirmar(""); } };
  const borrar = () => { if (confirmar !== "ELIMINAR") { setMensaje("Escribe ELIMINAR para confirmar."); return; } const r = eliminarCuentaDemo(); if (r.ok) navigate("/"); else setMensaje(r.mensaje); };
  return <main className="cfg-pagina"><div className="cfg-contenedor">
    <Link to="/perfil" className="cfg-volver">← Volver a mi perfil</Link>
    <header className="cfg-cabecera"><span className="cfg-etiqueta">CAPITAL V ROLEPLAY</span><h1>Configuración</h1><p>Administra tu cuenta y personaliza tu experiencia.</p></header>
    <div className="cfg-layout"><aside className="cfg-menu" aria-label="Secciones de configuración">{secciones.map(([id, icono, nombre]) =>
      <button type="button" key={id} className={seccion === id ? "seleccionado" : ""} onClick={() => { setSeccion(id); setMensaje(""); }}><span>{icono}</span>{nombre}</button>)}</aside>
    <section className="cfg-panel">
      {seccion === "cuenta" && <><h2>Mi cuenta</h2><p className="cfg-descripcion">Actualiza los datos de tu cuenta de prueba.</p>
        <div className="cfg-dato"><span>Nombre de usuario</span><strong>{usuario.nombre}</strong><Link to="/perfil">Editar en mi perfil</Link></div>
        <form onSubmit={guardarCorreo} className="cfg-form"><label htmlFor="cfg-correo">Correo electrónico</label><input id="cfg-correo" type="email" required value={correo} onChange={e => setCorreo(e.target.value)} /><button className="cfg-primario">Guardar correo</button></form>
        <div className="cfg-dato"><span>Fecha de registro</span><strong>{usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleDateString("es-ES") : "No disponible"}</strong></div>
        <p className="cfg-nota">Este correo solo se guarda en el navegador; todavía no se verifica por email.</p></>}
      {seccion === "seguridad" && <><h2>Seguridad</h2><p className="cfg-descripcion">Opciones disponibles en el sistema de prueba.</p>
        <form onSubmit={guardarClave} className="cfg-form"><label htmlFor="cfg-actual">Contraseña actual</label><input id="cfg-actual" type="password" autoComplete="current-password" required value={claveActual} onChange={e => setClaveActual(e.target.value)} />
        <label htmlFor="cfg-nueva">Nueva contraseña</label><input id="cfg-nueva" type="password" autoComplete="new-password" required minLength={8} value={claveNueva} onChange={e => setClaveNueva(e.target.value)} />
        <label htmlFor="cfg-confirmar">Confirmar nueva contraseña</label><input id="cfg-confirmar" type="password" autoComplete="new-password" required value={confirmar} onChange={e => setConfirmar(e.target.value)} />
        <button className="cfg-primario">Cambiar contraseña de prueba</button></form>
        <p className="cfg-nota">⚠️ Las contraseñas de esta demo se almacenan localmente sin seguridad de producción. No uses una contraseña real. Verificación en dos pasos y sesiones por dispositivo requieren un servidor de autenticación.</p></>}
      {seccion === "privacidad" && <><h2>Privacidad</h2><p className="cfg-descripcion">Preferencias para la futura integración con el foro.</p>
        <Opcion titulo="Perfil público" detalle="Permitir que otros miembros consulten tu perfil." activo={preferencias.perfilPublico} cambiar={v => cambiar("perfilPublico", v)} />
        <Opcion titulo="Mostrar estado en línea" detalle="Indicar cuándo estás conectado." activo={preferencias.mostrarEnLinea} cambiar={v => cambiar("mostrarEnLinea", v)} />
        <Opcion titulo="Permitir mensajes privados" detalle="Autorizar mensajes de otros miembros." activo={preferencias.permitirMensajes} cambiar={v => cambiar("permitirMensajes", v)} />
        <p className="cfg-nota">Estas preferencias se guardan, pero la privacidad real deberá aplicarse desde el servidor cuando exista backend.</p><button className="cfg-primario" onClick={guardar}>Guardar preferencias</button></>}
      {seccion === "notificaciones" && <><h2>Notificaciones</h2><p className="cfg-descripcion">Elige qué avisos quieres recibir cuando se conecte el foro.</p>
        <Opcion titulo="Respuestas a mis temas" detalle="Cuando alguien responda una publicación tuya." activo={preferencias.notificarRespuestas} cambiar={v => cambiar("notificarRespuestas", v)} />
        <Opcion titulo="Menciones" detalle="Cuando otro usuario te mencione." activo={preferencias.notificarMenciones} cambiar={v => cambiar("notificarMenciones", v)} />
        <Opcion titulo="Anuncios importantes" detalle="Noticias y comunicados de Capital V." activo={preferencias.notificarAnuncios} cambiar={v => cambiar("notificarAnuncios", v)} />
        <p className="cfg-nota">Se guardan las preferencias; todavía no se envían notificaciones reales.</p><button className="cfg-primario" onClick={guardar}>Guardar preferencias</button></>}
      {seccion === "apariencia" && <><h2>Apariencia</h2><p className="cfg-descripcion">Ajusta cómo quieres visualizar el sitio.</p>
        <label className="cfg-label" htmlFor="cfg-tema">Tema preferido</label><select id="cfg-tema" value={preferencias.tema} onChange={e => cambiar("tema", e.target.value)}><option value="oscuro">Oscuro (Capital V)</option><option value="claro">Claro (experimental)</option></select>
        <Opcion titulo="Reducir animaciones" detalle="Disminuir efectos y transiciones visuales." activo={preferencias.reducirAnimaciones} cambiar={v => cambiar("reducirAnimaciones", v)} />
        <p className="cfg-nota">El tema claro es experimental: las demás páginas mantienen sus estilos originales hasta adaptarlas.</p><button className="cfg-primario" onClick={guardar}>Guardar apariencia</button></>}
      {seccion === "peligro" && <><h2>Zona de peligro</h2><p className="cfg-descripcion">Esta acción no se puede deshacer en este navegador.</p><div className="cfg-peligro"><h3>Eliminar cuenta de prueba</h3><p>Se eliminarán los datos de esta cuenta guardados localmente. No afecta cuentas de otros dispositivos ni elimina datos de un servidor externo.</p><label htmlFor="cfg-eliminar">Escribe <strong>ELIMINAR</strong> para confirmar</label><input id="cfg-eliminar" value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder="ELIMINAR" /><button type="button" className="cfg-borrar" onClick={borrar}>Eliminar mi cuenta local</button></div></>}
      {mensaje && <p className="cfg-mensaje" role="status">{mensaje}</p>}
    </section></div>
  </div></main>;
}
