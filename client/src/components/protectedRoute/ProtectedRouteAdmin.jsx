import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectAuthUser,
  selectIsAuthChecked,
} from "@/slice/auth/authSelector";

const ProtectedRouteAdmin = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return null;
  }

  // block if not logged in OR not ADMIN
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;
