import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isProduction = process.env.REACT_APP_ENV === "production";
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isProduction) {
    return children;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
