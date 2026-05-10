import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/slice/auth/authSlice";
import productReducer from "@/slice/product/productSlice";
import categoryReducer from "@/slice/category/categorySlice";
import cartReducer from "@/slice/cart/cartSlice";
import orderReducer from "@/slice/order/orderSlice";
import dashboardReducer from "@/slice/dashboard/dashboardSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        category: categoryReducer,
        cart: cartReducer,
        order: orderReducer,
        dashboard: dashboardReducer,
    }
})

export default store