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
import time
import logging

logger = logging.getLogger("django.request")

print("DEBUG: Loading main URLs configuration")  # Debug log


# Simple function to serve the SPA
def serve_spa(request):
    return TemplateView.as_view(template_name="index.html")(request)


# Health check endpoint for Railway
def health_check(request):
    """Simple health check endpoint with response time measurement"""
    start = time.time()
    response = JsonResponse({"status": "healthy"})
    duration = time.time() - start
    logger.info(f"Health check response time: {duration*1000:.2f}ms")
    return response


# Performance test endpoint
def perf_test(request):
    """Test endpoint to measure response times"""
    start = time.time()
    # Simple dictionary operation
    data = {"test": "data"}
    for i in range(1000):
        data[f"key_{i}"] = i

    duration = time.time() - start
    return JsonResponse(
        {
            "process_time_ms": duration * 1000,
            "timestamp": time.time(),
            "message": "Performance test endpoint",
        }
    )


# Define all API and admin routes first
api_and_admin_patterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("gimli.users.urls")),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("accounts/", include("allauth.urls")),
    path("api/lore/", include("gimli.lore.urls")),
    path("api/", include("gimli.lore.urls")),
    path("api/health/", health_check, name="health_check"),
    path("api/perf-test/", perf_test, name="perf_test"),
]

# Handle SPA routes
spa_patterns = [
    # Root route explicitly
    path("", serve_spa, name="home"),
    # Let the SPA handle all other non-api, non-admin, non-static routes
    re_path(
        r"^(?!api/)(?!admin/)(?!assets/)(?!static/)(?!media/)(?!favicon).*$",
        serve_spa,
        name="spa",
    ),
]

# Start with API patterns
urlpatterns = api_and_admin_patterns

# In development, add static serving
if not settings.IS_PRODUCTION:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Add SPA patterns last - these should only catch routes not handled by API or static files
urlpatterns += spa_patterns
