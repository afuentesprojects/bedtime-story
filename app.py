from flask import Flask, render_template, request, jsonify
import os
import sqlite3
from groq import Groq
from dotenv import load_dotenv
from llm_config import MODEL_NAME, TEMPERATURE, MAX_TOKENS, SYSTEM_PROMPT, build_story_prompt
from auth import hash_password, verify_password, generate_token

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Database setup
DATABASE = 'stories.db'

def get_db():
    """Get database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def init_db():
    """Initialize the database with required tables."""
    conn = get_db()

    # Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            token TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Saved stories table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS saved_stories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT,
            story_text TEXT NOT NULL,
            story_type TEXT,
            language TEXT,
            length_minutes INTEGER,
            modifications TEXT,
            rating INTEGER CHECK(rating >= 1 AND rating <= 5),
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Migration: Add user_id column if updating from old schema
    try:
        conn.execute('ALTER TABLE saved_stories ADD COLUMN user_id INTEGER')
    except sqlite3.OperationalError:
        pass  # Column already exists

    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_story(story_type, length_minutes, language, modifications=""):
    """Generate a bedtime story using Groq API"""

    # Build prompt using config
    prompt = build_story_prompt(story_type, length_minutes, language, modifications)

    try:
        # Call Groq API with settings from llm_config
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            model=MODEL_NAME,
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
        )

        story = chat_completion.choices[0].message.content
        return {"success": True, "story": story}

    except Exception as e:
        return {"success": False, "error": str(e)}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json

    story_type = data.get('story_type')
    length = int(data.get('length', 5))
    language = data.get('language', 'English')
    modifications = data.get('modifications', '')

    result = generate_story(story_type, length, language, modifications)
    return jsonify(result)


# =============================================================================
# AUTHENTICATION ROUTES
# =============================================================================

@app.route('/register', methods=['POST'])
def register():
    """Register a new user with email and password."""
    data = request.json

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    display_name = data.get('display_name', '').strip()

    # Validation
    if not email or not password:
        return jsonify({"success": False, "error": "Email and password required"})

    if len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters"})

    try:
        conn = get_db()

        # Check if email already exists
        existing = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
        if existing:
            conn.close()
            return jsonify({"success": False, "error": "Email already registered"})

        # Create user with hashed password and token
        password_hash = hash_password(password)
        token = generate_token()

        conn.execute('''
            INSERT INTO users (email, password_hash, display_name, token)
            VALUES (?, ?, ?, ?)
        ''', (email, password_hash, display_name or email.split('@')[0], token))
        conn.commit()

        # Get the new user's ID
        user = conn.execute('SELECT id, display_name FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()

        return jsonify({
            "success": True,
            "user_id": user['id'],
            "display_name": user['display_name'],
            "token": token
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route('/login', methods=['POST'])
def login():
    """Login with email and password."""
    data = request.json

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password required"})

    try:
        conn = get_db()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

        if not user or not verify_password(password, user['password_hash']):
            conn.close()
            return jsonify({"success": False, "error": "Invalid email or password"})

        # Generate new token on login
        token = generate_token()
        conn.execute('UPDATE users SET token = ? WHERE id = ?', (token, user['id']))
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "user_id": user['id'],
            "display_name": user['display_name'],
            "token": token
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


# =============================================================================
# STORY ROUTES
# =============================================================================

@app.route('/save-story', methods=['POST'])
def save_story():
    """Save a story to the database. Requires authentication."""
    data = request.json

    user_id = data.get('user_id')
    token = data.get('token')
    title = data.get('title')
    story_text = data.get('story_text')
    rating = data.get('rating')

    if not user_id or not token or not story_text or not rating:
        return jsonify({"success": False, "error": "Missing required fields"})

    try:
        conn = get_db()

        # Verify token
        user = conn.execute('SELECT id FROM users WHERE id = ? AND token = ?', (user_id, token)).fetchone()
        if not user:
            conn.close()
            return jsonify({"success": False, "error": "Invalid authentication"})

        conn.execute('''
            INSERT INTO saved_stories (user_id, title, story_text, story_type, language, length_minutes, modifications, rating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            title,
            story_text,
            data.get('story_type'),
            data.get('language'),
            data.get('length_minutes'),
            data.get('modifications'),
            rating
        ))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/my-stories', methods=['GET'])
def my_stories():
    """Get all saved stories for a user. Requires authentication."""
    user_id = request.args.get('user_id')
    token = request.args.get('token')

    if not user_id or not token:
        return jsonify({"success": False, "error": "Authentication required"})

    try:
        conn = get_db()

        # Verify token
        user = conn.execute('SELECT id FROM users WHERE id = ? AND token = ?', (user_id, token)).fetchone()
        if not user:
            conn.close()
            return jsonify({"success": False, "error": "Invalid authentication"})

        stories = conn.execute(
            'SELECT * FROM saved_stories WHERE user_id = ? ORDER BY saved_at DESC',
            (user_id,)
        ).fetchall()
        conn.close()

        # Convert rows to dictionaries
        stories_list = [dict(story) for story in stories]
        return jsonify({"success": True, "stories": stories_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/update-rating', methods=['POST'])
def update_rating():
    """Update the rating of a saved story. Requires authentication."""
    data = request.json

    user_id = data.get('user_id')
    token = data.get('token')
    story_id = data.get('story_id')
    new_rating = data.get('rating')

    if not user_id or not token or not story_id or not new_rating:
        return jsonify({"success": False, "error": "Missing required fields"})

    try:
        conn = get_db()

        # Verify token and that story belongs to user
        user = conn.execute('SELECT id FROM users WHERE id = ? AND token = ?', (user_id, token)).fetchone()
        if not user:
            conn.close()
            return jsonify({"success": False, "error": "Invalid authentication"})

        conn.execute(
            'UPDATE saved_stories SET rating = ? WHERE id = ? AND user_id = ?',
            (new_rating, story_id, user_id)
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    # Check if API key is set
    if not os.environ.get("GROQ_API_KEY"):
        print("⚠️  WARNING: GROQ_API_KEY environment variable not set!")
        print("Get your free API key from: https://console.groq.com/")
        print("Set it with: export GROQ_API_KEY='your-key-here'")
    
    app.run(debug=True, port=5000)
