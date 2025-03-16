from rest_framework import serializers
from .models import Campaign, Character
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


class CharacterSerializer(serializers.ModelSerializer):
    """Serializer for reading characters"""

    owner = UserSerializer(read_only=True)
    campaign = CampaignSerializer(read_only=True)
    character_class_display = serializers.CharField(
        source="get_character_class_display", read_only=True
    )
    race_display = serializers.CharField(source="get_race_display", read_only=True)
    alignment_display = serializers.CharField(
        source="get_alignment_display", read_only=True
    )

    class Meta:
        model = Character
        fields = [
            "id",
            "name",
            "character_class",
            "character_class_display",
            "race",
            "race_display",
            "age",
            "alignment",
            "alignment_display",
            "bio",
            "campaign",
            "owner",
            "character_data",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "owner"]


class CharacterCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating characters"""

    class Meta:
        model = Character
        fields = [
            "name",
            "character_class",
            "race",
            "age",
            "alignment",
            "bio",
            "character_data",
        ]

    def create(self, validated_data):
        """Create a new character and set the owner to the current user"""
        request = self.context.get("request")
        campaign_id = self.context.get("campaign_id")

        # Set the owner and campaign
        validated_data["owner"] = request.user
        validated_data["campaign_id"] = campaign_id

        return super().create(validated_data)


class CharacterUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating characters"""

    class Meta:
        model = Character
        fields = [
            "name",
            "character_class",
            "race",
            "age",
            "alignment",
            "bio",
            "character_data",
        ]
