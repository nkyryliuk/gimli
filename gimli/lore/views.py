from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import models
from django.contrib.auth import get_user_model
from .models import Campaign, Character
from .serializers import (
    CampaignSerializer,
    CampaignCreateSerializer,
    CampaignUpdateSerializer,
    AddPlayerToCampaignSerializer,
    CharacterSerializer,
    CharacterCreateSerializer,
    CharacterUpdateSerializer,
)

User = get_user_model()


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.owner == request.user


class IsCampaignOwnerOrPlayer(permissions.BasePermission):
    """
    Custom permission to only allow campaign owners or players to access characters.
    """

    def has_permission(self, request, view):
        campaign_id = view.kwargs.get("campaign_pk")
        if not campaign_id:
            return False

        try:
            campaign = Campaign.objects.get(id=campaign_id)
            # Allow if user is the campaign owner or a player
            return (
                campaign.owner == request.user
                or campaign.players.filter(id=request.user.id).exists()
            )
        except Campaign.DoesNotExist:
            return False


class CampaignViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing campaigns.
    """

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        """
        This view should return a list of all campaigns
        for the currently authenticated user.
        """
        user = self.request.user
        # Return campaigns where user is either owner or player
        # Optimize with select_related and prefetch_related to reduce queries
        return (
            Campaign.objects.filter(models.Q(owner=user) | models.Q(players=user))
            .select_related("owner")
            .prefetch_related("players")
            .distinct()
        )

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the request.
        """
        if self.action == "create":
            return CampaignCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return CampaignUpdateSerializer
        elif self.action == "add_player":
            return AddPlayerToCampaignSerializer
        return CampaignSerializer

    def create(self, request, *args, **kwargs):
        """Override create to log user auth information"""
        print(f"User authenticated: {request.user.is_authenticated}")
        print(f"User: {request.user}")
        print(f"Request headers: {request.headers}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        """Set the owner to the current authenticated user"""
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def add_player(self, request, pk=None):
        """
        Add a player to a campaign.
        """
        campaign = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user_id = serializer.validated_data["user_id"]
            user = get_object_or_404(User, id=user_id)

            # Check if user is already a player in the campaign
            if campaign.players.filter(id=user_id).exists():
                return Response(
                    {"detail": "User is already a player in this campaign."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            campaign.players.add(user)
            return Response(
                {"detail": "Player added to campaign successfully."},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def remove_player(self, request, pk=None):
        """
        Remove a player from a campaign.
        """
        campaign = self.get_object()
        serializer = AddPlayerToCampaignSerializer(data=request.data)

        if serializer.is_valid():
            user_id = serializer.validated_data["user_id"]
            user = get_object_or_404(User, id=user_id)

            # Check if user is a player in the campaign
            if not campaign.players.filter(id=user_id).exists():
                return Response(
                    {"detail": "User is not a player in this campaign."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            campaign.players.remove(user)
            return Response(
                {"detail": "Player removed from campaign successfully."},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CharacterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing characters within a campaign.
    """

    permission_classes = [
        permissions.IsAuthenticated,
        IsCampaignOwnerOrPlayer,
        IsOwnerOrReadOnly,
    ]

    def get_queryset(self):
        """
        Return characters for the specified campaign.
        """
        campaign_id = self.kwargs.get("campaign_pk")
        # If we're in the context of a campaign, filter by that campaign
        if campaign_id:
            return Character.objects.filter(campaign_id=campaign_id).select_related(
                "owner", "campaign"
            )
        # Otherwise return all characters the user has access to
        return Character.objects.filter(owner=self.request.user).select_related(
            "campaign"
        )

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the request.
        """
        if self.action == "create":
            return CharacterCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return CharacterUpdateSerializer
        return CharacterSerializer

    def get_serializer_context(self):
        """
        Add campaign_id to serializer context.
        """
        context = super().get_serializer_context()
        context["campaign_id"] = self.kwargs.get("campaign_pk")
        return context

    def perform_create(self, serializer):
        """
        Create a new character with the current user as owner.
        """
        serializer.save(
            owner=self.request.user, campaign_id=self.kwargs.get("campaign_pk")
        )
