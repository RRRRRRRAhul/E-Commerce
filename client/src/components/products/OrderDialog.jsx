import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useDispatch } from "react-redux";

import { buyNow, checkPendingOrder } from "@/slice/order/orderApi";

import { toast } from "sonner";

import PaymentDialog from "./PaymentDialog";

const OrderDialog = ({ open, setOpen, product }) => {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [paymentOpen, setPaymentOpen] = useState(false);

  const [createdOrder, setCreatedOrder] = useState(null);

  const [checkingOrder, setCheckingOrder] = useState(false);

  const totalPrice = Number(product?.price || 0) * quantity;

  // Check existing pending order
  useEffect(() => {
    const checkPendingOrderStatus = async () => {
      if (!open || !product?.id) return;

      setCheckingOrder(true);

      const resultAction = await dispatch(checkPendingOrder(product.id));

      setCheckingOrder(false);

      if (resultAction.success && resultAction.order) {
        const  order  = resultAction.order;
        const { hasPendingOrder } = resultAction;

        if (hasPendingOrder && order) {
          // Already paid
          if (order.status === "CONFIRMED") {
            toast.success("You already purchased this product");

            setOpen(false);

            return;
          }

          // Pending payment
          if (order.status === "PENDING") {
            toast.info("You already have a pending order");

            setCreatedOrder(order);

            setOpen(false);

            setPaymentOpen(true);
          }
        }
      }
    };

    checkPendingOrderStatus();
  }, [open, product?.id, dispatch, setOpen]);

  // Create order
  const handleBuyNow = async () => {
    // Prevent duplicate order creation
    if (createdOrder) {
      setOpen(false);

      setPaymentOpen(true);

      return;
    }

    const orderData = {
      product: product.id,
      quantity,
    };

    const resultAction = await dispatch(buyNow(orderData));

    if (resultAction.success) {
      toast.success("Order placed successfully");

      setCreatedOrder(resultAction.data);

      setOpen(false);

      setPaymentOpen(true);
    } else {
      toast.error(resultAction.message || "Failed to place order");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>

            <DialogDescription>
              Complete your purchase for this product.
            </DialogDescription>
          </DialogHeader>

          {checkingOrder ? (
            <div className="py-10 text-center">Checking existing order...</div>
          ) : (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 rounded-lg object-cover border"
                />

                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  <p className="font-bold text-primary text-xl">
                    ₹{product.price}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity</Label>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((prev) => prev - 1)}
                  >
                    -
                  </Button>

                  <Input
                    value={quantity}
                    readOnly
                    className="w-16 text-center"
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Preferred Payment Method</Label>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <label
                    htmlFor="cod"
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === "COD" ? "border-primary bg-muted" : ""
                    }`}
                  >
                    <RadioGroupItem value="COD" id="cod" />

                    <span>Cash on Delivery</span>
                  </label>

                  <label
                    htmlFor="online"
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === "ONLINE"
                        ? "border-primary bg-muted"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value="ONLINE" id="online" />

                    <span>Online Payment</span>
                  </label>
                </RadioGroup>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-4">
                <span className="font-medium">Total Price</span>

                <span className="text-2xl font-bold text-primary">
                  ₹{totalPrice}
                </span>
              </div>

              {/* Action */}
              <Button className="w-full" onClick={handleBuyNow}>
                Continue to Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentOpen}
        setOpen={setPaymentOpen}
        closeOrderDialog={setOpen}
        order={createdOrder}
      />
    </>
  );
};

export default OrderDialog;
