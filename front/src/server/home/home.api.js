import axios from "axios";

const homeApi = axios.create({
  baseURL: "https://localhost:7218/api",
  withCredentials: true 
});

// Attach JWT token (Admin)
homeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ose adminToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default homeApi;
