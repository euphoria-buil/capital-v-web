import { useState } from "react";
import ForoCategoria from "../components/ForoCategoria";
import ForoBuscador from "../components/ForoBuscador";
import { DATOS_FORO } from "../services/datosForo";
import "./Foro.css";

const generales = ["comunicados", "comunidad", "reportes", "sugerencias", "soporte"];
const grupos = [
  { titulo: "Facciones legales", descripcion: "Nuestras gubernamentales", icono: "🛡️", ids: ["policia", "ems", "gobierno"] },
  { titulo: "Organizaciones y empresas", descripcion: "Negocios, organizaciones y concesionarios", icono: "🏢", ids: ["empresas", "organizaciones", "concesionarios"] },
];
export default function Foro() {
  const [busqueda, setBusqueda] = useState("");
  const termino = busqueda.trim().toLowerCase();
  const coincide = (id) => `${DATOS_FORO[id].titulo} ${DATOS_FORO[id].descripcion}`.toLowerCase().includes(termino);
  const total = generales.filter(coincide).length + grupos.filter(g => `${g.titulo} ${g.descripcion}`.toLowerCase().includes(termino) || g.ids.some(coincide)).length;
  return <main className="cvf-foro">
    <section className="cvf-bienvenida"><span className="cvf-etiqueta">FORO OFICIAL</span><h1>Capital V Roleplay</h1><p>Bienvenido al foro de Capital V. Explora nuestras categorías, comparte ideas y participa en la comunidad.</p></section>
    <section id="categorias" className="cvf-seccion"><h2>Explorar categorías</h2><ForoBuscador valor={busqueda} alCambiar={setBusqueda} />
      <h3>Información y comunidad</h3><div className="cvf-cuadricula">{generales.map(id => { const c = DATOS_FORO[id]; return <ForoCategoria key={id} id={id} titulo={c.titulo} descripcion={c.descripcion} icono={c.icono} busqueda={termino} />; })}</div>
    </section>
    <section className="cvf-seccion"><h3>Facciones y organizaciones</h3><div className="cvf-cuadricula">{grupos.map(g => <ForoCategoria key={g.titulo} {...g} busqueda={termino} hijos={g.ids.map(id => ({ id, ...DATOS_FORO[id] }))} />)}</div></section>
    {total === 0 && <p className="cvf-vacio">No encontramos categorías con ese nombre.</p>}
  </main>;
}
