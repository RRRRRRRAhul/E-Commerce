import { fetchFromApi } from "../../services/api";
import { authSuccess, authFailure, authStart, logout, setAuthChecked } from "./authSlice";
import { authInit } from "./authSlice";

export const extractErrorMessage = (error) => {
  if (error?.data) {
    const data = error.data;
    //detail error
    if (data.detail) {
      return data.detail;
    }
    //DRF field errors
    if (typeof data === "object") {
      return Object.values(data).flat().join("\n");
    }
  }

  return error?.message || "Something went wrong";
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(authStart());

    const data = await fetchFromApi("/auth/login/", {
      method: "POST",
      body: credentials,
      auth: false,
    });

    if (!data || !data.tokens?.access || !data.tokens?.refresh) {
      throw new Error("Invalid response from server");
    }

    localStorage.setItem("accessToken", data.tokens.access);
    localStorage.setItem("refreshToken", data.tokens.refresh);

    const user = await fetchFromApi("/auth/user/");

    if (!user) {
      throw new Error("Failed to fetch user data");
    }

    dispatch(
      authSuccess({
        user,
        accessToken: data.tokens.access,
        refreshToken: data.tokens.refresh,
      }),
    );
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(authFailure(message));
  }
};

export const registerUser = (userInfo) => async (dispatch) => {
  try {
    dispatch(authStart());

    const data = await fetchFromApi("/auth/register/", {
      method: "POST",
      body: userInfo,
      auth: false,
    });

    if (!data || !data.tokens?.access || !data.tokens?.refresh) {
      throw new Error("Invalid response from server");
    }

    localStorage.setItem("accessToken", data.tokens.access);
    localStorage.setItem("refreshToken", data.tokens.refresh);

    const user = await fetchFromApi("/auth/user/");

    if (!user) {
      throw new Error("Failed to fetch user data");
    }

    dispatch(
      authSuccess({
        user,
        accessToken: data.tokens.access,
        refreshToken: data.tokens.refresh,
      }),
    );
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(authFailure(message));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await fetchFromApi("/auth/logout/", {
        method: "POST",
        body: { refresh: refreshToken },
      });
    }
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    dispatch(logout());
  }
};

export const initializeAuth = () => async (dispatch) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return;

  try {
    const user = await fetchFromApi("/auth/user/");

    if (!user) {
      throw new Error("Failed to fetch user data");
    }

    dispatch(
      authInit({
        user,
        accessToken,
      }),
    );
    dispatch(setAuthChecked())
  } catch (error) {
    dispatch(logout());
  }
};
