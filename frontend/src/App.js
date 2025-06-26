// Complete, unabridged code for frontend/src/App.js

import React, { useState, useRef } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- DATA FOR NEW DROPDOWNS ---
const nicheOptions = [
  "💵 Wealth > Making Money", "💵 Wealth > Growing money", "💵 Wealth > Protecting & saving money",
  "💪 Health > Improving beauty & appearance", "💪 Health > Improving performance", "💪 Health > Reducing pain, discomfort & disease",
  "❤️ Relationships > Getting into one", "❤️ Relationships > Improving one", "❤️ Relationships > Getting out of one",
  "🕹️ Entertainment > Hobby/interest", "🕹️ Entertainment > Movies/games", "🕹️ Entertainment > Personal/adult/comedy",
];

const inclusionOptions = [
  "🟢 App", "🟢 Book", "🟢 Paid Content", "🟢 Software", "🟢 Physical Product", "🟢 Course",
  "🟠 Cheat Sheet", "🟠 Swipe Files", "🟠 Tools or Calculators", "🟠 Templates", "🟠 Scripts",
  "🟠 Email Automations", "🟠 Blueprints", "🟠 Done For You Service", "🟠 Funnels & Web Pages",
  "🔴 Challenge / Competition", "🔴 Private Group", "🔴 Live Q&A", "🔴 Accountability / Check In Calls",
  "🔴 Guest Expert Access", "🔴 1 on 1 Coaching", "🔴 Certification / License / Qualification",
  "🔴 Seminar", "🔴 Retreat / Event / Experience"
];

const scarcityOptions = ["Limited supply of bonuses", "Only X spots available", "Limited time enrollment", "First X buyers only"];
const urgencyOptions = ["Discount ends in...", "Price increases after...", "Offer expires tonight", "Bonus disappears at midnight"];
const offerTypeOptions = ["Bootcamp", "Course", "Workshop", "Coaching Program", "Membership", "Service"];
const paymentTypeOptions = ["One-time payment", "Subscription", "Payment Plan"];


const App = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({ 
        niche_category: nicheOptions[1],
        inclusion1_type: inclusionOptions[0],
        inclusion2_type: inclusionOptions[6],
        inclusion3_type: inclusionOptions[15],
        conditional_bonus_type: inclusionOptions[1],
        scarcity: scarcityOptions[0],
        urgency: urgencyOptions[0],
        offer_type: offerTypeOptions[0],
        payment_type: paymentTypeOptions[0]
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const reportRef = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApiSubmit = async (e, stepName, data) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`https://coral-app-rbtwz.ondigitalocean.app/api/generate`, {
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
    
    const generatePdf = () => {
        const input = reportRef.current;
        html2canvas(input, { 
            scale: 2,
            useCORS: true, 
            logging: true,
            width: input.scrollWidth,
            height: input.scrollHeight
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            let imgHeight = pdfWidth / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            pdf.save("Your-Offer-Report.pdf");
        });
    };

    const renderResult = (name, title) => formData[name] && (
        <div className="summary-item"><h4>{title}</h4><pre>{formData[name]}</pre></div>
    );

    const renderInput = (name, title) => formData[name] && (
        <div className="summary-item"><h4>{title}</h4><p>{formData[name]}</p></div>
    );

    return (
        <div className="App">
            <div className="container">
                <h1>Create Your Offer</h1>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(currentStep -1) / 11 * 100}%` }}></div>
                </div>

                <div className="summary-container" ref={reportRef}>
                    <h3>Your Offer So Far...</h3>
                    {renderInput('niche_category', 'Niche Category')}
                    {renderResult('niche', 'Generated Niches')}
                    {renderResult('avatar', 'Generated Avatars')}
                    {renderResult('outcome', 'Generated Outcomes')}
                    {renderResult('method', 'Generated Methods')}
                    {renderResult('objections', 'Generated Objection Handling')}
                    {renderInput('inclusion1_type', 'Inclusion #1')}
                    {renderInput('inclusion2_type', 'Inclusion #2')}
                    {renderInput('inclusion3_type', 'Inclusion #3')}
                    {renderResult('inclusions', 'Generated Value Stacks')}
                    {renderInput('conditional_bonus_type', 'Conditional Bonus')}
                    {renderInput('scarcity', 'Scarcity')}
                    {renderInput('urgency', 'Urgency')}
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
                        <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(7); }}>
                            <h2>Step 6: Inclusions & Bonuses</h2>
                            <p>Manually select your core offer inclusions, then generate AI suggestions for value stacks.</p>
                            <div className="form-grid">
                                <div className="form-group"><label>Inclusion #1 Type</label><select name="inclusion1_type" value={formData.inclusion1_type} onChange={handleInputChange}>{inclusionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div className="form-group"><label>Inclusion #2 Type</label><select name="inclusion2_type" value={formData.inclusion2_type} onChange={handleInputChange}>{inclusionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div className="form-group"><label>Inclusion #3 Type</label><select name="inclusion3_type" value={formData.inclusion3_type} onChange={handleInputChange}>{inclusionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div className="form-group"><label>Conditional Bonus Type</label><select name="conditional_bonus_type" value={formData.conditional_bonus_type} onChange={handleInputChange}>{inclusionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                            </div>
                            <button className="secondary" onClick={(e) => handleApiSubmit(e, 'inclusions', {})}>Generate AI Value Stacks</button>
                            <button type="submit">Next Step</button>
                        </form>
                    )}
                    
                    {currentStep === 7 && (
                        <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(8); }}>
                            <h2>Step 7: Scarcity & Urgency</h2>
                            <p>Select psychological triggers to encourage prompt action.</p>
                             <div className="form-grid">
                                <div className="form-group"><label>Scarcity Tactic</label><select name="scarcity" value={formData.scarcity} onChange={handleInputChange}>{scarcityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div className="form-group"><label>Urgency Tactic</label><select name="urgency" value={formData.urgency} onChange={handleInputChange}>{urgencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                            </div>
                            <button type="submit">Next Step</button>
                        </form>
                    )}

                    {currentStep === 8 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'guarantee', { niche_category: formData.niche_category, niche_titles: formData.niche, avatar_details: formData.avatar, primary_outcome: formData.outcome, objections: formData.objections })}>
                             <h2>Step 8: Guarantee</h2>
                             <p>Let's create a powerful guarantee to reduce risk and boost conversions.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Create Guarantee'}</button>
                        </form>
                    )}

                    {currentStep === 9 && (
                        <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(10); }}>
                            <h2>Step 9: Offer & Payment Type</h2>
                            <p>Define the delivery format and payment structure for your offer.</p>
                             <div className="form-grid">
                                <div className="form-group"><label>Offer Type</label><select name="offer_type" value={formData.offer_type} onChange={handleInputChange}>{offerTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div className="form-group"><label>Payment Type</label><select name="payment_type" value={formData.payment_type} onChange={handleInputChange}>{paymentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                            </div>
                            <button type="submit">Next Step</button>
                        </form>
                    )}
                    
                    {currentStep === 10 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'price', { stack_value: 174, offer_type: formData.offer_type, primary_outcome: formData.outcome, avatar_details: formData.avatar, method_details: formData.method })}>
                             <h2>Step 10: Price</h2>
                             <p>Let's generate strategic pricing options to meet your revenue goals.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Suggest Pricing'}</button>
                        </form>
                    )}
                    
                    {currentStep === 11 && (
                        <form onSubmit={(e) => handleApiSubmit(e, 'name', { offer_type: formData.offer_type, niche_titles: formData.niche, primary_outcome: formData.outcome, method_details: formData.method, guarantee_details: formData.guarantee })}>
                             <h2>Step 11: Name</h2>
                             <p>Finally, let's give your amazing offer a compelling name.</p>
                             <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Names'}</button>
                        </form>
                    )}

                    {currentStep === 12 && (
                        <div>
                            <h2>🎉 Offer Complete! 🎉</h2>
                            <p>You have successfully built your entire offer from scratch. Review the details in the summary box above and download your report.</p>
                            <button onClick={generatePdf}>Download PDF Report</button>
                            <button className="secondary" onClick={() => { setCurrentStep(1); setFormData({niche_category: nicheOptions[1]}); }}>Start a New Offer</button>
                        </div>
                    )}
                </div>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default App;
