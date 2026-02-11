const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`📡 API Request: ${options.method || "GET"} ${endpoint}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Error desconocido" }));
    console.error(`❌ API Error [${response.status}]:`, errorData);
    
    // Si es 401, limpiar token inválido
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
    }

    throw new Error(errorData.detail || `Error: ${response.status}`);
  }

  return response.json();
}
