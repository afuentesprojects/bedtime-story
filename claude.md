# Bedtime Story Generator - Project Context

## Project Overview
A web application that generates AI-powered bedtime stories for children of ages 4 -8 using the Groq API (Llama models). Users can customize story length, type, and language.

## Tech Stack
- **Backend:** Python 3.11, Flask 3.0.0
- **Frontend:** HTML, CSS, Vanilla JavaScript (no frameworks)
- **AI:** Groq API with Llama 3.3 70B model
- **Environment:** python-dotenv for API key management

## Project Structure
```
bedtime_story_app/
├── app.py              # Flask backend with API routes
├── templates/
│   └── index.html      # Frontend interface
├── static/
│   └── style.css       # Styling
├── .env                # API keys (gitignored, not to be modified)
├── requirements.txt    # Python dependencies
└── venv/               # Virtual environment
```

## Key Features
1. **Story Length:** 1-10 minutes reading time (converted to ~180 words/min)
2. **Story Types:**
   - Made Up: Original stories
   - Classic: Traditional tales
   - Mixed: Classic with user modifications
3. **Languages:** English, Spanish
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
- Groq API key stored in .env file
- Model: `llama-3.3-70b-versatile`
- Temperature: 0.7 for creative stories
- Max tokens: 2048

### What NOT to Change
- Don't modify `.env` file
- Don't add complex frameworks (keep it simple)
- Don't remove the word count estimation logic
- Maintain Flask's simple structure (no blueprints needed yet)

## Current Limitations & Future Ideas
- No database yet (stories aren't saved)
- No user authentication
- No story history
- Could add: themes, character names, illustrations, voice narration

## Testing
- Manual testing in browser
- Test both English and Spanish generation
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
10. This is a prototype/MVP - prioritize functionality over perfection
11. Maintain the simple architecture unless explicitly asked to scale up
12. Always test that changes work with the Groq API integration