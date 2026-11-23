import { useEffect, useRef, useState } from 'react';
import './Inicio.css';
import BotonesFlotantes from "../components/BotonesFlotantes";
import RedesSociales from "../components/RedesSociales";


// Sustituye las rutas por tus capturas en public/imagenes cuando las tengas.
const portada = [
  { imagen: '/imagenes/portada-1.jpg', titulo: 'Tu historia comienza en Capital V', texto: 'Descubre una nueva experiencia de GTA V Roleplay y construye tu propio camino.' },
  { imagen: '/imagenes/portada-2.jpg', titulo: 'Explora Los Santos', texto: 'Una ciudad llena de oportunidades, lugares por descubrir y nuevas historias.' },
  { imagen: '/imagenes/portada-3.jpg', titulo: 'Elige tu destino', texto: 'Desarrolla tu personaje y forma parte de una comunidad única.' },
  { imagen: '/imagenes/portada-4.jpg', titulo: 'Vive Capital V', texto: 'Cada decisión cuenta. ¿Qué historia vas a contar?' },
];

const experiencias = [
  { imagen: '/imagenes/ruleta-1.jpg', titulo: 'Crea tu propio imperio', texto: 'Construye negocios, consigue propiedades y desarrolla tu propia historia dentro de Capital V Roleplay.' },
  { imagen: '/imagenes/ruleta-2.jpg', titulo: 'Explora la ciudad', texto: 'Recorre Los Santos, descubre lugares y conoce personajes con historias únicas.' },
  { imagen: '/imagenes/ruleta-3.jpg', titulo: 'Elige tu profesión', texto: 'Participa en facciones, servicios de emergencia y distintas profesiones de la ciudad.' },
  { imagen: '/imagenes/ruleta-4.jpg', titulo: 'Construye tu historia', texto: 'Toma decisiones, crea vínculos y dale vida a tu personaje.' },
  { imagen: '/imagenes/ruleta-5.jpg', titulo: 'Forma parte de Capital V', texto: 'Únete a una comunidad donde cada día puede comenzar una nueva aventura.' },
];

function Foto({ src, alt, className = '', children }) {
  const [error, setError] = useState(false);
  useEffect(() => setError(false), [src]);
  return (
    
    <div className={`cv-foto ${className}`}>
      {!error && <img src={src} alt={alt} draggable="false" onError={() => setError(true)} />}
      {error && <div className="cv-foto-fallback" aria-label={alt}><span>CAPITAL <b>V</b></span><small>ROLEPLAY</small></div>}
      {children}
    </div>
  );
  
}

function PortadaAutomatica() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  useEffect(() => {
    if (pausado) return;
    const intervalo = window.setInterval(() => setActual(i => (i + 1) % portada.length), 5000);
    return () => window.clearInterval(intervalo);
  }, [pausado]);
  const cambiar = delta => setActual(i => (i + delta + portada.length) % portada.length);
  return (
    <section className="cv-portada" aria-label="Portada de Capital V" onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)} onFocusCapture={() => setPausado(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPausado(false); }}>
      {portada.map((item, i) => (
        <div className={`cv-portada-slide ${i === actual ? 'activo' : ''}`} key={item.titulo} aria-hidden={i !== actual}>
          <Foto src={item.imagen} alt={item.titulo} className="cv-portada-imagen" />
        </div>
      ))}
      <div className="cv-portada-sombra" />
      <div className="cv-portada-contenido">
        <span className="cv-etiqueta">BIENVENIDO A CAPITAL V ROLEPLAY</span>
        <h1>{portada[actual].titulo}</h1>
        <p>{portada[actual].texto}</p>
        <div className="cv-portada-acciones"><a href="#que-es" className="cv-btn cv-btn-primario">Descubre Capital V</a><a href="#como-jugar" className="cv-btn cv-btn-secundario">Cómo jugar</a></div>
      </div>
      <button type="button" className="cv-portada-flecha anterior" onClick={() => cambiar(-1)} aria-label="Imagen anterior">‹</button>
      <button type="button" className="cv-portada-flecha siguiente" onClick={() => cambiar(1)} aria-label="Imagen siguiente">›</button>
      <div className="cv-indicadores" aria-label="Elegir imagen de portada">{portada.map((item, i) => <button key={item.titulo} type="button" className={i === actual ? 'activo' : ''} aria-label={`Mostrar portada ${i + 1}`} aria-current={i === actual ? 'true' : undefined} onClick={() => setActual(i)} />)}</div>
    </section>
  );
}

function RuletaCapital() {
  const [actual, setActual] = useState(0);
  const inicioArrastre = useRef(null);
  const [arrastrando, setArrastrando] = useState(false);
  const total = experiencias.length;
  const mover = delta => setActual(i => (i + delta + total) % total);
  const alSoltar = e => {
    if (!inicioArrastre.current) return;
    const { x, y } = inicioArrastre.current;
    inicioArrastre.current = null;
    setArrastrando(false);
    const dx = e.clientX - x, dy = e.clientY - y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) mover(dx < 0 ? 1 : -1);
  };
  return (
    <section className="cv-seccion cv-que-es" id="que-es">
      <div className="cv-encabezado"><span className="cv-etiqueta">CONOCE NUESTRA CIUDAD</span><h2>¿QUÉ ES CAPITAL V RP?</h2><p>Crea tu propio imperio</p></div>
      <div className="cv-ruleta-layout">
        <div className="cv-ruleta-zona">
          <div
            className="cv-ruleta-escenario"
            role="region"
            aria-label="Ruleta de imágenes: arrastra horizontalmente"
            tabIndex={0}
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'pan-y',
              cursor: arrastrando ? 'grabbing' : 'grab',
            }}
            onDragStart={e => e.preventDefault()}
            onSelectStart={e => e.preventDefault()}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
            }}
            onPointerDown={e => {
              if (e.pointerType === 'mouse' && e.button !== 0) return;
              if (e.pointerType === 'mouse') e.preventDefault();
              inicioArrastre.current = { x: e.clientX, y: e.clientY };
              setArrastrando(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={alSoltar}
            onPointerCancel={() => {
              inicioArrastre.current = null;
              setArrastrando(false);
            }}
            onLostPointerCapture={() => {
              inicioArrastre.current = null;
              setArrastrando(false);
            }}
          >
            {experiencias.map((item, i) => {
              let distancia = i - actual;
              if (distancia > Math.floor(total / 2)) distancia -= total;
              if (distancia < -Math.floor(total / 2)) distancia += total;
              return <div key={item.titulo} className={`cv-ruleta-tarjeta ${distancia === 0 ? 'central' : ''}`} draggable={false} style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none', '--abs': Math.abs(distancia), zIndex: total - Math.abs(distancia), transform: `translateX(calc(-50% + ${distancia * 68}%)) translateZ(${-Math.abs(distancia) * 105}px) rotateY(${-distancia * 18}deg) scale(${1 - Math.abs(distancia) * .13})` }} aria-hidden={distancia !== 0}>
                <Foto src={item.imagen} alt={item.titulo} /><div className="cv-ruleta-titulo-imagen">{item.titulo}</div>
              </div>;
            })}
          </div>
          <div className="cv-ruleta-controles"><button type="button" onClick={() => mover(-1)} aria-label="Anterior imagen">‹</button><div className="cv-puntos">{experiencias.map((item, i) => <button type="button" key={item.titulo} className={i === actual ? 'activo' : ''} onClick={() => setActual(i)} aria-label={`Ver ${item.titulo}`} aria-current={i === actual ? 'true' : undefined} />)}</div><button type="button" onClick={() => mover(1)} aria-label="Siguiente imagen">›</button></div>
          <p className="cv-arrastrar">↔ Arrastra las imágenes con el ratón para explorar</p>
        </div>
        <div className="cv-ruleta-descripcion" aria-live="polite"><span className="cv-etiqueta">CAPITAL V ROLEPLAY</span><h3 key={`titulo-${actual}`}>{experiencias[actual].titulo}</h3><p key={`texto-${actual}`}>{experiencias[actual].texto}</p><span className="cv-contador">{String(actual + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></div>
      </div>
    </section>
  );
}

function ComoJugar() {
  return (
    <section className="cv-seccion cv-como-jugar" id="como-jugar"><div className="cv-encabezado"><h2>¿CÓMO JUGAR EN CAPITAL V?</h2><p>Sigue estos tres sencillos pasos y comienza tu historia en Los Santos.</p></div>
      <div className="cv-pasos">
        <article className="cv-paso"><div className="cv-paso-cabecera"><span className="cv-paso-numero">1</span><h3>Instalar el<br />juego GTA V</h3></div><p>Compra e instala una copia original de Grand Theft Auto V en tu PC.</p><div className="cv-tiendas"><a href="https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/" target="_blank" rel="noreferrer">Steam</a><a href="https://store.epicgames.com/" target="_blank" rel="noreferrer">Epic Games</a><a href="https://store.rockstargames.com/" target="_blank" rel="noreferrer">Rockstar</a></div><div className="cv-paso-arte cv-arte-gta"><span>grand<br />theft<br />auto <b>V</b></span></div><div className="cv-progreso"><small>Cargando...</small><div className="cv-barra"><span /></div></div></article>
        <article className="cv-paso destacado"><div className="cv-paso-cabecera"><span className="cv-paso-numero">2</span><h3>Instalar<br />FiveM</h3></div><p>Descarga e instala FiveM desde su página oficial. Es completamente gratuito.</p><a className="cv-btn cv-btn-amarillo" href="https://fivem.net/" target="_blank" rel="noreferrer">Descargar FiveM</a><div className="cv-paso-arte cv-arte-fivem" aria-label="FiveM"><span>Λ</span></div><div className="cv-progreso"><small>Instalando FiveM...</small><div className="cv-barra"><span /></div></div></article>
        <article className="cv-paso"><div className="cv-paso-cabecera"><span className="cv-paso-numero">3</span><h3>Únete a<br />Capital V Roleplay</h3></div><p>Abre FiveM y busca Capital V Roleplay cuando el servidor esté disponible.</p><span className="cv-btn cv-btn-espera">Próximamente</span><div className="cv-paso-arte cv-arte-capital"><span>CAPITAL<br /><b>V</b></span><small>ROLEPLAY</small></div><div className="cv-progreso"><small>Preparando el servidor...</small><div className="cv-barra"><span /></div></div></article>
      </div>
    </section>
  );
}

export default function Inicio() {
  return (
    <main className="cv-inicio">
      <PortadaAutomatica />

      <RuletaCapital />

      {/* Separador decorativo */}
      <div className="cv-separador">
        <div className="cv-separador-linea">
          <span className="cv-separador-rombo"></span>
        </div>
      </div>

      <ComoJugar />

      <RedesSociales />

      <BotonesFlotantes />

      <footer className="cv-footer"></footer>
    </main>
  );
}
