import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables (your API key)
load_dotenv()

# Setup Flask App
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# Configure OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

# This is the main endpoint your frontend will call
@app.route('/api/generate', methods=['POST'])
def generate_offer():
    # Get the data sent from the frontend
    data = request.json
    user_input = data.get('userInput')

    if not user_input:
        return jsonify({'error': 'No input provided'}), 400

    try:
        # This is where you construct the powerful prompt from your spreadsheet
        # We are combining a predefined instruction with the user's specific input
        system_prompt = "You are an expert business coach. Based on the user's input, generate three distinct and compelling business offer headlines. Return them as a single string, with each headline separated by the '---' characters."

        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo", # Or "gpt-4" for higher quality
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )

        # Extract the text content from the response
        ai_response = completion.choices[0].message.content

        # Send the AI's response back to the frontend
        return jsonify({'response': ai_response})

    except Exception as e:
        # Handle potential errors from the API call
        return jsonify({'error': str(e)}), 500

# A simple test route to make sure the server is running
@app.route('/')
def index():
    return "Backend server is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Runs the server on port 5001