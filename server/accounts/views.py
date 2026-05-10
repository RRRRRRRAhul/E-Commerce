from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.serializers import (
    UserLoginSerializer,
    UserRegistrationSerializer,
    CustomUserSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = {
            "user": CustomUserSerializer(user).data,
            "tokens": {"refresh": str(token), "access": str(token.access_token)},
        }
        return Response(data, status=status.HTTP_201_CREATED)


class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token = RefreshToken.for_user(user)
        data = {
            "user": CustomUserSerializer(user).data,
            "tokens": {"refresh": str(token), "access": str(token.access_token)},
        }
        return Response(data, status=status.HTTP_200_OK)


class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserInfoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(CustomUserSerializer(user).data)
