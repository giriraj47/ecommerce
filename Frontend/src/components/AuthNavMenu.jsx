import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "./AuthNavMenu.scss";

const AuthNavMenu = ({ variant = "global", isScrolled = false }) => {
  const { user, isAuthenticated, logout, isAdmin, authChecked } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/login");
  };

  // Build modifier classes
  const isHero = variant === "hero";
  const heroScrolled = isHero && isScrolled;

  // While auth is still determining, show standard login link
  if (authChecked && !isAuthenticated) {
    return (
      <Link
        to="/login"
        className={`auth-nav-login ${
          isHero ? "auth-nav-login--hero" : "auth-nav-login--global"
        } ${heroScrolled ? "auth-nav-login--hero-scrolled" : ""}`}
        aria-label="Sign in to your account"
      >
        <svg
          className="auth-nav-login__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        <span className="auth-nav-login__text">Login</span>
      </Link>
    );
  }

  // When not yet checked, render subtle Login link to avoid flicker
  if (!authChecked) {
    return (
      <Link
        to="/login"
        className={`auth-nav-login ${
          isHero ? "auth-nav-login--hero" : "auth-nav-login--global"
        } ${heroScrolled ? "auth-nav-login--hero-scrolled" : ""}`}
        style={{ opacity: 0.8 }}
      >
        <span className="auth-nav-login__text">Login</span>
      </Link>
    );
  }

  // User is logged in: show interactive user account menu (opens on click only)
  const displayName = user?.name ? user.name.split(" ")[0] : "Account";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  return (
    <div
      className={`auth-nav-profile ${
        isHero ? "auth-nav-profile--hero" : "auth-nav-profile--global"
      } ${heroScrolled ? "auth-nav-profile--hero-scrolled" : ""}`}
      ref={menuRef}
    >
      <button
        type="button"
        className={`auth-nav-profile__trigger ${
          isOpen ? "auth-nav-profile__trigger--active" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="auth-nav-profile__avatar">
          {userInitial ? (
            userInitial
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          )}
        </div>
        <span className="auth-nav-profile__name">{displayName}</span>
        <svg
          className={`auth-nav-profile__chevron ${
            isOpen ? "auth-nav-profile__chevron--open" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="auth-nav-dropdown" role="menu">
          <div className="auth-nav-dropdown__header">
            <span className="auth-nav-dropdown__greeting">Signed in as</span>
            <span className="auth-nav-dropdown__user-name">
              {user?.name || "User"}
            </span>
            {user?.email && (
              <span className="auth-nav-dropdown__user-email">
                {user.email}
              </span>
            )}
          </div>

          <div className="auth-nav-dropdown__divider" />

          {isAdmin && (
            <Link
              to="/admin"
              className="auth-nav-dropdown__item"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Admin Dashboard</span>
            </Link>
          )}

          <Link
            to="/orders"
            className="auth-nav-dropdown__item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>My Orders</span>
          </Link>

          <Link
            to="/profile"
            className="auth-nav-dropdown__item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile Settings</span>
          </Link>

          <div className="auth-nav-dropdown__divider" />

          <button
            type="button"
            className="auth-nav-dropdown__item auth-nav-dropdown__item--logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthNavMenu;
