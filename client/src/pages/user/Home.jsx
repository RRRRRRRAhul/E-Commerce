import Navbar from "@/components/layout/Navbar";
import ProductList from "@/components/products/ProductList";
import { useEffect } from "react";
import { getProducts } from "@/slice/product/productApi";
import { useSelector, useDispatch } from "react-redux";
import { selectProducts } from "@/slice/product/productSelector";

const HomePage = () => {
    const dispatch = useDispatch()
    const products = useSelector(selectProducts)

    useEffect(() => {
        dispatch(getProducts())
    },[dispatch])
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="px-4 md:px-8 py-6">
        <ProductList products={products}/>
      </div>

    </div>
  );
};

export default HomePage;