"""
Authentication Tests — login, signup, profile.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AuthTests(TestCase):
    """Tests for user registration and login endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.signup_url = '/api/auth/signup/'
        self.login_url = '/api/auth/login/'

    def test_user_signup_success(self):
        """A new user can register with valid credentials."""
        payload = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = self.client.post(self.signup_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])

    def test_user_signup_duplicate_email(self):
        """Registering with a duplicate email returns a 400 error."""
        User.objects.create_user(
            email='dupe@example.com', username='existing', password='Pass123!'
        )
        payload = {
            'email': 'dupe@example.com',
            'username': 'newuser',
            'password': 'SecurePass123!',
        }
        response = self.client.post(self.signup_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """A registered user can log in with correct credentials."""
        User.objects.create_user(
            email='login@example.com', username='loginuser', password='Pass123!'
        )
        payload = {'email': 'login@example.com', 'password': 'Pass123!'}
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_user_login_wrong_password(self):
        """Incorrect credentials return a 401 error."""
        User.objects.create_user(
            email='auth@example.com', username='authuser', password='CorrectPass123!'
        )
        payload = {'email': 'auth@example.com', 'password': 'WrongPass!'}
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
