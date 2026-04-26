import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, CheckCircle, Activity, Star } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  .admin-dashboard {
    min-height: 100vh;
    background: var(--cream, #FAF7F2);
    font-family: var(--font-body, 'Outfit', sans-serif);
    color: var(--navy, #1C2B3A);
    padding-bottom: 4rem;
  }

  .admin-header {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2.5rem 2rem;
  }
  .admin-title {
    font-family: var(--font-display, 'Playfair Display', serif);
    font-size: 2.5rem;
    color: var(--navy);
    margin-bottom: 0.5rem;
  }
  .admin-subtitle {
    color: var(--slate, #5A6A7A);
    font-size: 1.1rem;
  }

  .admin-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .kpi-card {
    background: var(--warm-white, #FDFCFA);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(74, 124, 111, 0.15);
    box-shadow: 0 4px 12px rgba(28, 43, 58, 0.05);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s;
  }
  .kpi-card:hover {
    transform: translateY(-2px);
  }

  .kpi-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: rgba(107, 158, 145, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--sage, #4A7C6F);
  }

  .kpi-content h4 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--slate);
    margin-bottom: 0.25rem;
  }
  .kpi-content .kpi-val {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--navy);
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  @media (max-width: 900px) {
    .charts-grid { grid-template-columns: 1fr; }
  }

  .chart-card {
    background: var(--warm-white);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(74, 124, 111, 0.15);
    box-shadow: 0 4px 12px rgba(28, 43, 58, 0.05);
  }
  .chart-title {
    font-family: var(--font-display, 'Playfair Display', serif);
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    color: var(--navy);
  }

  .table-card {
    background: var(--warm-white);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(74, 124, 111, 0.15);
    box-shadow: 0 4px 12px rgba(28, 43, 58, 0.05);
    overflow-x: auto;
  }

  .feedback-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }
  .feedback-table th {
    text-align: left;
    padding: 1rem;
    border-bottom: 2px solid rgba(74, 124, 111, 0.2);
    color: var(--slate);
    font-weight: 600;
  }
  .feedback-table td {
    padding: 1rem;
    border-bottom: 1px solid rgba(74, 124, 111, 0.1);
    color: var(--text-body, #3D4E5C);
    vertical-align: top;
    max-width: 300px;
  }
  .feedback-table tr:last-child td {
    border-bottom: none;
  }

  .status-badge {
    padding: 0.3rem 0.6rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .status-easy { background: rgba(74, 124, 111, 0.15); color: var(--sage); }
  .status-struggled { background: rgba(212, 121, 58, 0.15); color: var(--amber, #D4793A); }
  .status-gaveup { background: rgba(185, 28, 28, 0.1); color: #B91C1C; }
`;

const PIE_COLORS = ['#4A7C6F', '#D4793A', '#B91C1C'];

export default function AdminFeedback({ user, onLogout }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/feedback/all`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setData(resData.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch feedback", err);
        setLoading(false);
      });
  }, []);

  // Calculate KPIs
  const totalSubmissions = data.length;
  
  let totalSusScore = 0;
  let susCount = 0;
  
  let completionStats = { easy: 0, struggled: 0, gaveUp: 0 };
  
  data.forEach(item => {
    // Process SUS
    let itemSusTotal = 0;
    let answeredSus = 0;
    [item.sus1, item.sus2, item.sus3, item.sus4, item.sus5].forEach(val => {
      if (val) {
        itemSusTotal += parseInt(val);
        answeredSus++;
      }
    });
    if (answeredSus > 0) {
      totalSusScore += (itemSusTotal / answeredSus); // average for this user
      susCount++;
    }

    // Process Completion
    if (item.completion === 'yes_easily') completionStats.easy++;
    else if (item.completion === 'yes_struggled') completionStats.struggled++;
    else if (item.completion === 'no_gave_up') completionStats.gaveUp++;
  });

  const avgSus = susCount > 0 ? (totalSusScore / susCount).toFixed(1) : 0;
  const completionRate = totalSubmissions > 0 
    ? Math.round(((completionStats.easy + completionStats.struggled) / totalSubmissions) * 100) 
    : 0;

  // Chart Data
  const pieData = [
    { name: 'Easily Finished', value: completionStats.easy },
    { name: 'Finished with Struggle', value: completionStats.struggled },
    { name: 'Gave Up', value: completionStats.gaveUp },
  ].filter(d => d.value > 0);

  // Average per SUS question
  let susQ = [0,0,0,0,0];
  let susQCounts = [0,0,0,0,0];
  
  data.forEach(item => {
    if (item.sus1) { susQ[0] += parseInt(item.sus1); susQCounts[0]++; }
    if (item.sus2) { susQ[1] += parseInt(item.sus2); susQCounts[1]++; }
    if (item.sus3) { susQ[2] += parseInt(item.sus3); susQCounts[2]++; }
    if (item.sus4) { susQ[3] += parseInt(item.sus4); susQCounts[3]++; }
    if (item.sus5) { susQ[4] += parseInt(item.sus5); susQCounts[4]++; }
  });

  const barData = [
    { name: 'Q1 (Frequent use)', avg: susQCounts[0] ? Number((susQ[0]/susQCounts[0]).toFixed(1)) : 0 },
    { name: 'Q2 (Complex)', avg: susQCounts[1] ? Number((susQ[1]/susQCounts[1]).toFixed(1)) : 0 },
    { name: 'Q3 (Easy use)', avg: susQCounts[2] ? Number((susQ[2]/susQCounts[2]).toFixed(1)) : 0 },
    { name: 'Q4 (Need support)', avg: susQCounts[3] ? Number((susQ[3]/susQCounts[3]).toFixed(1)) : 0 },
    { name: 'Q5 (Well integrated)', avg: susQCounts[4] ? Number((susQ[4]/susQCounts[4]).toFixed(1)) : 0 },
  ];

  return (
    <div className="admin-dashboard">
      <style>{STYLES}</style>
      <Navbar user={user} onLogout={onLogout} />

      <header className="admin-header">
        <h1 className="admin-title">Phase 4A Evidence Dashboard</h1>
        <p className="admin-subtitle">Real-time analysis of user validation feedback and system usability metrics.</p>
      </header>

      <main className="admin-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--sage)' }}>Loading evidence data...</div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate)', background: 'var(--warm-white)', borderRadius: '20px' }}>
            No feedback collected yet. Send the test link to users to begin gathering evidence!
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon"><Users size={24} /></div>
                <div className="kpi-content">
                  <h4>Total Testers</h4>
                  <div className="kpi-val">{totalSubmissions}</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon"><Activity size={24} /></div>
                <div className="kpi-content">
                  <h4>Completion Rate</h4>
                  <div className="kpi-val">{completionRate}%</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon"><Star size={24} /></div>
                <div className="kpi-content">
                  <h4>Avg SUS Rating (1-5)</h4>
                  <div className="kpi-val">{avgSus}</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-title">Task Completion Breakdown</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3 className="chart-title">Average SUS Question Ratings</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(74, 124, 111, 0.1)" />
                      <XAxis type="number" domain={[0, 5]} ticks={[0,1,2,3,4,5]} />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: 'var(--slate)' }} />
                      <RechartsTooltip cursor={{fill: 'rgba(74,124,111,0.05)'}} />
                      <Bar dataKey="avg" fill="var(--navy)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="table-card">
              <h3 className="chart-title">Qualitative Insights</h3>
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Hesitations</th>
                    <th>Result Sense</th>
                    <th>Most Useful</th>
                    <th>Willing to Pay?</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={item._id || idx}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          item.completion === 'yes_easily' ? 'status-easy' : 
                          item.completion === 'yes_struggled' ? 'status-struggled' : 'status-gaveup'
                        }`}>
                          {item.completion === 'yes_easily' ? 'Easy' : 
                           item.completion === 'yes_struggled' ? 'Struggled' : 'Gave Up'}
                        </span>
                      </td>
                      <td>{item.hesitation || <em style={{color: '#aaa'}}>None</em>}</td>
                      <td>{item.resultSense || <em style={{color: '#aaa'}}>None</em>}</td>
                      <td>{item.mostUseful || <em style={{color: '#aaa'}}>None</em>}</td>
                      <td>{item.pay || <em style={{color: '#aaa'}}>None</em>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </>
        )}
      </main>
    </div>
  );
}
