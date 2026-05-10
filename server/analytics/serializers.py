from rest_framework import serializers


class DashboardAnalyticsSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    
    total_orders = serializers.IntegerField()
    
    pending_orders = serializers.IntegerField()
    
    revenue = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )