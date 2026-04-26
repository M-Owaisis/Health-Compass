import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import TestProgress from '../../components/TestProgress';
import { TEST_STYLES } from './testStyles';

function GlobalTest({ user, onLogout }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('healthCompassAnswers') || '{}');
    return stored.global || {};
  });

  const test = useMemo(() => {
    const stored = localStorage.getItem('healthCompassTests');
    const list = stored ? JSON.parse(stored) : [];
    return list.find((item) => item.id === 'global');
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
    stored.global = answers;
    localStorage.setItem('healthCompassAnswers', JSON.stringify(stored));
  }, [answers]);

  const domainRows = [
    { domain: 'Global', testType: 'MoCA / MMSE', benefit: 'Provides a standardized baseline rank for the patient.' },
    { domain: 'Episodic Memory', testType: 'Delayed Recall', benefit: 'Separates age-related forgetfulness from pathological loss.' },
    { domain: 'Executive', testType: 'Trail Making Test B', benefit: 'Captures the breakdown of complex thinking.' },
    { domain: 'Language', testType: 'Category Fluency', benefit: 'Detects word-finding difficulties (aphasia).' },
    { domain: 'Functional', testType: 'IADL Scale', benefit: 'Connects cognitive scores to real-world impact.' },
  ];

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
        <TestProgress currentStep={0} />

        {/* ── Hero ── */}
        <div className="tp-hero">
          <div>
            <div className="tp-hero-badge"><Brain size={10} /> Cognitive Screen</div>
            <h1 className="tp-hero-title">{test?.title || 'Global Cognitive Screen'}</h1>
            <p className="tp-hero-desc">
              A standardised overview of cognitive function, similar to MoCA/MMSE style screening, to anchor the overall profile.
            </p>
          </div>
          <div className="tp-hero-img-wrap">
            <img
              className="tp-hero-img"
              src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=600&q=80"
              alt="Global cognitive screen"
            />
            <div className="tp-hero-img-overlay" />
          </div>
        </div>

        {/* ── Why This Matters (table) ── */}
        <div className="tp-info">
          <div className="tp-info-title">Why These Domains Matter</div>
          <table className="tp-info-table">
            <tbody>
              {domainRows.map((row) => (
                <tr key={row.domain}>
                  <td>{row.domain}</td>
                  <td>{row.testType}</td>
                  <td>{row.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Not ready ── */}
        {!test && (
          <div className="tp-not-ready">
            <div className="tp-not-ready-title">Global test is not ready yet</div>
            <p className="tp-not-ready-text">Generate your assessment set from the dashboard to unlock this section.</p>
            <button className="tp-btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── Questions ── */}
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
                      <label
                        key={option}
                        className={`tp-option${answers[question.id] === option ? ' selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => handleAnswer(question.id, option)}
                        />
                        <span className="tp-option-dot">
                          <span className="tp-option-dot-inner" />
                        </span>
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="tp-actions">
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button className="tp-btn-secondary" onClick={() => {
                  if (window.confirm('Are you sure you want to exit the assessment? We would love your feedback before you go.')) {
                    window.dispatchEvent(new CustomEvent('open-phase4-feedback', { detail: { returnTo: '/dashboard' } }));
                  }
                }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  className="tp-btn-primary"
                  onClick={() => navigate('/tests/episodic-memory')}
                  disabled={!isAllAnswered}
                  style={{ opacity: isAllAnswered ? 1 : 0.6, cursor: isAllAnswered ? 'pointer' : 'not-allowed' }}
                >
                  Submit & Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


export default GlobalTest;