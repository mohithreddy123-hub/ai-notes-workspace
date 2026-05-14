"""
AI Usage History model — tracks every AI operation for analytics.
"""

import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class AIUsageLog(models.Model):
    """
    Persists every AI operation with token usage and latency.
    Powers the analytics dashboard's AI usage statistics.
    """

    class OperationType(models.TextChoices):
        SUMMARY = 'summary', 'Generate Summary'
        ACTION_ITEMS = 'action_items', 'Extract Action Items'
        SUGGEST_TITLE = 'suggest_title', 'Suggest Title'

    class Provider(models.TextChoices):
        OPENAI = 'openai', 'OpenAI'
        GEMINI = 'gemini', 'Gemini'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_usage_logs',
    )
    note = models.ForeignKey(
        'notes.Note',
        on_delete=models.SET_NULL,
        null=True,
        related_name='ai_logs',
    )
    operation = models.CharField(max_length=20, choices=OperationType.choices, db_index=True)
    provider = models.CharField(max_length=10, choices=Provider.choices, default=Provider.GEMINI)

    # Input/Output snapshots (truncated)
    input_tokens = models.PositiveIntegerField(default=0)
    output_tokens = models.PositiveIntegerField(default=0)
    total_tokens = models.PositiveIntegerField(default=0)

    # Latency in milliseconds
    latency_ms = models.PositiveIntegerField(default=0)

    # Success/error tracking
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = 'ai_usage_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'operation']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f'{self.operation} by {self.user.username} at {self.created_at}'
