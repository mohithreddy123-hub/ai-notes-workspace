"""
Serializers for user authentication and profile management.
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Enriched JWT token with user identity claims."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['theme'] = user.theme
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Attach user profile alongside tokens
        data['user'] = UserProfileSerializer(self.user).data
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Handles new user signup with password confirmation."""

    password = serializers.CharField(
        write_only=True, min_length=8, style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True, style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'full_name', 'password', 'password_confirm')
        extra_kwargs = {
            'full_name': {'required': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        if len(value) < 3:
            raise serializers.ValidationError('Username must be at least 3 characters.')
        if not value.replace('_', '').replace('-', '').isalnum():
            raise serializers.ValidationError(
                'Username may only contain letters, numbers, underscores, and hyphens.'
            )
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    """Full user profile — read-friendly output."""

    initials = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'full_name', 'display_name',
            'initials', 'avatar_url', 'bio', 'theme',
            'ai_provider_preference', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'email', 'created_at', 'updated_at')


class UserUpdateSerializer(serializers.ModelSerializer):
    """Partial update for user profile settings."""

    class Meta:
        model = User
        fields = ('full_name', 'bio', 'avatar_url', 'theme', 'ai_provider_preference')

    def validate_theme(self, value):
        if value not in ('dark', 'light'):
            raise serializers.ValidationError('Theme must be "dark" or "light".')
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """Secure password change with current-password verification."""

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password_confirm': 'Passwords do not match.'})
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': list(e.messages)})
        return attrs
