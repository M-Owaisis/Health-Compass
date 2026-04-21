import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Check, CreditCard, ShieldCheck, X, Loader2, ArrowRight, Sparkles } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  :root {
    --primary: #4A7C6F;
    --primary-light: #E8F0EE;
    --navy: #1C2B3A;
    --cream: #FAF7F2;
    --white: #FFFFFF;
    --slate: #5A6A7A;
    --font-main: 'Outfit', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  .sub-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--font-main);
    color: var(--navy);
    position: relative;
    overflow-x: hidden;
  }

  .bg-glow {
    position: fixed;
    width: 60vw; height: 60vw;
    border-radius: 50%;
    filter: blur(120px);
    z-index: 0;
    pointer-events: none;
    opacity: 0.3;
  }
  .bg-glow-1 { top: -20%; right: -10%; background: radial-gradient(circle, var(--primary-light), transparent); }

  .sub-main {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 8rem 2rem 6rem;
    text-align: center;
  }

  .sub-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 1.2rem;
    background: var(--white);
    border: 1px solid rgba(74, 124, 111, 0.2);
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 2rem;
  }

  .sub-title {
    font-family: var(--font-serif);
    font-size: clamp(2.5rem, 6vw, 4rem);
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .sub-desc {
    font-size: 1.2rem;
    color: var(--slate);
    line-height: 1.8;
    margin-bottom: 5rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .sub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 2.5rem;
    text-align: left;
  }

  .plan-card {
    background: var(--white);
    border-radius: 40px;
    padding: 4rem 3rem;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 10px 40px rgba(0,0,0,0.03);
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .plan-card:hover { transform: translateY(-12px); box-shadow: 0 40px 80px rgba(0,0,0,0.08); }

  .plan-pro { border: 2px solid var(--primary); }
  .pro-tag {
    position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
    background: var(--primary); color: white; padding: 0.4rem 1.2rem;
    border-radius: 999px; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
  }

  .plan-name { font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.5rem; }
  .plan-price { font-size: 3.5rem; font-weight: 700; margin-bottom: 2.5rem; font-family: var(--font-serif); display: flex; align-items: flex-end; }
  .plan-price span { font-size: 1.2rem; font-family: var(--font-main); color: var(--slate); font-weight: 400; margin-bottom: 1rem; margin-left: 0.2rem; }

  .plan-features { list-style: none; padding: 0; margin-bottom: 3.5rem; flex-grow: 1; }
  .plan-features li { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.2rem; font-size: 1.05rem; color: var(--navy); line-height: 1.5; }
  .check-icon { color: var(--primary); background: var(--primary-light); border-radius: 50%; padding: 4px; flex-shrink: 0; }

  .sub-btn {
    width: 100%; padding: 1.2rem; border-radius: 999px;
    font-weight: 700; font-size: 1.1rem; border: none; cursor: pointer;
    transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.8rem;
  }
  .sub-btn-outline { background: var(--cream); color: var(--navy); border: 1.5px solid rgba(0,0,0,0.1); }
  .sub-btn-outline:hover { background: var(--white); border-color: var(--primary); }
  .sub-btn-primary { background: var(--primary); color: var(--white); }
  .sub-btn-primary:hover { transform: scale(1.03); box-shadow: 0 15px 35px rgba(74, 124, 111, 0.3); }
  .sub-btn-current { background: var(--primary-light); color: var(--primary); cursor: default; }

  /* Modal Styles */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(28, 43, 58, 0.7);
    backdrop-filter: blur(12px); z-index: 1000;
    display: flex; align-items: center; justify-content: center; padding: 2rem;
  }
  .checkout-modal {
    background: var(--white); border-radius: 40px; width: 100%; max-width: 600px;
    overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.4);
    animation: modalIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @keyframes modalIn { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .checkout-header { background: var(--navy); color: white; padding: 3rem 2rem; text-align: center; position: relative; }
  .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  
  .stripe-logo { font-size: 2rem; font-weight: 800; opacity: 0.8; margin-bottom: 0.5rem; }
  .checkout-amount { font-size: 2rem; font-weight: 700; margin-top: 0.5rem; font-family: var(--font-serif); }

  .checkout-body { padding: 3rem; }
  .form-group { margin-bottom: 1.5rem; }
  .form-label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; margin-bottom: 0.6rem; letter-spacing: 0.05em; }
  .form-input { width: 100%; padding: 1.2rem; border-radius: 16px; border: 1.5px solid #E2E8F0; font-size: 1rem; font-family: var(--font-main); transition: border-color 0.2s; }
  .form-input:focus { outline: none; border-color: var(--primary); }

  .pay-btn { width: 100%; padding: 1.2rem; background: var(--primary); color: white; border: none; border-radius: 999px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.8rem; margin-top: 1rem; }
  .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(74, 124, 111, 0.3); }
  .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .secure-notice { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 2rem; color: var(--slate); font-size: 0.85rem; font-weight: 500; }

  .toast { position: fixed; bottom: 3rem; right: 3rem; background: var(--navy); color: white; padding: 1.5rem 2.5rem; border-radius: 20px; font-weight: 600; display: flex; align-items: center; gap: 1rem; box-shadow: 0 20px 50px rgba(0,0,0,0.3); z-index: 2000; animation: toastIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
  @keyframes toastIn { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: ['2 Assessments per month', 'Basic cognitive screening', 'Standard MoCA scores', 'Patient profile management']
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$29',
    features: ['10 Assessments per month', 'Adaptive Testing Mode', 'Basic Risk Prediction', 'Export history to PDF', 'Detailed domain breakdown']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    features: ['Unlimited Assessments', 'Advanced AI XGBoost Analysis', 'Priority Clinician Support', 'Full longitudinal logging', 'Custom medical flag tuning']
  }
];

export default function Subscription({ user, onLogout, refreshUser }) {
  const [currentTier, setCurrentTier] = useState('free');
  const [toast, setToast] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/subscription/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setCurrentTier(data.data.subscriptionTier);
      } catch (err) { console.error(err); }
    };
    fetchStatus();
  }, []);

  const handleConfirmPayment = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000)); // Sim delay
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: selectedPlan.id })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentTier(selectedPlan.id);
        setToast(`Welcome to the ${selectedPlan.name} plan.`);
        setSelectedPlan(null);
        setCardNumber(''); setExpiry(''); setCvc('');
        if (refreshUser) refreshUser();
        setTimeout(() => setToast(''), 4000);
      }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  return (
    <div className="sub-root">
      <style>{STYLES}</style>
      <div className="bg-glow bg-glow-1" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="sub-main">
        <div className="sub-badge"><Sparkles size={16} /> Choose Your Path</div>
        <h1 className="sub-title">Elevate Your Care Standards.</h1>
        <p className="sub-desc">Select the clinical precision level that matches your patient's needs. Upgrade or downgrade at any time.</p>

        <div className="sub-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card ${plan.id === 'pro' ? 'plan-pro' : ''}`}>
              {plan.id === 'pro' && <div className="pro-tag">Most Recommended</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">{plan.price}<span>/mo</span></div>

              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}><Check size={14} className="check-icon" /> {f}</li>
                ))}
              </ul>

              <button 
                className={`sub-btn ${currentTier === plan.id ? 'sub-btn-current' : (plan.id === 'pro' ? 'sub-btn-primary' : 'sub-btn-outline')}`}
                onClick={() => plan.id !== currentTier && setSelectedPlan(plan)}
              >
                {currentTier === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
                {currentTier !== plan.id && <ArrowRight size={18} />}
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedPlan && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedPlan(null)}>
          <div className="checkout-modal">
            <div className="checkout-header">
              <button className="close-btn" onClick={() => setSelectedPlan(null)}><X size={20} /></button>
              <div className="stripe-logo">stripe</div>
              <p style={{opacity: 0.7, fontSize: '0.9rem'}}>Confirming {selectedPlan.name} Subscription</p>
              <div className="checkout-amount">{selectedPlan.price}.00</div>
            </div>

            <div className="checkout-body">
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <div style={{position: 'relative'}}>
                  <CreditCard size={18} style={{position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)'}} />
                  <input 
                    className="form-input" 
                    style={{paddingLeft: '3.5rem'}} 
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    maxLength={19}
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label className="form-label">Expiry</label>
                  <input 
                    className="form-input" 
                    placeholder="MM / YY" 
                    value={expiry}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        let m = parseInt(val.substring(0,2));
                        if (m > 12) m = 12;
                        if (m === 0) m = 1;
                        let mStr = m.toString().padStart(2, '0');
                        
                        let yStr = val.substring(2, 4);
                        if (yStr.length === 2) {
                          let y = parseInt(yStr);
                          if (y < 26) y = 26; // Don't allow before 26
                          yStr = y.toString();
                        }
                        
                        val = mStr + ' / ' + yStr;
                      }
                      setExpiry(val);
                    }}
                    maxLength={7}
                  />
                </div>
                <div>
                  <label className="form-label">CVC</label>
                  <input className="form-input" placeholder="123" maxLength={3} value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
              </div>

              <button className="pay-btn" disabled={isProcessing || !cardNumber || !expiry || !cvc} onClick={handleConfirmPayment}>
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : `Process Payment`}
              </button>

              <div className="secure-notice">
                <ShieldCheck size={16} /> 256-bit SSL Secure Checkout
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <ShieldCheck size={24} color="var(--primary)" />
          {toast}
        </div>
      )}
    </div>
  );
}
