import Spinner from "@/components/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

const AdminRoute = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading)
    return (
      <div className="app-loading">
        <Spinner sizeClass="h-8 w-8" thickClass="border-4" />
        <span>Loading</span>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
