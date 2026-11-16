
document.addEventListener("DOMContentLoaded", () => {

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    const categoria = DATOS_FORO[id];

    const titulo = document.getElementById("categoriaTitulo");
    const descripcion = document.getElementById("categoriaDescripcion");
    const icono = document.getElementById("categoriaIcono");
    const ruta = document.getElementById("rutaCategoria");
    const lista = document.getElementById("listaSubforos");
    const buscador = document.getElementById("buscarSubforo");
    const vacio = document.getElementById("mensajeVacio");

    if (!categoria) {
        titulo.textContent = "Categoría no encontrada";
        descripcion.textContent = "Esta sección no está disponible.";
        icono.textContent = "❓";
        vacio.hidden = false;
        buscador.disabled = true;
        return;
    }

    document.title = categoria.titulo + " | Euphorya Roleplay";

    titulo.textContent = categoria.titulo;
    descripcion.textContent = categoria.descripcion;
    icono.textContent = categoria.icono;
    ruta.textContent = categoria.titulo;

    function mostrarSubforos() {
        const busqueda = buscador.value.toLowerCase().trim();

        const filtrados = categoria.subforos.filter(subforo =>
            subforo[1].toLowerCase().includes(busqueda) ||
            subforo[2].toLowerCase().includes(busqueda)
        );

        lista.replaceChildren();

        filtrados.forEach(subforo => {

            const enlace = document.createElement("a");
            enlace.className = "tarjeta-subforo";
            enlace.href = "subforo.html?id=" +
                encodeURIComponent(id + "-" + subforo[0]);
                enlace.addEventListener("click", function(evento) {
    evento.preventDefault();

    window.location.href = "subforo.html?id=" +
        encodeURIComponent(id + "-" + subforo[0]);
});

            const iconoSubforo = document.createElement("span");
            iconoSubforo.className = "subforo-icono";
            iconoSubforo.textContent = subforo[3];

            const informacion = document.createElement("div");
            informacion.className = "subforo-informacion";

            const nombre = document.createElement("h3");
            nombre.textContent = subforo[1];

            const detalle = document.createElement("p");
            detalle.textContent = subforo[2];

            const flecha = document.createElement("span");
            flecha.className = "subforo-flecha";
            flecha.textContent = "›";

            informacion.append(nombre, detalle);
            enlace.append(iconoSubforo, informacion, flecha);
            lista.appendChild(enlace);
        });

        vacio.hidden = filtrados.length > 0;
    }

    buscador.addEventListener("input", mostrarSubforos);
    mostrarSubforos();
});
