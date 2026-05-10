import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    fetchProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.products = action.payload;
    },
    fetchProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSingleProductStart: (state) => {
      ((state.loading = true), (state.product = null));
    },
    fetchSingleProductSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.product = action.payload;
    },
    fetchSingleProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
    addProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addProductSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    addProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProductStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteProuctSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    deleteProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const {
  fetchProductFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchSingleProductFailure,
  fetchSingleProductStart,
  fetchSingleProductSuccess,
  clearProductError,
  addProductFailure,
  addProductSuccess,
  addProductStart,
  deleteProductStart,
  deleteProuctSuccess,
  deleteProductFailure
} = productSlice.actions;
const productReducer = productSlice.reducer;
export default productReducer;
