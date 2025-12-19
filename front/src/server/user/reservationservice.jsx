import axios from "axios";

const API_URL = "https://localhost:7218/api/reservations";

/* ================= AXIOS INSTANCE ================= */

const reservationApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ================= JWT INTERCEPTOR ================= */

reservationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESERVATION FUNCTIONS ================= */

// GET ALL RESERVATIONS
export const getAllReservations = async () => {
  const response = await reservationApi.get("/get-all");
  return response.data;
};

// GET RESERVATION BY ID
export const getReservationById = async (id) => {
  const response = await reservationApi.get(`/${id}`);
  return response.data;
};

// CREATE RESERVATION
export const createReservation = async (data) => {
  const response = await reservationApi.post("", data);
  return response.data; // { reservationId }
};

// CANCEL RESERVATION
export const cancelReservation = async (id) => {
  await reservationApi.delete(`/${id}`);
};

export default reservationApi;
