import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/florax/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ────────────────────────────────────────────────────
// Automatically attaches the JWT token from localStorage to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────────────
// If a 401 is returned (token expired / invalid), clears the token and
// redirects to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;