"""
Notes ViewSets — full CRUD, filtering, search, archiving, sharing.
"""

from rest_framework import viewsets, generics, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone

from .models import Note, Tag
from .serializers import (
    NoteListSerializer,
    NoteDetailSerializer,
    NoteShareSerializer,
    TagSerializer,
)
from .filters import NoteFilter


class TagViewSet(viewsets.ModelViewSet):
    """CRUD for user-scoped tags."""
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user).prefetch_related('notes')


class NoteViewSet(viewsets.ModelViewSet):
    """
    Full-featured Note CRUD with:
    - Search by title/content
    - Filter by tags, status, visibility
    - Sort by updated_at, created_at
    - Pin/unpin, archive, share actions
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = NoteFilter
    search_fields = ['title', 'content', 'tags__name']
    ordering_fields = ['updated_at', 'created_at', 'title', 'word_count']
    ordering = ['-is_pinned', '-updated_at']

    def get_queryset(self):
        return (
            Note.objects
            .filter(user=self.request.user)
            .exclude(status=Note.Status.DELETED)
            .prefetch_related('tags')
            .select_related('user')
        )

    def get_serializer_class(self):
        if self.action == 'list':
            return NoteListSerializer
        return NoteDetailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # ── Custom actions ─────────────────────────────────────────────────────

    @action(detail=True, methods=['post'], url_path='archive')
    def archive(self, request, pk=None):
        """POST /notes/:id/archive — soft-archive a note."""
        note = self.get_object()
        note.status = Note.Status.ARCHIVED
        note.save(update_fields=['status'])
        return Response({'message': 'Note archived.', 'status': 'archived'})

    @action(detail=True, methods=['post'], url_path='restore')
    def restore(self, request, pk=None):
        """POST /notes/:id/restore — restore archived note."""
        note = self.get_object()
        note.status = Note.Status.ACTIVE
        note.save(update_fields=['status'])
        return Response({'message': 'Note restored.', 'status': 'active'})

    @action(detail=True, methods=['post'], url_path='pin')
    def toggle_pin(self, request, pk=None):
        """POST /notes/:id/pin — toggle pinned state."""
        note = self.get_object()
        note.is_pinned = not note.is_pinned
        note.save(update_fields=['is_pinned'])
        return Response({'is_pinned': note.is_pinned})

    @action(detail=True, methods=['post'], url_path='share')
    def share(self, request, pk=None):
        """POST /notes/:id/share — generate a public share link."""
        note = self.get_object()
        share_id = note.generate_share_id()
        return Response({
            'share_id': str(share_id),
            'shared_at': note.shared_at,
            'share_url': f'/shared/{share_id}',
        })

    @action(detail=True, methods=['post'], url_path='unshare')
    def unshare(self, request, pk=None):
        """POST /notes/:id/unshare — revoke public access."""
        note = self.get_object()
        note.revoke_share()
        return Response({'message': 'Public link revoked. Note is now private.'})

    @action(detail=False, methods=['get'], url_path='archived')
    def archived(self, request):
        """GET /notes/archived — list all archived notes."""
        qs = Note.objects.filter(user=request.user, status=Note.Status.ARCHIVED).prefetch_related('tags')
        serializer = NoteListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='pinned')
    def pinned(self, request):
        """GET /notes/pinned — list all pinned notes."""
        qs = Note.objects.filter(
            user=request.user, status=Note.Status.ACTIVE, is_pinned=True
        ).prefetch_related('tags')
        serializer = NoteListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


class PublicNoteView(generics.RetrieveAPIView):
    """
    GET /api/shared/:share_id — Public read-only note view.
    No authentication required.
    """
    serializer_class = NoteShareSerializer
    permission_classes = [AllowAny]
    lookup_field = 'share_id'

    def get_queryset(self):
        return Note.objects.filter(
            visibility=Note.Visibility.PUBLIC,
            status=Note.Status.ACTIVE,
        ).prefetch_related('tags').select_related('user')

    def get_object(self):
        share_id = self.kwargs.get('share_id')
        try:
            return self.get_queryset().get(share_id=share_id)
        except Note.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('This note is not publicly available.')
