from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.http import JsonResponse
import os

print("DEBUG: Loading main URLs configuration")  # Debug log


# Health check endpoint for Railway
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({"status": "healthy"})


# Simple catch-all to serve the frontend
def serve_spa(request):
    return TemplateView.as_view(template_name="index.html")(request)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("gimli.users.urls")),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("accounts/", include("allauth.urls")),
    # Support both URL patterns to maintain compatibility with the frontend
    path("api/lore/", include("gimli.lore.urls")),
    path("api/", include("gimli.lore.urls")),
    # Health check endpoint
    path("api/health/", health_check, name="health_check"),
]

# Serve static files during development
if not settings.IS_PRODUCTION:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # Don't attempt to serve frontend in development mode
else:
    # In production, serve the SPA for any route that isn't an API route
    urlpatterns += [
        # Admin is already handled above
        # Handle all other paths as SPA routes - this must be last
        re_path(r"^(?!api/)(?!admin/).*$", serve_spa, name="spa"),
    ]
