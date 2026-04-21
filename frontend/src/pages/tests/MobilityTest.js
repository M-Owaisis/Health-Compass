import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Activity, ArrowLeft, ArrowRight } from 'lucide-react';
import { TEST_STYLES } from './testStyles';

function MobilityTest({ user, onLogout }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('healthCompassAnswers') || '{}');
    return stored.mobility || {};
  });

  const test = useMemo(() => {
    const stored = localStorage.getItem('healthCompassTests');
    const list = stored ? JSON.parse(stored) : [];
    return list.find((item) => item.id === 'mobility');
  }, []);

  const questions = test?.questions || [];

  const handleAnswer = (id, value) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('healthCompassAnswers') || '{}');
    stored.mobility = answers;
    localStorage.setItem('healthCompassAnswers', JSON.stringify(stored));
  }, [answers]);

  return (
    <div className="tp-root">
      <style>{TEST_STYLES}</style>
      <div className="tp-blob tp-blob-1" />
      <div className="tp-blob tp-blob-2" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="tp-main">
        <div className="tp-hero">
          <div>
            <div className="tp-hero-badge"><Activity size={10} /> Mobility & Balance</div>
            <h1 className="tp-hero-title">{test?.title || 'Mobility & Balance Test'}</h1>
            <p className="tp-hero-desc">
              This section measures stability, balance, and confidence in movement to detect mobility changes that can affect safety.
            </p>
          </div>
          <div className="tp-hero-img-wrap">
            <img
              className="tp-hero-img"
              src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80"
              alt="Mobility and balance"
            />
            <div className="tp-hero-img-overlay" />
          </div>
        </div>

        <div className="tp-info">
          <div className="tp-info-title">Why Mobility Assessment Matters</div>
          <ul className="tp-info-list">
            <li>Functional mobility checks reveal safety risks and fall concerns before incidents occur.</li>
            <li>Balance confidence links physical changes to daily independence and quality of life.</li>
            <li>Activity impact highlights when clinical follow-up or physical therapy is needed.</li>
          </ul>
        </div>

        {!test && (
          <div className="tp-not-ready">
            <div className="tp-not-ready-title">Mobility test is not ready yet</div>
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
              <button className="tp-btn-secondary" onClick={() => navigate('/tests/mood')}><ArrowLeft size={16} /> Back</button>
              <button className="tp-btn-primary" onClick={() => navigate('/tests/functional')}>Submit & Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MobilityTest;