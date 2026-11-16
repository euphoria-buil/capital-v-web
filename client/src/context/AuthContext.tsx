import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, type WebRole } from "../api/client";

type User = {
  id: string;
  email: string;
  username: string;
  role: WebRole;
  banned?: boolean;
};

type AuthContextValue = {
  user: User | null;
  permissions: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  hasPermission: (key: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("capitalv_token");
    if (!token) {
      setUser(null);
      setPermissions([]);
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch<{ user: User; permissions: string[] }>("/auth/me");
      setUser(data.user);
      setPermissions(data.permissions);
    } catch {
      localStorage.removeItem("capitalv_token");
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("capitalv_token", data.token);
    await refresh();
  }, [refresh]);

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      const data = await apiFetch<{ token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
      });
      localStorage.setItem("capitalv_token", data.token);
      await refresh();
    },
    [refresh]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("capitalv_token");
    setUser(null);
    setPermissions([]);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      permissions,
      loading,
      login,
      register,
      logout,
      refresh,
      hasPermission: (key) => permissions.includes(key),
    }),
    [user, permissions, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fuera de AuthProvider");
  return ctx;
}