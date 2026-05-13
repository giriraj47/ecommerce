import React from "react";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to E-Com</h1>
      {isAuthenticated ? (
        <div className="welcome-msg">
          <p>Hello, <strong>{user?.name}</strong>!</p>
          <p>You are successfully logged in.</p>
        </div>
      ) : (
        <p>Please login or register to continue.</p>
      )}
    </div>
  );
};

export default Home;
