import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X } from 'lucide-react';

const NAVBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  .hc-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    font-family: 'DM Sans', sans-serif;
    transition: box-shadow 0.3s, background 0.3s;
  }
  .hc-nav.scrolled {
    background: rgba(250, 247, 242, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 2px 20px rgba(28, 43, 58, 0.07);
  }
  .hc-nav.top {
    background: rgba(250, 247, 242, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .hc-nav-inner {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  /* ── Brand ── */
  .hc-nav-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    flex-shrink: 0;
  }
  .hc-nav-brand-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #D4793A 0%, #E8944A 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(212, 121, 58, 0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .hc-nav-brand:hover .hc-nav-brand-icon {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(212, 121, 58, 0.4);
  }
  .hc-nav-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem;
    color: #1C2B3A;
    letter-spacing: 0.01em;
  }

  /* ── Nav links ── */
  .hc-nav-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
  }
  .hc-nav-link {
    position: relative;
    padding: 0.45rem 0.85rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #5A6A7A;
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
  }
  .hc-nav-link:hover {
    color: #1C2B3A;
    background: rgba(74, 124, 111, 0.07);
  }
  .hc-nav-link.active {
    color: #4A7C6F;
    font-weight: 600;
    background: rgba(74, 124, 111, 0.1);
  }
  .hc-nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #4A7C6F;
  }

  /* ── Right side ── */
  .hc-nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .hc-nav-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .hc-nav-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A7C6F, #6B9E91);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }
  .hc-nav-username {
    font-size: 0.88rem;
    color: #5A6A7A;
    font-weight: 500;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .hc-nav-plan-badge {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    letter-spacing: 0.05em;
    background: var(--primary-light);
    color: var(--primary);
  }
  .hc-nav-plan-badge.pro {
    background: var(--navy);
    color: #fff;
  }
  .hc-nav-plan-badge.basic {
    background: #FDF0E6;
    color: #D4793A;
  }

  .hc-nav-btn-logout {
    padding: 0.48rem 1.1rem;
    border-radius: 999px;
    border: 1.5px solid rgba(28, 43, 58, 0.18);
    background: transparent;
    color: #5A6A7A;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.18s;
  }
  .hc-nav-btn-logout:hover {
    background: #FDF0E6;
    color: #B85C2A;
    border-color: rgba(212,121,58,0.3);
    transform: translateY(-1px);
  }

  .hc-nav-btn-signin {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.48rem 1.2rem;
    border-radius: 999px;
    background: #1C2B3A;
    color: #FAF7F2;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 3px 12px rgba(28, 43, 58, 0.2);
  }
  .hc-nav-btn-signin:hover {
    background: #2D4055;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(28, 43, 58, 0.25);
  }

  /* ── Mobile hamburger ── */
  .hc-nav-hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 38px; height: 38px;
    border-radius: 10px;
    border: 1.5px solid rgba(28, 43, 58, 0.15);
    background: transparent;
    color: #1C2B3A;
    cursor: pointer;
    transition: background 0.2s;
  }
  .hc-nav-hamburger:hover { background: rgba(74, 124, 111, 0.08); }

  /* ── Mobile drawer ── */
  .hc-nav-drawer {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 200;
  }
  .hc-nav-drawer.open { display: block; }

  .hc-nav-drawer-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(28, 43, 58, 0.45);
    backdrop-filter: blur(4px);
    animation: drawerFadeIn 0.25s ease;
  }
  @keyframes drawerFadeIn { from { opacity: 0; } to { opacity: 1; } }

  .hc-nav-drawer-panel {
    position: absolute;
    top: 0; right: 0;
    width: min(320px, 85vw);
    height: 100vh;
    background: #FAF7F2;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: drawerSlideIn 0.28s cubic-bezier(.22,.68,0,1.2);
    overflow-y: auto;
  }
  @keyframes drawerSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .hc-nav-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .hc-nav-drawer-close {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid rgba(28, 43, 58, 0.15);
    background: transparent;
    color: #5A6A7A;
    cursor: pointer;
    transition: background 0.2s;
  }
  .hc-nav-drawer-close:hover { background: rgba(74, 124, 111, 0.08); color: #1C2B3A; }

  .hc-nav-drawer-links {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    list-style: none;
  }
  .hc-nav-drawer-link {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm, 10px);
    font-size: 1rem;
    font-weight: 500;
    color: #3D4E5C;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .hc-nav-drawer-link:hover { background: rgba(74, 124, 111, 0.08); color: #1C2B3A; }
  .hc-nav-drawer-link.active { background: rgba(74, 124, 111, 0.12); color: #4A7C6F; font-weight: 600; }

  .hc-nav-drawer-divider { height: 1px; background: rgba(74, 124, 111, 0.15); }

  .hc-nav-drawer-actions { display: flex; flex-direction: column; gap: 0.6rem; }

  /* ── Responsive breakpoints ── */
  @media (max-width: 860px) {
    .hc-nav-links { display: none; }
    .hc-nav-right .hc-nav-user,
    .hc-nav-right .hc-nav-btn-logout,
    .hc-nav-right .hc-nav-btn-signin { display: none; }
    .hc-nav-hamburger { display: flex; }
  }
`;

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/admin/feedback', label: 'Admin Panel' },
];

function Navbar({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const displayName = user?.name || user?.email || 'Guest';
  const initials = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{NAVBAR_STYLES}</style>
      <header className={`hc-nav ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="hc-nav-inner">
          {/* Brand */}
          <Link to="/" className="hc-nav-brand">
            <div className="hc-nav-brand-icon">
              <HeartPulse color="white" size={18} />
            </div>
            <span className="hc-nav-brand-name">Health Compass</span>
          </Link>

          {/* Nav links (desktop) */}
          <nav>
            <ul className="hc-nav-links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`hc-nav-link${isActive(link.to) ? ' active' : ''}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side (desktop) */}
          <div className="hc-nav-right">
            {user ? (
              <>
                <div className="hc-nav-user">
                  <div className="hc-nav-avatar">{initials}</div>
                  <span className="hc-nav-username">{displayName}</span>
                  <span className={`hc-nav-plan-badge ${user.subscriptionTier || 'free'}`}>
                    {user.subscriptionTier || 'FREE'}
                  </span>
                </div>
                <button className="hc-nav-btn-logout" onClick={onLogout}>Log out</button>
              </>
            ) : (
              <Link to="/login" className="hc-nav-btn-signin">Sign in →</Link>
            )}

            {/* Hamburger */}
            <button className="hc-nav-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`hc-nav-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="hc-nav-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
        <div className="hc-nav-drawer-panel">
          <div className="hc-nav-drawer-header">
            <Link to="/" className="hc-nav-brand" onClick={() => setDrawerOpen(false)}>
              <div className="hc-nav-brand-icon">
                <HeartPulse color="white" size={18} />
              </div>
              <span className="hc-nav-brand-name">Health Compass</span>
            </Link>
            <button className="hc-nav-drawer-close" onClick={() => setDrawerOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <ul className="hc-nav-drawer-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`hc-nav-drawer-link${isActive(link.to) ? ' active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hc-nav-drawer-divider" />

          <div className="hc-nav-drawer-actions">
            {user ? (
              <>
                <div className="hc-nav-user" style={{ padding: '0 0.25rem' }}>
                  <div className="hc-nav-avatar">{initials}</div>
                  <span className="hc-nav-username" style={{ maxWidth: 'none' }}>{displayName}</span>
                </div>
                <button
                  className="hc-nav-btn-logout"
                  style={{ width: '100%', borderRadius: '10px', padding: '0.7rem' }}
                  onClick={() => { setDrawerOpen(false); onLogout(); }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hc-nav-btn-signin"
                style={{ justifyContent: 'center', borderRadius: '10px', padding: '0.7rem' }}
                onClick={() => setDrawerOpen(false)}
              >
                Sign in →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;