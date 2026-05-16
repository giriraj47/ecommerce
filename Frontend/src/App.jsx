import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/auth.context";
import { ProductProvider } from "./features/products/product.context";
import { CartProvider } from "./features/cart/cart.context";
import AppRoutes from "./app.routes";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <AppRoutes />
            <ToastContainer position="bottom-right" />
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
