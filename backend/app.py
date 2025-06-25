# FINAL Production code for backend/app.py
import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
# This explicit CORS configuration is the key to making it work
CORS(app, resources={r"/api/*": {"origins": "*"}})
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    return "Backend server is running!"

@app.route('/api/generate', methods=['POST'])
def generate_step():
    data = request.json
    step_name = data.get('stepName')
    step_data = data.get('data', {})
    prompt = ""

    if step_name == 'niche':
        prompt = f"Create a list of niche titles... suited to the \"{step_data.get('niche_category')}\" niche..."
    elif step_name == 'avatar':
        prompt = f"Can you give me a list of ideal client avatars? My niche is '{step_data.get('niche_category')}', and more specifically it relates to these topics: '{step_data.get('niche_titles')}'..."
    elif step_name == 'outcome':
        prompt = f"Can you write a list of highly desirable outcomes... I’m in the industry of {step_data.get('niche_category')} and my niche is {step_data.get('niche_titles')}..."
    elif step_name == 'method':
        prompt = f"I need your help developing strategies to make my process more unique... I’m in the industry of {step_data.get('niche_category')}, my niche is {step_data.get('niche_titles')}, and the primary outcome is {step_data.get('primary_outcome')}..."
    elif step_name == 'objections':
        prompt = f"Can you help me produce a list of the most prominent objections... My industry is: {step_data.get('niche_category')}. My niche is: {step_data.get('niche_titles')}. My avatar is: {step_data.get('avatar_details')}. The outcome is: {step_data.get('primary_outcome')}..."
    elif step_name == 'inclusions':
        prompt = "With all this in mind, help me brainstorm a few 3-part-stacks for my offer..."
    elif step_name == 'guarantee':
        prompt = f"Please help me come up with a bold claim guarantee... My industry is: {step_data.get('niche_category')}. My niche is: {step_data.get('niche_titles')}. My avatar is: {step_data.get('avatar_details')}. The outcome is: {step_data.get('primary_outcome')}. I anticipate my objections will be: {step_data.get('objections')}..."
    elif step_name == 'price':
        prompt = f"Please help me come up with some potential pricing options... the total value of my stack, which is {step_data.get('stack_value')}. The offer I’m building is a: {step_data.get('offer_type')}..."
    elif step_name == 'name':
        prompt = f"Please help me come up with a compelling name for my {step_data.get('offer_type')}... My niche is: {step_data.get('niche_titles')}. The outcome is: {step_data.get('primary_outcome')}. My method is: {step_data.get('method_details')}. My guarantee is: {step_data.get('guarantee_details')}..."
    else:
        return jsonify({'error': 'Invalid step name provided.'}), 400

    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)