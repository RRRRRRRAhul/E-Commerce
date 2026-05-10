import ProductCard from "./ProductCard";
import { Input } from "@/components/ui/input";

export const mockProducts = [
  {
    id: 1,
    name: "iPhone 15",
    description: "Apple flagship phone",
    price: 80000,
    image: "https://via.placeholder.com/300x200?text=iPhone+15",
  },
  {
    id: 2,
    name: "Samsung S23",
    description: "Android flagship",
    price: 70000,
    image: "https://via.placeholder.com/300x200?text=Samsung+S23",
  },
  {
    id: 3,
    name: "Nike Shoes",
    description: "Running shoes",
    price: 5000,
    image: "https://via.placeholder.com/300x200?text=Nike+Shoes",
  },
  {
    id: 4,
    name: "Laptop",
    description: "High performance laptop",
    price: 90000,
    image: "https://via.placeholder.com/300x200?text=Laptop",
  },
];


const ProductList = ({products = mockProducts}) => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Products</h2>

        <Input
          placeholder="Search products..."
          className="max-w-sm w-full"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
};

export default ProductList;