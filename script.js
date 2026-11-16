
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;

function changeSlide() {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Cambiar cada 6 segundos
if (slides.length > 1 && dots.length === slides.length) {
    setInterval(changeSlide, 6000);
}


document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".slide");
    const bars = document.querySelectorAll(".progress-bar");

    let currentSlide = 0;

    function changeSlide() {
        slides[currentSlide].classList.remove("active");

        currentSlide = (currentSlide + 1) % slides.length;

        slides[currentSlide].classList.add("active");

        bars.forEach((bar, index) => {
            bar.classList.remove("active", "completed");

            if (index < currentSlide) {
                bar.classList.add("completed");
            }

            if (index === currentSlide) {
                bar.classList.add("active");
            }
        });
    }

    if (slides.length > 1 && slides.length === bars.length) {
        setInterval(changeSlide, 6000);
    }

});

/* ===================================
   ANIMACIONES CON SCROLL
=================================== */

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".hero");
    const navbar = document.getElementById("navbarFlotante");

    if (!hero || !navbar) return;

    let ticking = false;

    function actualizarScroll() {

        const scroll = window.scrollY;

        // Reducir la portada hasta un 12%
        const distanciaMaxima = 600;
        const reduccionMaxima = 0.12;

        const progreso = Math.min(
            Math.max(scroll / distanciaMaxima, 0),
            1
        );

        const escala = 1 - progreso * reduccionMaxima;

        hero.style.transform = `scale(${escala})`;

        // Mostrar barra flotante
        if (scroll > 100) {
            navbar.classList.add("visible");
        } else {
            navbar.classList.remove("visible");
        }

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(actualizarScroll);
            ticking = true;
        }
    }, { passive: true });

    actualizarScroll();
});

/* =====================================
   BOTON VOLVER AL INICIO
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const botonArriba = document.getElementById("volverArriba");

    if (!botonArriba) return;

    function controlarBoton() {

        if (window.scrollY > 300) {
            botonArriba.classList.add("visible");
        } else {
            botonArriba.classList.remove("visible");
        }

    }

    window.addEventListener("scroll", controlarBoton, {
        passive: true
    });

    botonArriba.addEventListener("click", () => {

        const reducirMovimiento = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reducirMovimiento ? "instant" : "smooth"
        });

    });

    controlarBoton();

});

/* ====================================
   REGISTRO Y LOGIN - INTERFAZ
==================================== */

document.addEventListener("DOMContentLoaded", () => {

    const abrir = document.getElementById("abrirCuenta");
    const cerrar = document.getElementById("cerrarCuenta");
    const overlay = document.getElementById("cuentaOverlay");

    const tabs = document.querySelectorAll(".cuenta-tab");
    const login = document.getElementById("formLogin");
    const registro = document.getElementById("formRegistro");
    const mensaje = document.getElementById("cuentaMensaje");

    if (!abrir || !cerrar || !overlay ||
        !login || !registro || !mensaje) return;

    let focoAnterior = null;

    function abrirModal() {
        focoAnterior = document.activeElement;
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        cerrar.focus();
    }

    function cerrarModal() {
        overlay.hidden = true;
        document.body.style.overflow = "";
        mensaje.textContent = "";
        focoAnterior?.focus();
    }

    abrir.addEventListener("click", abrirModal);
    cerrar.addEventListener("click", cerrarModal);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) cerrarModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !overlay.hidden) {
            cerrarModal();
        }
    });

    // CAMBIAR PESTAÑAS
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            const esLogin = tab.dataset.tab === "login";

            login.hidden = !esLogin;
            registro.hidden = esLogin;

            tabs.forEach(t => {
                t.classList.toggle("activo", t === tab);
            });

            mensaje.textContent = "";
        });
    });

    // LOGIN - DEMOSTRACION
    login.addEventListener("submit", (e) => {
        e.preventDefault();

        mensaje.textContent =
            "El inicio de sesión estará disponible " +
            "cuando conectemos el servidor.";
    });

    // REGISTRO - DEMOSTRACION
    registro.addEventListener("submit", (e) => {
        e.preventDefault();

        const password =
            document.getElementById("registroPassword").value;

        const confirmar =
            document.getElementById("registroConfirmar").value;

        if (password !== confirmar) {
            mensaje.textContent =
                "Las contraseñas no coinciden.";
            return;
        }

        mensaje.textContent =
            "Formulario correcto. El registro real " +
            "estará disponible al conectar la base de datos.";
    });

});

/* CONTADOR DE JUGADORES EUPHORYA */

document.addEventListener("DOMContentLoaded", function () {

    const numero = document.getElementById("jugadoresOnline");

    const indicador = document.querySelector(".contador-indicador");

    if (!numero || !indicador) return;

    // CALCULAR COLOR SEGUN JUGADORES
    function calcularColor(cantidad) {

        const naranja = [255, 112, 35];
        const amarillo = [255, 209, 45];
        const verde = [39, 214, 107];

        let inicio;
        let final;
        let progreso;

        if (cantidad < 75) {

            inicio = naranja;
            final = amarillo;
            progreso = cantidad / 75;

        } else if (cantidad < 150) {

            inicio = amarillo;
            final = verde;
            progreso = (cantidad - 75) / 75;

        } else {

            return "rgb(39, 214, 107)";

        }

        const resultado = inicio.map((valor, i) => {
            return Math.round(
                valor + (final[i] - valor) * progreso
            );
        });

        return `rgb(${resultado.join(",")})`;
    }

    // ACTUALIZAR EL CONTADOR
    function actualizarJugadores(cantidad) {

        if (!Number.isInteger(cantidad) || cantidad < 0) {
            numero.textContent = "--";

            indicador.style.setProperty(
                "--color-estado",
                "rgb(120, 120, 120)"
            );

            return;
        }

        numero.textContent = cantidad;

        const color = calcularColor(cantidad);

        indicador.style.setProperty(
            "--color-estado",
            color
        );
    }

    // CANTIDAD DE PRUEBA
    actualizarJugadores(75);

    // PERMITE CAMBIAR JUGADORES MANUALMENTE
    window.actualizarJugadores = actualizarJugadores;

});

/* =====================================
   DESVANECIMIENTO DEL CONTADOR
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const contador = document.querySelector(".contador-euphorya");

    if (!contador) return;

    function actualizarOpacidad() {

        // Cantidad de desplazamiento vertical
        const scroll = window.scrollY;

        // Desaparece gradualmente en 700px
        const distancia = 700;

        // Opacidad mínima de 0.15
        const opacidad = Math.max(
            0.15,
            1 - scroll / distancia
        );

        contador.style.opacity = opacidad;
    }

    // Actualizar al bajar o subir
    window.addEventListener(
        "scroll",
        actualizarOpacidad,
        { passive: true }
    );

    // Estado inicial
    actualizarOpacidad();

});

/* ==========================================
   RULETA 3D ARRASTRABLE EUPHORYA
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const escenario = document.getElementById("ruletaEscenario");
    const titulo = document.getElementById("ruletaTitulo");
    const descripcion = document.getElementById("ruletaDescripcion");
    const indicadores = document.getElementById("ruletaIndicadores");

    if (!escenario || !titulo || !descripcion || !indicadores) return;

    const cartas = [...escenario.querySelectorAll(".ruleta-carta")];

    if (!cartas.length) return;

    // INFORMACION DE CADA IMAGEN
    const informacion = [
        {
            titulo: "Crea tu propio imperio",
            descripcion: "Construye negocios, consigue propiedades y desarrolla tu propia historia dentro de Euphorya Roleplay."
        },
        {
            titulo: "Una ciudad llena de oportunidades",
            descripcion: "Explora Los Santos y descubre nuevas posibilidades para tu personaje."
        },
        {
            titulo: "Tu historia, tus decisiones",
            descripcion: "Cada decisión importa. Construye relaciones y elige tu propio camino."
        },
        {
            titulo: "Vive la experiencia",
            descripcion: "Disfruta de vehículos, actividades y nuevas aventuras dentro de la ciudad."
        },
        {
            titulo: "Una comunidad por descubrir",
            descripcion: "Conoce jugadores, crea amistades y participa en nuevas historias."
        }
    ];

    const total = cartas.length;
    const paso = (Math.PI * 2) / total;

    let posicion = 0;
    let objetivo = 0;

    let arrastrando = false;
    let punteroActivo = null;
    let ultimaX = 0;
    let ultimoTiempo = 0;
    let velocidad = 0;
    let movimientoTotal = 0;

    // CREAR INDICADORES
    cartas.forEach(() => {
        const punto = document.createElement("span");
        punto.className = "ruleta-indicador";
        indicadores.appendChild(punto);
    });

    const puntos = [...indicadores.children];

    // NORMALIZAR INDICES
    function modulo(numero, divisor) {
        return ((numero % divisor) + divisor) % divisor;
    }

    function actualizarDescripcion() {

        const indice = modulo(Math.round(objetivo), total);
        const datos = informacion[indice];

        if (!datos) return;

        titulo.textContent = datos.titulo;
        descripcion.textContent = datos.descripcion;

        puntos.forEach((punto, i) => {
            punto.classList.toggle("activo", i === indice);
        });
    }

    // DIBUJAR LA RULETA EN 3D
    function dibujarRuleta() {

        const ancho = escenario.clientWidth;

        cartas.forEach((carta, indice) => {

            const diferencia = indice - posicion;
            const angulo = diferencia * paso;

            const seno = Math.sin(angulo);
            const coseno = Math.cos(angulo);

            // DESPLAZAMIENTO HORIZONTAL
            const desplazamientoX = seno * ancho * 0.39;

            // PROFUNDIDAD
            const profundidad = (coseno - 1) * 220;

            // ESCALA SEGUN POSICION
            const escala = 0.78 + 0.22 * Math.max(0, coseno);

            // ROTACION LATERAL
            const rotacionY = -seno * 48;

            // DESENFOQUE SEGUN DISTANCIA
            const desenfoque = (1 - Math.max(0, coseno)) * 5;

            // TRANSPARENCIA
            const opacidad = Math.max(
                0,
                0.15 + 0.85 * Math.max(0, coseno)
            );

            carta.style.transform = `
                translate(-50%, -50%)
                translateX(${desplazamientoX}px)
                translateZ(${profundidad}px)
                rotateY(${rotacionY}deg)
                scale(${escala})
            `;

            carta.style.opacity = opacidad;
            carta.style.filter = `blur(${desenfoque}px)`;
            carta.style.zIndex = Math.round((coseno + 1) * 100);
        });
    }

    // ANIMACION SUAVE
    function animar() {

        if (!arrastrando) {
            posicion += (objetivo - posicion) * 0.13;

            if (Math.abs(objetivo - posicion) < 0.001) {
                posicion = objetivo;
            }
        }

        dibujarRuleta();
        requestAnimationFrame(animar);
    }

    // INICIAR ARRASTRE
    escenario.addEventListener("pointerdown", (evento) => {

        if (evento.pointerType === "mouse" && evento.button !== 0) {
            return;
        }

        arrastrando = true;
        punteroActivo = evento.pointerId;

        ultimaX = evento.clientX;
        ultimoTiempo = performance.now();
        velocidad = 0;
        movimientoTotal = 0;

        objetivo = posicion;

        escenario.classList.add("arrastrando");
        escenario.setPointerCapture(evento.pointerId);
    });

    // MOVER RULETA CON EL RATON
    escenario.addEventListener("pointermove", (evento) => {

        if (!arrastrando || evento.pointerId !== punteroActivo) {
            return;
        }

        const ahora = performance.now();
        const diferenciaX = evento.clientX - ultimaX;
        const diferenciaTiempo = Math.max(1, ahora - ultimoTiempo);

        // SENSIBILIDAD DEL ARRASTRE
        const sensibilidad = 170;

        posicion -= diferenciaX / sensibilidad;
        objetivo = posicion;

        movimientoTotal += Math.abs(diferenciaX);

        velocidad = diferenciaX / diferenciaTiempo;

        ultimaX = evento.clientX;
        ultimoTiempo = ahora;
    });

    // TERMINAR ARRASTRE
    function terminarArrastre(evento) {

        if (!arrastrando || evento.pointerId !== punteroActivo) {
            return;
        }

        arrastrando = false;
        punteroActivo = null;

        escenario.classList.remove("arrastrando");

        // PEQUEÑA INERCIA AL SOLTAR
        const tiempoSinMover =
            performance.now() - ultimoTiempo;

        const impulso = tiempoSinMover < 100
            ? -velocidad * 0.16
            : 0;

        objetivo = Math.round(posicion + impulso);

        actualizarDescripcion();
    }

    escenario.addEventListener("pointerup", terminarArrastre);

    escenario.addEventListener("pointercancel", () => {
        arrastrando = false;
        punteroActivo = null;
        objetivo = Math.round(posicion);
        escenario.classList.remove("arrastrando");
        actualizarDescripcion();
    });

    // SELECCIONAR IMAGEN CON CLIC
    escenario.addEventListener("click", (evento) => {

        if (movimientoTotal > 8) return;

        const carta = evento.target.closest(".ruleta-carta");
        if (!carta) return;

        const indice = cartas.indexOf(carta);
        if (indice < 0) return;

        const vueltaActual = Math.round(posicion / total);
        let destino = vueltaActual * total + indice;

        while (destino - posicion > total / 2) {
            destino -= total;
        }

        while (posicion - destino > total / 2) {
            destino += total;
        }

        objetivo = destino;
        actualizarDescripcion();
    });

    // INICIO
    actualizarDescripcion();
    animar();

});

/* ANIMACION DEL SEPARADOR EUPHORYA */

document.addEventListener("DOMContentLoaded", () => {

    const separador = document.querySelector(".separador-euphorya");

    if (!separador) return;

    if (!("IntersectionObserver" in window)) {
        separador.classList.add("visible");
        return;
    }

    const observador = new IntersectionObserver(
        (entradas) => {

            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    separador.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });

        },
        {
            threshold: 0.3
        }
    );

    observador.observe(separador);

});

/* ======================================
   CAMBIAR FONDO DE NAVBAR AL BAJAR
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector(".navbar-flotante");
    const portada = document.querySelector(".hero");

    if (!navbar || !portada) return;

    function actualizarFondoNavbar() {

        // Posicion inferior de la portada
        const finalPortada = portada.getBoundingClientRect().bottom;

        // Activar fondo cuando la barra sale de la portada
        const limiteNavbar = navbar.getBoundingClientRect().bottom;

        if (finalPortada <= limiteNavbar) {
            navbar.classList.add("navbar-oscura");
        } else {
            navbar.classList.remove("navbar-oscura");
        }
    }

    window.addEventListener("scroll", actualizarFondoNavbar, {
        passive: true
    });

    window.addEventListener("resize", actualizarFondoNavbar);

    // Comprobar al cargar la pagina
    actualizarFondoNavbar();

});
