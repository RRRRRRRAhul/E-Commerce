export const selectProducts = (state) => state.product.products;

export const selectSingleProduct = (state) => state.product.product;

export const selectProductLoading = (state) => state.product.loading;

export const selectProductError = (state) => state.product.error;