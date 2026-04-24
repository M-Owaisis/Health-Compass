import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Brain, ArrowLeft, AlertCircle, CheckCircle2, LayoutDashboard, Home, Loader2 } from 'lucide-react';

const PROFILE_KEY = 'healthCompassProfile';
const ANSWER_KEY = 'healthCompassAnswers';
const ADAPTIVE_ANSWER_KEY = 'healthCompassAdaptiveAnswers';
const TEST_KEY = 'healthCompassTests';

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

  .cra-root {
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

  .cra-main {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 2rem 5rem;
  }

  /* ── Loading ── */
  .cra-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    gap: 1.2rem;
    position: relative;
    z-index: 1;
  }
  .cra-loading-icon { color: var(--sage); animation: spin 0.9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .cra-loading-text {
    font-size: 1rem;
    color: var(--slate);
    font-family: var(--font-body);
  }
  .cra-loading-sub { font-size: 0.85rem; color: var(--sage-light); }

  /* ── Error ── */
  .cra-error-card {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    text-align: center;
    margin-top: 2rem;
  }
  .cra-error-title { font-family: var(--font-display); font-size: 1.5rem; color: #B91C1C; margin-bottom: 0.75rem; }
  .cra-error-text { color: #7F1D1D; line-height: 1.65; margin-bottom: 1.5rem; }

  /* ── Back link ── */
  .cra-back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--slate);
    text-decoration: none;
    margin-bottom: 1.8rem;
    transition: color 0.2s;
    padding: 0.3rem 0;
  }
  .cra-back:hover { color: var(--sage); }

  /* ── Hero risk card ── */
  .cra-hero {
    border-radius: var(--radius-xl);
    padding: 2.2rem;
    border: 1.5px solid;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
    animation: cardRise 0.6s cubic-bezier(.22,.68,0,1.2) both;
  }
  @keyframes cardRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .cra-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, currentColor, transparent 70%);
    opacity: 0.07;
    pointer-events: none;
  }

  .cra-hero-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .cra-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.28rem 0.8rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
    border: 1px solid;
  }

  .cra-hero-title {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--navy);
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }
  .cra-hero-sub { font-size: 0.85rem; color: var(--slate); }

  .cra-risk-pill {
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.95rem;
    color: #fff;
    white-space: nowrap;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }

  /* ── Probability display ── */
  .cra-prob-section {
    text-align: center;
    margin-bottom: 1.8rem;
  }
  .cra-prob-num {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 4.5rem);
    line-height: 1;
    margin-bottom: 0.35rem;
  }
  .cra-prob-label { font-size: 0.95rem; color: var(--text-body); font-weight: 500; }

  /* ── Progress bar ── */
  .cra-bar-track {
    height: 10px;
    border-radius: 999px;
    background: rgba(28, 43, 58, 0.08);
    overflow: hidden;
    margin-bottom: 1.8rem;
  }
  .cra-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(.22,.68,0,1.2);
  }

  /* ── Recommendation box ── */
  .cra-rec-box {
    border-radius: var(--radius-md);
    padding: 1.4rem;
    border: 1px solid;
  }
  .cra-rec-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
    color: var(--navy);
  }
  .cra-rec-text { font-size: 0.92rem; color: var(--text-body); line-height: 1.7; }

  /* ── Patient summary card ── */
  .cra-summary-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.6rem;
    box-shadow: var(--shadow-sm);
    margin-bottom: 1.5rem;
    animation: cardRise 0.6s 0.1s cubic-bezier(.22,.68,0,1.2) both;
  }
  .cra-summary-title {
    font-family: var(--font-display);
    font-size: 1.2rem;
    color: var(--navy);
    margin-bottom: 1rem;
  }
  .cra-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  .cra-summary-item {}
  .cra-summary-item-label { font-size: 0.75rem; font-weight: 600; color: var(--slate); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; }
  .cra-summary-item-val { font-size: 1.15rem; font-weight: 600; color: var(--navy); }

  /* ── Disclaimer ── */
  .cra-disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.2rem;
    background: var(--amber-pale);
    border: 1px solid rgba(212, 121, 58, 0.25);
    border-radius: var(--radius-md);
    margin-bottom: 2rem;
    animation: cardRise 0.6s 0.2s cubic-bezier(.22,.68,0,1.2) both;
  }
  .cra-disclaimer-icon { color: var(--amber); flex-shrink: 0; margin-top: 1px; }
  .cra-disclaimer-text { font-size: 0.85rem; color: #7A5230; line-height: 1.65; }
  .cra-disclaimer-text strong { color: var(--navy); }

  /* ── Action buttons ── */
  .cra-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    animation: cardRise 0.6s 0.25s cubic-bezier(.22,.68,0,1.2) both;
  }

  .cra-btn-primary {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.8rem 1.5rem;
    border-radius: 999px;
    background: var(--navy);
    color: var(--cream);
    font-family: var(--font-body);
    font-size: 0.9rem; font-weight: 600;
    text-decoration: none;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(28,43,58,0.2);
  }
  .cra-btn-primary:hover { background: var(--navy-mid); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(28,43,58,0.25); }

  .cra-btn-secondary {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.8rem 1.5rem;
    border-radius: 999px;
    background: transparent;
    color: var(--navy);
    font-family: var(--font-body);
    font-size: 0.9rem; font-weight: 600;
    text-decoration: none;
    border: 1.5px solid rgba(28,43,58,0.18);
    transition: background 0.2s, border-color 0.2s, transform 0.18s;
  }
  .cra-btn-secondary:hover { background: var(--cream-dark); border-color: rgba(28,43,58,0.28); transform: translateY(-2px); }

  /* ── Primary btn back to results ── */
  .cra-btn-sage {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.8rem 1.5rem;
    border-radius: 999px;
    background: var(--sage);
    color: #fff;
    font-family: var(--font-body);
    font-size: 0.9rem; font-weight: 600;
    text-decoration: none;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(74,124,111,0.25);
  }
  .cra-btn-sage:hover { background: var(--sage-light); transform: translateY(-2px); }
`;

// ── Risk color mapping to design system ──
function getRiskStyle(riskLevel) {
  if (!riskLevel) return { bg: 'var(--sage-pale)', border: 'var(--border)', pill: 'var(--sage)', bar: 'var(--sage)', rec: 'var(--sage-pale)', recBorder: 'rgba(74,124,111,0.25)', badge: 'var(--sage-pale)', badgeBorder: 'rgba(74,124,111,0.2)', badgeColor: 'var(--sage)' };
  const level = riskLevel.toLowerCase();
  if (level === 'low') return {
    bg: '#F0F9F7', border: 'rgba(74, 124, 111, 0.35)', pill: '#3D7A6B', bar: 'linear-gradient(90deg, #6B9E91, #4A7C6F)',
    rec: 'var(--sage-pale)', recBorder: 'rgba(74,124,111,0.2)', badge: 'var(--sage-pale)', badgeBorder: 'rgba(74,124,111,0.25)', badgeColor: 'var(--sage)', probColor: 'var(--sage)',
  };
  if (level === 'moderate') return {
    bg: '#FFFBF0', border: 'rgba(212, 121, 58, 0.4)', pill: '#C96A28', bar: 'linear-gradient(90deg, #E8944A, #D4793A)',
    rec: 'var(--amber-pale)', recBorder: 'rgba(212,121,58,0.22)', badge: 'var(--amber-pale)', badgeBorder: 'rgba(212,121,58,0.3)', badgeColor: 'var(--amber)', probColor: 'var(--amber)',
  };
  if (level === 'high') return {
    bg: '#FEF5F5', border: 'rgba(185, 28, 28, 0.35)', pill: '#B91C1C', bar: 'linear-gradient(90deg, #F87171, #DC2626)',
    rec: '#FEF2F2', recBorder: '#FECACA', badge: '#FEF2F2', badgeBorder: '#FECACA', badgeColor: '#B91C1C', probColor: '#DC2626',
  };
  return {
    bg: 'var(--sage-pale)', border: 'var(--border)', pill: 'var(--sage)', bar: 'var(--sage)',
    rec: 'var(--sage-pale)', recBorder: 'var(--border)', badge: 'var(--sage-pale)', badgeBorder: 'var(--border)', badgeColor: 'var(--sage)', probColor: 'var(--sage)',
  };
}

function ClinicalRiskAssessment({ user, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [assessmentSummary, setAssessmentSummary] = useState(null);

  useEffect(() => {
    const loadAssessmentData = () => {
      try {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        let profile = {};
        if (savedProfile) profile = JSON.parse(savedProfile);

        const isAdaptive = localStorage.getItem(ADAPTIVE_ANSWER_KEY) !== null;
        let domainScores = [], overallPercent = 0, mocaScore = null;

        if (isAdaptive) {
          const adaptiveAnswers = JSON.parse(localStorage.getItem(ADAPTIVE_ANSWER_KEY) || '{}');
          const rows = Object.entries(adaptiveAnswers).map(([domainId, questions]) => {
            const questionList = Object.values(questions);
            const total = questionList.length;
            const correctCount = questionList.filter(q => q.correct).length;
            const totalMocaPoints = questionList.reduce((sum, q) => sum + (q.mocaPoints || 1), 0);
            const earnedMocaPoints = questionList.filter(q => q.correct).reduce((sum, q) => sum + (q.mocaPoints || 1), 0);
            const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
            return { id: domainId, title: domainId, percent, correctCount, total, mocaPoints: { earned: earnedMocaPoints, total: totalMocaPoints } };
          });
          const overallCorrect = rows.reduce((sum, r) => sum + r.correctCount, 0);
          const overallTotal = rows.reduce((sum, r) => sum + r.total, 0);
          const overallMocaEarned = rows.reduce((sum, r) => sum + r.mocaPoints.earned, 0);
          const overallMocaTotal = rows.reduce((sum, r) => sum + r.mocaPoints.total, 0);
          overallPercent = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;
          const rawMoca = Math.round((overallMocaEarned / overallMocaTotal) * 30);
          const education = profile.education || 'high-school';
          const adjustedMoca = (education === 'elementary' || education === 'high-school') ? Math.min(30, rawMoca + 1) : rawMoca;
          mocaScore = { raw: rawMoca, adjusted: adjustedMoca };
          domainScores = rows;
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
            return { id: test.id, title: test.title, percent, correctCount, total, mocaPoints: { earned: earnedMocaPoints, total: totalMocaPoints } };
          });
          const overallCorrect = rows.reduce((sum, r) => sum + r.correctCount, 0);
          const overallTotal = rows.reduce((sum, r) => sum + r.total, 0);
          const overallMocaEarned = rows.reduce((sum, r) => sum + r.mocaPoints.earned, 0);
          const overallMocaTotal = rows.reduce((sum, r) => sum + r.mocaPoints.total, 0);
          overallPercent = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;
          const rawMoca = Math.round((overallMocaEarned / overallMocaTotal) * 30);
          const education = profile.education || 'high-school';
          const adjustedMoca = (education === 'elementary' || education === 'high-school') ? Math.min(30, rawMoca + 1) : rawMoca;
          mocaScore = { raw: rawMoca, adjusted: adjustedMoca };
          domainScores = rows;
        }

        setAssessmentSummary({ profile, domainScores, overallPercent, mocaScore, isAdaptive });
      } catch (err) {
        setError('Failed to load assessment data');
        setLoading(false);
      }
    };
    loadAssessmentData();
  }, []);

  useEffect(() => {
    const classifyRisk = async () => {
      if (!assessmentSummary) return;
      setLoading(true); setError(null);
      try {
        const { profile, domainScores, mocaScore, overallPercent, isAdaptive } = assessmentSummary;
        const domainMap = {};
        domainScores.forEach(domain => { domainMap[domain.id] = domain.percent; });

        const globalPercent = domainMap['global'] || 75;
        const episodicPercent = domainMap['episodic-memory'] || 83;
        const executivePercent = domainMap['executive'] || 85;
        const languagePercent = domainMap['language'] || 85;
        const functionalPercent = domainMap['functional'] || 85;

        const memoryComplaints = episodicPercent < 85 ? 1 : 0;
        const avgCognitiveScore = (globalPercent + episodicPercent + executivePercent + languagePercent) / 4;
        const behavioralProblems = avgCognitiveScore < 80 ? 1 : 0;
        let adl = 0;
        if (functionalPercent < 70) adl = 2;
        else if (functionalPercent < 90) adl = 1;
        const confusion = (globalPercent < 70 || executivePercent < 70) ? 1 : 0;
        const disorientation = globalPercent < 65 ? 1 : 0;
        const personalityChanges = behavioralProblems;
        const difficultyCompletingTasks = executivePercent < 75 ? 1 : 0;
        const forgetfulness = memoryComplaints;

        const genderMap = { 'male': 0, 'female': 1, 'other': 2 };
        const genderNumeric = profile.gender ? genderMap[profile.gender.toLowerCase()] : null;

        const ethnicityMap = { 'caucasian': 0, 'white': 0, 'african-american': 1, 'black': 1, 'hispanic': 2, 'latino': 2, 'asian': 3, 'other': 4 };
        const ethnicityNumeric = profile.ethnicity ? ethnicityMap[profile.ethnicity.toLowerCase()] : null;

        const eduMap = { 'elementary': 0, 'elementary school': 0, 'middle school': 1, 'high-school': 1, 'high school': 1, 'some-college': 2, 'some college': 2, 'associate': 2, 'bachelors': 3, 'bachelor': 3, "bachelor's": 3, 'masters': 4, 'master': 4, "master's": 4, 'doctorate': 5, 'phd': 5, 'doctoral': 5 };
        const educationNumeric = profile.education ? eduMap[profile.education.toLowerCase()] : 3;

        const smokingMap = { 'never': 0, 'former': 1, 'current': 2 };
        const smokingNumeric = profile.smoking ? smokingMap[profile.smoking.toLowerCase()] : null;

        const alcoholMap = { 'none': 0, 'never': 0, 'light': 1, 'moderate': 2, 'heavy': 3 };
        const alcoholNumeric = profile.alcohol ? alcoholMap[profile.alcohol.toLowerCase()] : null;

        const boolToInt = (val) => {
          if (val === undefined || val === null) return null;
          if (typeof val === 'boolean') return val ? 1 : 0;
          if (typeof val === 'number') return val;
          return (val === true || val === 'true' || val === 'yes' || val === 1) ? 1 : 0;
        };

        const assessmentData = {
          assessmentResults: {
            mocaScore: { raw: mocaScore.raw, adjusted: mocaScore.adjusted },
            domain_scores: domainScores.map(d => ({ id: d.id, title: d.title, percent: d.percent, correctCount: d.correctCount, total: d.total })),
            overall_percent: overallPercent,
            isAdaptive,
          },
          profile: {
            Age: parseInt(profile.age) || null, Gender: genderNumeric, Ethnicity: ethnicityNumeric, EducationLevel: educationNumeric,
            BMI: profile.bmi ? parseFloat(profile.bmi) : null, Smoking: smokingNumeric, AlcoholConsumption: alcoholNumeric,
            PhysicalActivity: profile.physical_activity ? parseInt(profile.physical_activity) : null,
            DietQuality: profile.diet_quality ? parseInt(profile.diet_quality) : null,
            SleepQuality: profile.sleep_quality ? parseInt(profile.sleep_quality) : null,
            FamilyHistoryAlzheimers: boolToInt(profile.family_history), CardiovascularDisease: boolToInt(profile.cardiovascular_disease),
            Diabetes: boolToInt(profile.diabetes), Depression: boolToInt(profile.depression), HeadInjury: boolToInt(profile.head_injury),
            Hypertension: boolToInt(profile.hypertension),
            SystolicBP: profile.systolic_bp ? parseInt(profile.systolic_bp) : null,
            DiastolicBP: profile.diastolic_bp ? parseInt(profile.diastolic_bp) : null,
            CholesterolTotal: profile.cholesterol_total ? parseFloat(profile.cholesterol_total) : null,
            CholesterolLDL: profile.cholesterol_ldl ? parseFloat(profile.cholesterol_ldl) : null,
            CholesterolHDL: profile.cholesterol_hdl ? parseFloat(profile.cholesterol_hdl) : null,
            CholesterolTriglycerides: profile.cholesterol_triglycerides ? parseFloat(profile.cholesterol_triglycerides) : null,
            MMSE: mocaScore.adjusted, FunctionalAssessment: (functionalPercent / 100) * 10,
            MemoryComplaints: memoryComplaints, BehavioralProblems: behavioralProblems, ADL: adl,
            Confusion: confusion, Disorientation: disorientation, PersonalityChanges: personalityChanges,
            DifficultyCompletingTasks: difficultyCompletingTasks, Forgetfulness: forgetfulness,
          },
        };

        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/assessment/classify-risk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(assessmentData),
        });
        const data = await response.json();
        if (data.success) {
          setRiskPrediction(data);
        }
        else setError(data.message || 'Failed to get risk assessment');
      } catch (err) {
        setError('Unable to connect to AI service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    classifyRisk();
  }, [assessmentSummary]);

  if (loading) {
    return (
      <div className="cra-root">
        <style>{STYLES}</style>
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <Navbar user={user} onLogout={onLogout} />
        <div className="cra-loading">
          <Loader2 size={42} className="cra-loading-icon" />
          <div className="cra-loading-text">Analysing cognitive patterns…</div>
          <div className="cra-loading-sub">XGBoost model · 26 clinical features</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cra-root">
        <style>{STYLES}</style>
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <Navbar user={user} onLogout={onLogout} />
        <div className="cra-main">
          <div className="cra-error-card">
            <div className="cra-error-title">Something went wrong</div>
            <p className="cra-error-text">{error}</p>
            <Link to="/tests/results" className="cra-btn-sage">← Back to Results</Link>
          </div>
        </div>
      </div>
    );
  }

  const rs = riskPrediction ? getRiskStyle(riskPrediction.risk_level) : getRiskStyle(null);
  const probPct = riskPrediction ? (riskPrediction.probability * 100).toFixed(1) : '0.0';

  return (
    <div className="cra-root">
      <style>{STYLES}</style>
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="cra-main">
        {riskPrediction && (
          <>
            <Link to="/tests/results" className="cra-back">
              <ArrowLeft size={15} /> Back to Cognitive Results
            </Link>

            {/* ── Hero Risk Card ── */}
            <div
              className="cra-hero"
              style={{ background: rs.bg, borderColor: rs.border }}
            >
              <div className="cra-hero-top">
                <div>
                  <div
                    className="cra-hero-badge"
                    style={{ background: rs.badge, borderColor: rs.badgeBorder, color: rs.badgeColor }}
                  >
                    <Brain size={11} /> AI Risk Assessment
                  </div>
                  <h1 className="cra-hero-title">Clinical Risk Prediction</h1>
                  <p className="cra-hero-sub">XGBoost Machine Learning Model · 26 Clinical Features</p>
                </div>
                <div className="cra-risk-pill" style={{ background: rs.pill }}>
                  {riskPrediction.risk_level} RISK
                </div>
              </div>

              {/* Probability */}
              <div className="cra-prob-section">
                <div className="cra-prob-num" style={{ color: rs.probColor }}>{probPct}%</div>
                <div className="cra-prob-label">Probability of {riskPrediction.risk_label}</div>
              </div>

              {/* Bar */}
              <div className="cra-bar-track">
                <div
                  className="cra-bar-fill"
                  style={{ width: `${riskPrediction.probability * 100}%`, background: rs.bar }}
                />
              </div>

              {/* Recommendation */}
              <div className="cra-rec-box" style={{ background: rs.rec, borderColor: rs.recBorder }}>
                <div className="cra-rec-label">
                  <CheckCircle2 size={16} style={{ color: rs.probColor }} />
                  Clinical Recommendation
                </div>
                <p className="cra-rec-text">{riskPrediction.recommendation}</p>
              </div>
            </div>

            {/* ── Patient Summary ── */}
            {assessmentSummary && (
              <div className="cra-summary-card">
                <div className="cra-summary-title">Patient Summary</div>
                <div className="cra-summary-grid">
                  <div className="cra-summary-item">
                    <div className="cra-summary-item-label">Age</div>
                    <div className="cra-summary-item-val">{assessmentSummary.profile.age || '—'}</div>
                  </div>
                  <div className="cra-summary-item">
                    <div className="cra-summary-item-label">Education</div>
                    <div className="cra-summary-item-val" style={{ textTransform: 'capitalize' }}>{assessmentSummary.profile.education?.replace('-', ' ') || '—'}</div>
                  </div>
                  <div className="cra-summary-item">
                    <div className="cra-summary-item-label">MoCA Score</div>
                    <div className="cra-summary-item-val">{assessmentSummary.mocaScore?.adjusted}<span style={{ fontSize: '0.85rem', color: 'var(--slate)', fontWeight: 400 }}>/30</span></div>
                  </div>
                  <div className="cra-summary-item">
                    <div className="cra-summary-item-label">Test Accuracy</div>
                    <div className="cra-summary-item-val">{assessmentSummary.overallPercent}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Disclaimer ── */}
            <div className="cra-disclaimer">
              <AlertCircle size={17} className="cra-disclaimer-icon" />
              <p className="cra-disclaimer-text">
                <strong>Important:</strong> This AI assessment is a clinical decision support tool based on an XGBoost model trained on cognitive assessment data. It is not a diagnostic device. All results should be interpreted by a qualified healthcare provider.
              </p>
            </div>

            {/* ── Actions ── */}
            <div className="cra-actions">
              <Link to="/tests/results" className="cra-btn-sage">
                <ArrowLeft size={16} /> View Cognitive Results
              </Link>
              <Link to="/dashboard" className="cra-btn-primary">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/home" className="cra-btn-secondary">
                <Home size={16} /> Home
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ClinicalRiskAssessment;