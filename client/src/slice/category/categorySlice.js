import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCategoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategorySuccess: (state, action) => {
      state.loading = false;
      state.category = action.payload;
    },
    fetchCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCategoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCategorySuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    addCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCategoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    deleteCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoryFailure,
  fetchCategoryStart,
  fetchCategorySuccess,
  addCategoryFailure,
  addCategoryStart,
  addCategorySuccess,
  deleteCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
} = categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export default categoryReducer;