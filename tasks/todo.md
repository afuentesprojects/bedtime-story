# Task: Settings Page

## Goal
Add a Settings page where users can save their preferences (tone, favorite topics, child age). These settings are stored in the database and used to personalize story generation.

## Settings to Add
1. **Tone** (multiple choice): Funny, Soothing, Educational, Fable, Adventure, Magical, Other (custom input)
2. **Favorite Topics** (multiple choice): Siblings, Friendship, Family, School, Fantasy, Princess, Pirates, Cars, Sports, Dinosaurs, Animals, Space, Superheroes, Nature
3. **Child Age**: Number input (2-10 years)

## Implementation Plan

### Step 1: Database - Add `user_settings` table
- [x] Add new table in `app.py` `init_db()` function
- Fields: `user_id`, `tones`, `tone_custom`, `favorite_topics` (JSON), `child_age`
- One row per user (created when they first save settings)

### Step 2: Backend - Add settings endpoints
- [x] Add `GET /settings` endpoint - returns user's current settings
- [x] Add `POST /settings` endpoint - saves user's settings

### Step 3: Update LLM prompts to use settings
- [x] Modify `build_story_prompt()` in `llm_config.py` to accept settings
- [x] Update `/generate` endpoint to fetch user settings and pass to prompt builder
- [x] Incorporate tone, topics, and age into the prompt

### Step 4: Frontend - Add Settings UI
- [x] Add "Settings" button next to "My Stories" in the logged-in header
- [x] Create settings section/form with:
  - Tone checkboxes + "Other" text input
  - Favorite topics checkboxes
  - Child age number input
- [x] Add save button with success/error feedback
- [x] Load existing settings when opening

### Step 5: Test the feature
- [ ] Test saving/loading settings
- [ ] Test story generation with different settings combinations
- [ ] Verify settings affect the generated story content

---

## Technical Notes

### Tone Options
- Funny, Soothing, Educational, Fable, Adventure, Magical
- "Other" allows custom text input

### Topic Options
- Siblings, Friendship, Family, School, Fantasy, Princess, Pirates, Cars, Sports, Dinosaurs, Animals, Space, Superheroes, Nature

### How Settings Affect Stories
The `build_story_prompt()` function will add instructions like:
- "Write in a [tone] tone"
- "Include themes about: [topics]"
- "The story should be appropriate for a [age]-year-old child"

### Database Schema
```sql
CREATE TABLE user_settings (
    user_id INTEGER PRIMARY KEY,
    tone TEXT DEFAULT 'Soothing',
    tone_custom TEXT,
    favorite_topics TEXT,  -- JSON array like '["Dinosaurs","Space"]'
    child_age INTEGER DEFAULT 6,
    FOREIGN KEY (user_id) REFERENCES users (id)
)
```

---

## Review

### What Changed

**1. Database (`app.py` - `init_db()`):**
Added a new `user_settings` table to store user preferences:
- `user_id` - Links to the user
- `tones` - JSON array of selected tones (e.g., `["Funny", "Adventure"]`)
- `tone_custom` - Custom tone text if "Other" is selected
- `favorite_topics` - JSON array of topics (e.g., `["Dinosaurs", "Space"]`)
- `child_age` - The child's age (2-10)

**2. Backend API (`app.py`):**
Added two new endpoints:
- `GET /settings` - Fetches user's saved settings
- `POST /settings` - Saves user's settings (uses INSERT OR REPLACE so it works for both new and existing settings)

**3. LLM Integration (`llm_config.py`):**
- Added `settings` parameter to `build_story_prompt()`
- Created `_build_personalization()` helper that converts settings into prompt instructions
- The prompt now includes phrases like "The tone should be: Funny, Adventure" and "Include themes about: Dinosaurs, Space" and "appropriate for a 5-year-old"

**4. Story Generation (`app.py` - `/generate`):**
- Updated to fetch user settings from the database when logged in
- Passes settings to `build_story_prompt()` so stories are personalized

**5. Frontend (`index.html`):**
- Added "Settings" button in the header (next to "My Stories")
- Created Settings section with:
  - Checkboxes for tones (Funny, Soothing, Educational, Fable, Adventure, Magical, Other)
  - Text input for custom tone
  - Checkboxes for topics (14 options including Siblings, Dinosaurs, Space, etc.)
  - Number input for child's age (2-10)
- Settings are loaded when opening the page
- Save button with success/error feedback
- Story generation now includes user_id/token to fetch settings

**6. Styling (`style.css`):**
- Added styles for checkbox groups
- Added Settings button styling
- Made checkboxes highlight when selected

### How It Works

1. User clicks "Settings" button
2. Their existing settings (if any) are loaded from the database
3. User selects tones, topics, and enters child age
4. User clicks "Save Settings"
5. When generating a story, the backend fetches their settings
6. The LLM prompt includes personalization instructions based on settings
7. The generated story reflects their preferences

### Files Changed
| File | Change |
|------|--------|
| `app.py` | Added `user_settings` table + GET/POST `/settings` endpoints + updated `/generate` |
| `llm_config.py` | Added `settings` param and `_build_personalization()` function |
| `templates/index.html` | Added Settings UI + JavaScript handlers |
| `static/style.css` | Added checkbox group and settings styling |