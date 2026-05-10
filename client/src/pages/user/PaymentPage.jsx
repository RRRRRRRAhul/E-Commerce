import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentOrder } from "@/slice/order/orderSelector";
import { useNavigate, useParams } from "react-router-dom";
import { makePayment, getOrderDetails } from "@/slice/order/orderApi";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";


const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [loading, setLoading] = useState(false);
  const order = useSelector(selectCurrentOrder);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  console.log(order);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const handlePayment = async () => {
    if (!order?.id) {
      toast.error("Order not found");

      return;
    }

    setLoading(true);

    const paymentData = {
      order: order.id,
      payment_method: paymentMethod,
    };

    const resultAction = await dispatch(makePayment(paymentData));

    setLoading(false);

    if (resultAction.success) {
      toast.success("Payment successful");
      navigate("/home");
    } else {
      toast.error(resultAction.message || "Payment failed");
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-lg font-medium">No order found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complete Payment</h1>

          <p className="text-muted-foreground mt-2">
            Complete your payment to confirm your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden border bg-white">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
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
                          ₹{item.price * item.quantity}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Order ID</span>

                  <span>#{order.id}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Items</span>

                  <span>{order.items.length}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount</span>

                  <span>₹{order.total_price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>

              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  {/* Online */}
                  <label
                    htmlFor="online"
                    className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "ONLINE"
                        ? "border-primary bg-muted"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value="ONLINE" id="online" />

                    <div>
                      <p className="font-medium">Online Payment</p>

                      <p className="text-sm text-muted-foreground">
                        UPI, Cards, Net Banking
                      </p>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    htmlFor="cod"
                    className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "COD" ? "border-primary bg-muted" : ""
                    }`}
                  >
                    <RadioGroupItem value="COD" id="cod" />

                    <div>
                      <p className="font-medium">Cash on Delivery</p>

                      <p className="text-sm text-muted-foreground">
                        Pay when order arrives
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Pay Button */}
            <Button
              className="w-full h-12 text-base"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${order.total_price}`}
            </Button>

            {/* Warning */}
            <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-4">
              <p className="text-sm text-yellow-800 font-medium">Important:</p>

              <p className="text-sm text-yellow-700 mt-1">
                Your order will only be confirmed after successful payment
                completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
