from django.contrib import admin
from .models import Note, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'color', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'user__username')
    ordering = ('name',)


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'visibility', 'is_pinned', 'word_count', 'updated_at')
    list_filter = ('status', 'visibility', 'is_pinned')
    search_fields = ('title', 'content', 'user__username')
    readonly_fields = ('id', 'share_id', 'word_count', 'created_at', 'updated_at')
    ordering = ('-updated_at',)
    filter_horizontal = ('tags',)
