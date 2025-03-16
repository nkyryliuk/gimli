from rest_framework import serializers
from .models import Campaign
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user information in campaigns"""

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class CampaignSerializer(serializers.ModelSerializer):
    """Serializer for Campaigns"""

    owner = UserSerializer(read_only=True)
    players = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id",
            "name",
            "description",
            "game_system",
            "created_at",
            "updated_at",
            "owner",
            "players",
            "is_active",
        ]
        read_only_fields = ["created_at", "updated_at", "owner"]


class CampaignCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating campaigns"""

    class Meta:
        model = Campaign
        fields = ["name", "description", "game_system", "is_active"]

    def create(self, validated_data):
        """Create a new campaign and set the owner to the current user"""
        request = self.context.get("request")
        validated_data["owner"] = request.user
        return super().create(validated_data)


class CampaignUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating campaigns"""

    class Meta:
        model = Campaign
        fields = ["name", "description", "game_system", "is_active"]


class AddPlayerToCampaignSerializer(serializers.Serializer):
    """Serializer for adding a player to a campaign"""

    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        """Check that the user exists"""
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")
        return value
