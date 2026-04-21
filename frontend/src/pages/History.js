import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ChevronDown, ChevronUp, History as HistoryIcon, Calendar, Activity, BarChart3, FileText, Lock, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { generateClinicalPDF } from '../services/reportingService';

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

  .history-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--font-main);
    color: var(--navy);
  }

  .history-main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 6rem 2rem 4rem;
  }

  .history-header {
    margin-bottom: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  @media (max-width: 600px) { .history-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; } }

  .history-title {
    font-family: var(--font-serif);
    font-size: 3.5rem;
    line-height: 1.1;
    margin-bottom: 0.5rem;
  }
  .history-subtitle { color: var(--slate); font-size: 1.1rem; }

  .hist-card {
    background: var(--white);
    border-radius: 32px;
    padding: 3rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 10px 40px rgba(28, 43, 58, 0.04);
    transition: all 0.3s ease;
  }
  .hist-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(28, 43, 58, 0.08); }

  .hist-card-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }

  .date-box {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: var(--primary);
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.8rem;
  }

  .patient-name { font-size: 1.8rem; font-family: var(--font-serif); margin-bottom: 0.4rem; }
  .mode-badge {
    display: inline-flex;
    padding: 0.3rem 0.8rem;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    padding: 2rem 0;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .stat-item label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--slate);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }
  .stat-item .val { font-size: 2rem; font-weight: 700; color: var(--navy); }
  .stat-item .sub { font-size: 1.1rem; color: var(--slate); font-weight: 500; }

  .expand-btn {
    width: 100%;
    padding: 1.2rem;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.05);
    background: var(--cream);
    color: var(--navy);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    transition: all 0.2s;
  }
  .expand-btn:hover { background: var(--white); border-color: var(--primary); }

  .details-grid {
    display: grid;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px dashed rgba(0,0,0,0.1);
  }

  .domain-row {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: #F9FBFA;
    border-radius: 12px;
    font-size: 0.95rem;
  }
  .domain-score { font-weight: 700; color: var(--primary); }

  .btn-dash {
    padding: 0.8rem 1.6rem;
    border-radius: 999px;
    background: var(--navy);
    color: var(--white);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    transition: all 0.3s;
  }
  .btn-dash:hover { transform: scale(1.05); background: var(--primary); }

  @media print {
    .history-root { background: #fff; }
    .btn-dash, .expand-btn, .history-header, .bg-glow { display: none !important; }
    .hist-card { border: none !important; box-shadow: none !important; break-inside: avoid; }
    .history-main { padding: 0; }
    .details-grid { display: grid !important; }
  }

  .chart-container {
    height: 300px;
    width: 100%;
    margin-bottom: 3rem;
    padding: 2rem;
    background: var(--white);
    border-radius: 32px;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 10px 40px rgba(28, 43, 58, 0.04);
  }
`;

const DOMAINS = [
  { key: 'global', label: 'Global Cognitive Screen' },
  { key: 'episodic-memory', label: 'Episodic Memory Assessment' },
  { key: 'executive', label: 'Executive Function Assessment' },
  { key: 'language', label: 'Language Assessment' },
  { key: 'functional', label: 'Functional Assessment' }
];

export default function History({ user, onLogout }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/assessment/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          // Filter out the "empty" 0-score tests from current view as requested
          const filteredHistory = data.data.filter(entry => 
            (entry.scores?.raw?.earned || 0) > 0 || (entry.scores?.mocaEquivalent?.adjusted || 0) > 0
          );
          setHistory(filteredHistory);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportPDF = () => {
    if (!canExport) return;
    const latestProfile = history.length > 0 ? history[0].patientProfile : {};
    generateClinicalPDF(history, latestProfile);
  };

  const tier = user?.subscriptionTier || 'free';
  const canExport = tier !== 'free';
  const canSeeDetails = tier !== 'free';

  return (
    <div className="history-root">
      <style>{STYLES}</style>
      <Navbar user={user} onLogout={onLogout} />

      <main className="history-main">
        <header className="history-header">
          <div>
            <h1 className="history-title">History</h1>
            <p className="history-subtitle">Longitudinal tracking of cognitive wellness assessments.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleExportPDF}
              disabled={!canExport}
              className="btn-dash"
              style={{ background: 'var(--white)', color: 'var(--navy)', border: '1px solid rgba(0,0,0,0.1)', opacity: canExport ? 1 : 0.6, cursor: canExport ? 'pointer' : 'not-allowed' }}
            >
              {canExport ? <Download size={18} /> : <Lock size={16} />}
              Clinical Report
            </button>
            <Link to="/dashboard" className="btn-dash">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Activity className="animate-spin" size={40} color="var(--primary)" />
            <p style={{ marginTop: '1rem', color: 'var(--slate)' }}>Retrieving clinical records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="hist-card" style={{ textAlign: 'center' }}>
            <HistoryIcon size={48} color="var(--slate)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No assessments yet</h3>
            <p style={{ color: 'var(--slate)', marginBottom: '2rem' }}>Complete your first cognitive baseline to see history here.</p>
            <Link to="/dashboard" className="btn-dash">Start Assessment</Link>
          </div>
        ) : (
          <>
            {history.map(entry => {
              const isExp = !!expanded[entry._id];
              const d = new Date(entry.createdAt);
              const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

              const earn = entry.scores?.raw?.earned || 0;
              const total = entry.scores?.raw?.total || 60;
              const percent = entry.scores?.raw?.percentage || Math.round((earn / total) * 100);
              const moca = entry.scores?.mocaEquivalent?.adjusted || 0;
              const domainsData = entry.scores?.byDomain || {};

              return (
                <div key={entry._id} className="hist-card">
                  <div className="date-box">
                    <Calendar size={14} /> {dateStr}
                  </div>

                  <div className="hist-card-top">
                    <div>
                      <h2 className="patient-name">{entry.patientProfile?.name || 'Patient'}</h2>
                      <span className="mode-badge">Standard Assessment</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>MoCA Equivalent</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{moca}<span style={{ fontSize: '1.2rem', color: 'var(--slate)' }}>/30</span></div>
                    </div>
                  </div>

                  <div className="stats-row">
                    <div className="stat-item">
                      <label>Accuracy</label>
                      <div className="val">{percent}<span className="sub">%</span></div>
                    </div>
                    <div className="stat-item">
                      <label>Correct</label>
                      <div className="val">{earn}<span className="sub">/{total}</span></div>
                    </div>
                    <div className="stat-item">
                      <label>Status</label>
                      <div className="val" style={{ fontSize: '1.2rem', color: moca >= 26 ? '#10B981' : '#F59E0B' }}>
                        {moca >= 26 ? 'Stable' : 'Observation'}
                      </div>
                    </div>
                  </div>

                  <button className="expand-btn" onClick={() => toggleExpand(entry._id)}>
                    {isExp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {isExp ? 'Hide Domain Breakdown' : 'View Domain Breakdown'}
                    {!canSeeDetails && <Lock size={12} style={{ marginLeft: '4px', opacity: 0.5 }} />}
                  </button>

                  {isExp && (
                    <div className="details-grid">
                      {canSeeDetails ? (
                        DOMAINS.map(d => {
                          const dom = domainsData[d.key] || { earned: 0, total: 12 };
                          return (
                            <div key={d.key} className="domain-row">
                              <span>{d.label}</span>
                              <span className="domain-score">{dom.earned}/{dom.total}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--primary-light)', borderRadius: '16px' }}>
                          <Lock size={24} color="var(--primary)" style={{ marginBottom: '0.8rem' }} />
                          <h4 style={{ margin: '0 0 0.5rem' }}>Basic Feature</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--primary)', opacity: 0.8, margin: '0 0 1rem' }}>
                            Upgrade to Basic or Pro to see the full domain breakdown for this assessment.
                          </p>
                          <Link to="/subscription" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                            Upgrade Now →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}
