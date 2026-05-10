import { fetchFromApi } from "@/services/api";
import { extractErrorMessage } from "../auth/authApi";
import {
  fetchCartFailure,
  fetchCartStart,
  fetchCartSuccess,
  removeFromCartFailure,
  removeFromCartStart,
  removeFromCartSuccess,
  addToCartFailure,
  addToCartStart,
  addToCartSuccess,
  updateCartItemQuantityFailure,
  updateCartItemQuantityStart,
  updateCartItemQuantitySuccess,
} from "./cartSlice";

export const getCart = () => async (dispatch) => {
    try{
        dispatch(fetchCartStart());

        const data = await fetchFromApi("/cart/");

        if (!data){
            throw new Error("Invalid response from server, try again");
        }
        dispatch(fetchCartSuccess(data))

        return { success: true}
    }
    catch(error){
        const message = extractErrorMessage(error);
        dispatch(fetchCartFailure(message))
        return { success: false, message }
    }
}

export const addToCart = (product, quantity) => async (dispatch) => {
  try {
    dispatch(addToCartStart());

    await fetchFromApi("/cart/items/", {
      method: "POST",
      body: { product: product, quantity },
    });

    dispatch(addToCartSuccess());

    await dispatch(getCart());

    return { success: true };
  } catch (error) {
    const message = extractErrorMessage(error);

    await dispatch(addToCartFailure(message));

    return { success: false, message };
  }
};

export const removeFromCart = (itemId) => async (dispatch) => {
    try{
        dispatch(removeFromCartStart());

        await fetchFromApi(`/cart/items/${itemId}/`, {
            method: "DELETE",
        })
        dispatch(removeFromCartSuccess())
        await dispatch(getCart())
        return { success: true }
    }
    catch(error){
        const message = extractErrorMessage(error);
        dispatch(removeFromCartFailure(message))
        return { success: false, message }
    }
}

export const updateCartItemQuantity = (itemId, quantity) => async (dispatch) => {
    try{
        dispatch(updateCartItemQuantityStart());
        await fetchFromApi(`/cart/items/${itemId}/`, {
            method: "PATCH",
            body: { quantity }
        })
        dispatch(updateCartItemQuantitySuccess())
        await dispatch(getCart())
        return { success: true }
    }
    catch(error){
        const message = extractErrorMessage(error);
        dispatch(updateCartItemQuantityFailure(message))
        return { success: false, message }
    }
}
