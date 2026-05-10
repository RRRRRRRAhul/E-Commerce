import { fetchFromApi } from "../../services/api";

import {
  placeOrderStart,
  placeOrderSuccess,
  placeOrderFailure,
  buyNowStart,
  buyNowSuccess,
  buyNowFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderDetailsStart,
  fetchOrderDetailsSuccess,
  fetchOrderDetailsFailure,
  makePaymentStart,
  makePaymentSuccess,
  makePaymentFailure,
  updateOrderStatusStart,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
} from "./orderSlice";
import { extractErrorMessage } from "../auth/authApi";

export const getOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());

    const data = await fetchFromApi("/order/orders/");

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(fetchOrdersSuccess(data));

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(fetchOrdersFailure(message));

    return {
      success: false,
      message,
    };
  }
};

export const getOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch(fetchOrderDetailsStart());

    const data = await fetchFromApi(`/order/orders/list/${orderId}/`);

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(fetchOrderDetailsSuccess(data));

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(fetchOrderDetailsFailure(message));

    return {
      success: false,
      message,
    };
  }
};

export const placeOrder = () => async (dispatch) => {
  try {
    dispatch(placeOrderStart());

    const data = await fetchFromApi("/order/place_order/", {
      method: "POST",
    });

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(placeOrderSuccess(data));

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(placeOrderFailure(message));

    return {
      success: false,
      message,
    };
  }
};

export const buyNow = (orderData) => async (dispatch) => {
  try {
    dispatch(buyNowStart());

    const data = await fetchFromApi("/order/buy_now/", {
      method: "POST",
      body: orderData,
    });

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(buyNowSuccess(data));

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(buyNowFailure(message));

    return {
      success: false,
      message,
    };
  }
};

export const makePayment = (paymentData) => async (dispatch) => {
  try {
    dispatch(makePaymentStart());

    const data = await fetchFromApi("/order/payment/", {
      method: "POST",
      body: paymentData,
    });

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(makePaymentSuccess(data));

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(makePaymentFailure(message));

    return {
      success: false,
      message,
    };
  }
};

export const checkPendingOrder = (productId) => async (dispatch) => {
  try {
    dispatch(fetchOrderDetailsStart());

    const data = await fetchFromApi(`/order/orders/pending/${productId}/`);

    if (!data) {
      throw new Error("Invalid response from server");
    }

    // if pending order exists
    if (data.has_pending_order) {
      dispatch(fetchOrderDetailsSuccess(data.order));
    } else {
      dispatch(fetchOrderDetailsSuccess(null));
    }

    return {
      success: true,
      hasPendingOrder: data.has_pending_order,
      order: data.order,
    };
  } catch (error) {
    const message = extractErrorMessage(error);

    dispatch(fetchOrderDetailsFailure(message));

    return {
      success: false,
      message,
    };
  }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    dispatch(updateOrderStatusStart());

    const data = await fetchFromApi(`/order/orders/${orderId}/status/`, {
      method: "PATCH",
      body: {
        status,
      },
    });

    if (!data) {
      throw new Error("Invalid response from server");
    }

    dispatch(updateOrderStatusSuccess());
    await dispatch(getOrders());

    return {
      success: true,
      data,
    };
  } catch (error) {
    dispatch(updateOrderStatusFailure(extractErrorMessage(error)));

    return {
      success: false,
      message: extractErrorMessage(error),
    };
  }
};
