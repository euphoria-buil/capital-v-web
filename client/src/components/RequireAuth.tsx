import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="container page">Cargando sesión…</p>;
  if (!user) return <Navigate to="/cuenta" replace state={{ from: location.pathname }} />;
  return children;
}