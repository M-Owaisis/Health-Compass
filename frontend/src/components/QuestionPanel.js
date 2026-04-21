import React from 'react';
import { Sparkles, AlertCircle, ClipboardList, Loader2 } from 'lucide-react';

const QUESTION_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

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
    --radius-sm: 10px;
    --radius-md: 16px;
    --font-display: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  .qp-root {
    background: var(--warm-white);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    box-shadow: var(--shadow-md);
    font-family: var(--font-body);
  }

  /* ── Header ── */
  .qp-header {}
  .qp-section-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: var(--sage-pale);
    color: var(--sage);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    border: 1px solid rgba(74, 124, 111, 0.2);
  }
  .qp-title {
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: var(--navy);
    margin: 0 0 0.3rem;
  }
  .qp-subtitle {
    font-size: 0.875rem;
    color: var(--slate);
    line-height: 1.55;
    margin: 0;
  }

  /* ── States ── */
  .qp-state {
    border-radius: var(--radius-sm);
    padding: 1.2rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .qp-state-loading {
    background: var(--cream);
    border: 1px dashed rgba(74, 124, 111, 0.3);
    color: var(--slate);
  }
  .qp-state-loading .qp-state-icon { color: var(--sage-light); }

  .qp-state-error {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    color: #B91C1C;
  }

  .qp-state-empty {
    background: var(--cream);
    border: 1px dashed rgba(74, 124, 111, 0.25);
    color: var(--slate);
  }

  @keyframes qpSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .qp-spinner { animation: qpSpin 0.9s linear infinite; }

  /* ── Question cards ── */
  .qp-list {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .qp-card {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: 1rem 1.1rem;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--cream);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    animation: qpCardIn 0.35s cubic-bezier(.22,.68,0,1.2) both;
  }
  .qp-card:hover {
    border-color: rgba(74, 124, 111, 0.3);
    box-shadow: var(--shadow-sm);
    transform: translateX(2px);
  }

  @keyframes qpCardIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .qp-card-num {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: var(--navy);
    color: var(--cream);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .qp-card-body {}
  .qp-card-title {
    font-weight: 600;
    color: var(--navy);
    font-size: 0.92rem;
    margin-bottom: 0.25rem;
  }
  .qp-card-desc {
    color: var(--text-body);
    font-size: 0.85rem;
    line-height: 1.55;
  }

  /* ── Generate button ── */
  .qp-generate-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.82rem 1.5rem;
    border-radius: 999px;
    border: none;
    background: var(--navy);
    color: var(--cream);
    font-family: var(--font-body);
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 4px 18px rgba(28, 43, 58, 0.22);
    align-self: flex-start;
    margin-top: 0.25rem;
  }
  .qp-generate-btn:hover:not(:disabled) {
    background: var(--navy-mid);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(28, 43, 58, 0.28);
  }
  .qp-generate-btn:active:not(:disabled) { transform: translateY(0); }
  .qp-generate-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

function QuestionPanel({ tests, loading, error, onGenerate, usageData }) {
  const isLimitReached = usageData?.used >= usageData?.limit && usageData?.limit !== 'Unlimited';

  return (
    <div className="qp-root">
      <style>{QUESTION_STYLES}</style>
      
      {/* Usage Tracker */}
      {usageData && (
        <div style={{
          padding: '1rem',
          background: 'var(--sage-pale)',
          borderRadius: '12px',
          border: '1px solid rgba(74, 124, 111, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.05em', display: 'block', marginBottom: '2px'}}>Plan Usage</span>
            <span style={{fontWeight: 600, color: 'var(--navy)'}}>{(usageData.tier || 'free').toUpperCase()} Plan</span>
          </div>
          <div style={{textAlign: 'right'}}>
            <span style={{fontWeight: 700, color: isLimitReached ? '#B91C1C' : 'var(--sage)', fontSize: '1rem'}}>{usageData?.used || 0}</span>
            <span style={{color: 'var(--slate)', fontWeight: 500}}> / {usageData?.limit || 1} assessments</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="qp-header">
        <div className="qp-section-badge">
          <ClipboardList size={10} /> Assessment
        </div>
        <h2 className="qp-title">Assessment Questions</h2>
        <p className="qp-subtitle">5 personalised tests generated from the patient profile.</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="qp-state qp-state-loading">
          <span className="qp-state-icon">
            <Loader2 size={18} className="qp-spinner" />
          </span>
          <span>Generating your personalised test set — this takes just a moment…</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="qp-state qp-state-error">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && tests.length === 0 && (
        <div className="qp-state qp-state-empty">
          <ClipboardList size={18} style={{ flexShrink: 0, marginTop: 1, color: 'var(--sage-light)' }} />
          <span>No questions yet. Fill the patient profile and press <strong style={{ color: 'var(--navy)' }}>Generate Tests</strong> to begin.</span>
        </div>
      )}

      {/* Question cards */}
      {!loading && !error && tests.length > 0 && (
        <div className="qp-list">
          {tests.map((test, index) => (
            <div
              key={test.id || test.title}
              className="qp-card"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="qp-card-num">{String(index + 1).padStart(2, '0')}</div>
              <div className="qp-card-body">
                <div className="qp-card-title">{test.title}</div>
                {test.description && (
                  <div className="qp-card-desc">{test.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate button */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <button
          className="qp-generate-btn"
          onClick={onGenerate}
          disabled={loading || isLimitReached}
          style={{width: '100%', justifyContent: 'center'}}
        >
          <Sparkles size={16} />
          {loading ? 'Generating…' : (isLimitReached ? 'Limit Reached' : 'Generate Tests')}
        </button>
        {isLimitReached && (
          <p style={{fontSize: '0.75rem', color: '#B91C1C', textAlign: 'center', margin: 0, fontWeight: 500}}>
            You've used all assessments on your current plan.
          </p>
        )}
      </div>
    </div>
  );
}

export default QuestionPanel;