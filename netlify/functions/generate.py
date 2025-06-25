# Restore this code into netlify/functions/generate.py

import os
import openai
import json

# This is the main handler function that Netlify will run
def handler(event, context):
    # Only allow POST requests
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'body': 'Method Not Allowed'
        }

    try:
        # Get the initial niche_category from the frontend
        body = json.loads(event['body'])
        niche_category = body.get('niche_category')

        if not niche_category:
             return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Niche category is required'})
            }

        # Set up the OpenAI API key from environment variables
        openai.api_key = os.environ.get('OPENAI_API_KEY')

        # --- STEP 1: Run the first prompt to get Niche Titles ---
        prompt_1 = f"Create a list of niche titles in high-profit, high-demand markets following this framework: [WHAT] [JOINER] [WHO/WHERE]. Use 'for' or 'in' as the joiner, and consider using specific demographics or geographic markers (2 words max) that are well-suited to the \"{niche_category}\" niche. Display results in a numbered list with WHAT, WHO/WHERE in bold, and the JOINER in regular weight."

        first_completion = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a marketing expert specializing in identifying profitable niches."},
                {"role": "user", "content": prompt_1}
            ]
        )
        # Store the result of the first AI call
        niche_titles_result = first_completion.choices[0].message.content

        # --- STEP 2: Use the first result as input for the second prompt ---
        prompt_2 = f"Can you give me a list of ideal client avatars? My niche is \"{niche_category}\", and more specifically, it can be described by these generated titles: \"{niche_titles_result}\". Include plenty of detail such as name, age, gender, pains & problems, dreams & goals, profession, interests, marital/family status, employment status & income etc. Format the output clearly for each avatar."
        
        second_completion = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a market research expert who creates detailed customer personas."},
                {"role": "user", "content": prompt_2}
            ]
        )
        # Store the final result of the second AI call
        final_response = second_completion.choices[0].message.content
        
        # Return a successful response containing only the final result
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'response': final_response})
        }

    except Exception as e:
        # Return an error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }