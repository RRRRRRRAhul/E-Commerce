import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectAuthUser,
  selectIsAuthChecked,
} from "@/slice/auth/authSelector";

const ProtectedRouteUser = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return null; 
  }

  // block if not logged in OR not USER
  if (!isAuthenticated || user?.role !== "USER") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteUser;
