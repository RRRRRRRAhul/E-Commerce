import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,

  loading: false,
  error: null,

  paymentLoading: false,
  paymentError: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchOrderDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    fetchOrderDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    placeOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    placeOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    placeOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    buyNowStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    buyNowSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    buyNowFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    makePaymentStart: (state) => {
      state.paymentLoading = true;
      state.paymentError = null;
    },
    makePaymentSuccess: (state, action) => {
      state.paymentLoading = false;
      state.paymentError = null;
    },
    makePaymentFailure: (state, action) => {
      state.paymentLoading = false;
      state.paymentError = action.payload;
    },
    updateOrderStatusStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateOrderStatusSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    updateOrderStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderDetailsStart,
  fetchOrderDetailsSuccess,
  fetchOrderDetailsFailure,
  placeOrderStart,
  placeOrderSuccess,
  placeOrderFailure,
  buyNowStart,
  buyNowSuccess,
  buyNowFailure,
  makePaymentStart,
  makePaymentSuccess,
  makePaymentFailure,
  updateOrderStatusStart,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
} = orderSlice.actions;
const orderReducer = orderSlice.reducer;
export default orderReducer;
