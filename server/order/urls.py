from django.urls import path
from order.views import (
    OrderByUserAndProductAPIView,
    UserOrderDetailAPIView,
    UserOrderListAPIView,
    PlaceOrderAPIView,
    OrderUpdateStatusAPIView,
    PaymentAPIView,
    BuyNowAPIView,
    OrderListAPIView,
)

urlpatterns = [
    path("orders/list/", UserOrderListAPIView.as_view()),
    path("orders/", OrderListAPIView.as_view()),
    path("orders/list/<int:pk>/", UserOrderDetailAPIView.as_view()),
    path("place_order/", PlaceOrderAPIView.as_view()),
    path("orders/<int:pk>/status/", OrderUpdateStatusAPIView.as_view()),
    path("payment/", PaymentAPIView.as_view()),
    path("buy_now/", BuyNowAPIView.as_view()),
    path(
        "orders/pending/<int:product_id>/",
        OrderByUserAndProductAPIView.as_view(),
    ),
]
