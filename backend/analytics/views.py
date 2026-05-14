"""
Productivity Analytics Dashboard API.
Provides stats like total notes, AI usage, tag distributions.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum
from datetime import timedelta

from notes.models import Note, Tag
from ai_features.models import AIUsageLog


class DashboardStatsView(APIView):
    """
    GET /api/analytics/dashboard/
    Returns aggregated stats for the user's dashboard.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        seven_days_ago = now - timedelta(days=7)

        # Notes stats
        active_notes = Note.objects.filter(user=user, status=Note.Status.ACTIVE)
        total_notes = active_notes.count()
        
        recent_notes_qs = active_notes.order_by('-updated_at')[:5]
        from notes.serializers import NoteListSerializer
        recent_notes = NoteListSerializer(recent_notes_qs, many=True, context={'request': request}).data

        notes_this_week = active_notes.filter(created_at__gte=seven_days_ago).count()

        # Tag stats
        top_tags = Tag.objects.filter(user=user).annotate(
            note_count=Count('notes')
        ).order_by('-note_count')[:5]
        from notes.serializers import TagSerializer
        most_used_tags = TagSerializer(top_tags, many=True, context={'request': request}).data

        # AI stats
        ai_logs = AIUsageLog.objects.filter(user=user)
        total_ai_requests = ai_logs.count()
        tokens_used_this_week = ai_logs.filter(created_at__gte=seven_days_ago).aggregate(
            Sum('total_tokens')
        )['total_tokens__sum'] or 0

        # Weekly Activity (dummy data structure, simple daily counts could be aggregated here)
        # For simplicity, we just return basic counts
        daily_activity = []
        for i in range(7):
            day = now - timedelta(days=i)
            start_of_day = day.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = day.replace(hour=23, minute=59, second=59, microsecond=999999)
            daily_notes = active_notes.filter(created_at__gte=start_of_day, created_at__lte=end_of_day).count()
            daily_activity.append({
                'date': start_of_day.strftime('%Y-%m-%d'),
                'notes_created': daily_notes
            })
        daily_activity.reverse()

        return Response({
            'total_notes': total_notes,
            'notes_this_week': notes_this_week,
            'recently_edited': recent_notes,
            'most_used_tags': most_used_tags,
            'ai_stats': {
                'total_requests': total_ai_requests,
                'tokens_used_this_week': tokens_used_this_week,
            },
            'weekly_activity': daily_activity
        })
