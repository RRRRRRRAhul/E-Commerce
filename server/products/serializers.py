from rest_framework import serializers
import os
from .models import Category, Product
import re

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
    
    def validate_name(self, data):
        data = data.strip()

        if not data:
            raise serializers.ValidationError("Category name is required")
        
        if len(data) <= 1 :
            raise serializers.ValidationError("Category name should be more than one character")
        
        queryset = Category.objects.filter(name__iexact=data)

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError("Category name must be unique")
        
        return data
    
    def validate_slug(self, data):
        pattern = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'
        if not data:
            raise serializers.ValidationError("Category slug is required")
        
        queryset = Category.objects.filter(slug__iexact=data)

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)
        
        if queryset.exists():
            raise serializers.ValidationError("Category slug must be unique")
        
        if not bool(re.match(pattern, data)):
            raise serializers.ValidationError("URL-friendly format only")
        
        return data
            
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "category_name",
            "name",
            "slug",
            "description",
            "price",
            "stock",
            "image",
            "video",
            "is_available",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "is_available",
        )

    def validate_category(self, data):
        if not data.is_active:
            raise serializers.ValidationError("This category is not active")
        
        return data
    
    def validate_name(self, data):
        data = data.strip()

        if not data:
            raise serializers.ValidationError("Name can't be empty")
        
        if len(data) <= 2:
            raise serializers.ValidationError("Name's length must be more than 2 character")
        
        queryset = Product.objects.filter(name__iexact=data)

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)
        
        if queryset.exists():
            raise serializers.ValidationError("Product name must be unique")
        
        return data
        
    def validate_slug(self, data):
        pattern = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'

        if not data:
            raise serializers.ValidationError("Product slug is required")

        queryset = Product.objects.filter(slug__iexact=data)

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)
        
        if queryset.exists():
            raise serializers.ValidationError("Product slug must be unique")
        
        if not bool(re.match(pattern, data)):
            raise serializers.ValidationError("URL-friendly format only")
        
        return data
    
    def validate_description(self, data):
        
        if not data:
            raise serializers.ValidationError("Description is required")
        
        if data and not data.strip():
            raise serializers.ValidationError("Description can't be empty")
        
        if len(data) < 15 :
            raise serializers.ValidationError("Description must be more then 15 characters long")
        
        return data
    
    def validate_price(self, data):
        if data is None:
            raise serializers.ValidationError("Product's price is required")
        
        if data <= 0:
            raise serializers.ValidationError("Product price can't be zero or negative")
        
        return data
    
    def validate_stock(self, data):
        if data is None:
            raise serializers.ValidationError("Product's stock is required")
        
        if data < 0 :
            raise serializers.ValidationError("Product stock can't negative")
        
        return data
    
    def validate_image(self, data):
        if not data and not self.instance:
            raise serializers.ValidationError("Product Image is required")
        
        if not data:
            return data
        
        ext = os.path.splitext(data.name)[1].lower()
        allowed_extensions = ['.jpg', '.jpeg', '.png']

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported image format. Allowed: {', '.join(allowed_extensions)}"
            )
        
        max_size = 2 * 1024 * 1024

        if data.size > max_size:
            raise serializers.ValidationError("Product Image size must be less than 2mb")
        
        return data
    
    def validate_video(self, data):
        if not data:
            return data # video is optional field
        
        ext = os.path.splitext(data.name)[1].lower()
        allowed_extensions = ['.mp4', '.mov', '.avi', '.mkv']

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported video format. Allowed formats: {', '.join(allowed_extensions)}"
            )
        
        mime_type = data.content_type
        allowed_mime_types = [
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-matroska'
        ]

        if mime_type not in allowed_mime_types:
            raise serializers.ValidationError("Invalid video file type")
        
        max_size = 100 * 1024 * 1024

        if data.size > max_size:
            raise serializers.ValidationError("Video file size must be less than 100MB")
        
        if data.size == 0:
            raise serializers.ValidationError("Empty video file is not allowed")
        
        return data



        

    
