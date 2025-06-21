# FINAL ATTEMPT: Complete code for backend/app.py with robust CORS configuration

import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS # We still need this import
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# --- ROBUST CORS CONFIGURATION ---
# This is the key change. We are explicitly telling CORS to handle all /api/ routes
# and allow all origins, which is standard for a public API.
CORS(app, resources={r"/api/*": {"origins": "*"}})

openai.api_key = os.getenv('OPENAI_API_KEY')

# --- HEALTH CHECK ENDPOINT ---
@app.route('/')
def index():
    return "Backend server is running!"

# --- We have removed the manual OPTIONS handling from all routes ---

# --- STEP 1: NICHE GENERATOR ---
@app.route('/api/generate-niche', methods=['POST'])
def generate_niche():
    data = request.json
    niche_category = data.get('niche_category')
    prompt = f"Create a list of niche titles in high-profit, high-demand markets following this framework: [WHAT] [JOINER] [WHO/WHERE]. Use 'for' or 'in' as the joiner, and consider using specific demographics or geographic markers (2 words max) that are well-suited to the \"{niche_category}\" niche. Display results in a numbered list with WHAT, WHO/WHERE in bold, and the JOINER in regular weight."
    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- STEP 3: OUTCOME GENERATOR ---
@app.route('/api/generate-outcome', methods=['POST'])
def generate_outcome():
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
@app.route('/api/generate-method', methods=['POST'])
def generate_method():
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
@app.route('/api/generate-stack', methods=['POST'])
def generate_stack():
    prompt = """With all this in mind, help me brainstorm a few 3-part-stacks for my offer. Choose a combination between these:

🟢 App ($7/m - $50/m)
🟢 Book ($10 - $60)
🟢 Paid Content ($10/m - $500/m)
🟢 Software ($20/m - $500/m)
🟢 Physical Product ($50+)
🟢 Course ($200 - $1,000)
🟠 Cheat Sheet ($20 - $100)
🟠 Swipe Files ($50 - $300)
🟠 Tools or Calculators ($50 - $1,000)
🟠 Templates ($50 - $500)
🟠 Scripts ($50 - $500)
🟠 Email Automations ($50 - $1,000)
🟠 Blueprints ($50 - $1,000)
🟠 Done For You Service ($100 - $5,000+)
🟠 Funnels & Web Pages ($300 - $2,000)
🔴 Challenge / Competition ($20 - $500/m)
🔴 Private Group ($50/m - $500/m)
🔴 Live Q&A ($50 - $200/m)
🔴 Accountability / Check In Calls ($100/h+)
🔴 Guest Expert Access ($100 - $1,000 per session)
🔴 1 on 1 Coaching ($200/hr - $1,000/hr)
🔴 Certification / License / Qualification ($500+)
🔴 Seminar ($2,000 - $6,000)
🔴 Retreat / Event / Experience ($2,000+)

Choose 3 inclusions from the above list for each possible value stack, one from each colour group where the legend is 🟢 Do it yourself, 🟠 Done with you, 🔴 Done for you.

Format the final list with the relevant coloured emoji's still attached. Remove the price guide that I've included from the list, and add your own value (a fixed number representing the value of the inclusion). Include a brief 1 sentence example for each inclusion to stimulate ideas. 

Also include ONE MORE of those as a conditional bonus where the condition is something like: Buy in the next 24 hours, Buy before <time/date>, Buy in January, If you’re among the first 20 to buy, Are joining for the first time, Next 50 sales only etc.

Give each stack its own unique name and put a total value at the bottom of each stack (including the conditional bonus). Please generate 3 different stacks.
"""
    try:
        completion = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
        return jsonify({'response': completion.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)