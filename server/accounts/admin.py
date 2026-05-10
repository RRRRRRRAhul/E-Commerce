from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import CustomUser
from accounts.forms import CustomUserCreationForm, CustomUserChangeForm


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = ("email", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")

    ordering = ("email",)
    search_fields = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("role", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "role", "is_staff", "is_active"),
        }),
    )
