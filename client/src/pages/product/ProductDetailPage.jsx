import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { getSingleProduct } from "@/slice/product/productApi";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectSingleProduct } from "@/slice/product/productSelector";
import { toast } from "sonner";
import { addToCart } from "@/slice/cart/cartApi";
import Navbar from "@/components/layout/Navbar";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectSingleProduct);

  // Add To Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const resultAction = await dispatch(addToCart(product.id, 1));

    if (resultAction.success) {
      toast.success("Product added to cart");
    } else {
      toast.error(resultAction.message || "Failed to add product to cart");
    }
  };

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar FULL WIDTH */}
      <Navbar />

      {/* Content with padding */}
      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="w-full h-64 md:h-100 bg-black rounded-xl overflow-hidden">
            <video
              key={id}
              className="w-full h-full object-cover"
              controls
              preload="auto"
            >
              <source
                src={`http://127.0.0.1:8000/api/products/streaming/${id}/`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product?.name}</h1>

            <p className="text-gray-500">{product?.description}</p>

            <p className="text-2xl font-bold">₹{product?.price}</p>

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
