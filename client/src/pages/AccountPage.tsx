import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Alert";
import { Card, PageHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function AccountPage() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      if (tab === "login") {
        await login(String(fd.get("email")), String(fd.get("password")));
      } else {
        const password = String(fd.get("password"));
        const confirm = String(fd.get("confirm"));
        if (password !== confirm) {
          setError("Las contraseñas no coinciden");
          return;
        }
        await register(String(fd.get("email")), String(fd.get("username")), password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo completar la operación");
    } finally {
      setLoading(false);
    }
  }

  if (user) return null;

  return (
    <main className="container page" style={{ maxWidth: 520 }}>
      <Card>
        <PageHeader
          title="Tu cuenta Capital V"
          description="Acceso al foro, reportes in-game y futura tienda con un solo registro."
        />

        <div className="tabs" style={{ marginBottom: "1rem" }}>
          <Button variant={tab === "login" ? "primary" : "secondary"} onClick={() => setTab("login")}>
            Iniciar sesión
          </Button>
          <Button variant={tab === "register" ? "primary" : "secondary"} onClick={() => setTab("register")}>
            Registrarse
          </Button>
        </div>

        <form className="form-stack" onSubmit={onSubmit}>
          {tab === "register" && (
            <>
              <label htmlFor="username">Usuario</label>
              <input id="username" name="username" required minLength={3} maxLength={24} />
            </>
          )}
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete={tab === "login" ? "current-password" : "new-password"} />
          {tab === "register" && (
            <>
              <label htmlFor="confirm">Confirmar contraseña</label>
              <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
            </>
          )}
          {error && <Alert variant="error">{error}</Alert>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Procesando…" : tab === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
      </Card>
    </main>
  );
}