// FINAL code for frontend/src/App.js

import React, { useState } from 'react';
import './App.css';

const nicheOptions = [
  "💵 Wealth > Making Money",
  "💵 Wealth > Growing money",
  "💵 Wealth > Protecting & saving money",
  "💪 Health > Improving beauty & appearance",
  "💪 Health > Improving performance",
  "💪 Health > Reducing pain, discomfort & disease",
  "❤️ Relationships > Getting into one",
  "❤️ Relationships > Improving one",
  "❤️ Relationships > Getting out of one",
  "🕹️ Entertainment > Hobby/interest",
  "🕹️ Entertainment > Movies/games",
  "🕹️ Entertainment > Personal/adult/comedy",
];

const App = () => {
    const [selectedNiche, setSelectedNiche] = useState(nicheOptions[0]);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult('');

        try {
            // This is the new, simplified URL.
            const response = await fetch('https://YOUR_DIGITALOCEAN_URL_GOES_HERE/api/generate-niche-titles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ niche_category: selectedNiche }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            
            setResult(data.response);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <div className="container">
                <h1>Create Your Offer</h1>
                <div className="step-container">
                  <h2>Step 1: Niche</h2>
                  <form onSubmit={handleSubmit}>
                      <p>Select your Niche from the list below. This will use the corresponding prompt to generate titles.</p>
                      <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)}>
                          {nicheOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                          ))}
                      </select>
                      <button type="submit" disabled={isLoading}>
                          {isLoading ? 'Generating...' : 'Generate Niche Titles'}
                      </button>
                  </form>
                </div>
                <div className="step-container">
                    <h2>Step 2: Avatar</h2>
                    <p>The AI-generated Niche Titles will appear below. You can then define your Avatar based on these ideas.</p>
                    <div className="result-box">
                        {isLoading && <p className="loading-text">Generating, please wait...</p>}
                        {error && <div className="error">{error}</div>}
                        {result && <pre>{result}</pre>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;