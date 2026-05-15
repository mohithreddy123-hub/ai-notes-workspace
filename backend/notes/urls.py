from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, TagViewSet, PublicNoteView

router = DefaultRouter()
router.register('tags', TagViewSet, basename='tag')
router.register('notes', NoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
    path('shared/<uuid:share_id>/', PublicNoteView.as_view(), name='note-public'),
]
