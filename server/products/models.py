from django.db import models
import uuid



class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    def product_image_path(instance, filename):
        ext = filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        return f"products/images/{instance.category.name}/{filename}"

    def product_video_path(instance, filename):
        ext = filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        return f"products/videos/{instance.category.name}/{filename}"
    
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products'
    )

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    image = models.ImageField(upload_to=product_image_path)
    video = models.FileField(upload_to=product_video_path, null=True, blank=True)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
