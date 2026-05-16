from django.urls import path
from .views import SharedNoteDetailView

urlpatterns = [
    path('<uuid:share_id>/', SharedNoteDetailView.as_view(), name='shared-note-public'),
]
