import axios from "axios";

const API_URL = "https://localhost:7218/api/user";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logout = async () => {
await api.post("/logout", {}, { withCredentials: true });

  // Pastro tokenat nga frontend
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
