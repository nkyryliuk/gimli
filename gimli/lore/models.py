from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Campaign(models.Model):
    """
    Model representing a D&D campaign.
    """

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    game_system = models.CharField(max_length=100, default="D&D 5e")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_campaigns"
    )
    players = models.ManyToManyField(User, related_name="campaigns", blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
