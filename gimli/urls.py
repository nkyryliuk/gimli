from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

print("DEBUG: Loading main URLs configuration")  # Debug log

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("gimli.users.urls")),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("accounts/", include("allauth.urls")),
    # Support both URL patterns to maintain compatibility with the frontend
    path("api/lore/", include("gimli.lore.urls")),
    path("api/", include("gimli.lore.urls")),
]
