from products.serializers import ProductSerializer, CategorySerializer
from rest_framework import generics
from products.permissions import AdminOrReadOnly
from products.models import Product, Category
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.http import Http404, StreamingHttpResponse, FileResponse
import mimetypes, os


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AdminOrReadOnly, IsAuthenticated]

    def get_queryset(self):
        base_qs = Product.objects.select_related("category")
        user = self.request.user

        if not user.is_admin():
            return base_qs.filter(is_available=True)

        return base_qs


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AdminOrReadOnly, IsAuthenticated]

    def get_queryset(self):
        base_qs = Product.objects.select_related("category")
        user = self.request.user

        if not user.is_admin():
            return base_qs.filter(is_available=True)

        return base_qs


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, AdminOrReadOnly]

    def get_queryset(self):
        base_qs = Category.objects.all()
        user = self.request.user

        if not user.is_admin():
            return base_qs.filter(is_active=True)

        return base_qs


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, AdminOrReadOnly]

    def get_queryset(self):
        base_qs = Category.objects.all()
        user = self.request.user

        if not user.is_admin():
            return base_qs.filter(is_active=True)

        return base_qs


def file_iterator(file, start, length, chunk_size=8192):
        file.seek(start)
        remaining = length

        while remaining > 0:
            chunk = file.read(min(chunk_size, remaining))
            if not chunk:
                break
            yield chunk
            remaining -= len(chunk)

        file.close() 


class ProductVideoStreamingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404("Video not found")
        
        video_path = product.video.path
        video_size = os.path.getsize(video_path)

        content_type, _ = mimetypes.guess_type(video_path)

        range_header = request.headers.get('Range', None)

        if range_header:
            byte_1, byte_2 = 0, None

            match = range_header.replace("bytes=", "").split("-")
            byte_1 = int(match[0])
            if match[1]: 
                byte_2 = int(match[1])
                
            length = video_size - byte_1 if byte_2 is None else byte_2 - byte_1 + 1

            f = open(video_path, "rb")

            response = StreamingHttpResponse(
                file_iterator(f, byte_1, length),
                status=206,
                content_type=content_type
            )

            response['Content-Range'] = f'bytes {byte_1}-{byte_1 + length - 1}/{video_size}'
            response['Accept-Ranges'] = 'bytes'
            response['Content-Length'] = str(length)

            return response
        
        return FileResponse(open(video_path, 'rb'), content_type=content_type)
            

