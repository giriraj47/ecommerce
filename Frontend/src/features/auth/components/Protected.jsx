import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
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

  if (isAdmin) {
    return children;
  }

  return <h1>You are not authorized to access this page</h1>;
};

export default Protected;
