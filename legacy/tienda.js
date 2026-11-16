
// ==========================================
// EUPHORYA ROLEPLAY - TIENDA
// ==========================================

// Precios de las membresías en USD
const planes = {
    cobre: {
        mensual: 4.99,
        permanente: 19.99
    },
    oro: {
        mensual: 9.99,
        permanente: 39.99
    },
    diamante: {
        mensual: 19.99,
        permanente: 79.99
    }
};

// CONFIGURACIÓN DE AUTENTICACIÓN
// Cuando tengas una página de inicio de sesión
// real, coloca su ruta aquí.
const URL_LOGIN = "";

// Esta versión es una demostración visual.
// No verifica sesiones reales ni procesa pagos.
const AUTENTICACION_CONFIGURADA = false;

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modalLogin");
    const cerrarLogin = document.getElementById("cerrarLogin");
    const verTienda = document.getElementById("verTienda");
    const abrirLogin = document.getElementById("abrirLogin");
    const irLogin = document.getElementById("irLogin");

    // ======================================
    // MOSTRAR Y CERRAR MODAL
    // ======================================

    function mostrarModal() {
        modal.classList.add("visible");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        cerrarLogin.focus();
    }

    function ocultarModal() {
        modal.classList.remove("visible");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Mostrar aviso al entrar en la tienda
    mostrarModal();

    cerrarLogin.addEventListener("click", ocultarModal);
    verTienda.addEventListener("click", ocultarModal);

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            ocultarModal();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" &&
            modal.classList.contains("visible")) {
            ocultarModal();
        }
    });

    // ======================================
    // SELECCIÓN DE DURACIÓN Y PRECIOS
    // ======================================

    const botonesDuracion =
        document.querySelectorAll(".duracion");

    botonesDuracion.forEach((boton) => {

        boton.addEventListener("click", () => {

            const plan = boton.dataset.plan;
            const tipo = boton.dataset.tipo;

            const tarjeta = boton.closest(".tarjeta-plan");

            tarjeta.querySelectorAll(".duracion")
                .forEach((otro) => {
                    otro.classList.remove("activo");
                });

            boton.classList.add("activo");

            const precio = planes[plan][tipo];

            document.getElementById(
                "precio-" + plan
            ).textContent = precio.toFixed(2);

            document.getElementById(
                "periodo-" + plan
            ).textContent =
                tipo === "mensual"
                    ? "/ 30 días"
                    : "/ pago único";
        });

    });

    // ======================================
    // BOTONES DE COMPRA
    // ======================================

    const botonesComprar =
        document.querySelectorAll(".comprar");

    botonesComprar.forEach((boton) => {

        boton.addEventListener("click", () => {

            const producto = boton.dataset.producto;

            const tarjeta = boton.closest(".tarjeta-plan");

            const duracionSeleccionada =
                tarjeta.querySelector(".duracion.activo");

            const tipo = duracionSeleccionada.dataset.tipo;

            // La tienda todavía no tiene autenticación
            // ni pagos reales configurados.
            if (!AUTENTICACION_CONFIGURADA) {
                mostrarModal();
                return;
            }

            // Este bloque se reemplazará por una
            // solicitud segura al servidor cuando
            // integremos autenticación y Tebex.
            alert(
                "La compra de " + producto +
                " (" + tipo + ") todavía no está disponible."
            );

        });

    });

});

// ==========================================
// EUPHORIA - INTERFAZ LOGIN Y REGISTRO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const modalAviso = document.getElementById("modalLogin");
    const modalAcceso = document.getElementById("modalAcceso");
    const modalRegistro = document.getElementById("modalRegistro");

    const formLogin = document.getElementById("formLogin");
    const formRegistro = document.getElementById("formRegistro");

    function abrirVentana(modal) {
        document.querySelectorAll(".modal-fondo").forEach(m => {
            m.classList.remove("visible");
            m.setAttribute("aria-hidden", "true");
        });

        modal.classList.add("visible");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const campo = modal.querySelector("input");
        if (campo) campo.focus();
    }

    function cerrarVentana(modal) {
        modal.classList.remove("visible");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Abrir login desde el aviso inicial
    document.getElementById("irLogin")
        .addEventListener("click", () => {
            abrirVentana(modalAcceso);
        });

    // Abrir login desde Mi cuenta
    document.getElementById("abrirLogin")
        .addEventListener("click", () => {
            abrirVentana(modalAcceso);
        });

    // Abrir registro
    document.getElementById("abrirRegistro")
        .addEventListener("click", () => {
            abrirVentana(modalRegistro);
        });

    // Regresar al login
    document.getElementById("volverLogin")
        .addEventListener("click", () => {
            abrirVentana(modalAcceso);
        });

    // Cerrar ventanas
    document.getElementById("cerrarAcceso")
        .addEventListener("click", () => {
            cerrarVentana(modalAcceso);
        });

    document.getElementById("cerrarRegistro")
        .addEventListener("click", () => {
            cerrarVentana(modalRegistro);
        });

    // Login de demostración: no envía credenciales
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        document.getElementById("mensajeLogin").textContent =
            "El sistema de cuentas todavía no está conectado.";
    });

    // Registro de demostración: no guarda contraseñas
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();

        document.getElementById("mensajeRegistro").textContent =
            "El registro estará disponible cuando conectemos la base de datos.";
    });

    // Recuperación de contraseña pendiente
    document.getElementById("olvidoPassword")
        .addEventListener("click", () => {
            document.getElementById("mensajeLogin").textContent =
                "La recuperación de contraseña todavía no está disponible.";
        });

});


// ==========================================
// VALIDACIÓN DE CONTRASEÑAS - EUPHORYA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const password = document.getElementById("registroPassword");
    const form = document.getElementById("formRegistro");

    const requisitos = [
        {
            id: "reqLongitud",
            texto: "Mínimo 8 caracteres",
            validar: valor => valor.length >= 8
        },
        {
            id: "reqMayuscula",
            texto: "Iniciar con una letra mayúscula",
            validar: valor => /^[A-Z]/.test(valor)
        },
        {
            id: "reqNumero",
            texto: "Contener al menos un número",
            validar: valor => /[0-9]/.test(valor)
        },
        {
            id: "reqEspecial",
            texto: "Contener un carácter especial",
            validar: valor => /[^A-Za-z0-9]/.test(valor)
        }
    ];

    const estado = document.getElementById("estadoPassword");

    function validarPassword() {

        const valor = password.value;
        let todosValidos = true;

        requisitos.forEach(requisito => {

            const elemento = document.getElementById(requisito.id);
            const cumple = requisito.validar(valor);

            elemento.classList.toggle("valido", cumple);

            elemento.textContent =
                (cumple ? "✔ " : "✖ ") + requisito.texto;

            if (!cumple) {
                todosValidos = false;
            }

        });

        estado.classList.remove("correcto", "incorrecto");

        if (valor.length === 0) {
            estado.textContent = "";
        } else if (todosValidos) {
            estado.textContent =
                "✔ Tu contraseña cumple todos los requisitos.";
            estado.classList.add("correcto");
        } else {
            estado.textContent =
                "✖ Debes cumplir todos los requisitos.";
            estado.classList.add("incorrecto");
        }

        return todosValidos;
    }

    password.addEventListener("input", validarPassword);

    // Bloquea el envío cuando la contraseña
    // no cumple todos los requisitos.
    form.addEventListener("submit", (evento) => {

        if (!validarPassword()) {
            evento.preventDefault();
            evento.stopImmediatePropagation();

            password.focus();

            document.getElementById("mensajeRegistro").textContent =
                "Debes crear una contraseña que cumpla " +
                "todos los requisitos obligatorios.";
        }

    }, true);

    validarPassword();

});
