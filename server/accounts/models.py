from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from accounts.managers import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('USER', 'User'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='USER')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def is_admin(self):
        return self.role == 'ADMIN'