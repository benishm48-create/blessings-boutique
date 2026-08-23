// Drop this file at: Bouti/src/api.js
// Small wrapper around fetch() so components don't repeat URLs/headers.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }
  return data;
}

export const api = {
  getProducts: (category) =>
    request(`/api/products/${category ? `?category=${category}` : ""}`),

  checkout: (payload) =>
    request(`/api/checkout/`, { method: "POST", body: JSON.stringify(payload) }),

  sendContact: (payload) =>
    request(`/api/contact`, { method: "POST", body: JSON.stringify(payload) }),

  subscribeNewsletter: (email) =>
    request(`/api/newsletter`, { method: "POST", body: JSON.stringify({ email }) }),
};
