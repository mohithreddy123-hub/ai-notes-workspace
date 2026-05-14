"""
Notes domain models: Tag, Note.
Designed for scalability with proper indexing and relationships.
"""

import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class Tag(models.Model):
    """User-scoped tags for note categorization."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tags',
    )
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#6366f1')  # hex color
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'tags'
        unique_together = ('user', 'name')
        indexes = [models.Index(fields=['user', 'name'])]
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.user.username})'


class Note(models.Model):
    """
    Core Note model with full lifecycle support.
    Supports archiving, pinning, public sharing, and AI enrichment.
    """

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        ARCHIVED = 'archived', 'Archived'
        DELETED = 'deleted', 'Deleted'

    class Visibility(models.TextChoices):
        PRIVATE = 'private', 'Private'
        PUBLIC = 'public', 'Public'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    title = models.CharField(max_length=255, blank=True, default='Untitled Note')
    content = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='notes')

    # Status & visibility
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE, db_index=True)
    visibility = models.CharField(max_length=10, choices=Visibility.choices, default=Visibility.PRIVATE, db_index=True)
    is_pinned = models.BooleanField(default=False, db_index=True)

    # AI-generated fields (cached to avoid re-running AI unnecessarily)
    ai_summary = models.TextField(blank=True)
    ai_action_items = models.JSONField(default=list, blank=True)
    ai_suggested_title = models.CharField(max_length=255, blank=True)

    # Public sharing
    share_id = models.UUIDField(unique=True, null=True, blank=True, db_index=True)
    shared_at = models.DateTimeField(null=True, blank=True)

    # Word count cached for analytics
    word_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        db_table = 'notes'
        ordering = ['-is_pinned', '-updated_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'updated_at']),
            models.Index(fields=['user', 'visibility']),
            models.Index(fields=['share_id']),
        ]

    def __str__(self):
        return f'{self.title} — {self.user.username}'

    def save(self, *args, **kwargs):
        # Update cached word count on every save
        self.word_count = len(self.content.split()) if self.content else 0
        super().save(*args, **kwargs)

    def generate_share_id(self):
        """Create a unique public share token."""
        if not self.share_id:
            self.share_id = uuid.uuid4()
            self.shared_at = timezone.now()
            self.visibility = self.Visibility.PUBLIC
            self.save(update_fields=['share_id', 'shared_at', 'visibility'])
        return self.share_id

    def revoke_share(self):
        """Remove public access."""
        self.share_id = None
        self.shared_at = None
        self.visibility = self.Visibility.PRIVATE
        self.save(update_fields=['share_id', 'shared_at', 'visibility'])
