import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: `${API_URL}/cart`,
  withCredentials: true,
});

export const addToCartApi = async (productId, quantity = 1) => {
  const response = await api.post("/add", { product: productId, quantity });
  return response.data;
};

export const getCartApi = async () => {
  const response = await api.get("/get");
  return response.data;
};

export const updateCartQuantityApi = async (productId, quantity) => {
  const response = await api.patch("/update", { product: productId, quantity });
  return response.data;
};

export const deleteCartApi = async () => {
  const response = await api.delete("/delete");
  return response.data;
};
