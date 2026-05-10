import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  authSuccessMessage: false,
  logoutSuccessMessage: false,
  isAuthChecked: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
      state.logoutSuccessMessage = false;
    },

    authSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.authSuccessMessage = true;
      state.logoutSuccessMessage = false;
    },

    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.logoutSuccessMessage = false;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.logoutSuccessMessage = true;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },

    authInit: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },

    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  clearAuthError,
  logout,
  authInit,
  setAuthChecked
} = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
