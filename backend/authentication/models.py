"""
Custom User model for AI Notes Workspace.
Extends AbstractBaseUser for full control over auth fields.
"""

import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom manager for the User model."""

    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required.')
        if not username:
            raise ValueError('Username is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model with UUID primary key.
    Supports avatar, bio, and preference fields for SaaS feel.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    username = models.CharField(max_length=50, unique=True, db_index=True)
    full_name = models.CharField(max_length=120, blank=True)
    avatar_url = models.URLField(blank=True)
    bio = models.TextField(max_length=300, blank=True)

    # Preferences
    theme = models.CharField(
        max_length=10,
        choices=[('dark', 'Dark'), ('light', 'Light')],
        default='dark'
    )
    ai_provider_preference = models.CharField(
        max_length=20,
        choices=[('openai', 'OpenAI'), ('gemini', 'Gemini'), ('groq', 'Groq')],
        default='groq'
    )

    # Account flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f'{self.username} <{self.email}>'

    @property
    def display_name(self):
        return self.full_name or self.username

    @property
    def initials(self):
        name = self.display_name
        parts = name.split()
        if len(parts) >= 2:
            return f'{parts[0][0]}{parts[1][0]}'.upper()
        return name[:2].upper()
