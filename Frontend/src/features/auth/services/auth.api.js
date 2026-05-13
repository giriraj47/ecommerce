import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for session cookies
});

export const loginApi = async (email, password) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const registerApi = async (name, email, password) => {
  const response = await api.post("/register", { name, email, password });
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.get("/logout");
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get("/get-user");
  return response.data;
};

export const forgetPasswordApi = async (email) => {
  const response = await api.post("/forget-password", { email });
  return response.data;
};
