import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" replace />;
  }

  const { isAuthenticated, isAdmin } = authContext;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/menu" replace />;
  }

  return <>{children}</>;
};
