# Todo: User Login, Story Saving, and Rating Feature

## Overview
Add functionality for users to "login" (simple username-based, no authentication), save stories they like, and rate stories 1-5 stars.

**Approach:** Since this is a prototype without real authentication, we'll use a simple username stored in the browser's localStorage. Stories will be saved to a SQLite database (simple file-based database, no server setup needed).

---

## Plan

### 1. Backend Changes (app.py)

- [ ] **Add SQLite database setup** - Create a `stories.db` file with a `saved_stories` table on app startup
- [ ] **Add `/save-story` endpoint** - Accepts story text, username, rating, and story metadata. Saves to SQLite.
- [ ] **Add `/my-stories` endpoint** - Returns all saved stories for a given username

### 2. Frontend Changes (index.html)

- [ ] **Add simple login UI** - A text input at the top where user enters their username. Store in localStorage so they stay "logged in".
- [ ] **Add "Save Story" button** - Appears after a story is generated. Only visible if user is logged in.
- [ ] **Add star rating component** - 5 clickable stars (1-5) that appear with the Save button
- [ ] **Add "My Stories" section** - A button/link to view saved stories, and a simple list display

### 3. CSS Updates (style.css)

- [ ] **Style the login area** - Simple input at top of page
- [ ] **Style the star rating** - Clickable stars that highlight on hover/selection
- [ ] **Style the saved stories list** - Simple list with story previews

---

## File Changes Summary
| File | Change Type |
|------|-------------|
| app.py | Add SQLite setup + 2 new endpoints |
| templates/index.html | Add login UI, save button, star rating, my stories view |
| static/style.css | Add styles for new components |
| stories.db | New file (SQLite database, created automatically on first run) |

---

## Technical Details

### Database Schema (SQLite)
```sql
CREATE TABLE saved_stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    story_text TEXT NOT NULL,
    story_type TEXT,
    language TEXT,
    length_minutes INTEGER,
    modifications TEXT,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### localStorage Structure
```javascript
localStorage.setItem('username', 'johnny');
```

---

## Review

### Changes Made

**1. [app.py](app.py) - Backend Changes**
- Added `sqlite3` import (Python's built-in database)
- Created `get_db()` function - opens a connection to the database
- Created `init_db()` function - creates the `saved_stories` table if it doesn't exist (runs once on startup)
- Added `/save-story` endpoint (POST) - receives story data from frontend and inserts into database
- Added `/my-stories` endpoint (GET) - fetches all stories for a username, returns them sorted by newest first

**2. [templates/index.html](templates/index.html) - Frontend Changes**
- Added login section at top: text input + Login button, or "Welcome, Name!" + Logout/My Stories buttons
- Added star rating (5 clickable stars) that appears after story generation (only if logged in)
- Added "Save Story" button that saves the story with the selected rating
- Added "My Stories" view that lists all saved stories with expandable full text
- All login state is managed via `localStorage` (persists in browser)

**3. [static/style.css](static/style.css) - Styling**
- Styled the login section (gray background box at top)
- Styled star rating (gold stars that highlight on hover/click)
- Styled save button (green gradient)
- Styled saved stories list (cards with rating, metadata, preview, and expandable full story)
- Added mobile responsiveness for new components

### How It Works (User Flow)

1. User enters name and clicks "Login" → stored in browser localStorage
2. User generates a story as usual
3. After story appears, they see star rating + "Save Story" button
4. User clicks stars (1-5) and clicks Save → story saved to SQLite database
5. User clicks "My Stories" → sees all their saved stories with ratings
6. User can expand any story to read the full text

### Files Created
- `stories.db` - SQLite database file (created automatically on first run)

