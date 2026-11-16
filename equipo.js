
document.addEventListener("DOMContentLoaded", () => {
    const arbol = document.getElementById("equipo-euphorya");
    if (!arbol) return;

    const tarjetas = arbol.querySelectorAll(
        ".equipo-persona, .equipo-rango"
    );

    const nombre = document.getElementById("equipoNombre");
    const descripcion = document.getElementById("equipoDescripcion");

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            tarjetas.forEach(otra => {
                otra.classList.remove("seleccionado");
            });

            tarjeta.classList.add("seleccionado");

            nombre.textContent =
                tarjeta.dataset.nombre + " — " + tarjeta.dataset.rango;

            descripcion.textContent = tarjeta.dataset.descripcion;
        });
    });
});
