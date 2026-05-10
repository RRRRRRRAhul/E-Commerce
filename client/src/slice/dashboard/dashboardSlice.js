import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  analytics: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    getAnalyticsStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    getAnalyticsSuccess: (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
    },

    getAnalyticsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getAnalyticsStart,
  getAnalyticsSuccess,
  getAnalyticsFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;