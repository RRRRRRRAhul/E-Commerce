from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from products.models import Product
from order.models import Order, Payment

from .serializers import DashboardAnalyticsSerializer


class DashboardAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_products = Product.objects.count()

        total_orders = Order.objects.count()

        pending_orders = Order.objects.filter(
            status="PENDING"
        ).count()

        revenue = (
            Payment.objects.filter(status="SUCCESS")
            .aggregate(total=Sum("amount"))["total"]
            or 0
        )

        data = {
            "total_products": total_products,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "revenue": revenue,
        }

        serializer = DashboardAnalyticsSerializer(
            instance=data
        )

        return Response(serializer.data)