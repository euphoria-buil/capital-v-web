import { useState } from 'react';
import './Tienda.css';

// Precios originales de tienda.js. La apariencia y el contenido se conservan.
const PRECIOS = {
  cobre: { mensual: 4.99, permanente: 19.99 },
  oro: { mensual: 9.99, permanente: 39.99 },
  diamante: { mensual: 19.99, permanente: 79.99 },
};

export default function Tienda({ onLoginRequest }) {
  const [duraciones, setDuraciones] = useState({ cobre: 'mensual', oro: 'mensual', diamante: 'mensual' });
  const [aviso, setAviso] = useState(false);

  function gestionarClick(evento) {
    const boton = evento.target.closest('button');
    if (!boton || !evento.currentTarget.contains(boton)) return;
    if (boton.classList.contains('duracion')) {
      const plan = boton.dataset.plan;
      const tipo = boton.dataset.tipo;
      if (PRECIOS[plan] && PRECIOS[plan][tipo] !== undefined) {
        setDuraciones(actual => ({ ...actual, [plan]: tipo }));
      }
    }
    if (boton.classList.contains('comprar')) {
      if (typeof onLoginRequest === 'function') onLoginRequest();
      else setAviso(true);
    }
  }

  return (
    <div className="cv-tienda-page" onClick={gestionarClick}>
      <div className="cv-tienda-contenido">
<main><section className={'hero'}><span className={'etiqueta'}>{'CAPITAL V'}</span><h1>{'TIENDA '}<span>{'OFICIAL'}</span></h1><p>{'\n            Descubre nuestras membresías y personaliza\n            tu experiencia dentro de nuestra comunidad.\n        '}</p><a href={'#membresias'} className={'boton-explorar'}>{'\n            Explorar membresías\n        '}</a></section><section className={'seccion-tienda'} id={'membresias'}><div className={'titulo-seccion'}><span>{'BENEFICIOS EXCLUSIVOS'}</span><h2>{'Nuestras membresías'}</h2><p>{'\n                Elige la membresía que más te guste.\n                Puedes adquirirla por 30 días o en\n                modalidad permanente.\n            '}</p></div><div className={'contenedor-planes'}><article className={'tarjeta-plan cobre'}><div className={'icono-plan'}><span>{'🥉'}</span></div><h3>{'COBRE'}</h3><p className={'subtitulo-plan'}>{'\n                    Tu primera experiencia VIP\n                '}</p><div className={'selector-duracion'}><button className={`duracion ${duraciones.cobre === 'mensual' ? 'activo' : ''}`} data-plan="cobre" data-tipo="mensual">{'\n                        30 días\n                    '}</button><button className={`duracion ${duraciones.cobre === 'permanente' ? 'activo' : ''}`} data-plan="cobre" data-tipo="permanente">{'\n                        Permanente\n                    '}</button></div><div className={'precio'}><span className={'simbolo'}>{'$'}</span><strong id={'precio-cobre'}>{PRECIOS['cobre'][duraciones.cobre].toFixed(2)}</strong><small id={'periodo-cobre'}>{duraciones.cobre === 'mensual' ? '/ 30 días' : '/ pago único'}</small></div><ul className={'beneficios'}><li>{'Insignia Cobre exclusiva'}</li><li>{'Canal exclusivo de comunidad'}</li><li>{'Conjunto de ropa cosmética'}</li><li>{'Eventos para miembros'}</li></ul><button className={'comprar'}>{'\n                    Comprar Cobre\n                '}</button></article><article className={'tarjeta-plan oro'}><div className={'etiqueta-popular'}>{'\n                    DESTACADO\n                '}</div><div className={'icono-plan'}><span>{'👑'}</span></div><h3>{'ORO'}</h3><p className={'subtitulo-plan'}>{'\n                    Más personalización y exclusividad\n                '}</p><div className={'selector-duracion'}><button className={`duracion ${duraciones.oro === 'mensual' ? 'activo' : ''}`} data-plan="oro" data-tipo="mensual">{'\n                        30 días\n                    '}</button><button className={`duracion ${duraciones.oro === 'permanente' ? 'activo' : ''}`} data-plan="oro" data-tipo="permanente">{'\n                        Permanente\n                    '}</button></div><div className={'precio'}><span className={'simbolo'}>{'$'}</span><strong id={'precio-oro'}>{PRECIOS['oro'][duraciones.oro].toFixed(2)}</strong><small id={'periodo-oro'}>{duraciones.oro === 'mensual' ? '/ 30 días' : '/ pago único'}</small></div><ul className={'beneficios'}><li>{'Todos los beneficios Cobre'}</li><li>{'Insignia Oro exclusiva'}</li><li>{'Dos conjuntos cosméticos adicionales'}</li><li>{'Personalización visual de vehículos'}</li><li>{'Eventos especiales'}</li></ul><button className={'comprar'}>{'\n                    Comprar Oro\n                '}</button></article><article className={'tarjeta-plan diamante'}><div className={'icono-plan'}><span>{'💎'}</span></div><h3>{'DIAMANTE'}</h3><p className={'subtitulo-plan'}>{'\n                    La experiencia más exclusiva\n                '}</p><div className={'selector-duracion'}><button className={`duracion ${duraciones.diamante === 'mensual' ? 'activo' : ''}`} data-plan="diamante" data-tipo="mensual">{'\n                        30 días\n                    '}</button><button className={`duracion ${duraciones.diamante === 'permanente' ? 'activo' : ''}`} data-plan="diamante" data-tipo="permanente">{'\n                        Permanente\n                    '}</button></div><div className={'precio'}><span className={'simbolo'}>{'$'}</span><strong id={'precio-diamante'}>{PRECIOS['diamante'][duraciones.diamante].toFixed(2)}</strong><small id={'periodo-diamante'}>{duraciones.diamante === 'mensual' ? '/ 30 días' : '/ pago único'}</small></div><ul className={'beneficios'}><li>{'Todos los beneficios Oro y Cobre'}</li><li>{'Insignia Diamante exclusiva'}</li><li>{'Colección cosmética exclusiva'}</li><li>{'Personalizaciones visuales adicionales'}</li><li>{'Eventos VIP especiales'}</li></ul><button className={'comprar'}>{'\n                    Comprar Diamante\n                '}</button></article></div><p className={'aviso-productos'}>{'\n            Los productos y beneficios están sujetos a\n            disponibilidad y a las normas de monetización\n            aplicables al servidor.\n        '}</p></section><section className={'seccion-monedas'}><div className={'titulo-seccion'}><span>{'ECONOMÍA DEL SERVIDOR'}</span><h2>{'Monedas Capital'}</h2><p>{'\n                Estas monedas te permitiran comprar objetos\n                exclusivos dentro del juego.\n            '}</p></div><div className={'contenedor-monedas'}><div className={'tarjeta-moneda'}><div className={'moneda-icono'}>{'🪙'}</div><h3>{'500'}</h3><p>{'Monedas virtuales'}</p><span>{'Obtenibles jugando'}</span></div><div className={'tarjeta-moneda'}><div className={'moneda-icono'}>{'🪙'}</div><h3>{'1.200'}</h3><p>{'Monedas virtuales'}</p><span>{'Obtenibles jugando'}</span></div><div className={'tarjeta-moneda'}><div className={'moneda-icono'}>{'🪙'}</div><h3>{'3.000'}</h3><p>{'Monedas virtuales'}</p><span>{'Obtenibles jugando'}</span></div></div></section></main>
      </div>
      {aviso && (
        <div className="cv-tienda-aviso-fondo" role="presentation" onClick={() => setAviso(false)}>
          <div className="cv-tienda-aviso" role="dialog" aria-modal="true" aria-label="Compras" onClick={e => e.stopPropagation()}>
            <h2>Inicia sesión</h2>
            <p>Para comprar una membresía, inicia sesión desde Mi cuenta en la barra superior.</p>
            <button type="button" onClick={() => setAviso(false)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
}
