const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.156.104.121:8080";

let onUnauthorized = null;

export function setUnauthorizedCallback(callback) {
  onUnauthorized = callback;
}

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
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(token, body !== undefined),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    const message = "Falha de rede: " + (networkErr.message || "Sem detalhes");
    const error = new Error(message);
    error.status = null;
    error.body = null;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch (e) {
    parsed = null;
  }
  if (!response.ok) {
    if (response.status === 401 && token && onUnauthorized) {
      onUnauthorized();
      return;
    }
    const message =
      parsed?.message ??
      parsed?.msg ??
      parsed?.error ??
      response.statusText ??
      "Erro ao processar requisição";
    const error = new Error(message);
    error.status = response.status;
    error.body = parsed;
    throw error;
  }

  return parsed;
}

export { API_BASE_URL };

export async function apiUpload(path, { method = "POST", token, formData } = {}) {
  let response;
  try {
    const headers = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: formData,
    });
  } catch (networkErr) {
    const message = "Falha de rede: " + (networkErr.message || "Sem detalhes");
    const error = new Error(message);
    error.status = null;
    error.body = null;
    throw error;
  }

  if (response.status === 204) return null;

  const text = await response.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch (e) {
    parsed = null;
  }

  if (!response.ok) {
    if (response.status === 401 && token && onUnauthorized) {
      onUnauthorized();
      return;
    }
    const message =
      parsed?.message ?? parsed?.msg ?? parsed?.error ?? response.statusText ?? "Erro ao processar requisição";
    const error = new Error(message);
    error.status = response.status;
    error.body = parsed;
    throw error;
  }

  return parsed;
}

