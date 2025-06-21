// Complete code for frontend/src/App.js

import React, { useState } from 'react';
import './App.css';

const App = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [inputs, setInputs] = useState({ niche_category: "💵 Wealth > Protecting & saving money" });
    const [results, setResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setCurrentStep(prev => prev + 1);
    };

    const handleApiSubmit = async (e, step, endpoint, body) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`https://my-offer-app-backend.onrender.com${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResults(prev => ({ ...prev, [`step${step}_result`]: data.response }));
            setCurrentStep(step + 1);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderResult = (step, title) => {
        const result = results[`step${step}_result`];
        return result && (
            <div className="summary-item">
                <h4>{title}</h4>
                <pre>{result}</pre>
            </div>
        );
    };

     const renderInput = (name, title) => {
        const input = inputs[name];
        return input && (
             <div className="summary-item">
                <h4>{title}</h4>
                <p>{input}</p>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="container">
                <h1>Create Your Offer</h1>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(currentStep -1) / 6 * 100}%` }}></div>
                </div>

                {/* --- Display previous inputs and results --- */}
                <div className="summary-container">
                    {renderInput('niche_category', 'Niche Category')}
                    {renderResult(1, 'Generated Niches')}
                    {renderInput('avatar', 'Your Avatar/Niche')}
                    {renderResult(3, 'Generated Outcomes')}
                    {renderInput('method_notes', 'Your Method Notes')}
                    {renderResult(4, 'Generated Method Ideas')}
                    {renderInput('objections', 'Your Customer Objections')}
                    {renderResult(6, 'Generated Offer Stacks')}
                </div>
                
                <div className="step-container">
                    {/* --- STEP 1: NICHE --- */}
                    {currentStep === 1 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 1, '/api/generate-niche', { niche_category: inputs.niche_category })}>
                            <h2>Step 1: Generate Niche Titles</h2>
                            <p>Select your high-level niche category below. We've pre-selected it based on your sheet.</p>
                            <select name="niche_category" value={inputs.niche_category} onChange={handleInputChange}>
                                <option value="💵 Wealth > Protecting & saving money">💵 Wealth > Protecting & saving money</option>
                                <option value="ጤ Health > Losing weight">ጤ Health > Losing weight</option>
                                <option value="❤️ Relationships > Finding a partner">❤️ Relationships > Finding a partner</option>
                            </select>
                            <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Niches'}</button>
                        </form>
                    )}
                    
                    {/* --- STEP 2: AVATAR (Manual) --- */}
                    {currentStep === 2 && (
                        <form onSubmit={handleNextStep}>
                            <h2>Step 2: Describe Your Avatar</h2>
                            <p>Who is your ideal customer? Be specific. This will be used in the next steps.</p>
                            <textarea name="avatar" onChange={handleInputChange} placeholder="e.g., Early-career software developers in their late 20s who want to start investing but are overwhelmed by options." required />
                            <button type="submit">Next Step</button>
                        </form>
                    )}

                    {/* --- STEP 3: OUTCOME --- */}
                    {currentStep === 3 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 3, '/api/generate-outcome', { industry: inputs.niche_category, niche_avatar: inputs.avatar })}>
                             <h2>Step 3: Generate Desirable Outcomes</h2>
                             <p>Click below to generate a list of powerful outcomes your customers would pay for.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Outcomes'}</button>
                        </form>
                    )}

                    {/* --- STEP 4: METHOD --- */}
                    {currentStep === 4 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 4, '/api/generate-method', { industry: inputs.niche_category, niche_avatar: inputs.avatar, primary_outcome: results.step3_result })}>
                             <h2>Step 4: Create a Unique Method</h2>
                             <p>Now let's brainstorm a unique name and process for your offer to make it stand out.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Method Ideas'}</button>
                        </form>
                    )}

                     {/* --- STEP 5: OBJECTIONS (Manual) --- */}
                    {currentStep === 5 && (
                        <form onSubmit={handleNextStep}>
                            <h2>Step 5: Brainstorm Customer Objections</h2>
                            <p>What are the top 3-5 reasons a customer might hesitate to buy your offer?</p>
                            <textarea name="objections" onChange={handleInputChange} placeholder="e.g., 1. It's too expensive. 2. I don't have time. 3. I'm not sure it will work for me." required />
                            <button type="submit">Next Step</button>
                        </form>
                    )}

                     {/* --- STEP 6: OFFER STACK --- */}
                    {currentStep === 6 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 6, '/api/generate-stack', {})}>
                             <h2>Step 6: Build Your Value Stack</h2>
                             <p>Let's generate some compelling offer stacks to maximize value.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Stacks'}</button>
                        </form>
                    )}

                    {/* --- STEP 7: FINALIZE (Manual) --- */}
                    {currentStep === 7 && (
                        <form onSubmit={(e) => { e.preventDefault(); alert("Offer Created!"); }}>
                            <h2>Step 7: Finalize Offer Details</h2>
                            <p>Fill in the remaining details for your offer.</p>
                            <div className="final-inputs">
                                <label>Guarantee Name & Promise</label>
                                <input name="guarantee" onChange={handleInputChange} type="text" placeholder="e.g., The 'Profit Path' 30-Day Guarantee" />
                                <label>Scarcity Tactic</label>
                                <input name="scarcity" onChange={handleInputChange} type="text" placeholder="e.g., Only 50 spots available this quarter" />
                                <label>Urgency Tactic</label>
                                <input name="urgency" onChange={handleInputChange} type="text" placeholder="e.g., Enrollment closes Friday at midnight" />
                                <label>Final Price</label>
                                <input name="price" onChange={handleInputChange} type="text" placeholder="e.g., $997" />
                            </div>
                            <button type="submit">Complete Offer</button>
                        </form>
                    )}

                </div>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default App;