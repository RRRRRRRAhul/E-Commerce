from django.urls import path
from products.views import (
    ProductListCreateView,
    ProductDetailView,
    ProductVideoStreamingView,
    CategoryListCreateView,
    CategoryDetailView,
)

urlpatterns = [
    # Product URLs
    path('products/', ProductListCreateView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),
    path('streaming/<int:pk>/', ProductVideoStreamingView.as_view()),

    # Category URLs
    path('categories/', CategoryListCreateView.as_view()),
    path('categories/<int:pk>/', CategoryDetailView.as_view()),
]