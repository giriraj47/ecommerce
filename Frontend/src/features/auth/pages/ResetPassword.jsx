import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { resetPassword, error, loading, clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      return;
    }

    try {
      await resetPassword(password, confirmPassword, token);
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      // Error is handled in context
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Invalid Link</h2>
          <p className="error-message">This password reset link is invalid or has expired.</p>
          <Link to="/forget-password" onClick={clearError} className="auth-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>New Password</h2>
        <p style={{ marginBottom: "1rem", textAlign: "center", color: "#64748b", fontSize: "0.875rem" }}>
          Please enter your new password below.
        </p>

        {message && <div className="success-message" style={{ background: "#f0fdf4", color: "#16a34a", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center", border: "1px solid #dcfce7" }}>{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) clearError();
              }}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) clearError();
              }}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
