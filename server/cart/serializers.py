from cart.models import Cart, CartItem
from rest_framework import serializers

# from products.models import Product


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)
    product_price = serializers.DecimalField(
        source="product.price", max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "quantity",
            "product_name",
            "product_image",
            "product_price",
        ]
        read_only_fields = ["id"]

    def validate_product(self, data):
        if not data.is_available:
            raise serializers.ValidationError(
                "Sorry, this is product is not available for sale"
            )

        return data

    def validate(self, attrs):
        product = attrs.get("product", self.instance.product if self.instance else None)

        quantity = attrs.get(
            "quantity",
            self.instance.quantity if self.instance else None
        )

        if quantity <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than 0"
            )

        if quantity > product.stock:
            raise serializers.ValidationError(
                "Quantity exceeds available stock"
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        product = validated_data["product"]
        quantity = validated_data["quantity"]

        cart, _ = Cart.objects.get_or_create(user=user)

        cart_item = CartItem.objects.filter(cart=cart, product=product).first()

        if cart_item:
            if cart_item.quantity + quantity > product.stock:
                raise serializers.ValidationError("Quantity exceeds available stock")

            cart_item.quantity += quantity
            cart_item.save()
            return cart_item

        return CartItem.objects.create(cart=cart, product=product, quantity=quantity)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
