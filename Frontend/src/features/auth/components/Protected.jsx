import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children, adminOnly = false }) => {
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/"} />;
  }

  if (adminOnly && !isAdmin) {
    return <h1>You are not authorized to access this page</h1>;
  }

  return children;
};

export default Protected;
