import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/auth.context";
import { ProductProvider } from "./features/products/product.context";
import { CartProvider } from "./features/cart/cart.context";
import AppRoutes from "./app.routes";
import Navbar from "./components/Navbar";
import CartDrawer from "./features/cart/components/CartDrawer";
import "./styles.scss";

const App = () => {
  return (
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
  );
};

export default App;
