// FINAL code for frontend/src/App.js with step debugger

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
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({ niche_category: nicheOptions[1] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApiSubmit = async (e, stepName, data) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            // NOTE: Ensure your DigitalOcean backend URL is correct
            const response = await fetch('https://coral-app-rbtwz-backend.ondigitalocean.app/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stepName, data }),
            });
            const result = await response.json();
            if (!response.ok || result.error) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }
            
            setFormData(prev => ({ ...prev, [stepName]: result.response }));
            setCurrentStep(prev => prev + 1);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderResult = (name, title) => {
        return formData[name] && (
            <div className="summary-item">
                <h4>{title}</h4>
                <pre>{formData[name]}</pre>
            </div>
        );
    };

     const renderInput = (name, title) => {
        return formData[name] && (
             <div className="summary-item">
                <h4>{title}</h4>
                <p>{formData[name]}</p>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="container">
                <h1>Create Your Offer</h1>

                {/* --- THIS IS THE NEW DEBUGGER BOX --- */}
                <div className="debugger">
                  <p>DEBUGGER: The current step is {currentStep}</p>
                </div>

                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(currentStep -1) / 10 * 100}%` }}></div>
                </div>

                <div className="summary-container">
                    <h3>Your Offer So Far...</h3>
                    {renderInput('niche_category', 'Niche Category')}
                    {renderResult('niche', 'Generated Niches')}
                    {renderResult('avatar', 'Generated Avatars')}
                    {renderResult('outcome', 'Generated Outcomes')}
                    {renderResult('method', 'Generated Methods')}
                    {renderResult('objections', 'Generated Objection Handling')}
                    {renderResult('inclusions', 'Generated Value Stacks')}
                    {renderResult('guarantee', 'Generated Guarantees')}
                    {renderInput('offer_type', 'Offer Type')}
                    {renderInput('payment_type', 'Payment Type')}
                    {renderResult('price', 'Generated Pricing')}
                    {renderResult('name', 'Generated Names')}
                </div>
                
                <div className="step-container">
                    {currentStep === 1 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'niche', { niche_category: formData.niche_category })}>
                            <h2>Step 1: Niche</h2>
                            <p>Select your Niche Category to generate specific titles.</p>
                            <select name="niche_category" value={formData.niche_category} onChange={handleInputChange}>
                                {nicheOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Niche Titles'}</button>
                        </form>
                    )}
                    {currentStep === 2 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'avatar', { niche_category: formData.niche_category, niche_titles: formData.niche })}>
                             <h2>Step 2: Avatar</h2>
                             <p>Now, let's generate some ideal client avatars for the niches you just created.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Avatars'}</button>
                        </form>
                    )}
                    {currentStep === 3 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'outcome', { niche_category: formData.niche_category, niche_titles: formData.niche })}>
                            <h2>Step 3: Outcome</h2>
                            <p>Let's define some powerful, desirable outcomes for your offer.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Outcomes'}</button>
                        </form>
                    )}
                    {currentStep === 4 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'method', { niche_category: formData.niche_category, niche_titles: formData.niche, primary_outcome: formData.outcome })}>
                             <h2>Step 4: Method</h2>
                             <p>Now, let's develop a unique method for delivering the outcome.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Method Ideas'}</button>
                        </form>
                    )}
                    {currentStep === 5 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'objections', { niche_category: formData.niche_category, niche_titles: formData.niche, avatar_details: formData.avatar, primary_outcome: formData.outcome })}>
                             <h2>Step 5: Objections</h2>
                             <p>Let's anticipate and solve potential customer objections.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Analyze Objections'}</button>
                        </form>
                    )}
                    {currentStep === 6 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'inclusions', {})}>
                             <h2>Step 6: Inclusions</h2>
                             <p>Now, let's build some high-value stacks for your offer.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Build Value Stacks'}</button>
                        </form>
                    )}
                    {currentStep === 7 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'guarantee', { niche_category: formData.niche_category, niche_titles: formData.niche, avatar_details: formData.avatar, primary_outcome: formData.outcome, objections: formData.objections })}>
                             <h2>Step 7: Guarantee</h2>
                             <p>Let's create a powerful guarantee to reduce risk and boost conversions.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Create Guarantee'}</button>
                        </form>
                    )}
                     {currentStep === 8 && (
                        <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(9); }}>
                            <h2>Step 8: Offer & Payment Type</h2>
                            <p>Define the delivery format and payment structure for your offer.</p>
                            <div className="final-inputs">
                                <label>Offer Type (e.g., Bootcamp, Course, Workshop)</label>
                                <input name="offer_type" onChange={handleInputChange} type="text" required />
                                <label>Payment Type (e.g., One-time payment, Subscription)</label>
                                <input name="payment_type" onChange={handleInputChange} type="text" required />
                            </div>
                            <button type="submit">Next Step</button>
                        </form>
                    )}
                     {currentStep === 9 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'price', { stack_value: 10000, offer_type: formData.offer_type, primary_outcome: formData.outcome, avatar_details: formData.avatar, method_details: formData.method })}>
                             <h2>Step 9: Price</h2>
                             <p>Now let's generate some strategic pricing options for your offer.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Suggest Pricing'}</button>
                        </form>
                    )}
                     {currentStep === 10 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'name', { offer_type: formData.offer_type, niche_titles: formData.niche, primary_outcome: formData.outcome, method_details: formData.method, guarantee_details: formData.guarantee })}>
                             <h2>Step 10: Name</h2>
                             <p>Finally, let's give your amazing offer a compelling name.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Names'}</button>
                        </form>
                    )}
                    {currentStep === 11 && (
                        <div>
                            <h2>🎉 Offer Complete! 🎉</h2>
                            <p>You have successfully built your entire offer from scratch. Review the details in the summary box above.</p>
                            <button onClick={() => { setCurrentStep(1); setFormData({niche_category: nicheOptions[1]}); }}>Start a New Offer</button>
                        </div>
                    )}
                </div>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default App;
