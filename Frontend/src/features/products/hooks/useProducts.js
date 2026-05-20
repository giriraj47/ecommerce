import { useContext } from "react";
import { ProductContext } from "../product.context";
import {
  getAllProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../services/product.api";

export const useProducts = () => {
  const context = useContext(ProductContext);
  const params = new URLSearchParams(location.search);
  const page = params.get("page") || 1;

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  const {
    products,
    setProducts,
    loading,
    setLoading,
    error,
    setError,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    search,
    setSearch,
  } = context;

  const getAllProducts = async (page = 1, search = "", category = "", sort = "", price = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProductsApi(page, search, category, sort, price);
      // Adjusting based on common API response pattern
      setProducts(Array.isArray(data) ? data : data.products || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setSearch(data.search);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductByIdApi(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createProductApi(productData);
      setProducts((prev) => [...prev, data.data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await updateProductApi(id, productData);

      setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)));

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    products,
    loading,
    error,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
    currentPage,
    totalPages,
    search,
  };
};
