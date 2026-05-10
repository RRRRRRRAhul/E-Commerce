import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRouteAdmin from "./components/protectedRoute/ProtectedRouteAdmin";
import ProtectedRouteUser from "./components/protectedRoute/ProtectedRouteUser";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import HomePage from "./pages/user/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Toaster } from "sonner";
import { initializeAuth } from "./slice/auth/authApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthUser } from "./slice/auth/authSelector";
import ProductForm from "./pages/product/ProductForm";
import CheckOutPage from "./pages/user/CheckOutPage";
import PaymentPage from "./pages/user/PaymentPage";


function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthUser)

  useEffect(() => {
    dispatch(initializeAuth())
  },[dispatch])


  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* {Admin pages} */}
        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/productForm" element={<ProductForm/>}/>
        </Route>

        {/* {User pages} */}
        <Route element={<ProtectedRouteUser />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
