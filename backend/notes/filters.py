"""
Django-filter FilterSet for advanced note querying.
"""

import django_filters
from .models import Note


class NoteFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Note.Status.choices)
    visibility = django_filters.ChoiceFilter(choices=Note.Visibility.choices)
    is_pinned = django_filters.BooleanFilter()
    tags = django_filters.UUIDFilter(field_name='tags__id')
    tag_name = django_filters.CharFilter(field_name='tags__name', lookup_expr='icontains')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    updated_after = django_filters.DateTimeFilter(field_name='updated_at', lookup_expr='gte')
    has_ai_summary = django_filters.BooleanFilter(method='filter_has_ai_summary')

    class Meta:
        model = Note
        fields = ['status', 'visibility', 'is_pinned', 'tags', 'tag_name']

    def filter_has_ai_summary(self, queryset, name, value):
        if value:
            return queryset.exclude(ai_summary='')
        return queryset.filter(ai_summary='')
