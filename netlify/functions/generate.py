# FINAL code for netlify/functions/generate.py

import os
import openai
import json

# This is the main handler function that Netlify will run
def handler(event, context):
    if event['httpMethod'] != 'POST':
        return {'statusCode': 405, 'body': 'Method Not Allowed'}

    try:
        body = json.loads(event['body'])
        niche_category = body.get('niche_category') # This is your "B2" value from the dropdown

        if not niche_category:
             return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Niche category is required'})
            }

        openai.api_key = os.environ.get('OPENAI_API_KEY')

        # --- AI Call #1: Generate Niche Titles ---
        prompt_1 = f"Create a list of niche titles in high-profit, high-demand markets following this framework: [WHAT] [JOINER] [WHO/WHERE]. Use 'for' or 'in' as the joiner, and consider using specific demographics or geographic markers (2 words max) that are well-suited to the \"{niche_category}\" niche. Display results in a numbered list with WHAT, WHO/WHERE in bold, and the JOINER in regular weight."
        
        first_completion = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt_1}]
        )
        # This is your "A2" variable, storing the result from the first call
        niche_titles_result = first_completion.choices[0].message.content

        # --- AI Call #2: Generate Avatars using the result from the first call ---
        # This prompt uses both the original niche (B2) and the result of the first prompt (A2/B3)
        prompt_2 = f"Can you give me a list of ideal client avatars? My niche is \"{niche_category}\", and more specifically it relates to these topics: \"{niche_titles_result}\". Include plenty of detail such as name, age, gender, pains & problems, dreams & goals, profession, interests, marital/family status, employment status & income etc."
        
        second_completion = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt_2}]
        )
        # This is the final result we will show the user
        final_response = second_completion.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'response': final_response})
        }

    except Exception as e:
        return { 'statusCode': 500, 'body': json.dumps({'error': str(e)}) }