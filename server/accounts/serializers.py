from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "role")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ("id", "email", "password")

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True) 

    def validate(self, data):
        user = authenticate(
            request=self.context.get("request"),
            username=data["email"],
            password=data["password"],
        )
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.is_active:
            raise serializers.ValidationError("User is inactive")
        
        data['user'] = user
        return data