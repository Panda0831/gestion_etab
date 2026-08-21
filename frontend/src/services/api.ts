// services/api.ts
const API_URL = "http://localhost:3000";

export async function post<TPayload, TResponse>(
  endpoint: string,
  payload: TPayload,
  requiresAuth: boolean = true // optionnel : certaines routes sont publiques
): Promise<TResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Si la route nécessite une authentification, on ajoute le token
  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      throw new Error("Authentification requise. Veuillez vous connecter.");
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("API Response:", data);

  if (!res.ok) {
    // Gestion 401 : supprimer le token et rediriger vers login
    if (res.status === 401) {
      localStorage.removeItem("token");
      // Vous pouvez déclencher une redirection depuis le composant si besoin
    }
    throw new Error(data.message || `Erreur ${res.status}`);
  }

  return data as TResponse;
}

export async function get<TResponse>(
  endpoint: string,
  requiresAuth: boolean = true
): Promise<TResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      throw new Error("Authentification requise. Veuillez vous connecter.");
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

  const data = await res.json();
  console.log("API Response:", data);

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
    }
    throw new Error(data.message || `Erreur ${res.status}`);
  }

  return data as TResponse;
}
