# Task: Language via Translation API (Google AI Studio)

## Goal
Instead of having the LLM generate stories in different languages (which adds complexity to prompts and may affect story quality), we will:
1. Always generate stories in English
2. Translate to the user's preferred language using Google AI Studio (Gemini)
3. Move language preference to Settings (not per-story selection)

## Benefits
- Simpler LLM prompts (always English)
- Consistent story quality (English is best-supported)
- Easier to add more languages in the future
- User sets language once in Settings

## Current State
- Language dropdown on main story form (English/Spanish)
- LLM prompts branch based on language (different instructions for Spanish)
- Language saved per-story in database

## Implementation Plan

### Step 1: Add Google AI Studio API setup
- [x] Add `google-generativeai` package to requirements.txt
- [x] Add `GOOGLE_API_KEY` to `.env` (user will add their key)
- [x] Create `translation.py` module with translate function using Gemini

### Step 2: Add language preference to Settings
- [x] Add `preferred_language` field to `user_settings` table in database
- [x] Update `GET /settings` to return language preference
- [x] Update `POST /settings` to save language preference
- [x] Add language dropdown to Settings UI (English, Spanish, French, etc.)

### Step 3: Simplify LLM prompts (English only)
- [x] Remove `LANGUAGE_INSTRUCTIONS` dictionary from `llm_config.py`
- [x] Remove `TITLE_INSTRUCTIONS` dictionary (use English only)
- [x] Remove language branching from `build_story_prompt()`
- [x] Remove language branching from `_build_personalization()` and `_build_age_only()`
- [x] Remove `language` parameter from `build_story_prompt()` signature

### Step 4: Update story generation flow
- [x] Update `/generate` endpoint to:
  1. Generate story in English (no language param)
  2. Fetch user's preferred language from settings
  3. If not English, call translation API
  4. Return translated story
- [x] Keep `language` field in saved_stories table (stores final language)

### Step 5: Update Frontend
- [x] Remove language dropdown from main story form
- [x] Update Settings section with language dropdown
- [x] Update "My Stories" display to show translated language

### Step 6: Test the feature
- [x] Verify app starts without errors
- [ ] Test story generation in English (default)
- [ ] Test translation to Spanish (with GOOGLE_API_KEY)
- [ ] Verify settings save/load language preference

---

## Technical Notes

### Google AI Studio (Gemini) Setup
```python
import google.generativeai as genai

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

def translate_text(text, target_language):
    if target_language == "English":
        return text

    prompt = f"Translate the following children's bedtime story to {target_language}. Keep the same tone and style. Only return the translated text, nothing else.\n\n{text}"
    response = model.generate_content(prompt)
    return response.text
```

### Languages to Support
- English (default, no translation needed)
- Spanish
- French
- Portuguese
- German
- Italian

### Database Change
```sql
ALTER TABLE user_settings ADD COLUMN preferred_language TEXT DEFAULT 'English';
```

### Flow Diagram
```
User clicks "Generate Story"
    ↓
Backend generates story in English (simplified prompts)
    ↓
Fetch user's preferred_language from settings
    ↓
If preferred_language != "English":
    Call Google AI Studio to translate
    ↓
Return story (original English or translated)
    ↓
Save to database with final language
```

---

## Files Modified

| File | Change |
|------|--------|
| `requirements.txt` | Added `google-generativeai==0.8.0` |
| `translation.py` | NEW - Translation function using Gemini 1.5 Flash |
| `llm_config.py` | Removed all language branching, simplified to English-only prompts |
| `app.py` | Added language to settings schema, updated /generate to translate |
| `templates/index.html` | Removed language from form, added to Settings page |
| `static/style.css` | Added styling for language dropdown |

---

## Review

### What Changed

**1. New Translation Module (`translation.py`):**
- Created a new file that uses Google AI Studio (Gemini 1.5 Flash) for translation
- `translate_story(story_text, target_language)` function handles translation
- Returns original text if language is English or if API key is missing
- Gracefully handles errors (returns original story if translation fails)

**2. Simplified LLM Prompts (`llm_config.py`):**
- Removed `LANGUAGE_INSTRUCTIONS` and `TITLE_INSTRUCTIONS` dictionaries
- Removed `language` parameter from `build_story_prompt()` function
- Removed all Spanish/language branching from helper functions
- Prompts are now ~50% shorter and simpler (English only)

**3. Database & Settings (`app.py`):**
- Added `preferred_language` column to `user_settings` table
- Added migration to handle existing databases
- Updated GET/POST `/settings` endpoints to handle language
- Updated `/generate` to translate stories after generation
- Added `/languages` endpoint to get supported languages

**4. Frontend (`index.html`):**
- Removed language dropdown from story generation form
- Added language dropdown in Settings page (6 languages)
- Updated JavaScript to save/load language preference
- Story language now comes from API response, not form input

### How It Works Now

1. User sets their preferred language in Settings (one-time)
2. When generating a story:
   - Backend always generates in English (simpler, higher quality)
   - If user's language is not English, translates using Google Gemini
   - Returns the translated story with language indicator
3. Saved stories show the final language they were translated to

### To Enable Translation

Add your Google AI Studio API key to `.env`:
```
GOOGLE_API_KEY=your-api-key-here
```

Get a free key from: https://aistudio.google.com/

Without the key, stories will be generated in English only (no translation).
