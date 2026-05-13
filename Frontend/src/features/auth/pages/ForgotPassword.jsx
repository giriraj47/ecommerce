import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { forgotPassword, error, loading, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await forgotPassword(email);
      setMessage("Reset link sent to your email!");
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p style={{ marginBottom: "1rem", textAlign: "center", color: "#64748b", fontSize: "0.875rem" }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {message && <div className="success-message" style={{ background: "#f0fdf4", color: "#16a34a", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center", border: "1px solid #dcfce7" }}>{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) clearError();
              }}
              required
              placeholder="name@example.com"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
