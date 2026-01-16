from flask import Flask, render_template, request, jsonify
import os
from groq import Groq

app = Flask(__name__)

# Initialize Groq client
# Get your free API key from: https://console.groq.com/
# Set it as an environment variable: export GROQ_API_KEY='your-key-here'
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def estimate_words_from_minutes(minutes):
    """Estimate word count based on reading time (avg 200-250 words/min for children's stories)"""
    return int(minutes * 200)

def generate_story(story_type, length_minutes, language, modifications=""):
    """Generate a bedtime story using Groq API"""
    
    word_count = estimate_words_from_minutes(length_minutes)
    
    # Build the prompt based on story type and language
    if language == "Spanish":
        lang_instruction = "Escribe la historia completamente en español."
        if story_type == "made_up":
            prompt = f"{lang_instruction} Crea una historia original para dormir de aproximadamente {word_count} palabras. Hazla mágica, relajante y apropiada para niños."
        elif story_type == "classic":
            prompt = f"{lang_instruction} Cuenta una historia clásica para dormir (como Caperucita Roja, Los Tres Cerditos, etc.) en aproximadamente {word_count} palabras. Hazla apropiada para niños."
        else:  # mixed
            prompt = f"{lang_instruction} Cuenta una historia clásica para dormir pero con estas modificaciones: {modifications}. La historia debe tener aproximadamente {word_count} palabras y ser apropiada para niños."
    else:  # English
        if story_type == "made_up":
            prompt = f"Create an original bedtime story of approximately {word_count} words. Make it magical, soothing, and child-appropriate."
        elif story_type == "classic":
            prompt = f"Tell a classic bedtime story (like Little Red Riding Hood, Three Little Pigs, etc.) in approximately {word_count} words. Make it child-appropriate."
        else:  # mixed
            prompt = f"Tell a classic bedtime story but with these modifications: {modifications}. The story should be approximately {word_count} words and child-appropriate."
    
    try:
        # Call Groq API with Llama model
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative storyteller who writes engaging, soothing bedtime stories for children. Your stories are imaginative, age-appropriate, and help children relax before sleep."
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

if __name__ == '__main__':
    # Check if API key is set
    if not os.environ.get("GROQ_API_KEY"):
        print("⚠️  WARNING: GROQ_API_KEY environment variable not set!")
        print("Get your free API key from: https://console.groq.com/")
        print("Set it with: export GROQ_API_KEY='your-key-here'")
    
    app.run(debug=True, port=5000)
