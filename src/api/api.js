import axios from "axios";

// Netlify/Vercel production backend URL.
// You can set either:
// VITE_API_URL=https://backend-kappa-ten-89.vercel.app
// or
// VITE_API_URL=https://backend-kappa-ten-89.vercel.app/api
// This normalizer prevents duplicate /api/api problems.
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "API request failed";
    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default api;
