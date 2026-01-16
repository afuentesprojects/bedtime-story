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


def build_story_prompt(story_type: str, length_minutes: int, language: str, modifications: str = "") -> str:
    """
    Build the user prompt for story generation.

    Args:
        story_type: "made_up", "classic", or "mixed"
        length_minutes: Reading time in minutes
        language: "English" or "Spanish"
        modifications: User modifications for "mixed" story type

    Returns:
        The complete prompt string to send to the LLM
    """
    word_count = estimate_words_from_minutes(length_minutes)
    title_instruction = TITLE_INSTRUCTIONS.get(language, TITLE_INSTRUCTIONS["English"])
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, "")

    # Build prompt based on language
    if language == "Spanish":
        if story_type == "made_up":
            prompt = f"{lang_instruction} {title_instruction} Crea una historia original para dormir de aproximadamente {word_count} palabras. Hazla mágica, relajante y apropiada para niños."
        elif story_type == "classic":
            prompt = f"{lang_instruction} {title_instruction} Cuenta una historia clásica para dormir (como Caperucita Roja, Los Tres Cerditos, etc.) en aproximadamente {word_count} palabras. Hazla apropiada para niños."
        else:  # mixed
            prompt = f"{lang_instruction} {title_instruction} Cuenta una historia clásica para dormir pero con estas modificaciones: {modifications}. La historia debe tener aproximadamente {word_count} palabras y ser apropiada para niños."
    else:  # English
        if story_type == "made_up":
            prompt = f"{title_instruction} Create an original bedtime story of approximately {word_count} words. Make it magical, soothing, and child-appropriate."
        elif story_type == "classic":
            prompt = f"{title_instruction} Tell a classic bedtime story (like Little Red Riding Hood, Three Little Pigs, etc.) in approximately {word_count} words. Make it child-appropriate."
        else:  # mixed
            prompt = f"{title_instruction} Tell a classic bedtime story but with these modifications: {modifications}. The story should be approximately {word_count} words and child-appropriate."

    return prompt
