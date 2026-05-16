"""
Shared Notes models — public access link tracking.
"""
from django.db import models
from django.utils import timezone
import uuid


class SharedNoteAccess(models.Model):
    """
    Logs every anonymous access to a publicly shared note.
    Useful for analytics and rate-limiting future work.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    share_id = models.UUIDField(db_index=True)
    accessed_at = models.DateTimeField(default=timezone.now, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        db_table = 'shared_note_access'
        ordering = ['-accessed_at']

    def __str__(self):
        return f'Access to share_id={self.share_id} at {self.accessed_at}'
