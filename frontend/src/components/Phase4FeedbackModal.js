import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, CheckCircle, Star } from 'lucide-react';

const FEEDBACK_STYLES = `
  .p4-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #D4793A;
    color: #fff;
    padding: 14px 24px;
    border-radius: 999px;
    font-family: var(--font-body, 'DM Sans', sans-serif);
    font-size: 1.05rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(212, 121, 58, 0.4);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    animation: p4Pulse 2s infinite;
  }
  .p4-fab:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 121, 58, 0.5);
    background: #C06A2F;
  }
  
  @keyframes p4Pulse {
    0% { box-shadow: 0 0 0 0 rgba(212, 121, 58, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(212, 121, 58, 0); }
    100% { box-shadow: 0 0 0 0 rgba(212, 121, 58, 0); }
  }
  
  .p4-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(28, 43, 58, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }
  
  .p4-modal {
    background: var(--warm-white, #FDFCFA);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(28, 43, 58, 0.15);
    display: flex;
    flex-direction: column;
    animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    overflow: hidden;
  }
  
  .p4-header {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(74, 124, 111, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--cream, #FAF7F2);
  }
  
  .p4-title {
    font-family: var(--font-display, 'DM Serif Display', serif);
    font-size: 1.4rem;
    color: var(--navy, #1C2B3A);
    margin: 0;
  }
  .p4-subtitle {
    font-family: var(--font-body, 'DM Sans', sans-serif);
    font-size: 0.85rem;
    color: var(--slate, #5A6A7A);
    margin-top: 4px;
  }
  
  .p4-close {
    background: none;
    border: none;
    color: var(--slate, #5A6A7A);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    transition: background 0.2s;
  }
  .p4-close:hover {
    background: rgba(28, 43, 58, 0.05);
  }
  
  .p4-content {
    padding: 24px;
    overflow-y: auto;
    font-family: var(--font-body, 'DM Sans', sans-serif);
  }
  
  .p4-group {
    margin-bottom: 24px;
  }
  .p4-group label {
    display: block;
    font-weight: 600;
    color: var(--navy, #1C2B3A);
    margin-bottom: 8px;
    font-size: 0.95rem;
  }
  
  .p4-input, .p4-select, .p4-textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(74, 124, 111, 0.2);
    background: var(--cream, #FAF7F2);
    font-family: inherit;
    font-size: 0.95rem;
    color: var(--text-body, #3D4E5C);
    transition: border-color 0.2s;
  }
  .p4-input:focus, .p4-select:focus, .p4-textarea:focus {
    outline: none;
    border-color: var(--sage, #4A7C6F);
    box-shadow: 0 0 0 3px rgba(74, 124, 111, 0.1);
  }
  .p4-textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .p4-sus-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .p4-sus-table th {
    font-size: 0.8rem;
    color: var(--slate, #5A6A7A);
    font-weight: 500;
    padding-bottom: 8px;
  }
  .p4-sus-table td {
    text-align: center;
    padding: 8px 0;
    border-top: 1px solid rgba(74, 124, 111, 0.1);
  }
  .p4-sus-q {
    text-align: left !important;
    font-size: 0.9rem;
    color: var(--text-body, #3D4E5C);
    padding-right: 16px !important;
    width: 60%;
  }
  
  .p4-footer {
    padding: 20px 24px;
    border-top: 1px solid rgba(74, 124, 111, 0.15);
    display: flex;
    justify-content: flex-end;
    background: var(--cream, #FAF7F2);
  }
  
  .p4-submit {
    background: var(--sage, #4A7C6F);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 999px;
    font-family: inherit;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .p4-submit:hover {
    background: var(--sage-light, #6B9E91);
    transform: translateY(-1px);
  }
  
  .p4-success {
    text-align: center;
    padding: 40px 20px;
  }
  .p4-success h3 {
    font-family: var(--font-display, 'DM Serif Display', serif);
    font-size: 1.8rem;
    color: var(--sage, #4A7C6F);
    margin: 16px 0 8px;
  }
  .p4-success p {
    color: var(--slate, #5A6A7A);
    line-height: 1.6;
  }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function Phase4FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const navigate = require('react-router-dom').useNavigate();

  // Show only on /tests/ routes
  const isTestRoute = location.pathname.startsWith('/tests');
  
  const [formData, setFormData] = useState({
    hesitation: '',
    completion: '',
    testMode: '',
    resultSense: '',
    mostUseful: '',
    reuse: '',
    pay: '',
    sus1: null,
    sus2: null,
    sus3: null,
    sus4: null,
    sus5: null
  });

  useEffect(() => {
    // Auto popup on Results page if they haven't submitted yet
    if (location.pathname === '/tests/results' && !localStorage.getItem('phase4_feedback_submitted')) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    const handleOpenEvent = (e) => {
      setIsOpen(true);
      if (e.detail?.returnTo) {
        localStorage.setItem('p4_returnTo', e.detail.returnTo);
      }
    };
    window.addEventListener('open-phase4-feedback', handleOpenEvent);
    return () => window.removeEventListener('open-phase4-feedback', handleOpenEvent);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    const returnTo = localStorage.getItem('p4_returnTo');
    if (returnTo) {
      localStorage.removeItem('p4_returnTo');
      navigate(returnTo);
    }
  };

  if (!isTestRoute) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSusChange = (qIndex, value) => {
    setFormData({ ...formData, [`sus${qIndex}`]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== PHASE 4A USER FEEDBACK ===", formData);
    
    setIsSubmitted(true); // Show success state immediately for perceived performance
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        console.error('Failed to save feedback to server');
      }
    } catch (err) {
      console.error('Error connecting to feedback API:', err);
    }

    localStorage.setItem('phase4_feedback_submitted', 'true');
    localStorage.setItem('phase4_feedback_data', JSON.stringify(formData));
    
    setTimeout(() => {
      setIsSubmitted(false); // reset for future
      handleClose();
    }, 2000);
  };

  return (
    <>
      <style>{FEEDBACK_STYLES}</style>
      
      {/* Floating Action Button */}
      {!isOpen && !localStorage.getItem('phase4_feedback_submitted') && (
        <button className="p4-fab" onClick={() => setIsOpen(true)}>
          <MessageSquare size={18} />
          Provide Feedback
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="p4-modal-overlay">
          <div className="p4-modal">
            <div className="p4-header">
              <div>
                <h2 className="p4-title">User Feedback</h2>
                <div className="p4-subtitle">Phase 4A Course Project Validation</div>
              </div>
              <button className="p4-close" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            {isSubmitted ? (
              <div className="p4-success">
                <CheckCircle size={64} color="var(--sage)" style={{ margin: '0 auto' }} />
                <h3>Thank You!</h3>
                <p>Your behavioral evidence has been recorded for our Phase 4A submission.<br/>We truly appreciate your time.</p>
              </div>
            ) : (
              <>
                <div className="p4-content">
                  <form id="p4-form" onSubmit={handleSubmit}>
                    
                    <div className="p4-group">
                      <label>1. Did you hesitate, get stuck, or feel confused at any point? (Be honest!)</label>
                      <textarea 
                        className="p4-textarea" 
                        name="hesitation" 
                        placeholder="e.g. I didn't know what to click on the memory test..."
                        value={formData.hesitation} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="p4-group">
                      <label>2. Were you able to successfully finish a test?</label>
                      <select className="p4-select" name="completion" value={formData.completion} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        <option value="yes_easily">Yes, easily</option>
                        <option value="yes_struggled">Yes, but I struggled</option>
                        <option value="no_gave_up">No, I got stuck or gave up</option>
                      </select>
                    </div>

                    <div className="p4-group">
                      <label>3. Which testing mode did you use?</label>
                      <select className="p4-select" name="testMode" value={formData.testMode} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        <option value="standard">Standard Mode (all 30 questions)</option>
                        <option value="adaptive">Adaptive Mode (GRE-style, one at a time)</option>
                        <option value="both">I tried both</option>
                      </select>
                    </div>

                    <div className="p4-group">
                      <label>3. When you saw your final result/score, did it make sense to you?</label>
                      <textarea 
                        className="p4-textarea" 
                        name="resultSense" 
                        placeholder="Did you understand what 15/30 means?"
                        value={formData.resultSense} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="p4-group">
                      <label>4. What did you find most useful or positive about the app?</label>
                      <textarea 
                        className="p4-textarea" 
                        name="mostUseful" 
                        value={formData.mostUseful} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="p4-group">
                      <label>5. Would you use this again for yourself or an older family member? Why?</label>
                      <textarea 
                        className="p4-textarea" 
                        name="reuse" 
                        value={formData.reuse} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="p4-group">
                      <label>6. If this app provided a highly detailed, clinical-grade report to hand to a doctor, would you pay for it?</label>
                      <textarea 
                        className="p4-textarea" 
                        name="pay" 
                        placeholder="Yes/No and why..."
                        value={formData.pay} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="p4-group">
                      <label>7. System Usability Scale (SUS)</label>
                      <table className="p4-sus-table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>1 (Disagree)</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5 (Agree)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            "I think that I would like to use this system frequently.",
                            "I found the system unnecessarily complex.",
                            "I thought the system was easy to use.",
                            "I think that I would need the support of a technical person.",
                            "I found the various functions well integrated."
                          ].map((q, i) => (
                            <tr key={i}>
                              <td className="p4-sus-q">{q}</td>
                              {[1, 2, 3, 4, 5].map(val => (
                                <td key={val}>
                                  <input 
                                    type="radio" 
                                    name={`sus${i+1}`} 
                                    value={val} 
                                    onChange={() => handleSusChange(i+1, val)}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </form>
                </div>
                <div className="p4-footer">
                  <button type="submit" form="p4-form" className="p4-submit">
                    Submit Feedback
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
