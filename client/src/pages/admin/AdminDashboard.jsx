import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductTable from "@/components/admin/ProductTable";
import OrderTable from "@/components/admin/OrderTable";
import CategoryTable from "@/components/admin/CategoryTable";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectProducts } from "@/slice/product/productSelector";
import { getProducts } from "@/slice/product/productApi";
import { getOrders } from "@/slice/order/orderApi";
import { selectOrders } from "@/slice/order/orderSelector";
import { getDashboardAnalytics } from "@/slice/dashboard/dashboardApi";
import {
  selectAnalytics,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from "@/slice/dashboard/dashbaordSelector";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [sideBarSection, setSideBarSection] = useState("dashboard");
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);
  const analytics = useSelector(selectAnalytics);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDashboardAnalytics());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar setSideBarSection={setSideBarSection} />

        {/* Main Content */}

        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          {loading && <p>Loading analytics...</p>}
          {error && <p className="text-red-500">{toast.error(error)}</p>}
          {/* Stats */}
          {sideBarSection == "dashboard" && !loading  && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border">
                  <p className="text-sm text-gray-500">Total Products</p>
                  <h2 className="text-xl font-bold">{analytics.total_products}</h2>
                </div>

                <div className="p-4 bg-white rounded-xl border">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <h2 className="text-xl font-bold">{analytics.total_orders}</h2>
                </div>

                <div className="p-4 bg-white rounded-xl border">
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <h2 className="text-xl font-bold">{analytics.pending_orders}</h2>
                </div>

                <div className="p-4 bg-white rounded-xl border">
                  <p className="text-sm text-gray-500">Revenue</p>
                  <h2 className="text-xl font-bold">{analytics.revenue}</h2>
                </div>
              </div>
            </>
          )}

          {/* Tables */}
          {sideBarSection == "products" && <ProductTable products={products} />}
          {sideBarSection == "orders" && <OrderTable orders={orders} />}
          {sideBarSection == "categories" && <CategoryTable />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
