import React, { createContext, useState, useEffect } from "react";
import { getMeApi } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);

  // Initial user fetch
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getMeApi();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
        authChecked,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
