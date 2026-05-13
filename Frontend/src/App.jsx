import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/auth.context";
import AppRoutes from "./app.routes";
import Navbar from "./features/auth/components/Navbar";
import "./styles.scss";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
