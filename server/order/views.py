from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from order.serializers import (
    OrderSerializer,
    OrderUpdateStatusSerializer,
    PaymentSerializer,
    BuyNowSerializer,
)
from order.models import Order
from rest_framework.response import Response
from rest_framework import status
import random
from django.db import transaction
from products.models import Product


class UserOrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user=user).prefetch_related(
            "items", "items__product"
        )


class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all().select_related("user").prefetch_related(
        "items", "items__product"
    )

class UserOrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user=user).select_related("user")


class PlaceOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = OrderSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderUpdateStatusAPIView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = OrderUpdateStatusSerializer
    queryset = Order.objects.all()


class PaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PaymentSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            payment = serializer.save()
            order = payment.order

            if payment.payment_method == "COD":
                payment.status = "SUCCESS"
                order.status = "CONFIRMED"
                message = {"message": "Payment successful (Cash on Delivery)"}

            else:
                result = random.choice(["SUCCESS", "FAILED"])

                if result == "SUCCESS":
                    payment.status = "SUCCESS"
                    order.status = "CONFIRMED"
                    message = {"message": "Payment successful"}
                else:
                    payment.status = "FAILED"
                    message = {"message": "Payment failed"}

            payment.save()
            order.save()

        return Response(message, status=status.HTTP_201_CREATED)
    

class BuyNowAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = BuyNowSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        order = serializer.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
class OrderByUserAndProductAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        product_id = kwargs.get("product_id")

        order = (
            Order.objects.filter(
                user=user,
                items__product_id=product_id,
                status="PENDING",
            )
            .exclude(payment__status="SUCCESS")
            .prefetch_related("items", "items__product")
            .order_by("-created_at")
            .first()
        )

        if not order:
            return Response(
                {
                    "has_pending_order": False,
                    "order": None,
                },
                status=status.HTTP_200_OK,
            )

        serializer = OrderSerializer(order)

        return Response(
            {
                "has_pending_order": True,
                "order": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


        
