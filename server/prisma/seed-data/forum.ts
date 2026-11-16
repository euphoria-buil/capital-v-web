/** Estructura del foro (basada en legacy/datos-foro.js) */
export const FORUM_CATEGORIES = {
  policia: {
    titulo: "Los Santos Police Department (LSPD)",
    descripcion: "Información y publicaciones del departamento.",
    icono: "🚓",
    subforos: [
      ["anuncios", "Anuncios oficiales", "Noticias de la jefatura.", "📢"],
      ["convocatorias", "Convocatorias", "Procesos de ingreso.", "📋"],
      ["normativas", "Normativas", "Reglamentos policiales.", "📖"],
      ["internos", "Comunicados internos", "Información del personal.", "🔒"],
    ],
  },
  ems: {
    titulo: "San Andreas Emergency Services (SAES)",
    descripcion: "Información del departamento médico.",
    icono: "🚑",
    subforos: [
      ["anuncios", "Anuncios oficiales", "Noticias del EMS.", "📢"],
      ["convocatorias", "Convocatorias", "Ingreso de paramédicos.", "📋"],
      ["protocolos", "Protocolos médicos", "Procedimientos médicos.", "🏥"],
      ["internos", "Comunicados internos", "Información del personal.", "🔒"],
    ],
  },
  gobierno: {
    titulo: "San Andreas Government",
    descripcion: "Información del Gobierno.",
    icono: "🏛️",
    subforos: [
      ["anuncios", "Anuncios oficiales", "Comunicados del gobierno.", "📢"],
      ["leyes", "Leyes y decretos", "Normativas de la ciudad.", "⚖️"],
      ["tramites", "Trámites", "Solicitudes y procedimientos.", "📄"],
    ],
  },
  empresas: {
    titulo: "Empresas registradas",
    descripcion: "Gestión de empresas de Capital V.",
    icono: "💼",
    subforos: [
      ["registro", "Registro de empresas", "Registro de negocios.", "📝"],
      ["solicitudes", "Solicitudes", "Peticiones empresariales.", "📋"],
      ["anuncios", "Anuncios comerciales", "Publicidad y novedades.", "📢"],
    ],
  },
  organizaciones: {
    titulo: "Organizaciones criminales",
    descripcion: "Secciones de organizaciones autorizadas.",
    icono: "👥",
    subforos: [
      ["registro", "Registro de organizaciones", "Información y requisitos.", "📁"],
      ["solicitudes", "Solicitudes", "Peticiones de organizaciones.", "📋"],
      ["internos", "Comunicados privados", "Información reservada.", "🔒"],
    ],
  },
  concesionarios: {
    titulo: "Concesionarios y talleres",
    descripcion: "Vehículos y servicios mecánicos.",
    icono: "🚗",
    subforos: [
      ["catalogos", "Catálogos", "Vehículos disponibles.", "🚘"],
      ["solicitudes", "Solicitudes", "Consultas y peticiones.", "📋"],
      ["servicios", "Servicios", "Reparaciones y mantenimiento.", "🔧"],
    ],
  },
  comunicados: {
    titulo: "Comunicados oficiales",
    descripcion: "Información oficial de Capital V Roleplay.",
    icono: "📢",
    subforos: [
      ["anuncios", "Anuncios oficiales", "Noticias de la administración.", "📣"],
      ["actualizaciones", "Actualizaciones", "Cambios y novedades del servidor.", "🔄"],
      ["mantenimiento", "Mantenimiento", "Avisos de mantenimiento.", "🔧"],
      ["eventos", "Eventos oficiales", "Actividades de la comunidad.", "🎉"],
    ],
  },
  comunidad: {
    titulo: "Comunidad general",
    descripcion: "Un espacio para compartir con otros jugadores.",
    icono: "🌎",
    subforos: [
      ["presentaciones", "Presentaciones", "Preséntate a la comunidad.", "👋"],
      ["debates", "Debates generales", "Conversaciones de la comunidad.", "💬"],
      ["historias", "Historias de rol", "Experiencias de RP.", "📖"],
      ["multimedia", "Fotos y vídeos", "Momentos del servidor.", "📷"],
    ],
  },
  reportes: {
    titulo: "Reportes y apelaciones",
    descripcion: "Gestión de reportes y solicitudes de revisión.",
    icono: "🛡️",
    subforos: [
      ["jugadores", "Reportes de jugadores", "Reportar incumplimientos.", "🚨"],
      ["apelaciones", "Apelaciones", "Solicitudes de revisión de sanciones.", "📋"],
      ["bugs", "Reportes de errores", "Informar fallos del servidor.", "🐛"],
    ],
  },
  sugerencias: {
    titulo: "Sugerencias",
    descripcion: "Ayúdanos a mejorar Capital V Roleplay.",
    icono: "💡",
    subforos: [
      ["nuevas", "Nuevas propuestas", "Comparte tus ideas.", "✨"],
      ["revision", "En revisión", "Propuestas que están siendo evaluadas.", "🔎"],
      ["aprobadas", "Propuestas aprobadas", "Ideas aceptadas por el equipo.", "✅"],
    ],
  },
  soporte: {
    titulo: "Ayuda y soporte",
    descripcion: "Información y asistencia para jugadores.",
    icono: "🛠️",
    subforos: [
      ["preguntas", "Preguntas frecuentes", "Respuestas a dudas habituales.", "❓"],
      ["tecnico", "Soporte técnico", "Problemas de conexión.", "💻"],
      ["guias", "Guías y tutoriales", "Aprende a utilizar el servidor.", "📚"],
    ],
  },
} as const;

export const PERMISSIONS = [
  { key: "forum.read", label: "Leer foro", description: "Ver categorías y hilos públicos" },
  { key: "forum.post", label: "Publicar en foro", description: "Crear hilos y respuestas" },
  { key: "forum.moderate", label: "Moderar foro", description: "Fijar, cerrar o borrar contenido" },
  { key: "reports.create", label: "Crear reportes", description: "Abrir reportes in-game" },
  { key: "reports.manage", label: "Gestionar reportes", description: "Asignar y resolver reportes" },
  { key: "shop.view", label: "Ver tienda", description: "Ver packs de la tienda" },
  { key: "shop.manage", label: "Gestionar tienda", description: "CRUD de packs" },
  { key: "admin.access", label: "Panel admin", description: "Acceso al panel de administración" },
  { key: "users.manage", label: "Gestionar usuarios", description: "Roles y baneos" },
  { key: "permissions.manage", label: "Gestionar permisos", description: "Solo owner: matriz rol-permiso" },
] as const;

/** Permisos por rol por defecto */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  USER: ["forum.read", "forum.post", "reports.create", "shop.view"],
  SUPPORT: ["forum.read", "forum.post", "reports.create", "reports.manage", "shop.view", "admin.access"],
  ADMIN: [
    "forum.read",
    "forum.post",
    "forum.moderate",
    "reports.create",
    "reports.manage",
    "shop.view",
    "shop.manage",
    "admin.access",
    "users.manage",
  ],
  OWNER: PERMISSIONS.map((p) => p.key),
};

export const SHOP_PACKS = [
  {
    slug: "bronce",
    name: "Membresía Bronce",
    description: "Acceso a ventajas básicas y cola prioritaria ligera.",
    priceCents: 499,
    featured: false,
    sortOrder: 1,
  },
  {
    slug: "plata",
    name: "Membresía Plata",
    description: "Beneficios intermedios y personalización extra.",
    priceCents: 999,
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "oro",
    name: "Membresía Oro",
    description: "Pack premium con máximas ventajas de comunidad.",
    priceCents: 1999,
    featured: false,
    sortOrder: 3,
  },
];