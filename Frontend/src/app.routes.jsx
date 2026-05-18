import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Products from "./features/products/pages/Products";
import ProductDetails from "./features/products/pages/ProductDetails";
import CreateProduct from "./features/products/pages/CreateProduct";
import UpdateProduct from "./features/products/pages/UpdateProduct";
import Protected from "./features/auth/components/Protected";
import Cart from "./features/cart/pages/Cart";
import Profile from "./features/auth/pages/Profile";
import MyOrders from "./features/orders/pages/MyOrders";
import AdminOrders from "./features/orders/pages/AdminOrders";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route
        path="/profile"
        element={
          <Protected>
            <Profile />
          </Protected>
        }
      />
      <Route 
        path="/cart" 
        element={
          <Protected>
            <Cart />
          </Protected>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <Protected>
            <MyOrders />
          </Protected>
        } 
      />
      <Route
        path="/admin/create-product"
        element={
          <Protected adminOnly={true}>
            <CreateProduct />
          </Protected>
        }
      />
      <Route
        path="/admin/update-product/:id"
        element={
          <Protected adminOnly={true}>
            <UpdateProduct />
          </Protected>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <Protected adminOnly={true}>
            <AdminOrders />
          </Protected>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
