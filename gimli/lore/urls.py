from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, CharacterViewSet

# Create a router for campaigns
router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet, basename="campaign")

# Create URL patterns
urlpatterns = [
    path("", include(router.urls)),
    path(
        "campaigns/<int:campaign_pk>/characters/",
        CharacterViewSet.as_view({"get": "list", "post": "create"}),
        name="campaign-characters-list",
    ),
    path(
        "campaigns/<int:campaign_pk>/characters/<int:pk>/",
        CharacterViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="campaign-characters-detail",
    ),
]
