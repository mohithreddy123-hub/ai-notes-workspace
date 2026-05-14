"""
Serializers for Notes and Tags.
"""

from rest_framework import serializers
from .models import Note, Tag


class TagSerializer(serializers.ModelSerializer):
    notes_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ('id', 'name', 'color', 'notes_count', 'created_at')
        read_only_fields = ('id', 'created_at')

    def get_notes_count(self, obj):
        return obj.notes.filter(status='active').count()

    def validate_name(self, value):
        user = self.context['request'].user
        qs = Tag.objects.filter(user=user, name__iexact=value)
        # Exclude current instance on update
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('You already have a tag with this name.')
        return value.strip().lower()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TagMiniSerializer(serializers.ModelSerializer):
    """Compact tag representation for note responses."""
    class Meta:
        model = Tag
        fields = ('id', 'name', 'color')


class NoteListSerializer(serializers.ModelSerializer):
    """Lightweight note representation for list views."""
    tags = TagMiniSerializer(many=True, read_only=True)
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = (
            'id', 'title', 'excerpt', 'tags', 'status', 'visibility',
            'is_pinned', 'word_count', 'ai_summary',
            'created_at', 'updated_at',
        )

    def get_excerpt(self, obj):
        """Return first 200 chars as a preview."""
        return obj.content[:200] if obj.content else ''


class NoteDetailSerializer(serializers.ModelSerializer):
    """Full note with all AI fields and tags."""
    tags = TagMiniSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.none(),
        write_only=True, required=False, source='tags'
    )

    class Meta:
        model = Note
        fields = (
            'id', 'title', 'content', 'tags', 'tag_ids',
            'status', 'visibility', 'is_pinned',
            'ai_summary', 'ai_action_items', 'ai_suggested_title',
            'share_id', 'shared_at', 'word_count',
            'created_at', 'updated_at',
        )
        read_only_fields = (
            'id', 'ai_summary', 'ai_action_items', 'ai_suggested_title',
            'share_id', 'shared_at', 'word_count', 'created_at', 'updated_at',
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            self.fields['tag_ids'].child_relation.queryset = Tag.objects.filter(
                user=request.user
            )

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        validated_data['user'] = self.context['request'].user
        note = Note.objects.create(**validated_data)
        note.tags.set(tags)
        return note

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance


class NoteShareSerializer(serializers.ModelSerializer):
    """Public note — only exposes safe fields."""
    tags = TagMiniSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = (
            'id', 'title', 'content', 'tags',
            'ai_summary', 'ai_action_items',
            'author_name', 'word_count',
            'created_at', 'updated_at', 'shared_at',
        )

    def get_author_name(self, obj):
        return obj.user.display_name
