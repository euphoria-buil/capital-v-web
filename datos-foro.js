
const DATOS_FORO = {
    policia: {
        titulo: "Los Santos Police Department (LSPD)",
        descripcion: "Información y publicaciones del departamento.",
        icono: "🚓",
        subforos: [
            ["anuncios", "Anuncios oficiales", "Noticias de la jefatura.", "📢"],
            ["convocatorias", "Convocatorias", "Procesos de ingreso.", "📋"],
            ["normativas", "Normativas", "Reglamentos policiales.", "📖"],
            ["internos", "Comunicados internos", "Información del personal.", "🔒"]
        ]
    },

    ems: {
        titulo: "San Andreas Emergency Services (SAES)",
        descripcion: "Información del departamento médico.",
        icono: "🚑",
        subforos: [
            ["anuncios", "Anuncios oficiales", "Noticias del EMS.", "📢"],
            ["convocatorias", "Convocatorias", "Ingreso de paramédicos.", "📋"],
            ["protocolos", "Protocolos médicos", "Procedimientos médicos.", "🏥"],
            ["internos", "Comunicados internos", "Información del personal.", "🔒"]
        ]
    },

    gobierno: {
        titulo: "San Andreas Goverment",
        descripcion: "Información del Gobierno.",
        icono: "🏛️",
        subforos: [
            ["anuncios", "Anuncios oficiales", "Comunicados del gobierno.", "📢"],
            ["leyes", "Leyes y decretos", "Normativas de la ciudad.", "⚖️"],
            ["tramites", "Trámites", "Solicitudes y procedimientos.", "📄"]
        ]
    },

    empresas: {
        titulo: "Empresas registradas",
        descripcion: "Gestión de empresas de Euphorya.",
        icono: "💼",
        subforos: [
            ["registro", "Registro de empresas", "Registro de negocios.", "📝"],
            ["solicitudes", "Solicitudes", "Peticiones empresariales.", "📋"],
            ["anuncios", "Anuncios comerciales", "Publicidad y novedades.", "📢"]
        ]
    },

    organizaciones: {
        titulo: "Organizaciones criminales",
        descripcion: "Secciones de organizaciones autorizadas.",
        icono: "👥",
        subforos: [
            ["registro", "Registro de organizaciones", "Información y requisitos.", "📁"],
            ["solicitudes", "Solicitudes", "Peticiones de organizaciones.", "📋"],
            ["internos", "Comunicados privados", "Información reservada.", "🔒"]
        ]
    },

    concesionarios: {
        titulo: "Concesionarios y talleres",
        descripcion: "Vehículos y servicios mecánicos.",
        icono: "🚗",
        subforos: [
            ["catalogos", "Catálogos", "Vehículos disponibles.", "🚘"],
            ["solicitudes", "Solicitudes", "Consultas y peticiones.", "📋"],
            ["servicios", "Servicios", "Reparaciones y mantenimiento.", "🔧"]
        ]
    },

    comunicados: {
        titulo: "Comunicados oficiales",
        descripcion: "Información oficial de Euphorya Roleplay.",
        icono: "📢",
        subforos: [
            ["anuncios", "Anuncios oficiales", "Noticias de la administración.", "📣"],
            ["actualizaciones", "Actualizaciones", "Cambios y novedades del servidor.", "🔄"],
            ["mantenimiento", "Mantenimiento", "Avisos de mantenimiento.", "🔧"],
            ["eventos", "Eventos oficiales", "Actividades de la comunidad.", "🎉"]
        ]
    },

    comunidad: {
        titulo: "Comunidad general",
        descripcion: "Un espacio para compartir con otros jugadores.",
        icono: "🌎",
        subforos: [
            ["presentaciones", "Presentaciones", "Preséntate a la comunidad.", "👋"],
            ["debates", "Debates generales", "Conversaciones de la comunidad.", "💬"],
            ["historias", "Historias de rol", "Experiencias de RP.", "📖"],
            ["multimedia", "Fotos y vídeos", "Momentos del servidor.", "📷"]
        ]
    },

    reportes: {
        titulo: "Reportes y apelaciones",
        descripcion: "Gestión de reportes y solicitudes de revisión.",
        icono: "🛡️",
        subforos: [
            ["jugadores", "Reportes de jugadores", "Reportar incumplimientos.", "🚨"],
            ["apelaciones", "Apelaciones", "Solicitudes de revisión de sanciones.", "📋"],
            ["bugs", "Reportes de errores", "Informar fallos del servidor.", "🐛"]
        ]
    },

    sugerencias: {
        titulo: "Sugerencias",
        descripcion: "Ayúdanos a mejorar Euphorya Roleplay.",
        icono: "💡",
        subforos: [
            ["nuevas", "Nuevas propuestas", "Comparte tus ideas.", "✨"],
            ["revision", "En revisión", "Propuestas que están siendo evaluadas.", "🔎"],
            ["aprobadas", "Propuestas aprobadas", "Ideas aceptadas por el equipo.", "✅"]
        ]
    },

    soporte: {
        titulo: "Ayuda y soporte",
        descripcion: "Información y asistencia para jugadores.",
        icono: "🛠️",
        subforos: [
            ["preguntas", "Preguntas frecuentes", "Respuestas a dudas habituales.", "❓"],
            ["tecnico", "Soporte técnico", "Problemas de conexión.", "💻"],
            ["guias", "Guías y tutoriales", "Aprende a utilizar el servidor.", "📚"]
        ]
    }
};

function obtenerSubforo(id) {
    for (const [categoriaId, categoria] of Object.entries(DATOS_FORO)) {
        for (const subforo of categoria.subforos) {
            if (`${categoriaId}-${subforo[0]}` === id) {
                return {
                    categoriaId,
                    categoria,
                    id,
                    titulo: subforo[1],
                    descripcion: subforo[2],
                    icono: subforo[3]
                };
            }
        }
    }

    return null;
}
