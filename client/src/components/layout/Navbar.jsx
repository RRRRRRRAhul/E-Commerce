import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/slice/auth/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import { selectCartItems } from "@/slice/cart/cartSelector";
import { getCart } from "@/slice/cart/cartApi";
import { useEffect, useState } from "react";

import { selectAuthUser } from "@/slice/auth/authSelector";

import CartItems from "../cart/CartItem";
import Summary from "../cart/Summary";
import Checkout from "../cart/Checkout";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const cartItems = useSelector(selectCartItems);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user?.role === "USER") {
      dispatch(getCart());
      console.log("Fetching cart items for user...");
    }
  }, [dispatch, user]);

  const location = useLocation();
  const keyword = location.pathname.split("/").pop();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleRedirectHome = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="w-full border-b px-6 py-4 flex justify-between items-center bg-white">
      <h1 className="text-xl font-bold">E-Commerce</h1>

      <div className="flex gap-3 items-center">
        {user?.role === "USER" && (
          <>
            {keyword !== "home" && (
              <Button variant="ghost" onClick={handleRedirectHome}>
                Home
              </Button>
            )}

            {/* Cart Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">Cart 🛒 ({cartItems.length})</Button>
              </SheetTrigger>

              <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    Review your selected items and proceed to checkout.
                  </SheetDescription>
                </SheetHeader>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  <CartItems cartItems={cartItems} />
                </div>

                {/* Summary + Checkout */}
                <div className="border-t pt-4 space-y-4 m-4">
                  <Summary cartItems={cartItems} setTotal={setTotal} />
                  <Checkout total={total} />
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
