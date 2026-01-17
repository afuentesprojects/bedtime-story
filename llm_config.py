"""
LLM Configuration for Bedtime Story Generator

This file contains all AI/LLM-related settings and prompt templates.
Modify this file to change story generation behavior without touching app.py.
"""

# =============================================================================
# MODEL SETTINGS
# =============================================================================

MODEL_NAME = "llama-3.3-70b-versatile"
TEMPERATURE = 0.7  # Higher = more creative, lower = more predictable
MAX_TOKENS = 2048
WORDS_PER_MINUTE = 180  # Average reading speed for children's stories


# =============================================================================
# SYSTEM PROMPT (AI Persona)
# =============================================================================

SYSTEM_PROMPT = """You are a creative storyteller who writes engaging, soothing bedtime stories for children.
Your stories are imaginative, age-appropriate for 4 to 10 year old, funny, and help children relax before sleep.
Use simple vocabulary"""


# =============================================================================
# PROMPT TEMPLATES
# =============================================================================

# Title instructions by language
TITLE_INSTRUCTIONS = {
    "English": "Start with a creative title (less than 10 words) on its own line, then a blank line, then the story.",
    "Spanish": "Comienza con un título creativo (menos de 10 palabras) en su propia línea, luego una línea en blanco, y después la historia."
}

# Language instructions
LANGUAGE_INSTRUCTIONS = {
    "English": "",  # No extra instruction needed for English
    "Spanish": "Escribe la historia completamente en español."
}


def estimate_words_from_minutes(minutes: int) -> int:
    """Estimate word count based on reading time."""
    return int(minutes * WORDS_PER_MINUTE)


def build_story_prompt(story_type: str, length_minutes: int, language: str, modifications: str = "", settings: dict = None) -> str:
    """
    Build the user prompt for story generation.

    Args:
        story_type: "made_up", "classic", or "mixed"
        length_minutes: Reading time in minutes
        language: "English" or "Spanish"
        modifications: User modifications for "mixed" story type
        settings: User settings dict with tones, favorite_topics, child_age

    Returns:
        The complete prompt string to send to the LLM
    """
    word_count = estimate_words_from_minutes(length_minutes)
    title_instruction = TITLE_INSTRUCTIONS.get(language, TITLE_INSTRUCTIONS["English"])
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, "")

    # Build personalization instructions from settings
    # For classic stories, only use age (for vocabulary), not tones/topics
    if story_type == "classic":
        personalization = _build_age_only(settings, language)
    else:
        personalization = _build_personalization(settings, language)

    # Build prompt based on language
    if language == "Spanish":
        if story_type == "made_up":
            prompt = f"{lang_instruction} {title_instruction} Crea una historia original para dormir de aproximadamente {word_count} palabras.{personalization} Hazla apropiada para niños."
        elif story_type == "classic":
            prompt = f"{lang_instruction} {title_instruction} Cuenta una historia clásica para dormir (como Caperucita Roja, Los Tres Cerditos, etc.) en aproximadamente {word_count} palabras.{personalization} Hazla apropiada para niños."
        else:  # mixed
            prompt = f"{lang_instruction} {title_instruction} Cuenta una historia clásica para dormir pero con estas modificaciones: {modifications}. La historia debe tener aproximadamente {word_count} palabras.{personalization} Hazla apropiada para niños."
    else:  # English
        if story_type == "made_up":
            prompt = f"{title_instruction} Create an original bedtime story of approximately {word_count} words.{personalization} Make it child-appropriate."
        elif story_type == "classic":
            prompt = f"{title_instruction} Tell a classic bedtime story (like Little Red Riding Hood, Three Little Pigs, etc.) in approximately {word_count} words.{personalization} Make it child-appropriate."
        else:  # mixed
            prompt = f"{title_instruction} Tell a classic bedtime story but with these modifications: {modifications}. The story should be approximately {word_count} words.{personalization} Make it child-appropriate."

    return prompt


def _build_age_only(settings: dict, language: str) -> str:
    """Build age-only personalization for classic stories."""
    if not settings:
        return ""

    age = settings.get('child_age')
    if age:
        if language == "Spanish":
            return f" El lenguaje y vocabulario debe ser apropiado para un niño de {age} años."
        else:
            return f" The language and vocabulary should be appropriate for a {age}-year-old child."
    return ""


def _build_personalization(settings: dict, language: str) -> str:
    """Build personalization instructions from user settings."""
    if not settings:
        return ""

    parts = []

    # Handle tones (can be multiple, stored as JSON string)
    tones = settings.get('tones')
    tone_custom = settings.get('tone_custom')
    if tones:
        import json
        try:
            tone_list = json.loads(tones)
            if tone_custom and 'Other' in tone_list:
                tone_list = [t if t != 'Other' else tone_custom for t in tone_list]
            if tone_list:
                if language == "Spanish":
                    parts.append(f"El tono debe ser: {', '.join(tone_list)}.")
                else:
                    parts.append(f"The tone should be: {', '.join(tone_list)}.")
        except (json.JSONDecodeError, TypeError):
            pass

    # Handle favorite topics (stored as JSON string)
    topics = settings.get('favorite_topics')
    if topics:
        import json
        try:
            topic_list = json.loads(topics)
            if topic_list:
                if language == "Spanish":
                    parts.append(f"Incluye temas sobre: {', '.join(topic_list)}.")
                else:
                    parts.append(f"Include themes about: {', '.join(topic_list)}.")
        except (json.JSONDecodeError, TypeError):
            pass

    # Handle child age
    age = settings.get('child_age')
    if age:
        if language == "Spanish":
            parts.append(f"La historia, lenguaje y vocabulario debe ser apropiada para un niño de {age} años.")
        else:
            parts.append(f"The story, language and vocabulary should be appropriate for a {age}-year-old child.")

    if parts:
        return " " + " ".join(parts)
    return ""
