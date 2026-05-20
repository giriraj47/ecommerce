import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useCart } from "../features/cart/hooks/useCart";
import "./Navbar.scss";

const Navbar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on auth-related pages and the homepage
  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forget-password" ||
    location.pathname === "/reset-password"
  ) {
    return null;
  }

  // Calculate total count of items in cart
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="navbar-global">
      <div className="navbar-global__inner">
        <nav className="navbar-global__left">
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/about">About Us</Link>
        </nav>

        <nav className="navbar-global__right">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/orders" className="navbar-global__link">
                  Admin
                </Link>
              )}
              <Link to="/orders" className="navbar-global__link">
                Orders
              </Link>
              <Link to="/profile" className="navbar-global__link">
                Profile
              </Link>
              <button
                className="navbar-global__link"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-global__link">
              Login
            </Link>
          )}
          <button 
            className="navbar-global__link" 
            onClick={() => setIsCartOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
          >
            Cart {totalItemsCount > 0 && `(${totalItemsCount})`}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
