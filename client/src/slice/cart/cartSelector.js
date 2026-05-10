export const selectCartItems = (state) => state.cart.cart?.items || [];
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;