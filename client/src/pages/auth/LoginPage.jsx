import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectAuthUser,
} from "@/slice/auth/authSelector";
import { useNavigate } from "react-router-dom";
import {
  selectAuthError,
  selectLogoutSuccessMessage,
} from "@/slice/auth/authSelector";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearAuthError } from "@/slice/auth/authSlice";

const LoginPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();
  const isError = useSelector(selectAuthError);
  const dispatch = useDispatch();
  const isLogout = useSelector(selectLogoutSuccessMessage);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(isError, {
        duration: Infinity,
      });
      dispatch(clearAuthError());
    }
  }, [isError, dispatch]);

  useEffect(() => {
    if (isLogout) {
      toast.success("Logout Successfully");
    }
  }, [isLogout]);

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
