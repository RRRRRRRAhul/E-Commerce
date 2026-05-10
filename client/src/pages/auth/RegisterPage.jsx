import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectAuthUser,
  selectAuthError,
} from "@/slice/auth/authSelector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearAuthError } from "@/slice/auth/authSlice";

const RegisterPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();
  const isError = useSelector(selectAuthError);
  const dispatch = useDispatch();

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
  }, [isError]);

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
