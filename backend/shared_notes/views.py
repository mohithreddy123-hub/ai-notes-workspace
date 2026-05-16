"""
Shared Notes views — public read-only access to shared notes.
No authentication required. Logs access for analytics.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from notes.models import Note
from notes.serializers import NoteShareSerializer
from .models import SharedNoteAccess


class SharedNoteDetailView(generics.RetrieveAPIView):
    """
    GET /api/shared/:share_id/
    Public, read-only endpoint to view a shared note without login.
    """
    serializer_class = NoteShareSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        share_id = self.kwargs.get('share_id')

        # Log the access
        SharedNoteAccess.objects.create(
            share_id=share_id,
            ip_address=self._get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
        )

        try:
            return Note.objects.filter(
                visibility=Note.Visibility.PUBLIC,
                status=Note.Status.ACTIVE,
            ).prefetch_related('tags').select_related('user').get(share_id=share_id)
        except Note.DoesNotExist:
            raise NotFound('This note is not publicly available or has been unpublished.')

    def _get_client_ip(self):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return self.request.META.get('REMOTE_ADDR')
