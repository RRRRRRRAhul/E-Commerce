import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {
    items: [],
  },
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action) => {
      state.loading = false;
      state.cart.items = action.payload.items;
    },
    fetchCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeFromCartSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    removeFromCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItemQuantityStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCartItemQuantitySuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateCartItemQuantityFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartFailure,
  fetchCartSuccess,
  addToCartStart,
  addToCartFailure,
  addToCartSuccess,
  removeFromCartStart,
  removeFromCartFailure,
  removeFromCartSuccess,
  updateCartItemQuantityStart,
  updateCartItemQuantityFailure,
  updateCartItemQuantitySuccess,
} = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;
