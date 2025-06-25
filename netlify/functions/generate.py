# FINAL code for netlify/functions/generate.py

import os
import openai
import json

def handler(event, context):
    if event['httpMethod'] != 'POST':
        return {'statusCode': 405, 'body': 'Method Not Allowed'}

    try:
        body = json.loads(event['body'])
        step_name = body.get('stepName')
        data = body.get('data', {})
        
        openai.api_key = os.environ.get('OPENAI_API_KEY')
        prompt = ""

        # --- Router to select the correct prompt based on the step name ---
        if step_name == 'niche':
            prompt = f"Create a list of niche titles in high-profit, high-demand markets following this framework: [WHAT] [JOINER] [WHO/WHERE]. Use 'for' or 'in' as the joiner, and consider using specific demographics or geographic markers (2 words max) that are well-suited to the \"{data.get('niche_category')}\" niche. Display results in a numbered list with WHAT, WHO/WHERE in bold, and the JOINER in regular weight."

        elif step_name == 'avatar':
            prompt = f"Can you give me a list of ideal client avatars? My niche is '{data.get('niche_category')}', and more specifically it relates to these topics: '{data.get('niche_titles')}'. Include plenty of detail such as name, age, gender, pains & problems, dreams & goals, profession, interests, marital/family status, employment status & income etc."
        
        elif step_name == 'outcome':
            prompt = f"Can you write a list of highly desirable outcomes that would serve as the foundation for a profitable product... I’m in the industry of {data.get('niche_category')} and my niche is {data.get('niche_titles')}. Please generate a list of highly desirable outcomes that people would pay for in this niche."

        elif step_name == 'method':
            prompt = f"I need your help developing strategies to make my process and product more unique and compelling... For your information, I’m in the industry of {data.get('niche_category')}, my niche is {data.get('niche_titles')}, and the primary outcome our clients achieve from our product is {data.get('primary_outcome')}. Go ahead and propose specific strategies to make my process more prolific."

        elif step_name == 'objections':
            prompt = f"Can you help me produce a list of the most prominent objections I’m likely to face from my avatar with this product? Specifically I want you to focus on 4 areas of objections - ⏰ time based, 💪 effort based, 💵 money based and 🤷‍♂️ belief based. My industry is: {data.get('niche_category')}. My niche is: {data.get('niche_titles')}. My avatar is: {data.get('avatar_details')}. The outcome of my product is: {data.get('primary_outcome')}. For each individual objection you come up with, I also want you to suggest one or more solutions. Display all the results in a 2 column table with objections on one side and solutions on the other."

        elif step_name == 'inclusions':
            prompt = f"With all this in mind, help me brainstorm a few 3-part-stacks for my offer. Choose a combination between these: 🟢 App, 🟢 Book, 🟢 Paid Content, 🟢 Software, 🟢 Physical Product, 🟢 Course, 🟠 Cheat Sheet, 🟠 Swipe Files, 🟠 Tools or Calculators, 🟠 Templates, 🟠 Scripts, 🟠 Email Automations, 🟠 Blueprints, 🟠 Done For You Service, 🟠 Funnels & Web Pages, 🔴 Challenge / Competition, 🔴 Private Group, 🔴 Live Q&A, 🔴 Accountability / Check In Calls, 🔴 Guest Expert Access, 🔴 1 on 1 Coaching, 🔴 Certification / License / Qualification, 🔴 Seminar, 🔴 Retreat / Event / Experience. Choose 3 inclusions from the above list for each possible value stack, one from each colour group where the legend is 🟢 Do it yourself, 🟠 Done with you, 🔴 Done for you. Format the final list with the relevant coloured emoji's still attached. Add your own value (a fixed number representing the value of the inclusion). Include a brief 1 sentence example for each inclusion. Also include a ONE MORE of those as a conditional bonus with a condition like 'Buy in the next 24 hours'. Give each stack its own unique name and put a total value at the bottom of each stack (including the conditional bonus). Generate 3 different stacks."

        elif step_name == 'guarantee':
            prompt = f"Please help me come up with a bold claim guarantee to improve my conversions... My industry is: {data.get('niche_category')}. My niche is: {data.get('niche_titles')}. My avatar is: {data.get('avatar_details')}. The outcome of my product is: {data.get('primary_outcome')}. I anticipate my objections will be: {data.get('objections')}. Please give me a list of compelling promises I could make. Also write a list of powerful names for the guarantee that are unique and interesting (not just a generic 30 day satisfaction guarantee)."

        elif step_name == 'price':
            prompt = f"Please help me come up with some potential pricing options for my offer. To do this, I want you to create 2 lists: 1) 'To make $50,000 per month with a one-time payment:' and 2) 'To make $50,000 per month with a subscription:' Then for each list, suggest various price points sorted high to low, and write a concise statement for each price point that results in $50,000/month total, using this exact format: 'You need to make X sales per month at $X', or 'You need X subscribers paying you $X/m' for the respective lists, use bold on the amounts. The highest priced option for each list should be equal to or less than the total value of my stack, which is {data.get('stack_value')}. The offer I’m building is a: {data.get('offer_type')}. Write a brief introduction and summary."
        
        elif step_name == 'name':
            prompt = f"Please help me come up with a compelling name for my {data.get('offer_type')}. I want a list of >=10 potential names in each of the following 5 categories: names derived from my niche, outcome, method, miscellaneous/other, and then finally a category of new single words made from blending 2 existing words that are relevant to my product. My niche is: {data.get('niche_titles')}. The primary outcome I help clients achieve is: {data.get('primary_outcome')}. My method for doing that is: {data.get('method_details')}. My guarantee is: {data.get('guarantee_details')}."

        else:
            return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid step name provided.'})}

        completion = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        ai_response = completion.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'response': ai_response})
        }

    except Exception as e:
        return { 'statusCode': 500, 'body': json.dumps({'error': str(e)}) }