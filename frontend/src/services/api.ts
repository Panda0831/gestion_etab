const API_URL = "http://localhost:3000";

async function request<TResponse>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  endpoint: string,
  payload?: unknown,
  requiresAuth = true
): Promise<TResponse> {
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentification requise. Veuillez vous connecter.");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) localStorage.removeItem("token");
    throw new Error(data.message || `Erreur ${res.status}`);
  }

  return data as TResponse;
}

export const get = <T>(endpoint: string, requiresAuth = true) =>
  request<T>("GET", endpoint, undefined, requiresAuth);

export const post = <TPayload, TResponse>(endpoint: string, payload: TPayload, requiresAuth = true) =>
  request<TResponse>("POST", endpoint, payload, requiresAuth);

export const patch = <TPayload, TResponse>(endpoint: string, payload: TPayload, requiresAuth = true) =>
  request<TResponse>("PATCH", endpoint, payload, requiresAuth);

export async function upload<TResponse>(endpoint: string, formData: FormData): Promise<TResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentification requise. Veuillez vous connecter.");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) localStorage.removeItem("token");
    throw new Error(Array.isArray(data.message) ? data.message.join(", ") : data.message || `Erreur ${res.status}`);
  }
  return data as TResponse;
}