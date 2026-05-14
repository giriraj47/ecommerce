import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

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
              <li>
                <Link to="/admin/create-product" className="admin-link">Create Product</Link>
              </li>
            )}
            <li>
              <span>
                Welcome, {user?.name} 
                {isAdmin && <span className="admin-badge"> (Admin)</span>}
              </span>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">
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
