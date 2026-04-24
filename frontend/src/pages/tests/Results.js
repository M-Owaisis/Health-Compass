import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Brain, LayoutDashboard, Home, RefreshCw, AlertCircle, BarChart2, ShieldCheck, Check } from 'lucide-react';

const ANSWER_KEY = 'healthCompassAnswers';
const TEST_KEY = 'healthCompassTests';
const ADAPTIVE_ANSWER_KEY = 'healthCompassAdaptiveAnswers';
const PROFILE_KEY = 'healthCompassProfile';

const STYLES = `
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

  .res-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--font-body);
    color: var(--navy);
    position: relative;
    overflow-x: hidden;
  }

  .bg-blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.3; }
  .bg-blob-1 { width: 500px; height: 500px; top: -100px; right: -80px; background: radial-gradient(circle, #B8D4CE, #6B9E9100); animation: blobDrift 18s ease-in-out infinite alternate; }
  .bg-blob-2 { width: 380px; height: 380px; bottom: 10%; left: -100px; background: radial-gradient(circle, #D4793A44, #D4793A00); animation: blobDrift 22s ease-in-out infinite alternate-reverse; }
  @keyframes blobDrift { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,20px) scale(1.06); } }

  .res-main {
    position: relative;
    z-index: 1;
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 2rem 5rem;
  }

  /* ── Page header ── */
  .res-page-header { margin-bottom: 2rem; animation: cardRise 0.6s cubic-bezier(.22,.68,0,1.2) both; }
  .res-page-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.28rem 0.8rem;
    border-radius: 999px;
    background: var(--sage-pale);
    color: var(--sage);
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase;
    margin-bottom: 0.6rem;
    border: 1px solid rgba(74,124,111,0.2);
  }
  .res-page-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--navy); line-height: 1.15; margin-bottom: 0.3rem; }
  .res-page-title em { font-style: italic; color: var(--sage); }
  .res-page-sub { font-size: 0.92rem; color: var(--slate); line-height: 1.6; }

  @keyframes cardRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes barSweep { from { width: 0; } to { } }

  /* ── MoCA card ── */
  .res-moca-card {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
    border-radius: var(--radius-xl);
    padding: 2.5rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    animation: cardRise 0.55s cubic-bezier(.22,.68,0,1.2) both;
    box-shadow: 0 30px 60px -12px rgba(28, 43, 58, 0.35);
  }
  .res-moca-card::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(107,158,145,0.22), transparent 70%);
    pointer-events: none;
    filter: blur(25px);
  }
  .res-moca-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
  }
  .res-moca-label {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.1);
    color: var(--sage-light);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 0.8rem;
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(4px);
  }
  .res-moca-title { font-family: var(--font-display); font-size: 1.6rem; color: var(--cream); margin-bottom: 0.4rem; letter-spacing: -0.01em; }
  .res-moca-sub { font-size: 0.9rem; color: rgba(250,247,242,0.55); font-weight: 500; }

  .res-moca-score-wrap { 
    text-align: right; 
    flex-shrink: 0;
    background: rgba(255,255,255,0.05);
    padding: 1rem 1.5rem;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(4px);
  }
  .res-moca-num {
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 4.2rem);
    line-height: 1;
    margin-bottom: 0.2rem;
    text-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  .res-moca-denom { font-size: 1.4rem; color: rgba(250,247,242,0.3); font-weight: 400; }
  .res-moca-adj { font-size: 0.85rem; color: rgba(250,247,242,0.5); margin-top: 0.3rem; font-weight: 600; }

  /* Interpretation banner */
  .res-moca-interp {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid;
    margin-bottom: 1.5rem;
    position: relative;
    backdrop-filter: blur(4px);
  }
  .res-moca-interp-dot {
    width: 12px; height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 10px currentColor;
  }
  .res-moca-interp-label { font-weight: 700; font-size: 1.1rem; margin-bottom: 0.2rem; }
  .res-moca-interp-text { font-size: 0.92rem; color: rgba(250,247,242,0.7); line-height: 1.6; }

  /* Range legend */
  .res-moca-ranges {
    display: flex; flex-wrap: wrap; gap: 1rem;
    position: relative;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .res-range-item { display: flex; align-items: center; gap: 0.5rem; }
  .res-range-dot { width: 10px; height: 10px; border-radius: 3px; }
  .res-range-label { font-size: 0.8rem; letter-spacing: 0.01em; }

  /* ── Summary card ── */
  .res-summary-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    margin-bottom: 2rem;
    animation: cardRise 0.55s 0.05s cubic-bezier(.22,.68,0,1.2) both;
  }
  .res-summary-title { font-family: var(--font-display); font-size: 1.4rem; color: var(--navy); margin-bottom: 0.6rem; }
  .res-summary-desc { font-size: 0.95rem; color: var(--slate); line-height: 1.7; margin-bottom: 1.5rem; }
  .res-summary-stats { display: flex; gap: 3rem; flex-wrap: wrap; }
  .res-stat-item {
    padding-left: 1.2rem;
    border-left: 3px solid var(--sage-pale);
  }
  .res-stat-label { font-size: 0.75rem; color: var(--slate); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; }
  .res-stat-val { font-size: 1.8rem; font-weight: 800; color: var(--navy); letter-spacing: -0.02em; }

  /* ── Empty state ── */
  .res-empty {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    text-align: center;
    color: var(--slate);
    font-size: 0.95rem;
    line-height: 1.65;
  }

  /* ── Content grid ── */
  .res-content { display: grid; gap: 1.2rem; animation: cardRise 0.55s 0.1s cubic-bezier(.22,.68,0,1.2) both; }

  /* ── Radar card ── */
  .res-radar-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.6rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
  }
  .res-radar-left { max-width: 340px; flex: 1; min-width: 220px; }
  .res-radar-title { font-family: var(--font-display); font-size: 1.2rem; color: var(--navy); margin-bottom: 0.4rem; }
  .res-radar-desc { font-size: 0.875rem; color: var(--slate); line-height: 1.6; margin-bottom: 1.1rem; }

  .res-domain-list { display: flex; flex-direction: column; gap: 0.45rem; }
  .res-domain-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.4rem 0.7rem;
    border-radius: var(--radius-sm);
    background: var(--cream);
    border: 1px solid var(--border);
    font-size: 0.875rem;
  }
  .res-domain-name { color: var(--text-body); }
  .res-domain-pct { font-weight: 700; font-size: 0.9rem; }

  .res-radar-chart-wrap {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── Domain breakdown cards ── */
  .res-domain-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.1rem 1.3rem;
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .res-domain-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

  .res-domain-card-top {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.75rem; gap: 1rem;
  }
  .res-domain-card-name { font-weight: 600; font-size: 0.92rem; color: var(--navy); }
  .res-domain-card-right { display: flex; align-items: center; gap: 0.9rem; }
  .res-domain-card-count { font-size: 0.85rem; color: var(--slate); }
  .res-domain-card-pct { font-weight: 700; font-size: 1rem; }

  .res-bar-track { height: 8px; border-radius: 999px; background: var(--cream-dark); overflow: hidden; }
  .res-bar-fill { height: 100%; border-radius: 999px; animation: barSweep 0.8s ease-out both; }

  /* ── Adaptive badge ── */
  .res-adaptive-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    background: rgba(107,158,145,0.18);
    color: var(--sage-light);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid rgba(107,158,145,0.3);
    margin-left: 0.5rem;
    vertical-align: middle;
  }

  /* ── Disclaimer ── */
  .res-disclaimer {
    display: flex; align-items: flex-start; gap: 0.75rem;
    padding: 1rem 1.2rem;
    background: var(--amber-pale);
    border: 1px solid rgba(212,121,58,0.25);
    border-radius: var(--radius-md);
    margin-top: 1.5rem;
    animation: cardRise 0.55s 0.15s cubic-bezier(.22,.68,0,1.2) both;
  }
  .res-disclaimer-icon { color: var(--amber); flex-shrink: 0; margin-top: 1px; }
  .res-disclaimer-text { font-size: 0.85rem; color: #7A5230; line-height: 1.65; }
  .res-disclaimer-text strong { color: var(--navy); }

  /* ── Action buttons ── */
  .res-actions {
    display: flex; gap: 0.75rem; flex-wrap: wrap;
    margin-top: 2rem;
    animation: cardRise 0.55s 0.2s cubic-bezier(.22,.68,0,1.2) both;
  }

  .res-btn-primary {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.8rem 1.5rem; border-radius: 999px;
    background: var(--navy); color: var(--cream);
    font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
    text-decoration: none;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(28,43,58,0.2);
  }
  .res-btn-primary:hover { background: var(--navy-mid); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(28,43,58,0.25); }

  .res-btn-secondary {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.8rem 1.5rem; border-radius: 999px;
    background: transparent; color: var(--navy);
    font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
    text-decoration: none;
    border: 1.5px solid rgba(28,43,58,0.18);
    transition: background 0.2s, border-color 0.2s, transform 0.18s;
  }
  .res-btn-secondary:hover { background: var(--cream-dark); border-color: rgba(28,43,58,0.28); transform: translateY(-2px); }

  .res-btn-ai {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.8rem 1.5rem; border-radius: 999px;
    background: var(--amber); color: #fff;
    font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
    text-decoration: none;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(212,121,58,0.28);
  }
  .res-btn-ai:hover { background: #C06A2F; transform: translateY(-2px); }
`;

// ── Colour logic tied to design system ──
function domainColor(percent) {
  if (percent >= 80) return { text: 'var(--sage)', bar: 'linear-gradient(90deg, var(--sage-light), var(--sage))' };
  if (percent >= 60) return { text: 'var(--navy)', bar: 'linear-gradient(90deg, var(--sage-light), var(--navy-mid))' };
  if (percent >= 40) return { text: 'var(--amber)', bar: 'linear-gradient(90deg, #E8944A, var(--amber))' };
  return { text: '#B91C1C', bar: 'linear-gradient(90deg, #F87171, #DC2626)' };
}

function mocaColor(severity) {
  if (severity === 'normal') return { hex: '#4A7C6F', css: 'var(--sage)' };
  if (severity === 'mild') return { hex: '#D4793A', css: 'var(--amber)' };
  if (severity === 'moderate') return { hex: '#C96A28', css: '#C96A28' };
  return { hex: '#B91C1C', css: '#B91C1C' };
}

const abilityOrder = [
  { id: 'global', label: 'Global' },
  { id: 'episodic-memory', label: 'Episodic' },
  { id: 'executive', label: 'Executive' },
  { id: 'language', label: 'Language' },
  { id: 'functional', label: 'Functional' },
];

function Results({ user, onLogout, refreshUser }) {
  const [mocaScore, setMocaScore] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const isAdaptive = useMemo(() => localStorage.getItem(ADAPTIVE_ANSWER_KEY) !== null, []);

  const summary = useMemo(() => {
    if (isAdaptive) {
      const adaptiveAnswers = JSON.parse(localStorage.getItem(ADAPTIVE_ANSWER_KEY) || '{}');
      const rows = Object.entries(adaptiveAnswers).map(([domainId, questions]) => {
        const questionList = Object.values(questions);
        const total = questionList.length;
        const correctCount = questionList.filter(q => q.correct).length;
        const totalMocaPoints = questionList.reduce((sum, q) => sum + (q.mocaPoints || 1), 0);
        const earnedMocaPoints = questionList.filter(q => q.correct).reduce((sum, q) => sum + (q.mocaPoints || 1), 0);
        const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        const domainNames = { 'global': 'Global Cognitive Screen', 'episodic-memory': 'Episodic Memory', 'executive': 'Executive Function', 'language': 'Language', 'functional': 'Functional Assessment' };
        return { id: domainId, title: domainNames[domainId] || domainId, correctCount, total, percent, mocaPoints: { earned: earnedMocaPoints, total: totalMocaPoints }, questions: questionList };
      });
      const overallCorrect = rows.reduce((s, r) => s + r.correctCount, 0);
      const overallTotal = rows.reduce((s, r) => s + r.total, 0);
      const overallMocaEarned = rows.reduce((s, r) => s + r.mocaPoints.earned, 0);
      const overallMocaTotal = rows.reduce((s, r) => s + r.mocaPoints.total, 0);
      const overallPercent = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;
      return { rows, overallCorrect, overallTotal, overallPercent, mocaPoints: { earned: overallMocaEarned, total: overallMocaTotal }, isAdaptive: true };
    } else {
      const storedTests = JSON.parse(localStorage.getItem(TEST_KEY) || '[]');
      const storedAnswers = JSON.parse(localStorage.getItem(ANSWER_KEY) || '{}');
      const normalizeValue = (value) => String(value || '').trim().toLowerCase();
      const rows = storedTests.map((test) => {
        const answers = storedAnswers[test.id] || {};
        const questions = test.questions || [];
        const total = questions.length;
        let totalMocaPoints = 0, earnedMocaPoints = 0;
        const correctCount = questions.reduce((sum, question) => {
          const key = question.id;
          const value = key ? answers[key] : undefined;
          const points = question.mocaPoints || 1;
          totalMocaPoints += points;
          if (value === undefined || value === '' || value === null) return sum;
          const normalizedValue = normalizeValue(value);
          const correctAnswer = normalizeValue(question.correctAnswer);
          const acceptableAnswers = Array.isArray(question.acceptableAnswers) ? question.acceptableAnswers.map(normalizeValue) : [];
          const isCorrect = normalizedValue !== '' && (normalizedValue === correctAnswer || acceptableAnswers.includes(normalizedValue));
          if (isCorrect) earnedMocaPoints += points;
          return sum + (isCorrect ? 1 : 0);
        }, 0);
        const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        return { id: test.id, title: test.title || test.id, correctCount, total, percent, mocaPoints: { earned: earnedMocaPoints, total: totalMocaPoints } };
      });
      const overallCorrect = rows.reduce((s, r) => s + r.correctCount, 0);
      const overallTotal = rows.reduce((s, r) => s + r.total, 0);
      const overallMocaEarned = rows.reduce((s, r) => s + r.mocaPoints.earned, 0);
      const overallMocaTotal = rows.reduce((s, r) => s + r.mocaPoints.total, 0);
      const overallPercent = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;
      return { rows, overallCorrect, overallTotal, overallPercent, mocaPoints: { earned: overallMocaEarned, total: overallMocaTotal }, isAdaptive: false };
    }
  }, [isAdaptive]);

  const profile = useMemo(() => JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'), []);

  useEffect(() => {
    const { mocaPoints } = summary;
    if (!mocaPoints || mocaPoints.total === 0) return;
    let mocaEquivalent = Math.round((mocaPoints.earned / mocaPoints.total) * 30);
    let adjustments = [];
    const education = profile.education || 'high-school';
    if (education === 'elementary' || education === 'high-school') {
      mocaEquivalent = Math.min(30, mocaEquivalent + 1);
      adjustments.push('+1 for education (≤12 years)');
    }
    let interpretation, severity;
    if (mocaEquivalent >= 26) { interpretation = 'Normal cognitive function'; severity = 'normal'; }
    else if (mocaEquivalent >= 18) { interpretation = 'Mild Cognitive Impairment (MCI) range'; severity = 'mild'; }
    else if (mocaEquivalent >= 10) { interpretation = 'Moderate cognitive impairment'; severity = 'moderate'; }
    else { interpretation = 'Severe cognitive impairment'; severity = 'severe'; }
    setMocaScore({ raw: Math.round((mocaPoints.earned / mocaPoints.total) * 30), adjusted: mocaEquivalent, adjustments, interpretation, severity, maxScore: 30 });
  }, [summary, profile]);

  const abilityScores = useMemo(() => {
    const rowMap = new Map(summary.rows.map((row) => [row.id, row]));
    return abilityOrder.map((domain) => ({ ...domain, percent: rowMap.get(domain.id)?.percent ?? 0 }));
  }, [summary.rows]);

  const handleSaveToHistory = async () => {
    if (!mocaScore || isSaved) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const token = localStorage.getItem('token');
      const interpretation = mocaScore.interpretation;
      const severity = mocaScore.severity;

      const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/assessment/save-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: profile,
          scores: { total: mocaScore.adjusted, max: 30 },
          prediction: severity,
          interpretation: interpretation
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsSaved(true);
        if (refreshUser) refreshUser(); // Update usage counts globally
      } else {
        throw new Error(data.message || 'Failed to save');
      }
    } catch (err) {
      setSaveError('Failed to save result to history.');
    } finally {
      setIsSaving(false);
    }
  };

  const radar = useMemo(() => {
    const size = 300;
    const center = size / 2;
    const radius = 105;
    const rings = 4;
    const angleStep = (Math.PI * 2) / abilityScores.length;
    const polarToPoint = (value, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const r = (value / 100) * radius;
      return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
    };
    const axisPoints = abilityScores.map((_, i) => polarToPoint(100, i));
    const scorePoints = abilityScores.map((score, i) => polarToPoint(score.percent, i));
    return { size, center, radius, rings, axisPoints, scorePoints };
  }, [abilityScores]);

  // Save assessment to history once per unique test generation
  useEffect(() => {
    if (!mocaScore) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    // Key is tied to the test-generation timestamp so each new test run
    // saves exactly once, even if the user navigates away and returns.
    const metadata = JSON.parse(localStorage.getItem('healthCompassMetadata') || '{}');
    const generatedAt = metadata.generatedAt || 'default';
    const sessionKey = `healthCompassResultsSaved_${generatedAt}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');

    const saveAssessment = async () => {
      try {
        const hasStandardAnswers = localStorage.getItem(ANSWER_KEY);
        const hasAdaptiveAnswers = localStorage.getItem(ADAPTIVE_ANSWER_KEY);

        // FIX: Don't save if there are no answers at all (prevents empty 0/30 shells)
        if (!hasStandardAnswers && !hasAdaptiveAnswers) return;

        const overallCorrect = summary.rows.reduce((s, r) => s + (r.correctCount || 0), 0);
        const overallTotal = summary.rows.reduce((s, r) => s + (r.total || 0), 0);

        // FIX: Don't save if the test structure is empty
        if (overallTotal === 0) return;
        const byDomain = summary.rows.reduce((obj, r) => {
          obj[r.id] = { earned: r.correctCount || 0, total: r.total || 0, percentage: r.percent || 0 };
          return obj;
        }, {});

        const res = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/assessment/save-result`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            profile,
            scores: {
              raw: {
                earned: overallCorrect,
                total: overallTotal,
                percentage: summary.overallPercent,
              },
              mocaEquivalent: {
                raw: mocaScore.raw,
                adjusted: mocaScore.adjusted,
                adjustments: mocaScore.adjustments || [],
              },
              byDomain,
            },
            prediction: null,
            interpretation: {
              level: mocaScore.interpretation,
              note: 'This is a screening tool, not a diagnostic assessment. Please consult a healthcare professional for clinical interpretation.',
            },
          }),
        });
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to save assessment history:', data.message);
        }
      } catch (err) {
        console.error('Failed to save assessment history:', err);
      }
    };

    saveAssessment();
  }, [mocaScore]); 

  const handleRetakeTest = () => {
    const metadata = JSON.parse(localStorage.getItem('healthCompassMetadata') || '{}');
    const generatedAt = metadata.generatedAt || 'default';
    sessionStorage.removeItem(`healthCompassResultsSaved_${generatedAt}`);
    localStorage.removeItem(ANSWER_KEY);
    localStorage.removeItem(ADAPTIVE_ANSWER_KEY);
    localStorage.removeItem(TEST_KEY);
  };

  const mc = mocaScore ? mocaColor(mocaScore.severity) : mocaColor('normal');

  const interpText = {
    normal: 'Score is within normal limits. Continue regular health monitoring and annual check-ins.',
    mild: 'Score suggests possible mild cognitive changes. A follow-up assessment with a healthcare provider is recommended.',
    moderate: 'Score indicates moderate cognitive changes. A comprehensive evaluation by a specialist is advised.',
    severe: 'Score suggests significant cognitive impairment. Urgent clinical evaluation is strongly recommended.',
  };

  const ranges = [
    { range: '26–30', label: 'Normal', color: 'var(--sage)' },
    { range: '18–25', label: 'Mild MCI', color: 'var(--amber)' },
    { range: '10–17', label: 'Moderate', color: '#C96A28' },
    { range: '0–9', label: 'Severe', color: '#B91C1C' },
  ];

  return (
    <div className="res-root">
      <style>{STYLES}</style>
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="res-main">

        {/* ── Page header ── */}
        <div className="res-page-header">
          <div className="res-page-badge"><BarChart2 size={11} /> Assessment Results</div>
          <h1 className="res-page-title">Your <em>Cognitive</em> Profile</h1>
          <p className="res-page-sub">
            A screening summary across five cognitive domains.
            {summary.isAdaptive && <span className="res-adaptive-badge">Adaptive</span>}
          </p>
        </div>

        {/* ── MoCA Card ── */}
        {mocaScore && (
          <div className="res-moca-card">
            <div className="res-moca-top">
              <div>
                <div className="res-moca-label"><Brain size={11} /> MoCA-Equivalent Score</div>
                <div className="res-moca-title">Montreal Cognitive Assessment</div>
                <div className="res-moca-sub">Normalised to 30-point MoCA scale</div>
              </div>
              <div className="res-moca-score-wrap">
                <div className="res-moca-num" style={{ color: mc.css }}>
                  {mocaScore.adjusted}
                  <span className="res-moca-denom">/30</span>
                </div>
                {mocaScore.adjustments.length > 0 && (
                  <div className="res-moca-adj">{mocaScore.adjustments.join(', ')}</div>
                )}
              </div>
            </div>

            {/* Interpretation */}
            <div
              className="res-moca-interp"
              style={{ background: `${mc.hex}18`, borderColor: `${mc.hex}40` }}
            >
              <div className="res-moca-interp-dot" style={{ background: mc.css }} />
              <div>
                <div className="res-moca-interp-label" style={{ color: mc.css }}>{mocaScore.interpretation}</div>
                <div className="res-moca-interp-text">{interpText[mocaScore.severity]}</div>
              </div>
            </div>

            {/* Ranges */}
            <div className="res-moca-ranges">
              {ranges.map((item) => (
                <div key={item.range} className="res-range-item">
                  <div
                    className="res-range-dot"
                    style={{ background: item.color, opacity: mc.css === item.color ? 1 : 0.35 }}
                  />
                  <span
                    className="res-range-label"
                    style={{
                      color: mc.css === item.color ? 'var(--cream)' : 'rgba(250,247,242,0.45)',
                      fontWeight: mc.css === item.color ? 600 : 400,
                    }}
                  >
                    {item.range}: {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Summary ── */}
        <div className="res-summary-card">
          <div className="res-summary-title">Assessment Summary</div>
          <p className="res-summary-desc">
            Raw scores reflect correct answers across all cognitive domains. This is a screening tool, not a diagnostic assessment.
          </p>
          <div className="res-summary-stats">
            <div className="res-stat-item">
              <div className="res-stat-label">Questions correct</div>
              <div className="res-stat-val">{summary.overallCorrect}<span style={{ fontSize: '0.85rem', color: 'var(--slate)', fontWeight: 400 }}>/{summary.overallTotal}</span></div>
            </div>
            <div className="res-stat-item">
              <div className="res-stat-label">Overall accuracy</div>
              <div className="res-stat-val" style={{ color: 'var(--sage)' }}>{summary.overallPercent}%</div>
            </div>
          </div>
        </div>

        {/* ── Empty ── */}
        {summary.rows.length === 0 ? (
          <div className="res-empty">
            No test data yet. Generate your tests from the dashboard to see results here.
          </div>
        ) : (
          <div className="res-content">

            {/* ── Radar card ── */}
            <div className="res-radar-card">
              <div className="res-radar-left">
                <div className="res-radar-title">Cognitive Profile</div>
                <p className="res-radar-desc">
                  Visual summary across five domains. Higher coverage indicates stronger performance in that area.
                </p>
                <div className="res-domain-list">
                  {abilityScores.map((score) => {
                    const c = domainColor(score.percent);
                    return (
                      <div key={score.id} className="res-domain-row">
                        <span className="res-domain-name">{score.label}</span>
                        <span className="res-domain-pct" style={{ color: c.text }}>{score.percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="res-radar-chart-wrap">
                <svg width={radar.size} height={radar.size} viewBox={`0 0 ${radar.size} ${radar.size}`}>
                  <defs>
                    <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6B9E91" />
                      <stop offset="100%" stopColor="#4A7C6F" />
                    </linearGradient>
                    <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(107,158,145,0.45)" />
                      <stop offset="100%" stopColor="rgba(74,124,111,0.1)" />
                    </radialGradient>
                  </defs>

                  {[...Array(radar.rings)].map((_, i) => {
                    const r = ((i + 1) / radar.rings) * radar.radius;
                    return <circle key={r} cx={radar.center} cy={radar.center} r={r} fill="none" stroke="rgba(74,124,111,0.15)" strokeDasharray="4 4" />;
                  })}

                  {radar.axisPoints.map((point, i) => (
                    <line key={abilityScores[i].id} x1={radar.center} y1={radar.center} x2={point.x} y2={point.y} stroke="rgba(74,124,111,0.2)" />
                  ))}

                  <polygon
                    points={radar.axisPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="rgba(74,124,111,0.04)"
                    stroke="rgba(74,124,111,0.18)"
                  />

                  <polygon
                    points={radar.scorePoints.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="url(#radarFill)"
                    stroke="url(#radarStroke)"
                    strokeWidth="2"
                  />

                  {radar.axisPoints.map((point, i) => (
                    <text
                      key={`label-${abilityScores[i].id}`}
                      x={point.x}
                      y={point.y}
                      fill="var(--navy)"
                      fontSize="11"
                      fontFamily="DM Sans, sans-serif"
                      fontWeight="600"
                      textAnchor={point.x < radar.center - 10 ? 'end' : point.x > radar.center + 10 ? 'start' : 'middle'}
                      dominantBaseline={point.y < radar.center ? 'auto' : 'hanging'}
                    >
                      {abilityScores[i].label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* ── Domain breakdown ── */}
            {summary.rows.map((row, index) => {
              const c = domainColor(row.percent);
              return (
                <div
                  key={row.id}
                  className="res-domain-card"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className="res-domain-card-top">
                    <div className="res-domain-card-name">{row.title}</div>
                    <div className="res-domain-card-right">
                      <span className="res-domain-card-count">{row.correctCount}/{row.total} correct</span>
                      <span className="res-domain-card-pct" style={{ color: c.text }}>{row.percent}%</span>
                    </div>
                  </div>
                  <div className="res-bar-track">
                    <div className="res-bar-fill" style={{ width: `${row.percent}%`, background: c.bar }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div className="res-disclaimer">
          <AlertCircle size={17} className="res-disclaimer-icon" />
          <p className="res-disclaimer-text">
            <strong>Important:</strong> This assessment is a screening tool based on MoCA standards and is not a substitute for professional medical evaluation. Results should be interpreted by a qualified healthcare provider.
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="res-actions">
          {!isSaved ? (
            <button className="res-btn-primary" onClick={handleSaveToHistory} disabled={isSaving}>
              {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {isSaving ? 'Saving...' : 'Save to History'}
            </button>
          ) : (
            <div className="res-save-success">
              <Check size={16} /> Saved to History
            </div>
          )}

          <Link to="/dashboard" className="res-btn-secondary">
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          <Link to="/tests/clinical-risk" className="res-btn-ai">
            <Brain size={16} /> AI Risk Assessment
          </Link>

          <Link to="/home" className="res-btn-secondary">
            <Home size={16} /> Home
          </Link>
        </div>

      </main>
    </div>
  );
}

export default Results;