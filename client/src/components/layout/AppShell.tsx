import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RoleBadge } from "../ui/RoleBadge";
import { linkBtnClass } from "../ui/Button";

type NavItem = { to: string; label: string; end?: boolean };

const NAV: NavItem[] = [
  { to: "/", label: "Inicio", end: true },
  { to: "/foro", label: "Foro" },
  { to: "/tienda", label: "Tienda" },
  { to: "/reportes", label: "Reportes" },
];

export function AppShell() {
  const { user, logout, hasPermission } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links: NavItem[] = [...NAV];
  if (hasPermission("admin.access")) links.push({ to: "/admin", label: "Admin" });
  if (user?.role === "OWNER" && hasPermission("permissions.manage")) {
    links.push({ to: "/owner/permisos", label: "Permisos" });
  }

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="logo-mark title-font" onClick={() => setMenuOpen(false)}>
            CAPITAL <span>V</span>
          </Link>

          <nav className="nav-desktop" aria-label="Principal">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <RoleBadge className="hide-mobile" role={user.role} label={`${user.username} · ${user.role}`} />
              </>
            ) : null}
            {user ? (
              <button type="button" className={linkBtnClass("secondary", "sm")} onClick={logout}>
                Salir
              </button>
            ) : (
              <Link to="/cuenta" className={linkBtnClass("primary", "sm")}>
                Mi cuenta
              </Link>
            )}
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Menú
            </button>
          </div>
        </div>

        <nav id="mobile-nav" className={`mobile-drawer ${menuOpen ? "open" : ""}`} aria-label="Móvil">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          {!user && (
            <NavLink to="/cuenta" onClick={() => setMenuOpen(false)}>
              Mi cuenta
            </NavLink>
          )}
        </nav>
      </header>

      <Outlet />

      <FloatingWidgets />

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div>
            <h3 className="title-font" style={{ marginTop: 0 }}>
              Capital V Roleplay
            </h3>
            <p className="muted">Foro institucional, reportes, tienda y administración web para la comunidad FiveM.</p>
          </div>
          <div>
            <h4 className="title-font" style={{ marginTop: 0, fontSize: "1rem" }}>
              Enlaces
            </h4>
            <p className="muted">
              <Link to="/foro">Foro</Link>
              {" · "}
              <Link to="/tienda">Tienda</Link>
              {" · "}
              <Link to="/reportes">Reportes</Link>
            </p>
          </div>
          <div>
            <h4 className="title-font" style={{ marginTop: 0, fontSize: "1rem" }}>
              Comunidad
            </h4>
            <div className="site-footer__social">
              <a href="https://discord.com/" target="_blank" rel="noreferrer" aria-label="Discord">
                DC
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                IG
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
                YT
              </a>
            </div>
          </div>
        </div>
        <p className="container muted" style={{ marginTop: "1.5rem", marginBottom: 0, fontSize: "0.85rem" }}>
          © {new Date().getFullYear()} Capital V Roleplay. Prototipo web — el HTML estático anterior está en /legacy.
        </p>
      </footer>
    </div>
  );
}

function FloatingWidgets() {
  return (
    <div className="floating-widgets" aria-label="Accesos rápidos">
      <OnlinePill />
      <Link to="/foro" className="forum-fab">
        💬 Foro
      </Link>
    </div>
  );
}

function OnlinePill() {
  return (
    <div className="online-pill">
      <span className="badge dot">LIVE</span>
      <strong>—</strong>
      <span className="muted">jugadores</span>
    </div>
  );
}