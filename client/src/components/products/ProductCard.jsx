// ProductCard.jsx

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";

import { addToCart } from "@/slice/cart/cartApi";

import { toast } from "sonner";

import OrderDialog from "./OrderDialog";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  // Add To Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const resultAction = await dispatch(
      addToCart(product.id, 1)
    );

    if (resultAction.success) {
      toast.success("Product added to cart");
    } else {
      toast.error(
        resultAction.message ||
          "Failed to add product to cart"
      );
    }
  };

  // Buy Now
  const handleBuyNow = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  // Product Details
  const redirectToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <Card
        onClick={redirectToDetails}
        className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        {/* Image */}
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-400 text-sm">
              No Image
            </span>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold line-clamp-1">
            {product?.name || "Product Name"}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">
            {product?.description ||
              "Short product description"}
          </p>

          <p className="text-2xl font-bold text-primary">
            ₹{product?.price || "999"}
          </p>
        </CardContent>

        <CardFooter className="p-4 flex gap-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>

          <Button
            className="flex-1"
            variant="secondary"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>

      {/* Order Dialog */}
      <OrderDialog
        open={open}
        setOpen={setOpen}
        product={product}
      />
    </>
  );
};

export default ProductCard;