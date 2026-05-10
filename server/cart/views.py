from cart.serializers import CartSerializer, CartItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from cart.models import Cart, CartItem


# Create your views here.

# Retrieve the cart of the authenticated user
class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

# create cart items for the authenticated user (already get the cart items in the cart view)
class CartItemView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            CartItem.objects.select_related("cart", "product")
            .filter(cart__user=user)
            .order_by("-created_at")
        )

# Retrieve, update, or delete a specific cart item for the authenticated user
class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            CartItem.objects.select_related("cart", "product")
            .filter(cart__user=user)
            .order_by("-created_at")
        )
