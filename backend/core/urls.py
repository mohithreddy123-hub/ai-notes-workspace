"""
Root URL configuration for AI Notes Workspace API.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/notes/', include('notes.urls')),
    path('api/ai/', include('ai_features.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/shared/', include('shared_notes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
