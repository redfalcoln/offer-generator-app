import React, { useState } from 'react';
import './App.css'; // Basic styling

function App() {
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      // This calls your backend API. Note the URL.
      const response = await fetch('https://my-offer-app.onrender.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the request.');
      }

      const data = await response.json();
      // We split the response string by '---' to get an array of choices
      setResults(data.response.split('---').map(item => item.trim()));

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Business Offer Generator</h1>
        <p>Describe your business or product, and we'll generate some headlines for you.</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., A project management tool for small creative teams..."
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Offers'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="results">
          {results.map((result, index) => (
            <div key={index} className="result-item">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;