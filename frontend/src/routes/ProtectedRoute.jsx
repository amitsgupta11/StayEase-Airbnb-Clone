import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error("Please login to continue");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    toast.error("Access denied");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
