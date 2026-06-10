import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useCart } from "../features/cart/hooks/useCart";
import "./Navbar.scss";

const Navbar = () => {
  const { isAuthenticated, logout, isAdmin, authChecked } = useAuth();
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
          {authChecked && isAdmin && (
            <Link to="/admin" className="navbar-global__link">
              Admin
            </Link>
          )}

          <div className="navbar-global__profile-menu">
            <Link to="/profile" className="navbar-global__profile-trigger" aria-label="Profile menu">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </Link>

            <div className="navbar-global__profile-dropdown">
              {authChecked && isAuthenticated ? (
                <>
                  <Link to="/profile" className="navbar-global__dropdown-item">
                    Edit Profile
                  </Link>
                  <Link to="/orders" className="navbar-global__dropdown-item">
                    My Orders
                  </Link>
                  <button
                    className="navbar-global__dropdown-item"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="navbar-global__dropdown-item">
                  Login
                </Link>
              )}
            </div>
          </div>

          <button
            className="navbar-global__link"
            onClick={() => setIsCartOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              font: "inherit",
              padding: 0,
            }}
          >
            Cart {totalItemsCount > 0 && `(${totalItemsCount})`}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
