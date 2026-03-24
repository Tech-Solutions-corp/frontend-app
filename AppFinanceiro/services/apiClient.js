const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

function buildHeaders(token, hasBody = false) {
  const headers = {
    Accept: "application/json",
  };

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, body !== undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = parsed?.message || "Erro ao processar requisicao";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return parsed;
}

export { API_BASE_URL };
