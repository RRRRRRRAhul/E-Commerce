import { fetchFromApi } from "@/services/api";
import {
  fetchCategoryStart,
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoryFailure,
  fetchCategorySuccess,
  addCategoryFailure,
  addCategoryStart,
  addCategorySuccess,
  deleteCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess
} from "./categorySlice";
import { extractErrorMessage } from "../auth/authApi";

export const getCategories = () => async(dispatch) => {
    try{
        dispatch(fetchCategoriesStart())

        const data = await fetchFromApi("/products/categories/");

        if (!data){
            throw new Error("Invalid response from server, try again");
        }

        dispatch(fetchCategoriesSuccess(data))
    }
    catch(error){
        const message = extractErrorMessage(error);
        dispatch(fetchCategoriesFailure(message))
    }
}

export const getSingleCategory = (id) => async (dispatch) => {
  try {
    dispatch(fetchCategoryStart());

    const data = await fetchFromApi(`/products/categories/${id}`);

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(fetchCategorySuccess(data));
  } catch (error) {
    dispatch(fetchCategoryFailure(extractErrorMessage(error)));
  }
};

export const addCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch(addCategoryStart());

    const data = await fetchFromApi("/products/categories/", {
      method: "POST",
      body: categoryData,
    });

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(addCategorySuccess());

    dispatch(getCategories());
  } catch (error) {
    dispatch(addCategoryFailure(extractErrorMessage(error)));
  }
};

export const updateCategory = ({ id, categoryData }) => async (dispatch) => {
  try {
    dispatch(addCategoryStart()); // you can create updateCategoryStart later if needed

    const data = await fetchFromApi(`/products/categories/${id}/`, {
      method: "PATCH",
      body: categoryData,
    });

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(addCategorySuccess());

    dispatch(getCategories());
  } catch (error) {
    dispatch(addCategoryFailure(extractErrorMessage(error)));
  }
};

export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch(deleteCategoryStart());

    await fetchFromApi(`/products/categories/${id}/`, {
      method: "DELETE",
    });

    dispatch(deleteCategorySuccess());

    dispatch(getCategories());
  } catch (error) {
    dispatch(deleteCategoryFailure(extractErrorMessage(error)));
  }
};