import { useEffect } from "react";

const Summary = ({ cartItems}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product_price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;


  return (
    <div className="space-y-2 flex flex-col">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>Free Delivery</span>
      </div>

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Summary;