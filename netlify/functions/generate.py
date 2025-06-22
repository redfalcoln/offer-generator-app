# Code for netlify/functions/generate.py with faster model

import os
import openai
import json

def handler(event, context):
    if event['httpMethod'] != 'POST':
        return {'statusCode': 405, 'body': 'Method Not Allowed'}

    try:
        body = json.loads(event['body'])
        niche_category = body.get('niche_category')

        if not niche_category:
             return {'statusCode': 400, 'body': json.dumps({'error': 'Niche category is required'})}

        openai.api_key = os.environ.get('OPENAI_API_KEY')

        prompt = f"Create a list of niche titles in high-profit, high-demand markets following this framework: [WHAT] [JOINER] [WHO/WHERE]. Use 'for' or 'in' as the joiner, and consider using specific demographics or geographic markers (2 words max) that are well-suited to the \"{niche_category}\" niche. Display results in a numbered list with WHAT, WHO/WHERE in bold, and the JOINER in regular weight."

        completion = openai.chat.completions.create(
            # --- THE ONLY CHANGE IS ON THIS LINE ---
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": "You are a marketing expert specializing in identifying profitable niches."},
                {"role": "user", "content": prompt}
            ]
        )
        ai_response = completion.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'response': ai_response})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }