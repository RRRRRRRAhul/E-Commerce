import { useLocation, useNavigate } from "react-router-dom";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/slice/product/productApi";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { toast } from "sonner";

import {
  selectProductLoading,
  selectProductError,
} from "@/slice/product/productSelector";

import { selectCategories } from "@/slice/category/categorySelector";
import { getCategories } from "@/slice/category/categoryApi";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = location?.state?.product;
  const productId = location?.state?.productId;
  const mode = location?.state?.mode;

  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const categories = useSelector(selectCategories);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  // Load categories on mount (fix refresh issue)
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch]);

  // Prefill AFTER categories are loaded
  useEffect(() => {
    if (mode === "EDIT" && product && categories.length > 0) {
      setName(product.name || "");
      setPrice(product.price || "");
      setCategory(String(product.category)); // FIX: ensure string
      setDescription(product.description || "");
      setSlug(product.slug || "");
      setStock(product.stock || "");
    }
  }, [mode, product, categories]);

  // Error Toast
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: Infinity });
    }
  }, [error]);

  // Submit Handler
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("stock", stock);

      if (image) formData.append("image", image);
      if (video) formData.append("video", video);

      if (mode === "ADD") {
        const res = await dispatch(addProduct(formData));

        if (res.success) {
          toast.success("Product added 🎉");
          navigate("/admin/dashboard");
        } else {
          toast.error(res.error || "Something went wrong");
        }
      }

      if (mode === "EDIT" && product) {
        const res = await dispatch(
          updateProduct({
            id: product.id,
            productData: formData,
          }),
        );
        if (res.success) {
          toast.success("Product updated ✏️");
          navigate("/admin/dashboard");
        } else {
          toast.error(res.error || "Something went wrong");
        }
      }

      if (mode === "DELETE" && productId) {
        const res = await dispatch(deleteProduct(productId));
        if (res.success) {
          toast.success("Product deleted 🗑️");
          navigate("/admin/dashboard");
        } else {
          toast.error(res.error || "Something went wrong");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-center">
          {mode === "ADD" && "Add Product"}
          {mode === "EDIT" && "Edit Product"}
          {mode === "DELETE" && "Delete Product"}
        </h2>

        {(mode === "ADD" || mode === "EDIT") && (
          <>
            {/* Name */}
            <Input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />

            {/* Price */}
            <Input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />

            {/* Category Select */}
            <Select
              value={category || ""}
              onValueChange={setCategory}
              disabled={categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    categories.length === 0
                      ? "Loading categories..."
                      : "Select Category"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Slug (e.g. iphone-14)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <Input
              placeholder="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2"
            />

            {/* Image Upload */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">
                {image ? image.name : "Upload Product Image"}
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                disabled={loading}
              />
            </div>

            {/* Video Upload */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">
                {video ? video.name : "Upload Product Video"}
              </label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                disabled={loading}
              />
            </div>
          </>
        )}

        {mode === "DELETE" && (
          <p className="text-sm text-gray-500 text-center">
            Are you sure you want to delete this product?
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
            variant={mode === "DELETE" ? "destructive" : "default"}
          >
            {loading
              ? "Processing..."
              : mode === "ADD"
                ? "Add"
                : mode === "EDIT"
                  ? "Update"
                  : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
