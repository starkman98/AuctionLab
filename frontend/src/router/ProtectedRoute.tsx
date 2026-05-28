import Spinner from "@/components/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="app-loading">
        <Spinner sizeClass="h-8 w-8" thickClass="border-4" />
        <span>Loading</span>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
