
/* BUSCADOR DE CATEGORIAS */

document.addEventListener("DOMContentLoaded", () => {

    const buscador = document.getElementById("buscarCategoria");
    const categorias = document.querySelectorAll(".foro-categoria");
    const sinResultados = document.getElementById("sinResultados");

    buscador.addEventListener("input", () => {

        const busqueda = buscador.value
            .toLowerCase()
            .trim();

        let visibles = 0;

        categorias.forEach(categoria => {

            const texto = categoria.textContent.toLowerCase();
            const coincide = texto.includes(busqueda);

            categoria.hidden = !coincide;

            if (coincide) visibles++;
        });

        sinResultados.hidden = visibles > 0;
    });

    /* CATEGORIAS AUN SIN PAGINA PROPIA */
    categorias.forEach(categoria => {
        categoria.addEventListener("click", (evento) => {
            evento.preventDefault();
        });
    });

});

/* ===================================
   FORO EUPHORYA ROLEPLAY
=================================== */

document.addEventListener("DOMContentLoaded", () => {

    const buscador = document.getElementById("buscarCategoria");
    const categorias = document.querySelectorAll(".foro-categoria");
    const grupos = document.querySelectorAll(".foro-grupo");
    const sinResultados = document.getElementById("sinResultados");

    // ABRIR Y CERRAR CATEGORIAS
    document.querySelectorAll(".foro-desplegable").forEach(boton => {

        boton.addEventListener("click", () => {

            const subcategorias = boton.nextElementSibling;
            const abierto = boton.getAttribute("aria-expanded") === "true";

           boton.setAttribute("aria-expanded", String(!abierto));

const grupo = boton.closest(".foro-grupo");

grupo.classList.toggle("abierto", !abierto);
subcategorias.hidden = abierto;

        });

    });

    // BUSCADOR DE CATEGORIAS
    if (buscador) {

        buscador.addEventListener("input", () => {

            const busqueda = buscador.value.toLowerCase().trim();
            let visibles = 0;

            // CATEGORIAS NORMALES
            categorias.forEach(categoria => {

                if (categoria.classList.contains("foro-desplegable")) {
                    return;
                }

                const coincide = categoria.textContent
                    .toLowerCase()
                    .includes(busqueda);

                categoria.hidden = !coincide;

                if (coincide) visibles++;
            });

            // CATEGORIAS DESPLEGABLES
            grupos.forEach(grupo => {

                const coincide = grupo.textContent
                    .toLowerCase()
                    .includes(busqueda);

                grupo.hidden = !coincide;

                if (coincide) visibles++;

                // MOSTRAR SUBCATEGORIAS AL BUSCAR
                const boton = grupo.querySelector(".foro-desplegable");
                const subcategorias = grupo.querySelector(".foro-subcategorias");

               if (busqueda && coincide) {
    boton.setAttribute("aria-expanded", "true");
    grupo.classList.add("abierto");
    subcategorias.hidden = false;
}

            });

            if (sinResultados) {
                sinResultados.hidden = visibles > 0;
            }

        });

    }

    // EVITAR NAVEGACION EN ENLACES SIN PAGINA
    document.querySelectorAll('.foro-categoria[href="#"], .foro-subcategoria[href="#"]')
        .forEach(enlace => {

            enlace.addEventListener("click", evento => {
                evento.preventDefault();
            });

        });

});

/* ======================================
   SESION DE DEMOSTRACION EUPHORYA
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    const login = document.getElementById("botonLogin");
    const logout = document.getElementById("botonLogout");
    const botonUsuario = document.getElementById("usuarioBoton");
    const menu = document.getElementById("usuarioDesplegable");

    if (!login || !logout || !botonUsuario || !menu) return;

    // Estado temporal para probar el diseño
    let conectado = false;

    function cerrarMenu() {
        menu.hidden = true;
        botonUsuario.setAttribute("aria-expanded", "false");
    }

    function actualizarUsuario() {
        login.hidden = conectado;
        botonUsuario.hidden = !conectado;
        cerrarMenu();
    }

    // INICIAR SESION DE PRUEBA
    login.addEventListener("click", () => {
        conectado = true;
        actualizarUsuario();
    });

    // ABRIR MENU DE PERFIL
    botonUsuario.addEventListener("click", (evento) => {
        evento.stopPropagation();

        const abierto = botonUsuario.getAttribute("aria-expanded") === "true";

        menu.hidden = abierto;
        botonUsuario.setAttribute("aria-expanded", String(!abierto));
    });

    // CERRAR SESION DE PRUEBA
    logout.addEventListener("click", () => {
        conectado = false;
        actualizarUsuario();
    });

    // CERRAR MENU AL HACER CLICK FUERA
    document.addEventListener("click", (evento) => {
        if (!menu.contains(evento.target) &&
            !botonUsuario.contains(evento.target)) {
            cerrarMenu();
        }
    });

    // CERRAR MENU CON ESC
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarMenu();
        }
    });

    // ENLACES TODAVIA SIN PAGINA
    menu.querySelectorAll('a[href="#"]').forEach(enlace => {
        enlace.addEventListener("click", evento => {
            evento.preventDefault();
        });
    });

    actualizarUsuario();

});
