export default function ForoBuscador({ valor, alCambiar }) {
  return <input className="cvf-buscador" type="search" value={valor} onChange={e => alCambiar(e.target.value)} placeholder="Buscar una categoría..." aria-label="Buscar categorías" />;
}
