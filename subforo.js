
document.addEventListener("DOMContentLoaded", () => {
    const $ = selector => document.querySelector(selector);
    const id = new URLSearchParams(location.search).get("id") || "";
    const subforo = obtenerSubforo(id);

    const lista = $("#listaTemas");
    const buscador = $("#buscarTema");
    const orden = $("#ordenTemas");
    const vacio = $("#subforoVacio");
    const botonCrear = $("#botonCrearTema");
    const panelCrear = $("#panelCrearTema");
    const panelLeer = $("#panelLeerTema");
    const formulario = $("#formularioTema");

    if (!subforo) {
        $("#subforoTitulo").textContent = "Subforo no encontrado";
        $("#subforoDescripcion").textContent = "Esta sección no existe.";
        botonCrear.disabled = true;
        return;
    }

    $("#subforoTitulo").textContent = subforo.titulo;
    $("#subforoDescripcion").textContent = subforo.descripcion;
    $("#subforoIcono").textContent = subforo.icono;
    $("#rutaSubforo").textContent = subforo.titulo;
    $("#enlaceCategoria").textContent = subforo.categoria.titulo;
    $("#enlaceCategoria").href =
        "categoria.html?id=" + encodeURIComponent(subforo.categoriaId);

    document.title = subforo.titulo + " | Euphorya Roleplay";

    const clave = "euphorya_temas_" + id;
    const claveUsuario = "euphorya_usuario_demo";
    const POR_PAGINA = 20;

    let paginaActual = 1;
    let temaAbierto = null;
    let temaEditando = null;
    let temas = [];

    try {
        const datos = JSON.parse(localStorage.getItem(clave) || "[]");
        temas = Array.isArray(datos) ? datos : [];
    } catch {
        temas = [];
    }

    // IDENTIDAD DEMOSTRATIVA
    function usuarioActual() {
        try {
            return JSON.parse(sessionStorage.getItem(claveUsuario));
        } catch {
            return null;
        }
    }

    function iniciarSesionDemo() {
        const existente = usuarioActual();
        if (existente && existente.id && existente.nombre) {
            return existente;
        }

        const nombre = prompt(
            "Modo de prueba: escribe el nombre del usuario que publicará:"
        );

        if (!nombre || !nombre.trim()) return null;

        const usuario = {
            id: "demo-" + crypto.randomUUID(),
            nombre: nombre.trim().slice(0, 60)
        };

        sessionStorage.setItem(claveUsuario, JSON.stringify(usuario));
        return usuario;
    }

    function esPropietario(tema) {
        const usuario = usuarioActual();

        return Boolean(
            usuario &&
            tema.autorId &&
            usuario.id === tema.autorId
        );
    }

    function guardar() {
        localStorage.setItem(clave, JSON.stringify(temas));
    }

    function fechaCompleta(valor) {
        const fecha = new Date(valor);

        if (Number.isNaN(fecha.getTime())) {
            return "Fecha no disponible";
        }

        return fecha.toLocaleString("es", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    }

    // CONTROLES DE PAGINACIÓN
    const paginacion = document.createElement("div");
    paginacion.className = "paginacion-temas";
    lista.insertAdjacentElement("afterend", paginacion);

    function obtenerFiltrados() {
        const texto = buscador.value.toLowerCase().trim();

        const resultado = temas.filter(tema =>
            String(tema.titulo || "").toLowerCase().includes(texto) ||
            String(tema.autor || "").toLowerCase().includes(texto) ||
            String(tema.contenido || "").toLowerCase().includes(texto)
        );

        if (orden.value === "antiguos") {
            resultado.sort((a, b) => a.fecha - b.fecha);
        } else if (orden.value === "titulo") {
            resultado.sort((a, b) =>
                a.titulo.localeCompare(b.titulo)
            );
        } else {
            resultado.sort((a, b) => b.fecha - a.fecha);
        }

        return resultado;
    }

    function crearBoton(texto, accion, clase = "") {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = clase;
        boton.textContent = texto;
        boton.addEventListener("click", accion);
        return boton;
    }

    function mostrarTemas() {
        const filtrados = obtenerFiltrados();
        const totalPaginas = Math.max(
            1, Math.ceil(filtrados.length / POR_PAGINA)
        );

        paginaActual = Math.max(
            1, Math.min(paginaActual, totalPaginas)
        );

        const inicio = (paginaActual - 1) * POR_PAGINA;
        const visibles = filtrados.slice(inicio, inicio + POR_PAGINA);

        lista.replaceChildren();
        paginacion.replaceChildren();
        vacio.hidden = filtrados.length > 0;

        visibles.forEach(tema => {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-tema";
            tarjeta.tabIndex = 0;
            tarjeta.setAttribute("role", "button");

            const avatar = document.createElement("div");
            avatar.className = "avatar-tema";
            avatar.textContent =
                String(tema.autor || "U").charAt(0).toUpperCase();

            if (tema.avatar) {
                const imagen = document.createElement("img");
                imagen.src = tema.avatar;
                imagen.alt = "Avatar de " + tema.autor;
                imagen.onerror = () => imagen.remove();
                avatar.appendChild(imagen);
            }

            const informacion = document.createElement("div");
            informacion.className = "informacion-tema";

            const titulo = document.createElement("h3");
            titulo.textContent = tema.titulo;

            const descripcion = document.createElement("p");
            const contenido = String(tema.contenido || "");
            descripcion.textContent =
                contenido.slice(0, 130) +
                (contenido.length > 130 ? "..." : "");

            const detalles = document.createElement("div");
            detalles.className = "detalles-tema";
            detalles.textContent =
                "Por " + tema.autor + " · " +
                (tema.tipo || "PUBLICACIÓN");

            // FECHA Y HORA PEQUEÑAS
            const fecha = document.createElement("small");
            fecha.className = "fecha-publicacion";
            fecha.textContent = "Publicado: " + fechaCompleta(tema.fecha);

            informacion.append(titulo, descripcion, detalles, fecha);

            if (tema.fechaEdicion) {
                const editado = document.createElement("small");
                editado.className = "fecha-publicacion";
                editado.textContent =
                    "Editado: " + fechaCompleta(tema.fechaEdicion);
                informacion.appendChild(editado);
            }

            const flecha = document.createElement("span");
            flecha.className = "flecha-tema";
            flecha.textContent = "›";

            tarjeta.append(avatar, informacion, flecha);

            tarjeta.addEventListener("click", () => abrirTema(tema));

            tarjeta.addEventListener("keydown", evento => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    abrirTema(tema);
                }
            });

            lista.appendChild(tarjeta);
        });

        if (!filtrados.length) return;

        const resumen = document.createElement("span");
        resumen.className = "resumen-paginas";
        resumen.textContent =
            `Mostrando ${inicio + 1}–${Math.min(inicio + POR_PAGINA, filtrados.length)} de ${filtrados.length} temas`;

        const controles = document.createElement("div");
        controles.className = "controles-paginas";

        function botonPagina(texto, pagina, deshabilitado = false) {
            const boton = crearBoton(texto, () => {
                paginaActual = pagina;
                mostrarTemas();
                lista.scrollIntoView({ behavior: "smooth" });
            }, "boton-pagina" + (pagina === paginaActual &&
                texto === String(pagina) ? " activo" : ""));

            boton.disabled = deshabilitado;
            controles.appendChild(boton);
        }

        botonPagina("‹", paginaActual - 1, paginaActual === 1);

        for (let pagina = 1; pagina <= totalPaginas; pagina++) {
            botonPagina(String(pagina), pagina);
        }

        botonPagina("›", paginaActual + 1,
            paginaActual === totalPaginas);

        paginacion.append(resumen, controles);
    }

    // BOTONES DE EDICIÓN Y ELIMINACIÓN
    const accionesPropietario = document.createElement("div");
    accionesPropietario.className = "acciones-propietario";
    panelLeer.appendChild(accionesPropietario);

    function abrirTema(tema) {
        temaAbierto = tema;
        panelCrear.hidden = true;
        panelLeer.hidden = false;

        $("#lecturaTitulo").textContent = tema.titulo;

        $("#lecturaAutor").textContent =
            "Publicado por " + tema.autor +
            " · " + fechaCompleta(tema.fecha) +
            (tema.fechaEdicion
                ? " · Editado: " + fechaCompleta(tema.fechaEdicion)
                : "");

        $("#lecturaContenido").textContent = tema.contenido;
        accionesPropietario.replaceChildren();

        // SOLO EL AUTOR VE ESTAS ACCIONES
        if (esPropietario(tema)) {
            const editar = crearBoton(
                "✏️ Editar tema",
                () => editarTema(tema),
                "boton-editar-tema"
            );

            const eliminar = crearBoton(
                "🗑️ Eliminar tema",
                () => eliminarTema(tema),
                "boton-eliminar-tema"
            );

            accionesPropietario.append(editar, eliminar);
        }

        panelLeer.scrollIntoView({ behavior: "smooth" });
    }

    // CREAR O EDITAR
    const botonPublicar = formulario.querySelector(
        'button[type="submit"]'
    );

    function prepararFormulario() {
        temaEditando = null;
        formulario.reset();
        botonPublicar.textContent = "Publicar tema";
    }

    botonCrear.disabled = false;

    botonCrear.addEventListener("click", () => {
        const usuario = iniciarSesionDemo();
        if (!usuario) return;

        prepararFormulario();
        $("#nuevoAutor").value = usuario.nombre;
        $("#nuevoAutor").readOnly = true;

        panelLeer.hidden = true;
        panelCrear.hidden = false;
        panelCrear.scrollIntoView({ behavior: "smooth" });
    });

    function editarTema(tema) {
        if (!esPropietario(tema)) return;

        temaEditando = tema.id;

        $("#nuevoAutor").value = tema.autor;
        $("#nuevoAutor").readOnly = true;
        $("#nuevoTitulo").value = tema.titulo;
        $("#nuevoContenido").value = tema.contenido;
        $("#nuevoTipo").value = tema.tipo;

        botonPublicar.textContent = "Guardar cambios";

        panelLeer.hidden = true;
        panelCrear.hidden = false;
        panelCrear.scrollIntoView({ behavior: "smooth" });
    }

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        const usuario = usuarioActual();
        if (!usuario) {
            alert("Debes iniciar una sesión de prueba.");
            return;
        }

        const titulo = $("#nuevoTitulo").value.trim();
        const contenido = $("#nuevoContenido").value.trim();
        const tipo = $("#nuevoTipo").value;

        if (!titulo || !contenido) {
            alert("Completa el título y el contenido.");
            return;
        }

        const copiaAnterior = JSON.stringify(temas);

        if (temaEditando) {
            const tema = temas.find(t => t.id === temaEditando);

            if (!tema || !esPropietario(tema)) {
                alert("No puedes editar este tema.");
                return;
            }

            tema.titulo = titulo;
            tema.contenido = contenido;
            tema.tipo = tipo;
            tema.fechaEdicion = Date.now();
        } else {
            temas.push({
                id: crypto.randomUUID(),
                autorId: usuario.id,
                autor: usuario.nombre,
                titulo,
                contenido,
                tipo,
                fecha: Date.now()
            });
        }

        try {
            guardar();
        } catch {
            temas = JSON.parse(copiaAnterior);
            alert("No se pudieron guardar los cambios.");
            return;
        }

        prepararFormulario();
        panelCrear.hidden = true;
        panelLeer.hidden = true;

        buscador.value = "";
        orden.value = "recientes";
        paginaActual = 1;

        mostrarTemas();
        lista.scrollIntoView({ behavior: "smooth" });
    });

    function eliminarTema(tema) {
        if (!esPropietario(tema)) {
            alert("No puedes eliminar este tema.");
            return;
        }

        const confirmar = confirm(
            '¿Seguro que quieres eliminar "' + tema.titulo + '"?'
        );

        if (!confirmar) return;

        const anteriores = temas;
        temas = temas.filter(t => t.id !== tema.id);

        try {
            guardar();
        } catch {
            temas = anteriores;
            alert("No se pudo eliminar el tema.");
            return;
        }

        temaAbierto = null;
        panelLeer.hidden = true;
        mostrarTemas();
        lista.scrollIntoView({ behavior: "smooth" });
    }

    $("#cancelarTema").addEventListener("click", () => {
        panelCrear.hidden = true;
        prepararFormulario();

        if (temaAbierto && temas.some(t => t.id === temaAbierto.id)) {
            abrirTema(temaAbierto);
        }
    });

    $("#volverTemas").addEventListener("click", () => {
        panelLeer.hidden = true;
        lista.scrollIntoView({ behavior: "smooth" });
    });

    buscador.addEventListener("input", () => {
        paginaActual = 1;
        mostrarTemas();
    });

    orden.addEventListener("change", () => {
        paginaActual = 1;
        mostrarTemas();
    });

    mostrarTemas();
});
