import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ArrowRight, User, Mail, Lock, Eye, EyeOff, Info, CheckCircle2, XCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const AUTH_STYLES = `
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

  .hc-auth-root {
    min-height: 100vh;
    display: flex;
    font-family: var(--font-body);
    background: var(--navy);
    overflow: hidden;
    position: relative;
  }

  /* ── Background blobs ── */
  .auth-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(100px);
    opacity: 0.2;
  }
  .auth-blob-1 {
    width: 600px; height: 600px;
    top: -200px; right: -100px;
    background: radial-gradient(circle, #6B9E91, transparent);
    animation: authBlobDrift 20s ease-in-out infinite alternate;
  }
  .auth-blob-2 {
    width: 400px; height: 400px;
    bottom: -100px; left: -100px;
    background: radial-gradient(circle, #D4793A55, transparent);
    animation: authBlobDrift 26s ease-in-out infinite alternate-reverse;
  }
  @keyframes authBlobDrift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.08); }
  }

  /* ── Left panel ── */
  .auth-left {
    flex: 1.1;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem;
    color: var(--cream);
  }

  .auth-left-inner {
    max-width: 500px;
    width: 100%;
    animation: authSlideUp 0.8s cubic-bezier(.22,.68,0,1.2) both;
  }

  .auth-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
  }
  .auth-brand-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--amber) 0%, #E8944A 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(212, 121, 58, 0.4);
  }
  .auth-brand-name {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--cream);
    letter-spacing: 0.02em;
  }

  .auth-hero-img-wrap {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 40px 80px rgba(0,0,0,0.4);
    margin-bottom: 2rem;
  }
  .auth-hero-img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
    filter: saturate(0.9) brightness(0.85);
  }
  .auth-hero-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(28,43,58,0.75) 100%);
  }
  .auth-hero-tag {
    position: absolute;
    bottom: 1.2rem; left: 1.4rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    font-size: 0.82rem;
    font-weight: 500;
  }
  .auth-hero-tag-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--sage-light);
  }

  .auth-copy-title {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 2.5vw, 2rem);
    color: var(--cream);
    margin-bottom: 0.7rem;
    line-height: 1.2;
  }
  .auth-copy-title em { font-style: italic; color: var(--sage-light); }
  .auth-copy-body {
    color: rgba(250,247,242,0.65);
    font-size: 0.95rem;
    line-height: 1.75;
    margin-bottom: 1.8rem;
  }

  .auth-trust-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }
  .auth-trust-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.8rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(250,247,242,0.75);
    font-size: 0.8rem;
    font-weight: 500;
  }
  .auth-trust-pill-check {
    color: var(--sage-light);
    font-size: 0.75rem;
  }

  /* ── Right panel ── */
  .auth-right {
    flex: 1;
    z-index: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem;
    background: var(--cream);
    min-height: 100vh;
  }

  /* Subtle texture */
  .auth-right::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 20%, rgba(232,240,238,0.8) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 80%, rgba(253,240,230,0.5) 0%, transparent 50%);
    pointer-events: none;
  }

  .auth-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 460px;
    animation: authSlideUp 0.7s cubic-bezier(.22,.68,0,1.2) 0.1s both;
  }

  @keyframes authSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Form section header ── */
  .auth-form-header {
    margin-bottom: 2rem;
  }
  .auth-form-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    background: var(--sage-pale);
    color: var(--sage);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
    border: 1px solid rgba(74,124,111,0.2);
  }
  .auth-form-title {
    font-family: var(--font-display);
    font-size: clamp(1.7rem, 3vw, 2.1rem);
    color: var(--navy);
    line-height: 1.15;
    margin-bottom: 0.4rem;
  }
  .auth-form-title em { font-style: italic; color: var(--sage); }
  .auth-form-subtitle {
    color: var(--slate);
    font-size: 0.9rem;
    line-height: 1.6;
  }

  /* ── Inputs ── */
  .auth-field {
    margin-bottom: 1.2rem;
  }
  .auth-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 0.45rem;
  }
  .auth-input-wrap {
    position: relative;
  }
  .auth-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--slate);
    pointer-events: none;
    transition: color 0.2s;
  }
  .auth-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.9rem;
    font-family: var(--font-body);
    font-size: 0.95rem;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--warm-white);
    color: var(--navy);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-shadow: var(--shadow-sm);
  }
  .auth-input:focus {
    border-color: var(--sage);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(74, 124, 111, 0.12);
  }
  .auth-input:focus ~ .auth-input-icon { color: var(--sage); }
  .auth-input-wrap:focus-within .auth-input-icon { color: var(--sage); }

  .auth-eye-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--slate);
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  .auth-eye-btn:hover { color: var(--navy); }

  /* ── Password strength ── */
  .auth-pw-tooltip {
    position: absolute;
    left: 0;
    top: calc(100% + 8px);
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.85rem 1rem;
    font-size: 0.83rem;
    box-shadow: var(--shadow-md);
    z-index: 20;
    min-width: 230px;
    animation: authFadeIn 0.15s ease both;
  }
  @keyframes authFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .auth-pw-tooltip-title {
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 0.5rem;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .auth-pw-req {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--slate);
    margin-bottom: 0.25rem;
    transition: color 0.2s;
  }
  .auth-pw-req.met { color: var(--sage); }
  .auth-pw-req.unmet { color: #C4534A; }

  /* ── Divider ── */
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.2rem 0;
  }
  .auth-divider-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .auth-divider-text {
    font-size: 0.78rem;
    color: var(--slate);
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* ── Buttons ── */
  .auth-btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.95rem 1.5rem;
    font-family: var(--font-body);
    font-size: 0.97rem;
    font-weight: 600;
    border-radius: var(--radius-sm);
    border: none;
    background: var(--navy);
    color: var(--cream);
    cursor: pointer;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    box-shadow: 0 4px 18px rgba(28, 43, 58, 0.22);
    margin-bottom: 0.9rem;
  }
  .auth-btn-primary:hover:not(:disabled) {
    background: var(--navy-mid);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(28, 43, 58, 0.28);
  }
  .auth-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .auth-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

  .auth-btn-google {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.85rem 1.5rem;
    font-family: var(--font-body);
    font-size: 0.93rem;
    font-weight: 600;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--warm-white);
    color: var(--navy);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.18s;
    box-shadow: var(--shadow-sm);
  }
  .auth-btn-google:hover {
    background: var(--cream-dark);
    border-color: rgba(74,124,111,0.3);
    transform: translateY(-2px);
  }

  .auth-link-btn {
    background: none;
    border: none;
    color: var(--sage);
    font-family: var(--font-body);
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    transition: color 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
  }
  .auth-link-btn:hover { color: var(--sage-light); text-decoration-color: var(--sage-light); }

  .auth-footer {
    text-align: center;
    font-size: 0.875rem;
    color: var(--slate);
    margin-top: 1.4rem;
  }

  /* ── Forgot password link above form ── */
  .auth-forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }
  .auth-forgot-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 0.83rem;
    font-weight: 500;
    color: var(--slate);
    padding: 0;
    transition: color 0.2s;
  }
  .auth-forgot-btn:hover { color: var(--sage); }

  /* ── Alerts ── */
  .auth-alert {
    padding: 0.8rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.88rem;
    line-height: 1.55;
    margin-bottom: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .auth-alert-error {
    background: #FEF2F2;
    color: #B91C1C;
    border: 1px solid #FECACA;
  }
  .auth-alert-success {
    background: var(--sage-pale);
    color: var(--sage);
    border: 1px solid rgba(74,124,111,0.25);
  }

  /* ── OTP ── */
  .auth-otp-row {
    display: flex;
    gap: 0.65rem;
    justify-content: center;
    margin: 1rem 0 1.5rem;
  }
  .auth-otp-input {
    width: 48px; height: 54px;
    font-family: var(--font-display);
    font-size: 1.5rem;
    text-align: center;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--warm-white);
    color: var(--navy);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-shadow: var(--shadow-sm);
  }
  .auth-otp-input:focus {
    border-color: var(--sage);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(74, 124, 111, 0.12);
  }
  .auth-otp-input.filled {
    border-color: var(--sage);
    background: var(--sage-pale);
    color: var(--sage);
  }

  /* ── Back button ── */
  .auth-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--slate);
    padding: 0;
    margin-bottom: 1.4rem;
    transition: color 0.2s;
  }
  .auth-back-btn:hover { color: var(--navy); }

  /* ── Resend ── */
  .auth-resend-row {
    text-align: center;
    font-size: 0.875rem;
    color: var(--slate);
    margin-top: 0.5rem;
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .auth-left { display: none; }
    .auth-right { min-height: 100vh; }
  }
`;

const passwordRequirements = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /\d/.test(v) },
  { label: 'One special character', test: (v) => /[^A-Za-z\d]/.test(v) },
];

const HealthCompassAuth = ({ onLogin, initialView = 'login' }) => {
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(initialView || 'login');
  const [flow, setFlow] = useState('verify');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const handleTransition = (view) => { clearMessages(); setCurrentView(view); };
  const clearMessages = () => { setError(''); setSuccess(''); };

  useEffect(() => {
    if (currentView === 'login') navigate('/login', { replace: true });
    if (currentView === 'signup') navigate('/signup', { replace: true });
    if (currentView === 'otp') navigate('/verify', { replace: true });
    if (currentView === 'forgot-password') navigate('/forgot-password', { replace: true });
    if (currentView === 'reset-password') navigate('/reset-password', { replace: true });
  }, [currentView, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const next = document.getElementById(`otp-${index + 1}`);
        if (next) next.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success && data.user && data.token) {
        setSuccess('Login successful!');
        setTimeout(() => { onLogin(data.user, data.token); }, 500);
      } else { setError(data.message || 'Login failed'); }
    } catch (err) { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleGoogleCredential = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      const accessToken = credentialResponse?.access_token || credentialResponse?.accessToken;
      if (!idToken && !accessToken) { setError('Google sign-in failed to return a token'); return; }
      setLoading(true);
      const body = idToken ? { idToken } : { accessToken };
      const res = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/google`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) { onLogin(data.user, data.token); }
      else { setError(data.message || 'Google sign-in failed'); }
    } catch (err) { setError('Google sign-in error'); }
    finally { setLoading(false); }
  };

  const loginWithGoogleSignIn = useGoogleLogin({ onSuccess: handleGoogleCredential, onError: () => setError('Google sign-in failed') });
  const loginWithGoogleSignUp = useGoogleLogin({ onSuccess: handleGoogleCredential, onError: () => setError('Google sign-in failed') });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success && data.token && data.user) {
        setSuccess('Registration successful!');
        setTimeout(() => { onLogin(data.user, data.token); }, 500);
      } else if (data.success && data.pending) {
        setFlow('verify');
        setSuccess('OTP sent to your email. Please verify to continue.');
        setTimeout(() => { handleTransition('otp'); }, 400);
      } else { setError(data.message || 'Registration failed'); }
    } catch (err) { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the 6-digit code'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const endpoint = flow === 'verify' ? '/api/auth/verify-email' : '/api/auth/verify-reset';
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (data.success) {
        if (flow === 'verify') {
          try {
            const loginRes = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/login`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            const loginData = await loginRes.json();
            if (loginData.success && loginData.token && loginData.user) { onLogin(loginData.user, loginData.token); return; }
          } catch (e) {}
          setSuccess('Email verified! Please log in.');
          setTimeout(() => handleTransition('login'), 700);
        } else {
          setSuccess('Code verified! Set your new password.');
          setVerifiedOtp(code);
          handleTransition('reset-password');
        }
      } else { setError(data.message || 'Verification failed'); }
    } catch (err) { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const endpoint = flow === 'verify' ? '/api/auth/resend-verification' : '/api/auth/resend-reset';
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) { setSuccess(flow === 'verify' ? 'Verification code resent. Check your email.' : 'Reset code resent. Check your email.'); }
      else { setError(data.message || 'Failed to resend code'); }
    } catch (err) { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (newPassword1 !== newPassword2) { setError('Passwords do not match'); return; }
    if (newPassword1.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verifiedOtp, newPassword: newPassword1 }),
      });
      const data = await response.json();
      if (data.success) { setSuccess('Password reset successful! Please log in.'); setTimeout(() => { handleTransition('login'); }, 1000); }
      else { setError(data.message || 'Reset failed'); }
    } catch (err) { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = (e) => {
    e?.preventDefault();
    if (!email) { setError('Please enter your email to reset your password.'); return; }
    handleTransition('forgot-password');
  };

  const handleSendResetOTP = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setFlow('reset');
        setSuccess('OTP has been sent to your email.');
        setCurrentView('otp');
        navigate('/verify', { replace: true });
      } else { setError('No account found with this email address.'); }
    } catch (err) { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  // ── Reusable sub-components ──

  const PasswordInfoTooltip = ({ pw }) => (
    showPasswordInfo ? (
      <div className="auth-pw-tooltip">
        <div className="auth-pw-tooltip-title">Requirements</div>
        {passwordRequirements.map((req, i) => (
          <div key={i} className={`auth-pw-req ${pw.length > 0 ? (req.test(pw) ? 'met' : 'unmet') : ''}`}>
            {req.test(pw) ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {req.label}
          </div>
        ))}
      </div>
    ) : null
  );

  const Alert = ({ type, msg }) => !msg ? null : (
    <div className={`auth-alert auth-alert-${type}`}>
      {type === 'error' ? <XCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
      {msg}
    </div>
  );

  return (
    <div className="hc-auth-root">
      <style>{AUTH_STYLES}</style>
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <HeartPulse color="white" size={24} />
            </div>
            <span className="auth-brand-name">Health Compass</span>
          </div>

          <div className="auth-hero-img-wrap">
            <img
              className="auth-hero-img"
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80"
              alt="Caregiver with patient"
            />
            <div className="auth-hero-img-overlay" />
            <div className="auth-hero-tag">
              <span className="auth-hero-tag-dot" />
              Caregiver-first platform
            </div>
          </div>

          <h2 className="auth-copy-title">
            Navigate care with <em>clarity</em>
          </h2>
          <p className="auth-copy-body">
            Build a profile once and receive tailored memory, mobility, and mood check-ins that adapt as your loved one's needs change.
          </p>

          <div className="auth-trust-pills">
            {['Safety guardrails', 'Explainable AI', 'Clinician-informed', 'Plain language'].map((t) => (
              <span key={t} className="auth-trust-pill">
                <span className="auth-trust-pill-check">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">

          {/* ── LOGIN ── */}
          {currentView === 'login' && (
            <>
              <div className="auth-form-header">
                <div className="auth-form-badge">Welcome back</div>
                <h1 className="auth-form-title">Sign in to <em>Health Compass</em></h1>
                <p className="auth-form-subtitle">Continue your care journey where you left off.</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="auth-field">
                  <label className="auth-label"><Mail size={14} /> Email</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon"><Mail size={17} /></span>
                    <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" />
                  </div>
                </div>

                <div className="auth-field">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <label className="auth-label" style={{ margin: 0 }}>
                      <Lock size={14} /> Password
                      <span style={{ marginLeft: 6, cursor: 'pointer', position: 'relative' }}
                        onMouseEnter={() => setShowPasswordInfo(true)}
                        onMouseLeave={() => setShowPasswordInfo(false)}>
                        <Info size={14} color="var(--slate)" />
                        <PasswordInfoTooltip pw={password} />
                      </span>
                    </label>
                    <button type="button" className="auth-forgot-btn" onClick={handleForgotPassword}>Forgot password?</button>
                  </div>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon"><Lock size={17} /></span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" />
                    <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <Alert type="error" msg={error} />
                <Alert type="success" msg={success} />

                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? 'Signing in…' : 'Continue'} <ArrowRight size={18} />
                </button>
              </form>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">or</span>
                <div className="auth-divider-line" />
              </div>

              <button className="auth-btn-google" onClick={() => loginWithGoogleSignIn()}>
                <img src="google.png" alt="Google" style={{ width: 18, height: 18 }} />
                Sign in with Google
              </button>

              <div className="auth-footer">
                Don't have an account?{' '}
                <button className="auth-link-btn" onClick={() => handleTransition('signup')}>Create one</button>
              </div>
            </>
          )}

          {/* ── SIGNUP ── */}
          {currentView === 'signup' && (
            <>
              <div className="auth-form-header">
                <div className="auth-form-badge">New account</div>
                <h1 className="auth-form-title">Join <em>Health Compass</em></h1>
                <p className="auth-form-subtitle">Start your caregiving journey with confidence.</p>
              </div>

              <form onSubmit={handleRegister}>
                <div className="auth-field">
                  <label className="auth-label"><User size={14} /> Full Name</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon"><User size={17} /></span>
                    <input type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="auth-input" />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label"><Mail size={14} /> Email</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon"><Mail size={17} /></span>
                    <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">
                    <Lock size={14} /> Password
                    <span style={{ marginLeft: 6, cursor: 'pointer', position: 'relative' }}
                      onMouseEnter={() => setShowPasswordInfo(true)}
                      onMouseLeave={() => setShowPasswordInfo(false)}>
                      <Info size={14} color="var(--slate)" />
                      <PasswordInfoTooltip pw={password} />
                    </span>
                  </label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon"><Lock size={17} /></span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" />
                    <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <Alert type="error" msg={error} />
                <Alert type="success" msg={success} />

                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? 'Creating…' : 'Create Account'} <ArrowRight size={18} />
                </button>
              </form>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">or</span>
                <div className="auth-divider-line" />
              </div>

              <button className="auth-btn-google" onClick={() => loginWithGoogleSignUp()}>
                <img src="google.png" alt="Google" style={{ width: 18, height: 18 }} />
                Sign up with Google
              </button>

              <div className="auth-footer">
                Already have an account?{' '}
                <button className="auth-link-btn" onClick={() => handleTransition('login')}>Sign in</button>
              </div>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {currentView === 'forgot-password' && (
            <>
              <button className="auth-back-btn" onClick={() => handleTransition('login')}>← Back to login</button>
              <div className="auth-form-header">
                <div className="auth-form-badge">Password reset</div>
                <h1 className="auth-form-title">Reset your password</h1>
                <p className="auth-form-subtitle">Enter your email and we'll send a reset code.</p>
              </div>
              <div className="auth-field">
                <label className="auth-label"><Mail size={14} /> Email</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><Mail size={17} /></span>
                  <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" />
                </div>
              </div>
              <Alert type="error" msg={error} />
              <Alert type="success" msg={success} />
              <button className="auth-btn-primary" onClick={handleSendResetOTP} disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Code'} <ArrowRight size={18} />
              </button>
            </>
          )}

          {/* ── OTP ── */}
          {currentView === 'otp' && (
            <>
              <button className="auth-back-btn" onClick={() => handleTransition(flow === 'reset' ? 'forgot-password' : 'signup')}>← Back</button>
              <div className="auth-form-header">
                <div className="auth-form-badge">{flow === 'reset' ? 'Reset code' : 'Verification'}</div>
                <h1 className="auth-form-title">{flow === 'reset' ? 'Verify reset code' : 'Verify your email'}</h1>
                <p className="auth-form-subtitle">We sent a 6-digit code to <strong style={{ color: 'var(--navy)' }}>{email}</strong></p>
              </div>

              <div className="auth-otp-row">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`auth-otp-input${digit ? ' filled' : ''}`}
                  />
                ))}
              </div>

              <Alert type="error" msg={error} />
              <Alert type="success" msg={success} />

              <button className="auth-btn-primary" onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying…' : 'Verify & Continue'} <ArrowRight size={18} />
              </button>

              <div className="auth-resend-row">
                Didn't receive it?{' '}
                <button className="auth-link-btn" onClick={handleResend} disabled={loading}>Resend code</button>
              </div>
              <div className="auth-footer" style={{ marginTop: '0.5rem' }}>Check your spam folder if you don't see it.</div>
            </>
          )}

          {/* ── RESET PASSWORD ── */}
          {currentView === 'reset-password' && (
            <>
              <button className="auth-back-btn" onClick={() => handleTransition('otp')}>← Back</button>
              <div className="auth-form-header">
                <div className="auth-form-badge">New password</div>
                <h1 className="auth-form-title">Set a new password</h1>
                <p className="auth-form-subtitle">Choose a strong password to protect your account.</p>
              </div>

              <div className="auth-field">
                <label className="auth-label">
                  <Lock size={14} /> New Password
                  <span style={{ marginLeft: 6, cursor: 'pointer', position: 'relative' }}
                    onMouseEnter={() => setShowPasswordInfo(true)}
                    onMouseLeave={() => setShowPasswordInfo(false)}>
                    <Info size={14} color="var(--slate)" />
                    <PasswordInfoTooltip pw={newPassword1} />
                  </span>
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><Lock size={17} /></span>
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)} className="auth-input" />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label"><Lock size={14} /> Confirm Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><Lock size={17} /></span>
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} className="auth-input" />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <Alert type="error" msg={error} />
              <Alert type="success" msg={success} />

              <button className="auth-btn-primary" onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'} <ArrowRight size={18} />
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default HealthCompassAuth;