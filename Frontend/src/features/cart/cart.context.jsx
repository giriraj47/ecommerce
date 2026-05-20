import React, { createContext, useState, useEffect } from "react";
import { getCartApi } from "./services/cart.api";
import { useAuth } from "../auth/hooks/useAuth";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setTotalAmount(0);
      setIsCartOpen(false);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCartApi();
      setCartItems(data.products || []);
      setTotalAmount(data.totalAmount || 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
