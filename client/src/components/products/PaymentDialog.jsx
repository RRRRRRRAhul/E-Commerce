// components/order/PaymentDialog.jsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";

import { useState } from "react";

import { useDispatch } from "react-redux";

import { makePayment } from "@/slice/order/orderApi";

import { toast } from "sonner";

const PaymentDialog = ({
  open,
  setOpen,
  order,
  closeOrderDialog,
}) => {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [loading, setLoading] =
    useState(false);

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

    const resultAction = await dispatch(
      makePayment(paymentData)
    );

    setLoading(false);

    if (resultAction.success) {
      toast.success(
        "Payment successful"
      );

      // Close payment dialog
      setOpen(false);

      // Close order dialog
      closeOrderDialog(false);
    } else {
      toast.error(
        resultAction.message ||
          "Payment failed"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Complete Payment
          </DialogTitle>

          <DialogDescription>
            Choose your payment method to
            complete the order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span>Order ID</span>

              <span className="font-medium">
                #{order?.id}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>

              <span className="font-medium text-yellow-600">
                {order?.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Amount</span>

              <span className="font-bold text-2xl">
                ₹{order?.total_price}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>
              Select Payment Method
            </Label>

            <RadioGroup
              value={paymentMethod}
              onValueChange={
                setPaymentMethod
              }
              className="space-y-3"
            >
              <label
                htmlFor="payment-cod"
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-primary bg-muted"
                    : ""
                }`}
              >
                <RadioGroupItem
                  value="COD"
                  id="payment-cod"
                />

                <span>
                  Cash on Delivery
                </span>
              </label>

              <label
                htmlFor="payment-online"
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod ===
                  "ONLINE"
                    ? "border-primary bg-muted"
                    : ""
                }`}
              >
                <RadioGroupItem
                  value="ONLINE"
                  id="payment-online"
                />

                <span>
                  Online Payment
                </span>
              </label>
            </RadioGroup>
          </div>

          {/* Action */}
          <Button
            className="w-full"
            disabled={loading}
            onClick={handlePayment}
          >
            {loading
              ? "Processing Payment..."
              : "Pay Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;