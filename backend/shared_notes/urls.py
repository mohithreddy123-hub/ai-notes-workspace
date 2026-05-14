from django.urls import path
from notes.views import PublicNoteView

urlpatterns = [
    path('<uuid:share_id>/', PublicNoteView.as_view(), name='shared-note-public'),
]
