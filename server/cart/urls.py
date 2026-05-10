from django.urls import path
from cart.views import CartView, CartItemView, CartItemDetailView

urlpatterns = [
    # cart url
    path(
        "", CartView.as_view()
    ),  # to get the cart of the authenticated user (also get the cart items in the response)
    # cart items urls


    path(
        "items/", CartItemView.as_view()
    ),  # to create cart items for the authenticated user (already get the cart items in the cart view)

    
    path(
        "items/<int:pk>/", CartItemDetailView.as_view()
    ),  # to retrieve, update, or delete a specific cart item for the authenticated user
]
