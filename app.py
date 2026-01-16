from flask import Flask, render_template, request, jsonify
import os
import sqlite3
from groq import Groq
from dotenv import load_dotenv

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
    conn.execute('''
        CREATE TABLE IF NOT EXISTS saved_stories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            title TEXT,
            story_text TEXT NOT NULL,
            story_type TEXT,
            language TEXT,
            length_minutes INTEGER,
            modifications TEXT,
            rating INTEGER CHECK(rating >= 1 AND rating <= 5),
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Add title column if it doesn't exist (for existing databases)
    try:
        conn.execute('ALTER TABLE saved_stories ADD COLUMN title TEXT')
    except sqlite3.OperationalError:
        pass  # Column already exists
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def estimate_words_from_minutes(minutes):
    """Estimate word count based on reading time (avg 180 words/min for children's stories)"""
    return int(minutes * 180)

def generate_story(story_type, length_minutes, language, modifications=""):
    """Generate a bedtime story using Groq API"""
    
    word_count = estimate_words_from_minutes(length_minutes)
    
    # Title instruction
    title_instruction_en = "Start with a creative title (less than 10 words) on its own line, then a blank line, then the story."
    title_instruction_es = "Comienza con un título creativo (menos de 10 palabras) en su propia línea, luego una línea en blanco, y después la historia."

    # Build the prompt based on story type and language
    if language == "Spanish":
        lang_instruction = "Escribe la historia completamente en español."
        if story_type == "made_up":
            prompt = f"{lang_instruction} {title_instruction_es} Crea una historia original para dormir de aproximadamente {word_count} palabras. Hazla mágica, relajante y apropiada para niños."
        elif story_type == "classic":
            prompt = f"{lang_instruction} {title_instruction_es} Cuenta una historia clásica para dormir (como Caperucita Roja, Los Tres Cerditos, etc.) en aproximadamente {word_count} palabras. Hazla apropiada para niños."
        else:  # mixed
            prompt = f"{lang_instruction} {title_instruction_es} Cuenta una historia clásica para dormir pero con estas modificaciones: {modifications}. La historia debe tener aproximadamente {word_count} palabras y ser apropiada para niños."
    else:  # English
        if story_type == "made_up":
            prompt = f"{title_instruction_en} Create an original bedtime story of approximately {word_count} words. Make it magical, soothing, and child-appropriate."
        elif story_type == "classic":
            prompt = f"{title_instruction_en} Tell a classic bedtime story (like Little Red Riding Hood, Three Little Pigs, etc.) in approximately {word_count} words. Make it child-appropriate."
        else:  # mixed
            prompt = f"{title_instruction_en} Tell a classic bedtime story but with these modifications: {modifications}. The story should be approximately {word_count} words and child-appropriate."
    
    try:
        # Call Groq API with Llama model
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative storyteller who writes engaging, soothing bedtime stories for children. Your stories are imaginative, age-appropriate for 4 to 10 year old, funny, and help children relax before sleep. Use simple vocabulary"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",  # Free lightweight model
            temperature=0.7,
            max_tokens=2048,
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

@app.route('/save-story', methods=['POST'])
def save_story():
    """Save a story to the database."""
    data = request.json

    username = data.get('username')
    title = data.get('title')
    story_text = data.get('story_text')
    rating = data.get('rating')

    if not username or not story_text or not rating:
        return jsonify({"success": False, "error": "Missing required fields"})

    try:
        conn = get_db()
        conn.execute('''
            INSERT INTO saved_stories (username, title, story_text, story_type, language, length_minutes, modifications, rating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            username,
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
    """Get all saved stories for a user."""
    username = request.args.get('username')

    if not username:
        return jsonify({"success": False, "error": "Username required"})

    try:
        conn = get_db()
        stories = conn.execute(
            'SELECT * FROM saved_stories WHERE username = ? ORDER BY saved_at DESC',
            (username,)
        ).fetchall()
        conn.close()

        # Convert rows to dictionaries
        stories_list = [dict(story) for story in stories]
        return jsonify({"success": True, "stories": stories_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/update-rating', methods=['POST'])
def update_rating():
    """Update the rating of a saved story."""
    data = request.json

    story_id = data.get('story_id')
    new_rating = data.get('rating')

    if not story_id or not new_rating:
        return jsonify({"success": False, "error": "Missing required fields"})

    try:
        conn = get_db()
        conn.execute(
            'UPDATE saved_stories SET rating = ? WHERE id = ?',
            (new_rating, story_id)
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
