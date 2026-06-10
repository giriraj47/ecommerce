import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {
  loginApi,
  registerApi,
  logoutApi,
  forgetPasswordApi,
  resetPasswordApi,
  updateProfileApi,
} from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    authChecked,
    error,
    setError,
  } = context;

  const isAdmin = user?.role === "admin";

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerApi(name, email, password);
      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = await forgetPasswordApi(email);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (password, confirmPassword, token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await resetPasswordApi(password, confirmPassword, token);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProfileApi(data);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    isAuthenticated,
    loading,
    authChecked,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    clearError,
    isAdmin,
  };
};
