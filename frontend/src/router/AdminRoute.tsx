import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading)
    return (
      <>
        <p>Loading ...</p>
      </>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
