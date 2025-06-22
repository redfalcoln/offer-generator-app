# Final code for backend/app.py for DigitalOcean/Heroku
import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    return "Backend server is running!"

@app.route('/api/generate-niche-titles', methods=['POST'])
def generate_niche_titles():
    data = request.json
    niche_category = data.get('niche_category')
    if not niche_category:
        return jsonify({'error': 'Niche category is required'}), 400
    prompt = f"Create a list of niche titles... suited to the \"{niche_category}\" niche..." # Keeping this short for readability
    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add other endpoints here if needed in the future

if __name__ == '__main__':
    app.run(port=8080)