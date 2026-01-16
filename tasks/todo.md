# Task: User Authentication (Email + Password)

## Goal
Replace the simple username-only system with proper email + password authentication.

## Todo Items
- [x] Create `auth.py` with password hashing and user functions
- [x] Add `users` table to database
- [x] Add `/register` and `/login` endpoints to `app.py`
- [x] Update `saved_stories` to use `user_id` instead of `username`
- [x] Update frontend with Login/Register forms
- [x] Test authentication flow
- [x] Update CLAUDE.md backlog

## Review

### What Changed

**1. Created `auth.py`**
A new file with three simple functions:
- `hash_password()` - Securely hashes passwords using werkzeug (scrypt algorithm)
- `verify_password()` - Checks if a password matches its hash
- `generate_token()` - Creates random 64-character session tokens

**2. Updated `app.py`**
- Added `users` table with: id, email, password_hash, display_name, token, created_at
- Changed `saved_stories` table to use `user_id` instead of `username`
- Added `/register` endpoint - creates account, returns user_id + token
- Added `/login` endpoint - verifies password, returns user_id + token
- Updated `/save-story`, `/my-stories`, `/update-rating` to require token auth

**3. Updated `index.html`**
- Replaced simple username input with Login/Register forms
- Login form: email + password fields
- Register form: display name + email + password fields
- Toggle between login and register views
- All API calls now include `user_id` and `token`
- Stores `user_id`, `token`, `display_name` in localStorage (not just username)

**4. Updated `style.css`**
- Added styles for auth forms
- Added `.secondary-btn` for the "Create Account" / "Back to Login" buttons
- Added `.auth-error` for error messages

### How It Works

1. **Registration:**
   - User enters email, password, (optional) display name
   - Backend hashes password with scrypt, generates random token
   - Returns user_id + token to frontend
   - Frontend stores in localStorage

2. **Login:**
   - User enters email + password
   - Backend verifies password against stored hash
   - Generates new token (for security)
   - Returns user_id + token

3. **Protected Routes:**
   - All story-related routes require `user_id` and `token`
   - Backend verifies token matches what's stored for that user
   - Only allows access to user's own stories

### Security Features
- Passwords hashed with scrypt (via werkzeug) - never stored in plain text
- Session tokens are 64 random hex characters
- New token generated on each login
- Stories linked to user_id, can't access other users' stories

### Files Changed
| File | Change |
|------|--------|
| `auth.py` | Created (new file) |
| `app.py` | Added auth endpoints + updated story routes |
| `templates/index.html` | Login/Register UI + token-based API calls |
| `static/style.css` | Auth form styling |
| `CLAUDE.md` | Updated project structure and backlog |

### Database Schema Changes
Old `saved_stories` table had `username` column.
New schema:
- `users` table: id, email, password_hash, display_name, token, created_at
- `saved_stories` table: user_id (foreign key) instead of username
