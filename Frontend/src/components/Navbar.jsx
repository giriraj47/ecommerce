import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useCart } from "../features/cart/hooks/useCart";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">E-Com</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <>
                <li>
                  <Link to="/admin/create-product" className="admin-link">
                    Create Product
                  </Link>
                </li>
                <li>
                  <Link to="/admin/orders" className="admin-link">
                    Manage Orders
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/profile" className="profile-link">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/cart" className="cart-link">
                Cart{" "}
                {cartItems?.length > 0 && (
                  <span className="cart-count">({cartItems.length})</span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/orders" className="orders-link">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="welcome-link">
                Welcome, {user?.name}
                {isAdmin && <span className="admin-badge"> (Admin)</span>}
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
