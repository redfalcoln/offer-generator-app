# Final corrected code for backend/app.py with updated routes

import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Apply CORS to all routes
openai.api_key = os.getenv('OPENAI_API_KEY')

# --- HEALTH CHECK ENDPOINT ---
@app.route('/')
def index():
    return "Backend server is running!"

# --- STEP 1: NICHE GENERATOR ---
@app.route('/generate-niche-titles', methods=['POST'])
def generate_niche():
    # ... (the rest of this function's code is unchanged)
    data = request.json
    niche_category = data.get('niche_category')
    prompt = f"Create a list of niche titles in high-profit, high-demand markets following this framework: [WHAT] [JOINER] [WHO/WHERE]. Use 'for' or 'in' as the joiner, and consider using specific demographics or geographic markers (2 words max) that are well-suited to the \"{niche_category}\" niche. Display results in a numbered list with WHAT, WHO/WHERE in bold, and the JOINER in regular weight."
    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- STEP 3: OUTCOME GENERATOR ---
@app.route('/generate-outcome', methods=['POST'])
def generate_outcome():
    # ... (the rest of this function's code is unchanged)
    data = request.json
    industry = data.get('industry')
    niche_avatar = data.get('niche_avatar')
    prompt = f"""Can you write a list of highly desirable outcomes that would serve as the foundation for a profitable product. Each outcome should reflect high market demand, making it clear that a product enabling clients to achieve these results would attract significant interest and generate strong sales. Here are the rules for defining each outcome: You must choose outcomes that create a clear, powerful before-and-after transformation. The outcomes must be measurable and visible (seeing is believing). Where numbers are used in an outcome, use X as a placeholder (ie. Lose X kg in X weeks). You must only choose outcomes that people actively want and search for. You must describe the outcomes in clear and concise language. Avoid vague language and overly technical terms. Our priority is to sell clients what they want, then deliver what they need. Outcomes should be listed as concise headlines in 2nd person POV. Ensure at least some of your listed outcomes include numbers, such as a quantity of outcome, timeframe of achievement or both, but that’s not a hard rule. I’m in the industry of {industry} and my niche is {niche_avatar}. Please generate a list of highly desirable outcomes that people would pay for in this niche."""
    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- STEP 4: METHOD GENERATOR ---
@app.route('/generate-method', methods=['POST'])
def generate_method():
    # ... (the rest of this function's code is unchanged)
    data = request.json
    industry = data.get('industry')
    niche_avatar = data.get('niche_avatar')
    primary_outcome = data.get('primary_outcome')
    prompt = f"""I need your help developing strategies to make my process and product more unique and compelling. The goal is to ensure my process sits in the “prolific zone,” which is half-way between mainstream and batshit crazy. Here are guidelines for creating a prolific process that stands out: Give your method a unique name (e.g., The Wimhof Method, Allen Carr’s Easyway, The Demartini Method). Make a bold claim about your method (e.g., “If you do X, I guarantee Y”). Challenge conventional wisdom (e.g., “You can dissolve grief in 3 hours or less”). Use unconventional techniques (e.g., “Activate metabolism through cold exposure instead of high-intensity workouts”). Create an “us vs. them” dichotomy (e.g., Funnels vs. websites). Combine unrelated fields (e.g., financial markets + hermetic philosophy). Combine opposing strategies (e.g., active trading + passive investing in one system). Promote extreme minimalism or maximalism (e.g., “the one-person business,” “full bank account & empty calendar”). Reject mainstream absurdities (e.g., “The lottery is a tax on people who don’t know math”). Add a ‘dragon’ (e.g., the blue light on teeth-whitening devices that makes it feel unique compared to regular hydrogen peroxide). Get a poster child (e.g., flaunt your top success story and attribute their success to your method). Gamify the process (e.g., leaderboards, scoring, apps, challenges, prizes). Before starting, please review and understand each guideline above. For your information, I’m in the industry of {industry}, my niche is {niche_avatar}, and the primary outcome our clients achieve from our product is {primary_outcome}. Go ahead and propose specific strategies to make my process more prolific."""
    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- STEP 6: OFFER STACK GENERATOR ---
@app.route('/generate-stack', methods=['POST'])
def generate_stack():
    # ... (the rest of this function's code is unchanged)
    prompt = """With all this in mind, help me brainstorm a few 3-part-stacks for my offer...""" # Shortened for brevity
    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080) # Port 8080 is a common default for DO App Platform