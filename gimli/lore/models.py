from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

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
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_campaigns",
    )
    players = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="campaigns", blank=True
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Character(models.Model):
    """Model for D&D 5E characters"""

    # Character classes choices
    CLASS_CHOICES = [
        ("barbarian", "Barbarian"),
        ("bard", "Bard"),
        ("cleric", "Cleric"),
        ("druid", "Druid"),
        ("fighter", "Fighter"),
        ("monk", "Monk"),
        ("paladin", "Paladin"),
        ("ranger", "Ranger"),
        ("rogue", "Rogue"),
        ("sorcerer", "Sorcerer"),
        ("warlock", "Warlock"),
        ("wizard", "Wizard"),
        ("artificer", "Artificer"),
        ("blood_hunter", "Blood Hunter"),
    ]

    # Race choices
    RACE_CHOICES = [
        ("dragonborn", "Dragonborn"),
        ("dwarf", "Dwarf"),
        ("elf", "Elf"),
        ("gnome", "Gnome"),
        ("half_elf", "Half-Elf"),
        ("half_orc", "Half-Orc"),
        ("halfling", "Halfling"),
        ("human", "Human"),
        ("tiefling", "Tiefling"),
        ("orc", "Orc"),
        ("leonin", "Leonin"),
        ("satyr", "Satyr"),
        ("aasimar", "Aasimar"),
        ("fairy", "Fairy"),
        ("harengon", "Harengon"),
        ("tabaxi", "Tabaxi"),
        ("tortle", "Tortle"),
        ("genasi", "Genasi"),
        ("goliath", "Goliath"),
        ("other", "Other"),
    ]

    # Alignment choices
    ALIGNMENT_CHOICES = [
        ("lg", "Lawful Good"),
        ("ng", "Neutral Good"),
        ("cg", "Chaotic Good"),
        ("ln", "Lawful Neutral"),
        ("nn", "True Neutral"),
        ("cn", "Chaotic Neutral"),
        ("le", "Lawful Evil"),
        ("ne", "Neutral Evil"),
        ("ce", "Chaotic Evil"),
    ]

    # Basic info
    name = models.CharField(max_length=100)
    character_class = models.CharField(
        max_length=20, choices=CLASS_CHOICES, default="fighter"
    )
    race = models.CharField(max_length=20, choices=RACE_CHOICES, default="human")
    age = models.PositiveIntegerField(null=True, blank=True)
    alignment = models.CharField(max_length=2, choices=ALIGNMENT_CHOICES, default="nn")
    bio = models.TextField(blank=True)

    # Relationships
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name="characters"
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="characters"
    )

    # Character sheet data (JSON format)
    character_data = models.JSONField(default=dict, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_character_class_display()}, {self.get_race_display()})"
