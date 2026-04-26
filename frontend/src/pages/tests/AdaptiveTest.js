import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Brain, CheckCircle2, XCircle, Loader2, ArrowRight, X } from 'lucide-react';

const DOMAINS = [
  { id: 'global', name: 'Global Cognitive', shortName: 'Global' },
  { id: 'episodic-memory', name: 'Episodic Memory', shortName: 'Episodic' },
  { id: 'executive', name: 'Executive Function', shortName: 'Executive' },
  { id: 'language', name: 'Language', shortName: 'Language' },
  { id: 'functional', name: 'Functional Assessment', shortName: 'Functional' },
];

const QUESTIONS_PER_DOMAIN = 6;

const ADAPTIVE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FAF7F2;
    --cream-dark: #F0EBE1;
    --sage: #4A7C6F;
    --sage-light: #6B9E91;
    --sage-pale: #E8F0EE;
    --navy: #1C2B3A;
    --navy-mid: #2D4055;
    --slate: #5A6A7A;
    --warm-white: #FDFCFA;
    --amber: #D4793A;
    --amber-pale: #FDF0E6;
    --text-body: #3D4E5C;
    --border: rgba(74, 124, 111, 0.15);
    --shadow-sm: 0 2px 12px rgba(28, 43, 58, 0.06);
    --shadow-md: 0 8px 32px rgba(28, 43, 58, 0.10);
    --shadow-lg: 0 20px 60px rgba(28, 43, 58, 0.14);
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-xl: 36px;
    --font-display: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  .at-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--font-body);
    color: var(--navy);
    position: relative;
    overflow-x: hidden;
  }

  .at-blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.25; }
  .at-blob-1 { width: 480px; height: 480px; top: -100px; right: -80px; background: radial-gradient(circle, #B8D4CE, #6B9E9100); animation: atBlob 18s ease-in-out infinite alternate; }
  .at-blob-2 { width: 360px; height: 360px; bottom: 5%; left: -80px; background: radial-gradient(circle, #D4793A44, transparent); animation: atBlob 22s ease-in-out infinite alternate-reverse; }
  @keyframes atBlob { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,20px) scale(1.06); } }

  .at-main {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 2rem 5rem;
  }

  @keyframes atRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Progress header ── */
  .at-progress-card {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
    border-radius: var(--radius-xl);
    padding: 2rem 2.2rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
    animation: atRise 0.5s cubic-bezier(.22,.68,0,1.2) both;
    box-shadow: 0 25px 50px -12px rgba(28, 43, 58, 0.25);
  }
  .at-progress-card::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 250px; height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(107,158,145,0.22), transparent 70%);
    pointer-events: none;
    filter: blur(20px);
  }

  .at-progress-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .at-domain-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    background: rgba(107,158,145,0.15);
    color: var(--sage-light);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
    border: 1px solid rgba(107,158,145,0.25);
    backdrop-filter: blur(4px);
  }

  .at-domain-title {
    font-family: var(--font-display);
    font-size: 1.6rem;
    color: var(--cream);
    line-height: 1.1;
    letter-spacing: -0.01em;
  }
  .at-domain-sub {
    font-size: 0.88rem;
    color: rgba(250,247,242,0.6);
    margin-top: 0.4rem;
    font-weight: 500;
  }

  .at-score-wrap { 
    text-align: right; 
    flex-shrink: 0;
    background: rgba(255,255,255,0.05);
    padding: 0.8rem 1.2rem;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .at-score-num {
    font-family: var(--font-display);
    font-size: 2.4rem;
    line-height: 1;
    color: var(--sage-light);
    text-shadow: 0 4px 12px rgba(107,158,145,0.3);
  }
  .at-score-sub { font-size: 0.8rem; color: rgba(250,247,242,0.5); margin-top: 0.25rem; font-weight: 600; letter-spacing: 0.02em; }

  /* Domain step dots */
  .at-domain-steps {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 1.2rem;
    position: relative;
  }
  .at-domain-step {
    flex: 1;
    height: 6px;
    border-radius: 4px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .at-domain-step.done { background: var(--sage-light); box-shadow: 0 0 10px rgba(107,158,145,0.4); }
  .at-domain-step.active { background: var(--amber); transform: scaleY(1.2); box-shadow: 0 0 12px rgba(212,121,58,0.5); }
  .at-domain-step.pending { background: rgba(255,255,255,0.12); }

  /* Overall progress bar */
  .at-overall-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }
  .at-overall-track {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.08);
    border-radius: 999px;
    overflow: hidden;
  }
  .at-overall-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sage-light), var(--sage));
    border-radius: 999px;
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .at-overall-pct { font-size: 0.85rem; color: rgba(250,247,242,0.6); min-width: 40px; text-align: right; font-weight: 700; }

  /* ── Difficulty pills ── */
  .at-difficulty-row {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
    animation: atRise 0.5s 0.05s cubic-bezier(.22,.68,0,1.2) both;
  }
  .at-diff-pill {
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border: 1.5px solid;
    transition: background 0.2s, color 0.2s;
  }
  .at-diff-pill.active-easy { background: var(--sage-pale); color: var(--sage); border-color: rgba(74,124,111,0.35); }
  .at-diff-pill.active-medium { background: var(--amber-pale); color: var(--amber); border-color: rgba(212,121,58,0.35); }
  .at-diff-pill.active-hard { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }
  .at-diff-pill.inactive { background: transparent; color: var(--slate); border-color: var(--border); }

  /* ── Question card ── */
  .at-q-card {
    background: var(--warm-white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.8rem;
    box-shadow: var(--shadow-md);
    min-height: 300px;
    position: relative;
    animation: atRise 0.5s 0.08s cubic-bezier(.22,.68,0,1.2) both;
  }

  /* Loading state */
  .at-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    gap: 0.9rem;
  }
  .at-loading-icon { color: var(--sage); animation: spin 0.9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .at-loading-text { font-size: 0.9rem; color: var(--slate); }

  /* Error state */
  .at-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 240px;
    gap: 0.9rem;
    text-align: center;
  }
  .at-error-text { color: #B91C1C; font-size: 0.9rem; line-height: 1.6; max-width: 340px; }

  /* Feedback overlay */
  .at-feedback {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    z-index: 10;
    animation: atRise 0.2s ease both;
  }
  .at-feedback-correct { background: rgba(232,240,238,0.97); }
  .at-feedback-wrong { background: rgba(254,242,242,0.97); }
  .at-feedback-label {
    font-family: var(--font-display);
    font-size: 1.4rem;
  }
  .at-feedback-correct .at-feedback-label { color: var(--sage); }
  .at-feedback-wrong .at-feedback-label { color: #B91C1C; }
  .at-feedback-ans { font-size: 0.88rem; color: var(--slate); }

  /* Domain tag */
  .at-domain-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.22rem 0.6rem;
    border-radius: 6px;
    background: var(--sage-pale);
    color: var(--sage);
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.85rem;
  }

  /* Question text */
  .at-q-text {
    font-size: 1.08rem;
    font-weight: 600;
    color: var(--navy);
    line-height: 1.55;
    margin-bottom: 1.3rem;
  }

  /* Options */
  .at-options { display: flex; flex-direction: column; gap: 0.55rem; }
  .at-option {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--cream);
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text-body);
    transition: border-color 0.2s, background 0.2s;
    user-select: none;
  }
  .at-option:hover { border-color: rgba(74,124,111,0.3); background: var(--sage-pale); }
  .at-option.selected { border-color: var(--sage); background: var(--sage-pale); color: var(--navy); font-weight: 500; }
  .at-option input[type="radio"] { display: none; }
  .at-opt-dot {
    width: 17px; height: 17px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s, background 0.2s;
  }
  .at-option.selected .at-opt-dot { background: var(--sage); border-color: var(--sage); }
  .at-opt-dot-inner { width: 6px; height: 6px; border-radius: 50%; background: #fff; opacity: 0; transition: opacity 0.15s; }
  .at-option.selected .at-opt-dot-inner { opacity: 1; }

  /* ── Action bar ── */
  .at-action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.2rem;
    gap: 1rem;
    animation: atRise 0.5s 0.12s cubic-bezier(.22,.68,0,1.2) both;
  }

  .at-btn-exit {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.72rem 1.2rem;
    border-radius: 999px;
    background: transparent;
    color: var(--slate);
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 500;
    border: 1.5px solid rgba(28,43,58,0.15);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .at-btn-exit:hover { background: var(--cream-dark); color: var(--navy); }

  .at-btn-submit {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.82rem 1.8rem;
    border-radius: 999px;
    background: var(--navy);
    color: var(--cream);
    font-family: var(--font-body);
    font-size: 0.93rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(28,43,58,0.2);
  }
  .at-btn-submit:hover:not(:disabled) { background: var(--navy-mid); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(28,43,58,0.25); }
  .at-btn-submit:disabled { background: var(--slate); opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
  .at-btn-submit.finish { background: var(--sage); box-shadow: 0 4px 16px rgba(74,124,111,0.25); }
  .at-btn-submit.finish:hover:not(:disabled) { background: var(--sage-light); }

  /* ── Retry button ── */
  .at-btn-retry {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.72rem 1.4rem;
    border-radius: 999px;
    background: var(--sage);
    color: #fff;
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.18s;
  }
  .at-btn-retry:hover { background: var(--sage-light); transform: translateY(-1px); }

  /* ── Domain performance panel ── */
  .at-perf-panel {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.1rem 1.3rem;
    margin-top: 1.1rem;
    box-shadow: var(--shadow-sm);
    animation: atRise 0.5s 0.15s cubic-bezier(.22,.68,0,1.2) both;
  }
  .at-perf-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--slate);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 0.7rem;
  }
  .at-perf-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .at-perf-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1.5px solid var(--border);
    background: var(--cream);
    color: var(--slate);
    transition: background 0.2s, border-color 0.2s;
  }
  .at-perf-pill.active-domain {
    background: var(--sage-pale);
    border-color: rgba(74,124,111,0.35);
    color: var(--sage);
    font-weight: 600;
  }
  .at-perf-pill.has-score { color: var(--navy); }
  .at-perf-pct { font-weight: 700; color: var(--sage); }
`;

function AdaptiveTest({ user, onLogout }) {
  const navigate = useNavigate();

  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  const [performance, setPerformance] = useState({ total: 0, correct: 0, recentCorrect: 0, byDomain: {} });
  const [allAnswers, setAllAnswers] = useState({});
  const [askedQuestions, setAskedQuestions] = useState([]);

  const currentDomain = DOMAINS[currentDomainIndex];
  const profile = JSON.parse(localStorage.getItem('healthCompassProfile') || '{}');
  const totalQuestions = DOMAINS.length * QUESTIONS_PER_DOMAIN;
  const completedQuestions = currentDomainIndex * QUESTIONS_PER_DOMAIN + questionNumber - 1;
  const overallProgress = Math.round((completedQuestions / totalQuestions) * 100);
  const scorePercent = Math.round((performance.correct / Math.max(1, performance.total)) * 100);
  const isLastQuestion = questionNumber >= QUESTIONS_PER_DOMAIN && currentDomainIndex >= DOMAINS.length - 1;

  const fetchNextQuestion = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setSelectedAnswer(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/ai/adaptive-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          profile,
          currentDomain: currentDomain.id,
          questionNumber,
          performance: {
            ...performance,
            recentCorrect: performance.total >= 3
              ? (allAnswers[currentDomain.id]
                  ? Object.values(allAnswers[currentDomain.id]).slice(-3).filter(a => a.correct).length
                  : 0)
              : performance.correct,
          },
          askedQuestions: askedQuestions.slice(-10),
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to generate question');
      setCurrentQuestion(data.question);
      setAskedQuestions(prev => [...prev, data.question.question]);
    } catch (err) {
      setError(err.message || 'Failed to load question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentDomain, questionNumber, performance, profile, askedQuestions, allAnswers]);

  useEffect(() => { fetchNextQuestion(); }, [currentDomainIndex]);

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;
    setIsSubmitting(true);

    const isCorrect = selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim();

    setPerformance(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      recentCorrect: isCorrect ? prev.recentCorrect + 1 : Math.max(0, prev.recentCorrect - 1),
      byDomain: {
        ...prev.byDomain,
        [currentDomain.id]: {
          total: (prev.byDomain[currentDomain.id]?.total || 0) + 1,
          correct: (prev.byDomain[currentDomain.id]?.correct || 0) + (isCorrect ? 1 : 0),
        },
      },
    }));

    const newAnswer = {
      question: currentQuestion.question,
      selected: selectedAnswer,
      correct: isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      difficulty: currentQuestion.difficulty,
      mocaPoints: currentQuestion.mocaPoints || 1,
    };

    setAllAnswers(prev => ({
      ...prev,
      [currentDomain.id]: { ...prev[currentDomain.id], [`q${questionNumber}`]: newAnswer },
    }));

    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setShowFeedback(false);
    setIsSubmitting(false);

    if (questionNumber >= QUESTIONS_PER_DOMAIN) {
      if (currentDomainIndex < DOMAINS.length - 1) {
        setCurrentDomainIndex(prev => prev + 1);
        setQuestionNumber(1);
        setAskedQuestions([]);
      } else {
        const finalAnswers = {
          ...allAnswers,
          [currentDomain.id]: { ...allAnswers[currentDomain.id], [`q${questionNumber}`]: newAnswer },
        };
        localStorage.setItem('healthCompassAdaptiveAnswers', JSON.stringify(finalAnswers));
        localStorage.setItem('healthCompassAdaptivePerformance', JSON.stringify(performance));
        navigate('/tests/results');
      }
    } else {
      setQuestionNumber(prev => prev + 1);
      fetchNextQuestion();
    }
  };

  const diffLevel = currentQuestion?.difficulty;

  return (
    <div className="at-root">
      <style>{ADAPTIVE_STYLES}</style>
      <div className="at-blob at-blob-1" />
      <div className="at-blob at-blob-2" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="at-main">

        {/* ── Progress header ── */}
        <div className="at-progress-card">
          <div className="at-progress-top">
            <div>
              <div className="at-domain-badge"><Brain size={10} /> Adaptive Test</div>
              <div className="at-domain-title">{currentDomain.name}</div>
              <div className="at-domain-sub">Question {questionNumber} of {QUESTIONS_PER_DOMAIN}</div>
            </div>
            <div className="at-score-wrap">
              <div className="at-score-num">{scorePercent}%</div>
              <div className="at-score-sub">{performance.correct}/{performance.total} correct</div>
            </div>
          </div>

          {/* Domain steps */}
          <div className="at-domain-steps">
            {DOMAINS.map((d, idx) => (
              <div
                key={d.id}
                className={`at-domain-step ${idx < currentDomainIndex ? 'done' : idx === currentDomainIndex ? 'active' : 'pending'}`}
                title={d.name}
              />
            ))}
          </div>

          {/* Overall */}
          <div className="at-overall-row">
            <div className="at-overall-track">
              <div className="at-overall-fill" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="at-overall-pct">{overallProgress}%</span>
          </div>
        </div>

        {/* ── Difficulty pills ── */}
        {currentQuestion && (
          <div className="at-difficulty-row">
            {['easy', 'medium', 'hard'].map((level) => (
              <span
                key={level}
                className={`at-diff-pill ${diffLevel === level ? `active-${level}` : 'inactive'}`}
              >
                {level}
              </span>
            ))}
          </div>
        )}

        {/* ── Question card ── */}
        <div className="at-q-card">
          {/* Feedback overlay */}
          {showFeedback && (
            <div className={`at-feedback ${lastAnswerCorrect ? 'at-feedback-correct' : 'at-feedback-wrong'}`}>
              {lastAnswerCorrect
                ? <CheckCircle2 size={48} color="var(--sage)" strokeWidth={1.5} />
                : <XCircle size={48} color="#B91C1C" strokeWidth={1.5} />
              }
              <div className="at-feedback-label">{lastAnswerCorrect ? 'Correct!' : 'Incorrect'}</div>
              {!lastAnswerCorrect && currentQuestion && (
                <div className="at-feedback-ans">Correct: {currentQuestion.correctAnswer}</div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="at-loading">
              <Loader2 size={38} className="at-loading-icon" />
              <div className="at-loading-text">Generating adaptive question…</div>
            </div>
          ) : error ? (
            <div className="at-error">
              <XCircle size={32} color="#B91C1C" strokeWidth={1.5} />
              <p className="at-error-text">{error}</p>
              <button className="at-btn-retry" onClick={fetchNextQuestion}>Retry</button>
            </div>
          ) : currentQuestion ? (
            <>
              <div className="at-domain-tag">{currentQuestion.cognitiveDomain || currentDomain.id}</div>
              <div className="at-q-text">{currentQuestion.question}</div>
              <div className="at-options">
                {currentQuestion.options?.map((option, idx) => (
                  <label
                    key={idx}
                    className={`at-option${selectedAnswer === option ? ' selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => setSelectedAnswer(option)}
                    />
                    <span className="at-opt-dot"><span className="at-opt-dot-inner" /></span>
                    {option}
                  </label>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* ── Action bar ── */}
        <div className="at-action-bar">
          <button className="at-btn-exit" onClick={() => {
            if (window.confirm('Are you sure you want to exit the assessment? We would love your feedback before you go.')) {
              window.dispatchEvent(new CustomEvent('open-phase4-feedback', { detail: { returnTo: '/dashboard' } }));
            }
          }}>
            <X size={15} /> Exit Test
          </button>
          <button
            className={`at-btn-submit${isLastQuestion ? ' finish' : ''}`}
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitting || isLoading}
          >
            {isSubmitting
              ? 'Submitting…'
              : isLastQuestion
                ? 'Finish Assessment'
                : 'Submit & Continue'
            }
            <ArrowRight size={16} />
          </button>
        </div>

        {/* ── Domain performance ── */}
        <div className="at-perf-panel">
          <div className="at-perf-label">Domain Performance</div>
          <div className="at-perf-row">
            {DOMAINS.map((domain, idx) => {
              const domainPerf = performance.byDomain[domain.id];
              const pct = domainPerf ? Math.round((domainPerf.correct / domainPerf.total) * 100) : null;
              const isActive = idx === currentDomainIndex;
              return (
                <div
                  key={domain.id}
                  className={`at-perf-pill${isActive ? ' active-domain' : ''}${pct !== null ? ' has-score' : ''}`}
                >
                  {domain.shortName}
                  {pct !== null && <span className="at-perf-pct">{pct}%</span>}
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}

export default AdaptiveTest;