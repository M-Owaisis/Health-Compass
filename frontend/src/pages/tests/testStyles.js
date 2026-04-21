// ── Shared Test Page Styles ──
// Import this constant in each test file

export const TEST_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

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
    --white: #FFFFFF;
    --amber: #D4793A;
    --amber-pale: #FDF0E6;
    --text-body: #3D4E5C;
    --border: rgba(74, 124, 111, 0.15);
    --shadow-sm: 0 4px 12px rgba(28, 43, 58, 0.05);
    --shadow-md: 0 12px 30px rgba(28, 43, 58, 0.10);
    --shadow-lg: 0 30px 60px rgba(28, 43, 58, 0.15);
    --radius-sm: 12px;
    --radius-md: 20px;
    --radius-lg: 32px;
    --radius-xl: 48px;
    --font-display: 'Playfair Display', serif;
    --font-body: 'Outfit', sans-serif;
  }

  /* ── Root ── */
  .tp-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--font-body);
    color: var(--navy);
    position: relative;
    overflow-x: hidden;
    padding-bottom: 6rem;
  }

  /* ── Background Blobs ── */
  .tp-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(120px);
    opacity: 0.3;
  }
  .tp-blob-1 {
    width: 600px; height: 600px;
    top: -10%; right: -5%;
    background: radial-gradient(circle, var(--sage-light), transparent);
    animation: drift 20s infinite alternate;
  }
  .tp-blob-2 {
    width: 500px; height: 500px;
    bottom: -5%; left: -5%;
    background: radial-gradient(circle, rgba(212, 121, 58, 0.15), transparent);
    animation: drift 25s infinite alternate-reverse;
  }
  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to { transform: translate(40px, 30px) scale(1.1); }
  }

  /* ── Main Layout ── */
  .tp-main {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 6rem 2rem 4rem;
  }

  /* ── Hero Header ── */
  .tp-hero {
    background: var(--white);
    border-radius: var(--radius-xl);
    padding: 4rem;
    margin-bottom: 4rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 3rem;
    align-items: center;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @media (max-width: 800px) {
    .tp-hero { grid-template-columns: 1fr; padding: 2.5rem; text-align: center; }
    .tp-hero-img-wrap { order: -1; width: 100%; height: 220px; }
  }

  .tp-hero-badge {
    display: inline-flex; align-items: center; gap: 0.6rem;
    padding: 0.5rem 1.2rem; border-radius: 999px;
    background: var(--sage-pale); color: var(--sage);
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 1.5rem;
    border: 1px solid rgba(74, 124, 111, 0.1);
  }
  .tp-hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 5vw, 3.4rem);
    line-height: 1.1; color: var(--navy); margin-bottom: 1.2rem;
  }
  .tp-hero-desc { font-size: 1.15rem; color: var(--slate); line-height: 1.7; max-width: 520px; }
  
  .tp-hero-img-wrap {
    width: 320px; height: 220px;
    border-radius: var(--radius-lg);
    overflow: hidden; position: relative;
    box-shadow: 0 20px 50px rgba(28,43,58,0.15);
  }
  .tp-hero-img { width: 100%; height: 100%; object-fit: cover; }
  .tp-hero-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(28,43,58,0.3), transparent);
  }

  /* ── Info Panel ── */
  .tp-info {
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    margin-bottom: 3rem;
    box-shadow: var(--shadow-md);
  }
  .tp-info-title {
    font-family: var(--font-display);
    font-size: 1.6rem;
    color: var(--navy);
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.8rem;
  }
  .tp-info-list { list-style: none; padding: 0; display: grid; gap: 1rem; }
  .tp-info-list li {
    display: flex; align-items: flex-start; gap: 0.8rem;
    font-size: 1.05rem; color: var(--slate); line-height: 1.6;
  }
  .tp-info-list li::before {
    content: '→'; color: var(--sage); font-weight: 700; margin-top: 2px;
  }

  /* ── Questions ── */
  .tp-form { display: grid; gap: 3rem; }
  .tp-q-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 4rem;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    position: relative;
  }
  .tp-q-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: rgba(74,124,111,0.3); }
  
  .tp-q-num {
    position: absolute; top: -16px; left: 4rem;
    background: var(--navy); color: var(--white);
    padding: 0.5rem 1.2rem; border-radius: 12px;
    font-size: 0.85rem; font-weight: 700;
    box-shadow: 0 8px 20px rgba(28,43,58,0.2);
  }
  .tp-q-text {
    font-family: var(--font-serif);
    font-size: 1.8rem; font-weight: 400; color: var(--navy);
    line-height: 1.4; margin-bottom: 2.5rem; margin-top: 0.5rem;
  }

  /* ── Options ── */
  .tp-options { display: grid; gap: 1.2rem; }
  .tp-option {
    display: flex; align-items: center; gap: 1.4rem;
    padding: 1.5rem 2rem; border-radius: 24px;
    background: var(--cream); border: 2px solid transparent;
    cursor: pointer; transition: all 0.3s ease; position: relative;
    font-size: 1.1rem; font-weight: 500;
  }
  .tp-option:hover { background: var(--white); border-color: rgba(74, 124, 111, 0.2); transform: scale(1.02); }
  .tp-option.selected {
    background: var(--white);
    border-color: var(--sage);
    box-shadow: 0 15px 40px rgba(74, 124, 111, 0.12);
    color: var(--navy);
  }
  .tp-option input { position: absolute; opacity: 0; }
  
  .tp-option-dot {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #CBD5E1; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; background: var(--white); transition: all 0.3s;
  }
  .tp-option.selected .tp-option-dot { border-color: var(--sage); border-width: 8px; }
  .tp-option-dot-inner { display: none; }

  .tp-textarea {
    width: 100%; padding: 2rem; border-radius: 24px;
    background: var(--cream); border: 2px solid transparent;
    font-family: inherit; font-size: 1.2rem; line-height: 1.7;
    color: var(--navy); transition: all 0.3s; resize: vertical; min-height: 200px;
  }
  .tp-textarea:focus {
    outline: none; background: var(--white); border-color: var(--sage);
    box-shadow: 0 20px 50px rgba(74, 124, 111, 0.15);
  }

  /* ── Actions Bar ── */
  .tp-actions {
    margin-top: 4rem;
    display: flex; gap: 1.5rem;
    background: var(--white);
    padding: 2.5rem; border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    flex-direction: column;
    align-items: flex-start;
  }

  .tp-btn-primary {
    background: var(--navy); color: var(--white);
    padding: 1.2rem 3rem; border-radius: 999px;
    font-weight: 700; font-size: 1.15rem; border: none;
    display: flex; align-items: center; gap: 0.8rem; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    width: 100%; justify-content: center;
    box-shadow: 0 10px 30px rgba(28, 43, 58, 0.2);
  }
  .tp-btn-primary:hover:not(:disabled) { background: var(--sage); transform: translateY(-3px); box-shadow: 0 15px 35px rgba(74, 124, 111, 0.3); }
  .tp-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .tp-btn-secondary {
    background: transparent; color: var(--navy);
    padding: 1.1rem 2rem; border-radius: 999px;
    font-weight: 600; border: 2px solid rgba(28,43,58,0.1);
    display: flex; align-items: center; gap: 0.6rem; cursor: pointer;
    transition: all 0.3s;
  }
  .tp-btn-secondary:hover { background: var(--cream); border-color: rgba(28,43,58,0.3); }

  @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
`;