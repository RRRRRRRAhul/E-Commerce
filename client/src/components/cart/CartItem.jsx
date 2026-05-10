import { Button } from "@/components/ui/button";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
} from "@/slice/cart/cartApi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const CartItems = ({ cartItems }) => {
  const dispatch = useDispatch();

  const handleUpdateQuantity = async (itemId, quantity) => {
    const result = await dispatch(updateCartItemQuantity(itemId, quantity));
    if (result.success) {
      toast.success("Cart updated");
    } else {
      toast.error(result.message || "Failed to update cart");
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await dispatch(removeFromCart(itemId));
    if (result.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error(result.message || "Failed to remove item");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-medium mb-2">Your cart is empty</h2>

        <p className="text-sm text-gray-500">
          Browse products and add them to your cart.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div key={item.id} className="flex gap-4 border rounded-xl p-3">
          {/* Product Image */}
          <img
            src={item.product_image}
            alt={item.product_name}
            className="w-20 h-20 rounded-lg object-cover"
          />

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-medium">{item.product_name}</h3>

              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </Button>

              <span className="text-sm font-medium">{item.quantity}</span>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Remove */}
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500"
            onClick={() => handleRemoveItem(item.id)}
          >
            ✕
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
