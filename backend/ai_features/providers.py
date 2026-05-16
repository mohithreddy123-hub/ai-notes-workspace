"""
AI provider abstraction layer.
Supports both Gemini (default) and OpenAI, switchable per user preference.
"""

import time
import os
from django.conf import settings


class AIProvider:
    """Factory that returns the correct AI client based on config."""

    @staticmethod
    def get_client(provider: str = None):
        provider = provider or settings.AI_PROVIDER
        if provider == 'openai':
            return OpenAIClient()
        return GeminiClient()


class GeminiClient:
    """Google Gemini AI integration using google-generativeai SDK."""

    MODEL = 'gemini-2.0-flash'

    def __init__(self):
        import google.generativeai as genai
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError('GEMINI_API_KEY is not configured.')
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(self.MODEL)

    def generate(self, prompt: str) -> dict:
        start = time.time()
        try:
            response = self.model.generate_content(prompt)
            latency_ms = int((time.time() - start) * 1000)
            text = response.text.strip()
            # Gemini doesn't always expose token counts on flash — estimate
            input_tokens = len(prompt.split())
            output_tokens = len(text.split())
            return {
                'text': text,
                'input_tokens': input_tokens,
                'output_tokens': output_tokens,
                'total_tokens': input_tokens + output_tokens,
                'latency_ms': latency_ms,
                'provider': 'gemini',
                'success': True,
            }
        except Exception as e:
            latency_ms = int((time.time() - start) * 1000)
            return {
                'text': '',
                'input_tokens': 0,
                'output_tokens': 0,
                'total_tokens': 0,
                'latency_ms': latency_ms,
                'provider': 'gemini',
                'success': False,
                'error': str(e),
            }


class OpenAIClient:
    """OpenAI GPT integration."""

    MODEL = 'gpt-4o-mini'

    def __init__(self):
        from openai import OpenAI
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise ValueError('OPENAI_API_KEY is not configured.')
        self.client = OpenAI(api_key=api_key)

    def generate(self, prompt: str) -> dict:
        start = time.time()
        try:
            response = self.client.chat.completions.create(
                model=self.MODEL,
                messages=[{'role': 'user', 'content': prompt}],
                max_tokens=1000,
                temperature=0.7,
            )
            latency_ms = int((time.time() - start) * 1000)
            text = response.choices[0].message.content.strip()
            usage = response.usage
            return {
                'text': text,
                'input_tokens': usage.prompt_tokens,
                'output_tokens': usage.completion_tokens,
                'total_tokens': usage.total_tokens,
                'latency_ms': latency_ms,
                'provider': 'openai',
                'success': True,
            }
        except Exception as e:
            latency_ms = int((time.time() - start) * 1000)
            return {
                'text': '',
                'input_tokens': 0,
                'output_tokens': 0,
                'total_tokens': 0,
                'latency_ms': latency_ms,
                'provider': 'openai',
                'success': False,
                'error': str(e),
            }


# ── Prompt Templates ─────────────────────────────────────────────────────────

PROMPTS = {
    'summary': """You are an expert note summarizer. Given the following note content, 
generate a concise, clear summary in 2-4 sentences. Focus on the key ideas and insights.
Respond with ONLY the summary text — no preamble.

Note Content:
{content}

Summary:""",

    'action_items': """You are a productivity assistant. Extract clear, actionable tasks 
from the following note. Return a JSON array of strings, each being a concrete action item.
If there are no action items, return an empty array [].
Respond with ONLY the JSON array — no explanation, no markdown.

Note Content:
{content}

Action Items (JSON array):""",

    'suggest_title': """You are a creative writing assistant. Based on the following note content,
suggest a concise, descriptive, and engaging title (max 10 words).
Respond with ONLY the title text — no quotes, no preamble.

Note Content:
{content}

Suggested Title:""",
}
