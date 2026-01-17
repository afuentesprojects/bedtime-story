# Bedtime Story Generator - Project Context

## Project Overview
A **native Android mobile application** (with web support) that generates AI-powered bedtime stories for children ages 4-8 using the Groq API (Llama models). Users can customize story length, type, language, and tone.

## Architecture Decision
**Decision Date:** January 2026

We are transitioning from a Flask web app to a **Native Android App** built with Kotlin, while maintaining the Python/Flask backend as an API server. This gives us:
- Full Play Store distribution
- Best native Android experience
- Access to all Android features
- Separate optimized frontends for mobile and web

## Tech Stack
- **Backend (API):** Python 3.11, Flask 3.0.0 (serves as REST API)
- **Mobile Frontend:** Kotlin, Android SDK (Native Android)
- **Web Frontend:** HTML, CSS, Vanilla JavaScript (maintained for web access)
- **AI:** Groq API with Llama 3.3 70B model
- **Translation:** Google AI Studio (Gemini 2.0 Flash)
- **Database:** SQLite (local) → will need cloud DB for cross-device sync
- **Environment:** python-dotenv for API key management

## Project Structure (Current - Web MVP)
```
bedtime_story_app/
├── app.py              # Flask backend with API routes
├── auth.py             # Authentication utilities (password hashing, tokens)
├── llm_config.py       # LLM settings and prompt templates (English only)
├── translation.py      # Translation using Google Gemini API
├── templates/
│   └── index.html      # Web frontend interface
├── static/
│   └── style.css       # Web styling
├── .env                # API keys (GROQ_API_KEY, GOOGLE_API_KEY)
├── requirements.txt    # Python dependencies
└── venv/               # Virtual environment
```

## Project Structure (Target - Android + Web)
```
bedtime_story_app/
├── backend/                    # Flask API server
│   ├── app.py                  # Main API routes
│   ├── llm_config.py           # LLM prompts and configuration
│   ├── auth.py                 # Authentication logic
│   ├── requirements.txt
│   └── .env
├── android/                    # Native Android app (Kotlin)
│   ├── app/
│   │   └── src/main/
│   │       ├── java/...        # Kotlin source files
│   │       └── res/...         # Android resources
│   └── build.gradle
├── web/                        # Web frontend (optional, for browser access)
│   ├── index.html
│   └── style.css
└── shared/                     # Shared assets (stories catalog, etc.)
    └── classic_tales.json      # Catalog of classic stories
```

## Key Features
1. **Story Length:** 1-10 minutes reading time (converted to ~180 words/min)
2. **Story Types:**
   - Made Up: Original stories
   - Classic: Traditional tales
   - Mixed: Classic with user modifications
3. **Languages:** English, Spanish, French, Portuguese, German, Italian (via translation)
4. **Output:** Plain text stories

## Development Guidelines

### Python Code Standards
- Use clear, descriptive function names
- Add docstrings to functions
- Keep functions focused on single responsibility
- Use type hints where helpful

### Frontend Standards
- Keep JavaScript vanilla (no jQuery, React, etc.)
- Mobile-responsive design
- Minimal dependencies
- Simple, functional UI (not overly styled)

### API Usage
- Groq API key stored in .env file (GROQ_API_KEY)
- Google API key stored in .env file (GOOGLE_API_KEY) - for translation
- Story generation model: `llama-3.3-70b-versatile` (Groq)
- Translation model: `gemini-2.0-flash` (Google AI Studio)
- Temperature: 0.7 for creative stories
- Max tokens: 2048

### What NOT to Change
- Don't modify `.env` file
- Don't add complex frameworks (keep it simple)
- Don't remove the word count estimation logic
- Maintain Flask's simple structure (no blueprints needed yet)

## Current Limitations
- Stories saved locally only (no cloud sync)

---

# BACKLOG

## Priority 1: Backend Refactoring (Required before Android)
- [x] **Separate LLM configuration** - Extract prompts and LLM settings into `llm_config.py` ✓ DONE
- [x] **User Authentication** - Email/password auth with secure password hashing ✓ DONE
- [ ] **Split app.py into modules** - Separate concerns into individual files:
  - `db.py` - Database setup, connection helper, init_db()
  - `routes/auth.py` - Authentication routes (register, login)
  - `routes/stories.py` - Story routes (generate, save, my-stories, update-rating)
  - `routes/settings.py` - Settings routes (get/save settings)
  - `app.py` - Main Flask app setup, imports routes

## Priority 2: Core Features
- [x] **Settings Page** - User customizations including:
  - Default story duration
  - Child age (affects vocabulary and themes)
  - Story tone options: Funny, Soothing, Educational, Christian, Adventure, etc.
  - Preferred language
- [x] **Language via Translation API** - ✓ DONE (January 2026)
  - Stories always generated in English (simpler prompts, better quality)
  - Language preference moved to Settings page
  - Translation via Google AI Studio (Gemini 2.0 Flash)
  - Supports: English, Spanish, French, Portuguese, German, Italian
- [ ] **UI Polish** - Improve overall aesthetics of the web interface
- [ ] **Classic Tales Catalog** - JSON database of traditional stories:
  - Grimm's fairy tales
  - Aesop's fables
  - Classic bedtime stories
  - Searchable/browsable in-app

## Priority 3: Android App
- [ ] **Android Project Setup** - Create Kotlin Android project with Android Studio
- [ ] **API Client** - Connect Android app to Flask backend
- [ ] **Story Generation Screen** - Port story form to native Android UI
- [ ] **My Stories Screen** - View saved stories
- [ ] **Settings Screen** - User preferences
- [ ] **Play Store Preparation** - Icons, screenshots, listing

## Priority 4: Future Enhancements
- [ ] **Password Reset (Email-based)** - Forgot password flow with email service
- [ ] Cloud database for cross-device sync
- [ ] Character name customization
- [ ] Story illustrations (AI-generated)
- [ ] Voice narration (text-to-speech)
- [ ] Offline mode with cached stories
- [ ] Family accounts (multiple children profiles)

---

## Testing
- Manual testing in browser
- Test story generation (always in English first)
- Test translation to different languages
- Test all three story types
- Verify mobile responsiveness

## Environment Setup
```bash
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

## Common Tasks
- Run app: `python app.py`
- Install new package: `pip install <package>` then `pip freeze > requirements.txt`
- Access app: http://localhost:5000

## Notes for Claude Code
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made, be didactical as the user (although he knows how to code) is not a software engineer
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY
10. This is is not a prototype, although it is a simple app - prioritize functionality over perfection
11. Maintain the simple architecture unless explicitly asked to scale up
12. Always test that changes work with the Groq API integration