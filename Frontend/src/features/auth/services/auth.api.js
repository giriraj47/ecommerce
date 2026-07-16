import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth`;

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

export const resetPasswordApi = async (password, confirmPassword, token) => {
  const response = await api.post("/reset-password", { password, confirmPassword, token });
  return response.data;
};
export const updateProfileApi = async (data) => {
  const response = await api.patch("/update-profile", data);
  return response.data;
};
