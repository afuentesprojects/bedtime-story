"""
Translation module using Google AI Studio (Gemini) for story translation.
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Google AI
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Supported languages
SUPPORTED_LANGUAGES = [
    "English",
    "Spanish",
    "French",
    "Portuguese",
    "German",
    "Italian"
]


def translate_story(story_text, target_language):
    """
    Translate a bedtime story to the target language using Google Gemini.

    Args:
        story_text: The story text in English
        target_language: The language to translate to

    Returns:
        Translated story text, or original if English or error occurs
    """
    # No translation needed for English
    if target_language == "English":
        return story_text

    # Check if API key is configured
    if not GOOGLE_API_KEY:
        print("Warning: GOOGLE_API_KEY not set, returning English story")
        return story_text

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')

        prompt = f"""Translate the following children's bedtime story to {target_language}.
Keep the same tone, style, and formatting (including the title on its own line).
Only return the translated text, nothing else.

{story_text}"""

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print(f"Translation error: {e}")
        # Return original story if translation fails
        return story_text
