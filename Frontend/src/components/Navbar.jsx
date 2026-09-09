import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useCart } from "../features/cart/hooks/useCart";
import AuthNavMenu from "./AuthNavMenu";
import "./Navbar.scss";

const Navbar = () => {
  const { isAdmin, authChecked } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
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

          <AuthNavMenu variant="global" />

          <button
            className="navbar-global__link navbar-global__cart-btn"
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
