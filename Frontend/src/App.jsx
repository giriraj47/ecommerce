import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/auth.context";
import { ProductProvider } from "./features/products/product.context";
import AppRoutes from "./app.routes";
import Navbar from "./components/Navbar";
import "./styles.scss";

const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
