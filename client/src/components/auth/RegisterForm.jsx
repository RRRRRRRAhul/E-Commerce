import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "@/slice/auth/authApi";
import { useDispatch } from "react-redux";
import { selectAuthLoading } from "@/slice/auth/authSelector";
import { useSelector } from "react-redux";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);

  const redirectToLogin = () => {
    navigate("/login");
  };

  const handleRegistration = () => {
    const userInfo = {
      email: email,
      password: password
    }
    dispatch(registerUser(userInfo))
  }
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold">Register</h2>
        <p className="text-sm text-gray-500">Create your account</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
      </div>

      <Button className="w-full" onClick={handleRegistration} disabled={isLoading}>Register</Button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <span
          className="text-black font-medium cursor-pointer"
          onClick={redirectToLogin}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
