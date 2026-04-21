import React from 'react';
import { BookOpen, CheckCircle2, Info } from 'lucide-react';

const INSTRUCTION_STYLES = `
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

  .ip-root {
    background: var(--warm-white);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    min-height: 360px;
    box-shadow: var(--shadow-md);
    font-family: var(--font-body);
  }

  /* ── Header ── */
  .ip-section-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: var(--amber-pale);
    color: var(--amber);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    border: 1px solid rgba(212, 121, 58, 0.22);
  }
  .ip-title {
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: var(--navy);
    margin: 0 0 0.3rem;
  }
  .ip-subtitle {
    font-size: 0.875rem;
    color: var(--slate);
    line-height: 1.55;
    margin: 0;
  }

  /* ── Instruction list ── */
  .ip-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex: 1;
  }

  .ip-item {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    padding: 0.72rem 0.9rem;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--cream);
    font-size: 0.88rem;
    color: var(--text-body);
    line-height: 1.6;
    transition: border-color 0.2s, background 0.2s;
    animation: ipItemIn 0.4s cubic-bezier(.22,.68,0,1.2) both;
  }
  .ip-item:hover {
    border-color: rgba(74, 124, 111, 0.28);
    background: var(--sage-pale);
  }
  @keyframes ipItemIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .ip-item-icon {
    color: var(--sage);
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* ── Notice banner ── */
  .ip-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-sm);
    background: var(--sage-pale);
    border: 1px solid rgba(74, 124, 111, 0.2);
    color: var(--sage);
    font-size: 0.85rem;
    line-height: 1.6;
    margin-top: auto;
  }
  .ip-notice-icon { flex-shrink: 0; margin-top: 1px; }
  .ip-notice strong { color: var(--navy); }
`;

function InstructionPanel({ instructions }) {
  return (
    <div className="ip-root">
      <style>{INSTRUCTION_STYLES}</style>

      {/* Header */}
      <div>
        <div className="ip-section-badge">
          <BookOpen size={10} /> Guidelines
        </div>
        <h2 className="ip-title">Assessment Instructions</h2>
        <p className="ip-subtitle">Guidance for safe, age-aware triage prompts.</p>
      </div>

      {/* List */}
      <ul className="ip-list">
        {instructions.map((item, index) => (
          <li
            key={item}
            className="ip-item"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <CheckCircle2 size={16} className="ip-item-icon" />
            {item}
          </li>
        ))}
      </ul>

      {/* Notice */}
      <div className="ip-notice">
        <Info size={16} className="ip-notice-icon" />
        <span>
          <strong>Developer note:</strong> Connect this panel to your backend prompt template once the assessment engine is ready.
        </span>
      </div>
    </div>
  );
}

export default InstructionPanel;