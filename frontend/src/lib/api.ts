import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenantId = sessionStorage.getItem("tenant_id");
    if (tenantId) {
      config.headers["X-Tenant-Id"] = tenantId;
    }
  }
  return config;
});

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem("access_token", token);
  else sessionStorage.removeItem("access_token");
}

export function setTenantId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) sessionStorage.setItem("tenant_id", id);
  else sessionStorage.removeItem("tenant_id");
}
