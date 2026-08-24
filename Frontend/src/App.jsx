import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./features/auth/auth.context";
import { ProductProvider } from "./features/products/product.context";
import { CartProvider } from "./features/cart/cart.context";
import AppRoutes from "./app.routes";
import Navbar from "./components/Navbar";
import CartDrawer from "./features/cart/components/CartDrawer";
import "./styles.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes cache persistence
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <Navbar />
              <CartDrawer />
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
