import axios from "axios";

const API_URL = "http://localhost:3000/api/payment";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const checkoutRazorpayApi = async (amount) => {
  const response = await api.post("/checkout", { amount });
  return response.data;
};

export const verifyRazorpayPaymentApi = async (paymentDetails) => {
  const response = await api.post("/verify", paymentDetails);
  return response.data;
};
