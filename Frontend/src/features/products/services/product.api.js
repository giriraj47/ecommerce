import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/products`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllProductsApi = async (page = 1, search = "", category = "", sort = "", price = "") => {
  const response = await api.get("/get-all-products", {
    params: { search, page, category, sort, price },
  });
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await api.get(`/get-product/${id}`);
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await api.post("/create-product", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await api.patch(`/update-product/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/delete-product/${id}`);
  return response.data;
};
