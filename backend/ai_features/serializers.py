from rest_framework import serializers
from .models import AIUsageLog


class AIUsageLogSerializer(serializers.ModelSerializer):
    note_title = serializers.SerializerMethodField()
    operation_display = serializers.CharField(source='get_operation_display', read_only=True)

    class Meta:
        model = AIUsageLog
        fields = (
            'id', 'operation', 'operation_display', 'provider',
            'note_title', 'input_tokens', 'output_tokens', 'total_tokens',
            'latency_ms', 'success', 'error_message', 'created_at',
        )

    def get_note_title(self, obj):
        return obj.note.title if obj.note else 'Deleted Note'
