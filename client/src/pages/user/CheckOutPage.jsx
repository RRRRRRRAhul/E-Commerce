import Navbar from "@/components/layout/Navbar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Badge } from "@/components/ui/badge";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems } from "@/slice/cart/cartSelector";
import { placeOrder } from "@/slice/order/orderApi";
import { selectOrderLoading } from "@/slice/order/orderSelector";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const orderLoading = useSelector(selectOrderLoading);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    const result = await dispatch(placeOrder());
    if (result.success) {
      toast.success("Order placed successfully");
      navigate(`/payment/${result.data.id}`);
    } else {
      toast.error(result.message || "Failed to place order");
    }
  };

  // Total calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0,
  );

  const shippingFee = 0;

  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <p className="text-muted-foreground mt-2">
            Review your order and complete payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden border bg-white">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.product_name}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          ₹{item.product_price * item.quantity}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        ₹{item.product_price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>

                  <span>₹{total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Place Order */}
            <Button
              className="w-full h-12 text-base"
              onClick={handlePlaceOrder}
              disabled={orderLoading}
            >
              Place Order
            </Button>

            {/* Warning Message */}
            <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-4">
              <p className="text-sm text-yellow-800 font-medium">Important:</p>

              <p className="text-sm text-yellow-700 mt-1">
                After placing your order, you must complete the payment process
                to confirm your purchase. Unpaid orders may be automatically
                cancelled later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
