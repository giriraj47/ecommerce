import { useContext, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductContext } from "../product.context";
import {
  getAllProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../services/product.api";

// Custom hook leveraging TanStack Query for product listing with automatic caching
export const useProductsQuery = (
  page = 1,
  search = "",
  category = "",
  sort = "",
  price = "",
) => {
  return useQuery({
    queryKey: ["products", { page, search, category, sort, price }],
    queryFn: () => getAllProductsApi(page, search, category, sort, price),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  const queryClient = useQueryClient();

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

  const getAllProducts = useCallback(
    async (page = 1, search = "", category = "", sort = "", price = "") => {
      setLoading(true);
      setError(null);
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ["products", { page, search, category, sort, price }],
          queryFn: () => getAllProductsApi(page, search, category, sort, price),
        });
        setProducts(Array.isArray(data) ? data : data.products || []);
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || 1);
        setSearch(data.search || search);
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [queryClient, setProducts, setCurrentPage, setTotalPages, setSearch, setLoading, setError],
  );

  const getProductById = async (id) => {
    return queryClient.fetchQuery({
      queryKey: ["product", id],
      queryFn: async () => {
        setLoading(true);
        setError(null);
        try {
          return await getProductByIdApi(id);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch product");
          throw err;
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProducts((prev) => [...prev, data.data]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, productData }) => updateProductApi(id, productData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      setProducts((prev) =>
        prev.map((p) => (p._id === variables.id ? data.product : p)),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    },
  });

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      return await createMutation.mutateAsync(productData);
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
      return await updateMutation.mutateAsync({ id, productData });
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
      return await deleteMutation.mutateAsync(id);
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
