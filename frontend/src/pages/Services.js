import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Brain, Activity, ShieldCheck, FileText, ChevronRight, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

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

  .services-root {
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
    text-align: center;
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
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: clamp(3rem, 7vw, 4.5rem);
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }
  .hero-title span { font-style: italic; color: var(--primary); }

  .hero-desc {
    font-size: 1.2rem;
    color: var(--slate);
    line-height: 1.8;
    margin-bottom: 2.5rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 2.5rem;
    margin: 4rem 0 8rem;
  }

  .service-card {
    background: var(--white);
    padding: 3.5rem 3rem;
    border-radius: 40px;
    border: 1px solid rgba(0,0,0,0.04);
    text-align: left;
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex;
    flex-direction: column;
  }
  .service-card:hover { transform: translateY(-12px); box-shadow: 0 40px 80px rgba(0,0,0,0.07); }

  .service-icon {
    width: 64px; height: 64px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 2.5rem;
  }

  .service-card h3 { font-size: 1.8rem; margin-bottom: 1.2rem; font-family: var(--font-serif); }
  .service-card p { color: var(--slate); line-height: 1.7; margin-bottom: 2rem; flex-grow: 1; }

  .feature-list { list-style: none; padding: 0; display: grid; gap: 1rem; }
  .feature-list li { display: flex; align-items: center; gap: 0.8rem; font-size: 0.95rem; color: var(--navy); font-weight: 500; }
  .feature-list li svg { color: var(--primary); }

  .cta-box {
    background: var(--navy);
    padding: 6rem 4rem;
    border-radius: 48px;
    color: var(--white);
    text-align: center;
    margin-bottom: 8rem;
    position: relative;
    overflow: hidden;
  }

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

export default function Services({ user, onLogout }) {
  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')), {threshold: 0.1});
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="services-root">
      <style>{STYLES}</style>
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <Navbar user={user} onLogout={onLogout} />

      <main className="section-container">
        <header className="hero-section">
          <div className="reveal hero-badge"><Zap size={16} /> Scalable Care Solutions</div>
          <h1 className="reveal hero-title">Advanced Care <span>Simplified</span>.</h1>
          <p className="reveal hero-desc">From initial screening to specialized risk assessment, we provide the tools necessary to monitor cognitive health with confidence and precision.</p>
        </header>

        <section className="services-grid">
          <div className="reveal service-card">
            <div className="service-icon"><Activity size={32} /></div>
            <h3>Cognitive Screening</h3>
            <p>MoCA-aligned assessments covering memory, language, and executive function. Perfect for monthly monitoring and early baseline creation.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={18} /> Standardized MoCA Scoring</li>
              <li><CheckCircle2 size={18} /> Multi-domain Analysis</li>
              <li><CheckCircle2 size={18} /> Age-adjusted Baseline</li>
            </ul>
          </div>

          <div className="reveal service-card" style={{transitionDelay: '0.1s'}}>
            <div className="service-icon"><Brain size={32} /></div>
            <h3>Adaptive Testing</h3>
            <p>GRE-style intelligence that adjusts question difficulty in real-time. Reduces test fatigue while maximizing diagnostic precision.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={18} /> Real-time Difficulty Scaling</li>
              <li><CheckCircle2 size={18} /> Intelligent Item Bank</li>
              <li><CheckCircle2 size={18} /> Reduced Testing Time</li>
            </ul>
          </div>

          <div className="reveal service-card" style={{transitionDelay: '0.2s'}}>
            <div className="service-icon"><ShieldCheck size={32} /></div>
            <h3>Predictive Risk Analysis</h3>
            <p>Advanced predictive models that identify subtle patterns and alert you to potential clinical escalations.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={18} /> Predictive Risk Modeling</li>
              <li><CheckCircle2 size={18} /> Clinician-ready Summaries</li>
              <li><CheckCircle2 size={18} /> Proactive Safety Alerts</li>
            </ul>
          </div>
        </section>

        <section className="reveal cta-box">
          <div style={{position: 'relative', zIndex: 2}}>
            <h2 style={{fontFamily: 'var(--font-serif)', fontSize: '3.5rem', marginBottom: '1.5rem'}}>Secure your care journey today.</h2>
            <p style={{color: '#A0B3C1', fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem'}}>Join the thousands of caregivers who rely on Health Compass for precision monitoring.</p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
              <Link to="/signup" className="btn btn-primary">Create Your Profile <ArrowRight size={18} /></Link>
              <Link to="/pricing" className="btn" style={{border: '1px solid white', color: 'white'}}>View Plans</Link>
            </div>
          </div>
          <div style={{position: 'absolute', bottom: '-20%', left: '-10%', width: '40%', height: '80%', background: 'radial-gradient(circle, rgba(74, 124, 111, 0.15), transparent 70%)'}}></div>
        </section>
      </main>
    </div>
  );
}