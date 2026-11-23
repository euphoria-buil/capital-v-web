
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import LoginModal from "./components/LoginModal";
import MenuUsuario from "./components/MenuUsuario";
import Perfil from "./pages/Perfil";
import "./App.css";
import Foro from "./pages/Foro";
import Inicio from "./pages/Inicio";
import Tienda from "./pages/Tienda";
import Configuracion from "./pages/Configuracion";

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loginAbierto, setLoginAbierto] = useState(false);
  const { usuario } = useAuth();

  return (
    <BrowserRouter>
      <div className="capital-web">

        <header className="capital-header">
          <Link className="capital-marca" to="/">
            <img
              src="/logo-capital-v.png"
              alt="Capital V Roleplay"
            />
            <div>
              <strong>CAPITAL V</strong>
              <span>ROLEPLAY</span>
            </div>
          </Link>

          <button
            className="capital-menu-boton"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>

          <nav className={
            menuAbierto
              ? "capital-nav abierto"
              : "capital-nav"
          }>
            <Link
              to="/"
              onClick={() => setMenuAbierto(false)}
            >
              Inicio
            </Link>

            <Link
              to="/#comunidad"
              onClick={() => setMenuAbierto(false)}
            >
              Comunidad
            </Link>

            <Link
              to="/foro"
              onClick={() => setMenuAbierto(false)}
            >
              Foro
            </Link>

            <Link
              to="/tienda"
              onClick={() => setMenuAbierto(false)}
            >
              Tienda
            </Link>
          </nav>

          {usuario ? (
            <MenuUsuario />
          ) : (
            <button
              className="capital-login"
              type="button"
              onClick={() => setLoginAbierto(true)}
            >
              Iniciar sesión
            </button>
          )}
        </header>

<Routes>
  <Route path="/" element={<Inicio />} />
  <Route path="/perfil" element={<Perfil />} />
  <Route path="/foro" element={<Foro />} />
  <Route path="/tienda" element={<Tienda />} />
  <Route path="/configuracion" element={<Configuracion />} />
</Routes>
        <LoginModal
          abierto={loginAbierto}
          cerrar={() => setLoginAbierto(false)}
        />

      </div>
    </BrowserRouter>
  );
}

export default App;
