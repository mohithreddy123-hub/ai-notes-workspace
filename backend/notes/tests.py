"""
Notes API Tests — CRUD, sharing, pin, archive.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Note, Tag

User = get_user_model()


class NotesAPITests(TestCase):
    """Tests for the Notes CRUD and action endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='notes@example.com', username='notesuser', password='Pass123!'
        )
        # Authenticate using JWT token
        login = self.client.post('/api/auth/login/', {
            'email': 'notes@example.com', 'password': 'Pass123!'
        }, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')
        self.notes_url = '/api/notes/notes/'

    def test_create_note(self):
        """Authenticated user can create a note."""
        payload = {'title': 'Test Note', 'content': 'This is a test content.'}
        response = self.client.post(self.notes_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test Note')

    def test_list_notes(self):
        """Authenticated user can list their notes."""
        Note.objects.create(user=self.user, title='Note 1', content='Content 1')
        Note.objects.create(user=self.user, title='Note 2', content='Content 2')
        response = self.client.get(self.notes_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_note(self):
        """Authenticated user can update their note."""
        note = Note.objects.create(user=self.user, title='Old Title', content='Content')
        response = self.client.patch(
            f'{self.notes_url}{note.id}/', {'title': 'New Title'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Title')

    def test_delete_note_requires_auth(self):
        """Unauthenticated request to delete a note should fail."""
        note = Note.objects.create(user=self.user, title='Note', content='Content')
        anon_client = APIClient()
        response = anon_client.delete(f'{self.notes_url}{note.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_share_note(self):
        """Sharing a note generates a public share_id."""
        note = Note.objects.create(user=self.user, title='Shared Note', content='Content to share')
        response = self.client.post(f'{self.notes_url}{note.id}/share/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('share_id', response.data)

    def test_public_note_accessible_without_auth(self):
        """A shared note is accessible without authentication."""
        note = Note.objects.create(user=self.user, title='Public Note', content='Public content')
        note.generate_share_id()
        anon_client = APIClient()
        response = anon_client.get(f'/api/shared/{note.share_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Public Note')

    def test_pin_note(self):
        """Pinning a note toggles its is_pinned field."""
        note = Note.objects.create(user=self.user, title='Pin Me', content='Content')
        response = self.client.post(f'{self.notes_url}{note.id}/pin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_pinned'])

    def test_archive_note(self):
        """Archiving a note sets its status to archived."""
        note = Note.objects.create(user=self.user, title='Archive Me', content='Content')
        response = self.client.post(f'{self.notes_url}{note.id}/archive/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'archived')
