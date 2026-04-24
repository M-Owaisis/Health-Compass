import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Home as HomeIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import TestProgress from '../../components/TestProgress';
import { TEST_STYLES } from './testStyles';

function FunctionalTest({ user, onLogout }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('healthCompassAnswers') || '{}');
    return stored.functional || {};
  });

  const test = useMemo(() => {
    const stored = localStorage.getItem('healthCompassTests');
    const list = stored ? JSON.parse(stored) : [];
    return list.find((item) => item.id === 'functional');
  }, []);

  const questions = test?.questions || [];

  const handleAnswer = (id, value) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('healthCompassAnswers') || '{}');
    stored.functional = answers;
    localStorage.setItem('healthCompassAnswers', JSON.stringify(stored));
  }, [answers]);

  const isAllAnswered = questions.length > 0 && questions.every(q => {
    const ans = answers[q.id];
    return ans !== undefined && ans !== null && String(ans).trim() !== '';
  });

  return (
    <div className="tp-root">
      <style>{TEST_STYLES}</style>
      <div className="tp-blob tp-blob-1" />
      <div className="tp-blob tp-blob-2" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="tp-main">
        <TestProgress currentStep={4} />
        <div className="tp-hero">
          <div>
            <div className="tp-hero-badge"><HomeIcon size={10} /> Functional Skills</div>
            <h1 className="tp-hero-title">{test?.title || 'Functional Skills Test'}</h1>
            <p className="tp-hero-desc">
              This section connects cognitive changes to real-world daily tasks using an IADL style assessment.
            </p>
          </div>
          <div className="tp-hero-img-wrap">
            <img
              className="tp-hero-img"
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
              alt="Functional daily tasks"
            />
            <div className="tp-hero-img-overlay" />
          </div>
        </div>

        <div className="tp-info">
          <div className="tp-info-title">Why Functional Assessment Matters</div>
          <ul className="tp-info-list">
            <li>IADL-style items connect cognitive scores to real-world daily living impact.</li>
            <li>Functional decline is one of the most meaningful indicators for caregivers and clinicians.</li>
            <li>Reveals whether cognitive changes are affecting independence and safety at home.</li>
          </ul>
        </div>

        {!test && (
          <div className="tp-not-ready">
            <div className="tp-not-ready-title">Functional test is not ready yet</div>
            <p className="tp-not-ready-text">Generate your assessment set from the dashboard to unlock this section.</p>
            <button className="tp-btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}

        {test && (
          <div className="tp-form">
            {questions.map((question, index) => (
              <div key={question.id || index} className="tp-q-card">
                <div className="tp-q-num">{String(index + 1).padStart(2, '0')}</div>
                <div className="tp-q-text">{question.question || question.prompt}</div>
                {question.type === 'text' ? (
                  <textarea
                    className="tp-textarea"
                    rows="4"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    placeholder="Type your answer here…"
                  />
                ) : (
                  <div className="tp-options">
                    {question.options?.map((option) => (
                      <label key={option} className={`tp-option${answers[question.id] === option ? ' selected' : ''}`}>
                        <input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => handleAnswer(question.id, option)} />
                        <span className="tp-option-dot"><span className="tp-option-dot-inner" /></span>
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="tp-actions">
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button className="tp-btn-secondary" onClick={() => navigate('/tests/language')}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button 
                  className="tp-btn-sage" 
                  onClick={() => navigate('/tests/results')}
                  disabled={!isAllAnswered}
                  style={{ opacity: isAllAnswered ? 1 : 0.6, cursor: isAllAnswered ? 'pointer' : 'not-allowed' }}
                >
                  Submit & View Results <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default FunctionalTest;