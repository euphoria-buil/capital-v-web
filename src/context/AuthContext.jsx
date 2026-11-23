
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext(null);

const USUARIOS_KEY = "capitalv_usuarios_demo";
const SESION_KEY = "capitalv_sesion_demo";

function leerLocal(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(() =>
    leerLocal(USUARIOS_KEY, [])
  );

  const [usuario, setUsuario] = useState(() =>
    leerLocal(SESION_KEY, null)
  );

  function registrar(nombre, correo, password) {
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (nombreLimpio.length < 3) {
      return {
        ok: false,
        mensaje: "El nombre debe tener mínimo 3 caracteres."
      };
    }

    if (
      !/^[A-Z]/.test(password) ||
      password.length < 8 ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return {
        ok: false,
        mensaje:
          "La contraseña debe comenzar con mayúscula, " +
          "tener mínimo 8 caracteres, un número " +
          "y un símbolo especial."
      };
    }

    if (usuarios.some(u => u.correo === correoLimpio)) {
      return {
        ok: false,
        mensaje: "Ese correo ya está registrado."
      };
    }

    const nuevo = {
      id: crypto.randomUUID(),
      nombre: nombreLimpio,
      correo: correoLimpio,
      rol: "usuario",
      fechaRegistro: new Date().toISOString(),
      claveDemo: "CapitalV@2026"
    };

    const actualizados = [...usuarios, nuevo];

    setUsuarios(actualizados);
    localStorage.setItem(
      USUARIOS_KEY,
      JSON.stringify(actualizados)
    );

    return {
      ok: true,
      mensaje:
        "¡Cuenta creada! Inicia sesión " +
        "con la contraseña CapitalV@2026."
    };
  }

  function iniciarSesion(correo, password) {
    const encontrado = usuarios.find(
      u => u.correo === correo.trim().toLowerCase()
    );

    if (
      !encontrado ||
      password !== encontrado.claveDemo
    ) {
      return {
        ok: false,
        mensaje: "Correo o contraseña incorrectos."
      };
    }

    const { claveDemo, ...datosUsuario } = encontrado;

    setUsuario(datosUsuario);
    localStorage.setItem(
      SESION_KEY,
      JSON.stringify(datosUsuario)
    );

    return {
      ok: true,
      mensaje: "Sesión iniciada correctamente."
    };
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem(SESION_KEY);
  }

  function actualizarPerfil(cambios) {
    const datos = typeof cambios === "string" ? { nombre: cambios } : cambios;
    if (!usuario) {
      return {
        ok: false,
        mensaje: "Debes iniciar sesión."
      };
    }

    const nombreLimpio = String(datos.nombre ?? usuario.nombre).trim();
    const biografia = String(datos.biografia ?? usuario.biografia ?? "").trim();
    if (biografia.length > 300) return { ok: false, mensaje: "La biografía no puede superar 300 caracteres." };
    const extras = { biografia };
    for (const campo of ["foto", "portada"]) {
      if (typeof datos[campo] === "string") extras[campo] = datos[campo];
    }

    if (
      nombreLimpio.length < 3 ||
      nombreLimpio.length > 30
    ) {
      return {
        ok: false,
        mensaje: "El nombre debe tener entre 3 y 30 caracteres."
      };
    }

    const usuarioActualizado = {
      ...usuario,
      nombre: nombreLimpio, ...extras
    };

    const actualizados = usuarios.map(u =>
      u.id === usuario.id
        ? { ...u, nombre: nombreLimpio, ...extras }
        : u
    );

    try {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(actualizados));
      localStorage.setItem(SESION_KEY, JSON.stringify(usuarioActualizado));
    } catch { return { ok: false, mensaje: "Sin espacio para guardar imágenes en el navegador." }; }
    setUsuarios(actualizados);
    setUsuario(usuarioActualizado);

    return {
      ok: true,
      mensaje: "Perfil actualizado correctamente."
    };
  }

  function actualizarConfiguracion(cambios) {
    if (!usuario) return { ok: false, mensaje: "Debes iniciar sesión." };
    const permitidos = ["perfilPublico", "mostrarEnLinea", "permitirMensajes", "notificarRespuestas", "notificarMenciones", "notificarAnuncios", "tema", "reducirAnimaciones"];
    const seguros = Object.fromEntries(Object.entries(cambios).filter(([k]) => permitidos.includes(k)));
    const configuracion = { ...usuario.configuracion, ...seguros };
    const actualizado = { ...usuario, configuracion };
    const lista = usuarios.map(u => u.id === usuario.id ? { ...u, configuracion } : u);
    try {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(lista));
      localStorage.setItem(SESION_KEY, JSON.stringify(actualizado));
    } catch { return { ok: false, mensaje: "No se pudieron guardar los cambios." }; }
    setUsuarios(lista);
    setUsuario(actualizado);
    return { ok: true, mensaje: "Preferencias guardadas." };
  }

  function cambiarCorreo(nuevoCorreo) {
    if (!usuario) return { ok: false, mensaje: "Debes iniciar sesión." };
    const correo = nuevoCorreo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { ok: false, mensaje: "Correo no válido." };
    if (usuarios.some(u => u.id !== usuario.id && u.correo === correo)) return { ok: false, mensaje: "Ese correo ya está registrado." };
    const actualizado = { ...usuario, correo };
    const lista = usuarios.map(u => u.id === usuario.id ? { ...u, correo } : u);
    try {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(lista));
      localStorage.setItem(SESION_KEY, JSON.stringify(actualizado));
    } catch { return { ok: false, mensaje: "No se pudieron guardar los cambios." }; }
    setUsuarios(lista);
    setUsuario(actualizado);
    return { ok: true, mensaje: "Correo actualizado en esta versión de prueba." };
  }

  function cambiarClaveDemo(actual, nueva) {
    if (!usuario) return { ok: false, mensaje: "Debes iniciar sesión." };
    const cuenta = usuarios.find(u => u.id === usuario.id);
    if (!cuenta || cuenta.claveDemo !== actual) return { ok: false, mensaje: "Contraseña actual incorrecta." };
    if (nueva.length < 8 || !/^[A-Z]/.test(nueva) || !/[0-9]/.test(nueva) || !/[^A-Za-z0-9]/.test(nueva)) return { ok: false, mensaje: "La nueva contraseña debe empezar con mayúscula y tener 8 caracteres, un número y un símbolo." };
    const lista = usuarios.map(u => u.id === usuario.id ? { ...u, claveDemo: nueva } : u);
    try { localStorage.setItem(USUARIOS_KEY, JSON.stringify(lista)); }
    catch { return { ok: false, mensaje: "No se pudo guardar." }; }
    setUsuarios(lista);
    return { ok: true, mensaje: "Contraseña de prueba actualizada. No es un sistema de seguridad real." };
  }

  function eliminarCuentaDemo() {
    if (!usuario) return { ok: false, mensaje: "Debes iniciar sesión." };
    const lista = usuarios.filter(u => u.id !== usuario.id);
    try { localStorage.setItem(USUARIOS_KEY, JSON.stringify(lista)); localStorage.removeItem(SESION_KEY); }
    catch { return { ok: false, mensaje: "No se pudo eliminar la cuenta local." }; }
    setUsuarios(lista);
    setUsuario(null);
    return { ok: true, mensaje: "Cuenta local eliminada." };
  }

  function obtenerPerfilPublico(id) {
    const encontrado = usuarios.find(u => u.id === id);
    if (!encontrado) return null;
    const { nombre, rol, fechaRegistro, biografia, foto, portada } = encontrado;
    return { id, nombre, rol, fechaRegistro, biografia, foto, portada };
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        registrar,
        iniciarSesion,
        cerrarSesion,
        actualizarPerfil,
        obtenerPerfilPublico,
        actualizarConfiguracion,
        cambiarCorreo,
        cambiarClaveDemo,
        eliminarCuentaDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return contexto;
}
