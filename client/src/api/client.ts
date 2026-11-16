const API_BASE = "/api";

export type WebRole = "USER" | "SUPPORT" | "ADMIN" | "OWNER";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(typeof data === "object" && data && "error" in data ? String((data as { error: string }).error) : "Error API");
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  return localStorage.getItem("capitalv_token");
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}