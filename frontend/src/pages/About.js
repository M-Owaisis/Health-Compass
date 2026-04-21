import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Brain, ShieldCheck, Heart, Target, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  :root {
    --primary: #4A7C6F;
    --primary-light: #E8F0EE;
    --navy: #1C2B3A;
    --cream: #FAF7F2;
    --white: #FFFFFF;
    --slate: #5A6A7A;
    --font-main: 'Outfit', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  .about-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--font-main);
    color: var(--navy);
    overflow-x: hidden;
  }

  .bg-glow {
    position: fixed;
    width: 60vw; height: 60vw;
    border-radius: 50%;
    filter: blur(120px);
    z-index: 0;
    pointer-events: none;
    opacity: 0.3;
  }
  .bg-glow-1 { top: -20%; right: -10%; background: radial-gradient(circle, var(--primary-light), transparent); }
  .bg-glow-2 { bottom: -10%; left: -10%; background: radial-gradient(circle, rgba(212, 121, 58, 0.1), transparent); }

  .section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  .hero-section {
    padding: 8rem 0 6rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  @media (max-width: 900px) { .hero-section { grid-template-columns: 1fr; text-align: center; } }

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
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: clamp(2.5rem, 5vw, 3.8rem);
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }
  .hero-title span { font-style: italic; color: var(--primary); }

  .hero-desc {
    font-size: 1.15rem;
    color: var(--slate);
    line-height: 1.8;
    margin-bottom: 2.5rem;
  }

  .hero-visual {
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 30px 70px rgba(28, 43, 58, 0.15);
    background: var(--white);
    padding: 1rem;
  }
  .hero-img { width: 100%; border-radius: 30px; display: block; }

  .mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 4rem 0 8rem;
  }

  .mission-card {
    background: var(--white);
    padding: 3rem 2.5rem;
    border-radius: 32px;
    border: 1px solid rgba(0,0,0,0.04);
    text-align: left;
    transition: transform 0.3s ease;
  }
  .mission-card:hover { transform: translateY(-10px); }
  .mission-icon {
    width: 60px; height: 60px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 2rem;
  }
  .mission-card h3 { font-size: 1.4rem; margin-bottom: 1rem; }
  .mission-card p { color: var(--slate); line-height: 1.7; }

  .cta-strip {
    background: var(--navy);
    padding: 4rem;
    border-radius: 40px;
    color: var(--white);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6rem;
  }
  @media (max-width: 768px) { .cta-strip { flex-direction: column; text-align: center; gap: 2rem; } }

  .btn {
    padding: 1rem 2.4rem;
    border-radius: 999px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    transition: all 0.3s;
  }
  .btn-primary { background: var(--primary); color: var(--white); }
  .btn-primary:hover { background: var(--primary-dark); transform: scale(1.05); }

  .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;

export default function About({ user, onLogout }) {
  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')), {threshold: 0.1});
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="about-root">
      <style>{STYLES}</style>
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="section-container">
        <section className="hero-section">
          <div className="reveal">
            <div className="hero-badge"><Sparkles size={16} /> Our Philosophy</div>
            <h1 className="hero-title">Empowering Caregivers with <span>Scientific</span> Clarity.</h1>
            <p className="hero-desc">Health Compass was founded to bridge the gap between complex neuropsychological standards and daily home care. We translate high-level MoCA metrics into actionable insights for families.</p>
            <div style={{display: 'flex', gap: '1rem'}}>
              <Link to="/services" className="btn btn-primary">Our Services <ArrowRight size={18} /></Link>
            </div>
          </div>
          <div className="reveal hero-visual">
            <img src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80" alt="About Health Compass" className="hero-img" />
          </div>
        </section>

        <section style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 className="reveal" style={{fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '3rem'}}>Core Principles</h2>
          <div className="mission-grid">
            <div className="reveal mission-card">
              <div className="mission-icon"><Target size={28} /></div>
              <h3>Precision First</h3>
              <p>Every assessment is calibrated against clinical MoCA standards, ensuring data that doctors can actually trust.</p>
            </div>
            <div className="reveal mission-card">
              <div className="mission-icon"><ShieldCheck size={28} /></div>
              <h3>Safety-Led</h3>
              <p>Our algorithms prioritize clinical "red flags," alerting caregivers to urgent changes before they escalate.</p>
            </div>
            <div className="reveal mission-card">
              <div className="mission-icon"><Heart size={28} /></div>
              <h3>Empathy-Driven</h3>
              <p>Built for people, not just data. We focus on the caregiver's journey and emotional well-being.</p>
            </div>
          </div>
        </section>

        <div className="reveal cta-strip">
          <div style={{maxWidth: '500px'}}>
            <h2 style={{fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem'}}>Join the Health Compass community</h2>
            <p style={{color: '#A0B3C1'}}>Stay informed about the latest in cognitive health and home-care optimization.</p>
          </div>
          <Link to="/signup" className="btn btn-primary" style={{background: 'var(--white)', color: 'var(--navy)'}}>
            Get Started Free <ChevronRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  );
}