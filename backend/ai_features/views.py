"""
AI Feature views — summary, action items, title suggestion.
Each endpoint logs usage to AIUsageLog for analytics.
"""

import json
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notes.models import Note
from .models import AIUsageLog
from .providers import AIProvider, PROMPTS
from .serializers import AIUsageLogSerializer


def _run_ai_operation(request, note_id: str, operation: str):
    """
    Shared helper for all AI operations.
    Fetches the note, calls the AI, caches result, logs usage.
    """
    try:
        note = Note.objects.get(id=note_id, user=request.user)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)

    if not note.content or len(note.content.strip()) < 20:
        return Response(
            {'error': 'Note content is too short to generate AI insights (minimum 20 characters).'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Use requested provider, user's preference, or fall back to global settings
    provider_name = (
        request.data.get('provider') or
        getattr(request.user, 'ai_provider_preference', None) or
        settings.AI_PROVIDER
    )
    try:
        client = AIProvider.get_client(provider_name)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    prompt = PROMPTS[operation].format(content=note.content[:4000])  # Safety truncate
    result = client.generate(prompt)

    # Persist usage log regardless of success/failure
    log = AIUsageLog.objects.create(
        user=request.user,
        note=note,
        operation=operation,
        provider=result['provider'],
        input_tokens=result['input_tokens'],
        output_tokens=result['output_tokens'],
        total_tokens=result['total_tokens'],
        latency_ms=result['latency_ms'],
        success=result['success'],
        error_message=result.get('error', ''),
    )

    if not result['success']:
        return Response(
            {'error': f"AI generation failed: {result.get('error', 'Unknown error')}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return result, note, log


class GenerateSummaryView(APIView):
    """POST /api/ai/notes/:note_id/generate-summary"""
    permission_classes = [IsAuthenticated]

    def post(self, request, note_id):
        outcome = _run_ai_operation(request, note_id, 'summary')
        if isinstance(outcome, Response):
            return outcome
        result, note, log = outcome

        # Cache on note
        note.ai_summary = result['text']
        note.save(update_fields=['ai_summary'])

        return Response({
            'summary': result['text'],
            'tokens_used': result['total_tokens'],
            'latency_ms': result['latency_ms'],
            'provider': result['provider'],
        })


class ExtractActionItemsView(APIView):
    """POST /api/ai/notes/:note_id/extract-actions"""
    permission_classes = [IsAuthenticated]

    def post(self, request, note_id):
        outcome = _run_ai_operation(request, note_id, 'action_items')
        if isinstance(outcome, Response):
            return outcome
        result, note, log = outcome

        # Parse JSON array from AI output
        try:
            raw = result['text'].strip()
            # Strip markdown code fences if present
            if raw.startswith('```'):
                raw = raw.split('```')[1]
                if raw.startswith('json'):
                    raw = raw[4:]
            action_items = json.loads(raw)
            if not isinstance(action_items, list):
                action_items = []
        except (json.JSONDecodeError, IndexError):
            action_items = [result['text']] if result['text'] else []

        # Cache on note
        note.ai_action_items = action_items
        note.save(update_fields=['ai_action_items'])

        return Response({
            'action_items': action_items,
            'count': len(action_items),
            'tokens_used': result['total_tokens'],
            'latency_ms': result['latency_ms'],
            'provider': result['provider'],
        })


class SuggestTitleView(APIView):
    """POST /api/ai/notes/:note_id/suggest-title"""
    permission_classes = [IsAuthenticated]

    def post(self, request, note_id):
        outcome = _run_ai_operation(request, note_id, 'suggest_title')
        if isinstance(outcome, Response):
            return outcome
        result, note, log = outcome

        suggested = result['text'].strip('"\'').strip()

        # Cache on note
        note.ai_suggested_title = suggested
        note.save(update_fields=['ai_suggested_title'])

        return Response({
            'suggested_title': suggested,
            'tokens_used': result['total_tokens'],
            'latency_ms': result['latency_ms'],
            'provider': result['provider'],
        })


class AIUsageHistoryView(APIView):
    """GET /api/ai/history — Last 50 AI operations for the authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = AIUsageLog.objects.filter(user=request.user).select_related('note')[:50]
        serializer = AIUsageLogSerializer(logs, many=True)
        return Response(serializer.data)
