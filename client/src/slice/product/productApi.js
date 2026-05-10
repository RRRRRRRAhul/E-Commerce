import { fetchFromApi } from "@/services/api";
import {
  fetchProductStart,
  fetchProductFailure,
  fetchProductSuccess,
  fetchSingleProductSuccess,
  fetchSingleProductFailure,
  fetchSingleProductStart,
  addProductFailure,
  addProductSuccess,
  addProductStart,
  deleteProductFailure,
  deleteProuctSuccess,
  deleteProductStart,
} from "./productSlice";
import { extractErrorMessage } from "../auth/authApi";

export const getProducts = () => async (dispatch) => {
  try {
    dispatch(fetchProductStart());

    const data = await fetchFromApi("/products/products/");

    if (!data) {
      throw new Error("Invalid response from server, try again");
    }

    dispatch(fetchProductSuccess(data));
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(fetchProductFailure(message));
  }
};

export const getSingleProduct = (id) => async (dispatch) => {
  try {
    dispatch(fetchSingleProductStart());

    const data = await fetchFromApi(`/products/products/${id}`);

    if (!data) {
      throw new Error("Invalid response from server, try again");
    }

    dispatch(fetchSingleProductSuccess(data));
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(fetchSingleProductFailure(message));
  }
};

export const addProduct = (productData) => async (dispatch) => {
  try {
    dispatch(addProductStart());

    const data = await fetchFromApi("/products/products/", {
      method: "POST",
      body: productData,
      fileUpload: true,
    });

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(addProductSuccess());
    dispatch(getProducts());

    return { success: true }; // RETURN SOMETHING
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(addProductFailure(message));

    return { success: false, error: message }; // RETURN ERROR
  }
};

export const updateProduct =
  ({ id, productData }) =>
  async (dispatch) => {
    try {
      dispatch(addProductStart());

      const data = await fetchFromApi(`/products/products/${id}/`, {
        method: "PATCH",
        body: productData,
        fileUpload: true
      });

      if (!data) {
        throw new Error("Invalid response from server, try again");
      }
      dispatch(addProductSuccess());
      dispatch(getProducts());
      return { success: true }; 
    } catch (error) {
      const message = extractErrorMessage(error);

      dispatch(addProductFailure(message));
      return { success: false, error: message };
    }
  };

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductStart());

    await fetchFromApi(`/products/products/${id}/`, {
      method: "DELETE",
    });

    dispatch(deleteProuctSuccess());
    dispatch(getProducts());
    return { success: true };
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(deleteProductFailure(message));
    return { success: false, error: message };
  }
};
