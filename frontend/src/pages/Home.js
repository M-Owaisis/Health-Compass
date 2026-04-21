import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Brain, ShieldCheck, Activity, Users, ArrowRight, CheckCircle2, Play, ChevronRight, Heart } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  :root {
    --primary: #4A7C6F;
    --primary-dark: #3a6258;
    --primary-light: #E8F0EE;
    --navy: #1C2B3A;
    --navy-light: #2D4055;
    --cream: #FAF7F2;
    --white: #FFFFFF;
    --slate: #5A6A7A;
    --amber: #D4793A;
    --glass: rgba(255, 255, 255, 0.8);
    --font-main: 'Outfit', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  .home-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--font-main);
    color: var(--navy);
    overflow-x: hidden;
  }

  /* ── Background Elements ── */
  .bg-glow {
    position: fixed;
    width: 60vw; height: 60vw;
    border-radius: 50%;
    filter: blur(120px);
    z-index: 0;
    pointer-events: none;
    opacity: 0.4;
  }
  .bg-glow-1 { top: -20%; right: -10%; background: radial-gradient(circle, var(--primary-light), transparent); }
  .bg-glow-2 { bottom: -10%; left: -10%; background: radial-gradient(circle, rgba(212, 121, 58, 0.1), transparent); }

  /* ── Sections ── */
  .section-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  /* ── Hero Section ── */
  .hero-section {
    padding: 8rem 0 6rem;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .hero-section { grid-template-columns: 1fr; text-align: center; padding: 6rem 0 4rem; }
    .hero-content { display: flex; flex-direction: column; align-items: center; }
  }

  .hero-badge {
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
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: clamp(3rem, 6vw, 4.8rem);
    line-height: 1.05;
    margin-bottom: 1.5rem;
    font-weight: 400;
  }

  .hero-title span {
    font-style: italic;
    color: var(--primary);
    position: relative;
  }

  .hero-description {
    font-size: 1.15rem;
    color: var(--slate);
    line-height: 1.7;
    margin-bottom: 2.5rem;
    max-width: 580px;
  }

  .hero-actions {
    display: flex;
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 1rem 2.4rem;
    border-radius: 999px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }

  .btn-primary {
    background: var(--navy);
    color: var(--white);
    box-shadow: 0 10px 30px rgba(28, 43, 58, 0.2);
  }
  .btn-primary:hover {
    background: var(--primary);
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(74, 124, 111, 0.3);
  }

  .btn-secondary {
    background: var(--white);
    color: var(--navy);
    border: 1px solid rgba(28, 43, 58, 0.1);
  }
  .btn-secondary:hover {
    background: var(--cream);
    transform: translateY(-3px);
  }

  /* ── Hero Image Card ── */
  .hero-visual {
    position: relative;
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 30px 70px rgba(28, 43, 58, 0.15);
    background: var(--white);
    padding: 1rem;
  }

  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
    display: block;
  }

  .floating-stat {
    position: absolute;
    bottom: 2rem;
    left: -2rem;
    background: var(--white);
    padding: 1.5rem;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    animation: float 4s ease-in-out infinite;
    z-index: 2;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .stat-icon {
    width: 48px; height: 48px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Stats Bar ── */
  .stats-bar {
    display: flex;
    justify-content: space-around;
    padding: 4rem 2rem;
    background: var(--white);
    border-radius: 32px;
    margin-bottom: 6rem;
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 10px 40px rgba(0,0,0,0.02);
  }

  @media (max-width: 768px) { .stats-bar { flex-direction: column; gap: 3rem; text-align: center; } }

  .stat-item h3 { font-family: var(--font-serif); font-size: 2.8rem; margin-bottom: 0.2rem; color: var(--navy); }
  .stat-item p { color: var(--slate); font-weight: 500; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.1em; }

  /* ── Feature Cards ── */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 4rem 0 8rem;
  }

  .feature-card {
    background: var(--white);
    padding: 3rem 2.5rem;
    border-radius: 32px;
    border: 1px solid rgba(0,0,0,0.04);
    transition: all 0.4s ease;
    text-align: left;
    position: relative;
    overflow: hidden;
  }
  .feature-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.08); }
  .feature-card::after {
    content: ''; position: absolute; top: 0; right: 0; width: 80px; height: 80px;
    background: radial-gradient(circle at top right, var(--primary-light), transparent);
    opacity: 0; transition: opacity 0.4s;
  }
  .feature-card:hover::after { opacity: 1; }

  .feature-card-icon {
    width: 64px; height: 64px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 2rem;
  }

  .feature-card h4 { font-size: 1.4rem; margin-bottom: 1rem; color: var(--navy); }
  .feature-card p { color: var(--slate); line-height: 1.7; font-size: 1rem; }

  /* ── CTA Banner ── */
  .cta-banner {
    background: var(--navy);
    padding: 6rem 4rem;
    border-radius: 48px;
    color: var(--white);
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 4rem;
    align-items: center;
    margin-bottom: 8rem;
    position: relative;
    overflow: hidden;
  }
  .cta-banner::before {
    content: ''; position: absolute; top: -50%; right: -20%; width: 80%; height: 200%;
    background: radial-gradient(circle, rgba(74, 124, 111, 0.2), transparent 70%);
  }

  @media (max-width: 900px) { .cta-banner { grid-template-columns: 1fr; padding: 4rem 2rem; text-align: center; } }

  .cta-title { font-family: var(--font-serif); font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.1; }
  .cta-desc { font-size: 1.1rem; color: #A0B3C1; margin-bottom: 2.5rem; }

  .testimonial-box {
    background: rgba(255, 255, 255, 0.05);
    padding: 2.5rem;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  .testimonial-box p { font-style: italic; font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem; }
  .testimonial-author { font-weight: 600; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; }

  /* ── Reveal Animation ── */
  .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;

export default function Home({ user, onLogout }) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Caregiver';

  return (
    <div className="home-root">
      <style>{STYLES}</style>
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <Navbar user={user} onLogout={onLogout} />

      <div className="section-container">
        {/* ── Hero ── */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="reveal hero-badge">
              <ShieldCheck size={16} /> Clinically-Informed Cognitive Screening
            </div>
            
            <h1 className="reveal hero-title">
              Navigate care with <br />
              <span>Clarity</span> & Confidence.
            </h1>

            <p className="reveal hero-description">
              Health Compass combines MoCA-standard assessments with AI-driven triage to help caregivers monitor cognitive health safely and effectively from home.
            </p>

            <div className="reveal hero-actions">
              <Link to="/dashboard" className="btn btn-primary">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Explore the Science
              </Link>
            </div>
          </div>

          <div className="reveal hero-visual">
            <img src="/images/hero.png" alt="Health Compass Visualization" className="hero-img" />
            
            <div className="floating-stat">
              <div className="stat-icon">
                <Brain size={24} />
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: '1.2rem'}}>98%</div>
                <div style={{fontSize: '0.8rem', color: 'var(--slate)'}}>Triage Accuracy</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="reveal stats-bar">
          <div className="stat-item">
            <h3>5,000+</h3>
            <p>Assessments Completed</p>
          </div>
          <div className="stat-item">
            <h3>300+</h3>
            <p>Medical Guardrails</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Peace of Mind</p>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{textAlign: 'center'}}>
          <div className="reveal" style={{marginBottom: '4rem'}}>
            <p style={{color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem'}}>Capabilities</p>
            <h2 style={{fontFamily: 'var(--font-serif)', fontSize: '3rem'}}>Designed for <span>Families</span></h2>
          </div>

          <div className="features-grid">
            <div className="reveal feature-card" style={{transitionDelay: '0.1s'}}>
              <div className="feature-card-icon">
                <Activity size={30} />
              </div>
              <h4>Adaptive Testing</h4>
              <p>GRE-style logic adjusts difficulty in real-time, delivering MoCA-equivalent accuracy in half the time.</p>
            </div>

            <div className="reveal feature-card" style={{transitionDelay: '0.2s'}}>
              <div className="feature-card-icon">
                <ShieldCheck size={30} />
              </div>
              <h4>Clinical Triage</h4>
              <p>Built-in medical guardrails detect red flags and provide structured next steps for clinicians.</p>
            </div>

            <div className="reveal feature-card" style={{transitionDelay: '0.3s'}}>
              <div className="feature-card-icon">
                <Users size={30} />
              </div>
              <h4>Caregiver Insights</h4>
              <p>Translate complex clinical scores into plain language reports that families can actually use.</p>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="reveal cta-banner">
          <div>
            <h2 className="cta-title">Ready to build a <br/> smarter care plan?</h2>
            <p className="cta-desc">Join thousands of caregivers who use Health Compass to stay ahead of cognitive changes and ensure safety.</p>
            <Link to="/signup" className="btn btn-primary" style={{background: 'var(--white)', color: 'var(--navy)'}}>
              Create Free Account <ChevronRight size={18} />
            </Link>
          </div>
          <div className="testimonial-box">
            <p>"Health Compass gave us the vocabulary to talk to our doctor. We moved from 'something feels off' to sharing specific data points across memory and mood."</p>
            <div className="testimonial-author">
              <Heart size={16} fill="var(--primary)" /> Martha S., Family Caregiver
            </div>
          </div>
        </section>
      </div>

      <footer style={{textAlign: 'center', padding: '4rem 0', background: 'var(--white)', borderTop: '1px solid var(--primary-light)'}}>
        <div className="section-container">
          <p style={{color: 'var(--slate)', fontSize: '0.9rem'}}>© 2026 Health Compass. All rights reserved. For screening purposes only.</p>
        </div>
      </footer>
    </div>
  );
}