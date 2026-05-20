import { useContext } from "react";
import { CartContext } from "../cart.context";
import { addToCartApi, updateCartQuantityApi, deleteCartApi } from "../services/cart.api";


export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const {
    cartItems,
    setCartItems,
    totalAmount,
    setTotalAmount,
    loading,
    setLoading,
    error,
    setError,
    fetchCart,
    isCartOpen,
    setIsCartOpen,
  } = context;

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await addToCartApi(productId, quantity);
      setCartItems(data.products || []);
      setTotalAmount(data.totalAmount || 0);
      setIsCartOpen(true); // Automatically slide the cart drawer open!
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to cart";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const data = await updateCartQuantityApi(productId, quantity);
      setCartItems(data.products || []);
      setTotalAmount(data.totalAmount || 0);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update cart";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await deleteCartApi();
      setCartItems([]);
      setTotalAmount(0);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to clear cart";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    totalAmount,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  };
};
