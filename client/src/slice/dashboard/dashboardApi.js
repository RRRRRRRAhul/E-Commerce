import {
  getAnalyticsStart,
  getAnalyticsSuccess,
  getAnalyticsFailure,
} from "./dashboardSlice";
import { fetchFromApi } from "@/services/api";
import { extractErrorMessage } from "../auth/authApi";


export const getDashboardAnalytics =
  () => async (dispatch) => {
    try {
      dispatch(getAnalyticsStart());

      const data = await fetchFromApi(
        "/analytics/dashboard/"
      );

      dispatch(getAnalyticsSuccess(data));

      return {
        success: true,
      };
    } catch (error) {
      dispatch(
        getAnalyticsFailure(
          extractErrorMessage(error)
        )
      );

      return {
        success: false,
      };
    }
  };