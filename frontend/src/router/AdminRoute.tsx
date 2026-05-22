import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

const AdminRoute = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading)
    return (
      <>
        <p>Loading ...</p>
      </>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
