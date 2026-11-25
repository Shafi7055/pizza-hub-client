export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("pizzahub-token");
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "The request could not be completed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}
