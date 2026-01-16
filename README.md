# Bedtime Story Generator

A simple web application that generates bedtime stories using AI. Built with Flask, HTML, CSS, and the Groq API (free lightweight LLM).

## Features

- **Adjustable Length**: Choose reading time from 1-30 minutes
- **Three Story Types**:
  - 100% Made Up: Completely original stories
  - Classic: Traditional bedtime stories
  - Mixed: Classic stories with custom modifications
- **Bilingual Support**: English and Spanish
- **Free AI Model**: Uses Groq's free API with Llama models

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd bedtime_story_app
pip install -r requirements.txt
```

### 2. Get a Free Groq API Key

1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### 3. Set Environment Variable

**On Mac/Linux:**
```bash
export GROQ_API_KEY='your-api-key-here'
```

**On Windows (Command Prompt):**
```cmd
set GROQ_API_KEY=your-api-key-here
```

**On Windows (PowerShell):**
```powershell
$env:GROQ_API_KEY='your-api-key-here'
```

### 4. Run the Application

```bash
python app.py
```

### 5. Open in Browser

Navigate to: [http://localhost:5000](http://localhost:5000)

## Usage

1. **Set Reading Time**: Choose how long you want the story to be (in minutes)
2. **Select Story Type**: 
   - Made Up: Get a completely original story
   - Classic: Get a traditional bedtime story
   - Mixed: Get a classic story with your own twist (requires modifications input)
3. **Choose Language**: English or Spanish
4. **Generate**: Click the button and wait for your story!

## Project Structure

```
bedtime_story_app/
├── app.py              # Flask backend
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html     # Frontend HTML
└── static/
    └── style.css      # Styling
```

## Technologies Used

- **Backend**: Python with Flask
- **Frontend**: HTML, CSS, JavaScript
- **AI Model**: Groq API (Llama 3.3 70B)

## Notes

- The Groq API has a generous free tier
- Stories are generated in real-time (usually takes 5-15 seconds)
- Word count is estimated at ~200 words per minute of reading time

## Troubleshooting

**API Key Error**: Make sure you've set the GROQ_API_KEY environment variable correctly

**Connection Error**: Check your internet connection and ensure the Groq API is accessible

**Dependencies Error**: Make sure all packages are installed with `pip install -r requirements.txt`

## Future Improvements

- Add character customization
- Include story themes/genres
- Save favorite stories
- Add illustrations (image generation)
- Voice narration
- More languages

## License

MIT License - Feel free to use and modify!
