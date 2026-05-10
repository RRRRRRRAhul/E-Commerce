from rest_framework import serializers
from order.models import Order, OrderItem, Payment
from cart.models import Cart
from django.shortcuts import get_object_or_404
from django.db import transaction
import uuid

from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)
    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price", "product_name", "product_image"]
        read_only_fields = ["id", "price", "product_name", "product_image"]

    def validate_quantity(self, data):
        if not isinstance(data, int):
            raise serializers.ValidationError("Quantity must be positive integer")

        if data < 0:
            raise serializers.ValidationError("Quantity can't be less than Zero")

        return data


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user", "user_email", "items", "total_price", "status", "created_at"]
        read_only_fields = [
            "id",
            "user",
            "user_email",
            "items",
            "total_price",
            "status",
            "created_at",
        ]

    def create(self, validated_data):
        user = self.context["request"].user

        cart = get_object_or_404(Cart, user=user)

        cart_items = cart.items.select_related("product")

        if not cart_items.exists():
            raise serializers.ValidationError("Sorry the cart is empty")

        with transaction.atomic():
            total_price = 0

            order = Order.objects.create(user=user)

            for item in cart_items:
                order_item = OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price,
                )

                total_price += order_item.quantity * order_item.price

            order.total_price = total_price
            order.save()

            cart_items.delete()

        return order


class OrderUpdateStatusSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)

    class Meta:
        model = Order
        fields = ["status"]

    def validate(self, attrs):
        old_status = self.instance.status
        new_status = attrs.get("status")

        # Optional: prevent same status update
        if old_status == new_status:
            raise serializers.ValidationError("Order is already in this status")

        # Transition rules
        if old_status == "PENDING":
            if new_status not in ["CONFIRMED", "CANCELLED"]:
                raise serializers.ValidationError(
                    "From PENDING, you can only CONFIRM or CANCEL"
                )

        elif old_status == "CONFIRMED":
            if new_status not in ["SHIPPED", "CANCELLED"]:
                raise serializers.ValidationError(
                    "From CONFIRMED, you can only SHIP or CANCEL"
                )

        elif old_status == "SHIPPED":
            if new_status != "DELIVERED":
                raise serializers.ValidationError(
                    "From SHIPPED, you can only mark as DELIVERED"
                )

        elif old_status in ["DELIVERED", "CANCELLED"]:
            raise serializers.ValidationError(
                "You cannot change status of a completed/cancelled order"
            )

        return attrs


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "amount",
            "payment_method",
            "status",
            "transaction_id",
            "created_at",
        ]
        read_only_fields = ["id", "amount", "status", "transaction_id", "created_at"]

    def validate_order(self, order):
        user = self.context["request"].user

        if order.user != user:
            raise serializers.ValidationError("This order does not belong to you")

        if hasattr(order, "payment"):
            if order.payment.status == "SUCCESS":
                raise serializers.ValidationError("This order is already paid")

        if order.status in ["CANCELLED", "DELIVERED"]:
            raise serializers.ValidationError("You cannot make payment for this order")

        return order

    def create(self, validated_data):
        order = validated_data["order"]
        payment_method = validated_data["payment_method"]

        with transaction.atomic():
            amount = order.total_price
            transaction_id = None

            if payment_method == "ONLINE":
                transaction_id = str(uuid.uuid4())

            payment = Payment.objects.create(
                order=order,
                amount=amount,
                payment_method=payment_method,
                transaction_id=transaction_id,
            )

        return payment


class BuyNowSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, attrs):
        product = attrs.get("product")
        quantity = attrs.get("quantity")
        
        if not product.is_available:
            raise serializers.ValidationError("This product is currently unavailable")
        
        if product.stock <= 0:
            raise serializers.ValidationError("This product is out of stock")

        if quantity > product.stock:
            raise serializers.ValidationError(
                f"Only {product.stock} items available in stock"
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        product = validated_data["product"]
        quantity = validated_data["quantity"]

        with transaction.atomic():
            total_price = product.price * quantity

            order = Order.objects.create(user=user, total_price=total_price)

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )

        return order
