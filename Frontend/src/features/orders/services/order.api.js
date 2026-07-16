import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/orders`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const createOrderApi = async (orderData) => {
  const response = await api.post("/create", orderData);
  return response.data;
};

export const getMyOrdersApi = async () => {
  const response = await api.get("/my");
  return response.data;
};

export const getSingleOrderApi = async (orderId) => {
  const response = await api.get(`/${orderId}`);
  return response.data;
};

// Admin Routes
export const getAllOrdersApi = async () => {
  const response = await api.get("/");
  return response.data;
};

export const updateOrderStatusApi = async (orderId, status) => {
  const response = await api.patch(`/${orderId}/status`, { status });
  return response.data;
};
