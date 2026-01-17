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

TITLE_INSTRUCTION = "Start with a creative title (less than 10 words) on its own line, then a blank line, then the story."


def estimate_words_from_minutes(minutes: int) -> int:
    """Estimate word count based on reading time."""
    return int(minutes * WORDS_PER_MINUTE)


def build_story_prompt(story_type: str, length_minutes: int, modifications: str = "", settings: dict = None) -> str:
    """
    Build the user prompt for story generation (always in English).
    Translation to other languages is handled separately after generation.

    Args:
        story_type: "made_up", "classic", or "mixed"
        length_minutes: Reading time in minutes
        modifications: User modifications for "mixed" story type
        settings: User settings dict with tones, favorite_topics, child_age

    Returns:
        The complete prompt string to send to the LLM
    """
    word_count = estimate_words_from_minutes(length_minutes)

    # Build personalization instructions from settings
    # For classic stories, only use age (for vocabulary), not tones/topics
    if story_type == "classic":
        personalization = _build_age_only(settings)
    else:
        personalization = _build_personalization(settings)

    # Build prompt (always in English - translation happens after generation)
    if story_type == "made_up":
        prompt = f"{TITLE_INSTRUCTION} Create an original bedtime story of approximately {word_count} words.{personalization} Make it child-appropriate."
    elif story_type == "classic":
        prompt = f"{TITLE_INSTRUCTION} Tell a classic bedtime story (like Little Red Riding Hood, Three Little Pigs, etc.) in approximately {word_count} words.{personalization} Make it child-appropriate."
    else:  # mixed
        prompt = f"{TITLE_INSTRUCTION} Tell a classic bedtime story but with these modifications: {modifications}. The story should be approximately {word_count} words.{personalization} Make it child-appropriate."

    return prompt


def _build_age_only(settings: dict) -> str:
    """Build age-only personalization for classic stories."""
    if not settings:
        return ""

    age = settings.get('child_age')
    if age:
        return f" The language and vocabulary should be appropriate for a {age}-year-old child."
    return ""


def _build_personalization(settings: dict) -> str:
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
                parts.append(f"Include themes about: {', '.join(topic_list)}.")
        except (json.JSONDecodeError, TypeError):
            pass

    # Handle child age
    age = settings.get('child_age')
    if age:
        parts.append(f"The story, language and vocabulary should be appropriate for a {age}-year-old child.")

    if parts:
        return " " + " ".join(parts)
    return ""
