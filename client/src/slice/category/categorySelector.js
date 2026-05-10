export const selectCategoryState = (state) => state.category;

export const selectCategories = (state) =>
  state.category.categories;

export const selectSingleCategory = (state) =>
  state.category.category;

export const selectCategoryLoading = (state) =>
  state.category.loading;

export const selectCategoryError = (state) =>
  state.category.error;