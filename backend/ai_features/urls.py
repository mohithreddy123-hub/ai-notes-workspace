from django.urls import path
from .views import (
    GenerateSummaryView,
    ExtractActionItemsView,
    SuggestTitleView,
    AIUsageHistoryView,
)

urlpatterns = [
    path('notes/<uuid:note_id>/generate-summary/', GenerateSummaryView.as_view(), name='ai-summary'),
    path('notes/<uuid:note_id>/extract-actions/', ExtractActionItemsView.as_view(), name='ai-actions'),
    path('notes/<uuid:note_id>/suggest-title/', SuggestTitleView.as_view(), name='ai-title'),
    path('history/', AIUsageHistoryView.as_view(), name='ai-history'),
]
