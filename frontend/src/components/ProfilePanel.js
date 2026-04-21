import React, { useState } from 'react';
import { User, Activity, ShieldAlert, Heart, Lock, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProfilePanel({ profile, onChange, user }) {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    clinical: false,
    medical: false,
    vitals: false
  });

  const tier = user?.subscriptionTier || 'free';
  const isPro = tier === 'pro';

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const calculateCompleteness = () => {
    const requiredFields = ['name', 'age', 'gender', 'education', 'occupation'];
    const filledRequired = requiredFields.filter(f => profile[f]).length;
    const total = requiredFields.length;
    return Math.round((filledRequired / total) * 100);
  };

  const completeness = calculateCompleteness();

  const sectionStyle = {
    marginBottom: '1rem',
    borderRadius: '16px',
    border: '1px solid rgba(0,0,0,0.05)',
    background: '#fff',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
  };

  const headerStyle = {
    padding: '1.2rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#fff',
    transition: 'background 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--slate)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.9rem 1.1rem',
    border: '1.5px solid #F1F5F9',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    background: '#F8FAFC',
    transition: 'all 0.2s'
  };

  const lockOverlay = (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 10, borderRadius: '16px', padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--sage-pale)', color: 'var(--sage)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1rem' }}>
        <Lock size={20} />
      </div>
      <h4 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)' }}>Pro Feature</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--slate)', marginBottom: '1rem' }}>Advanced clinical markers are available on the Pro plan.</p>
      <Link to="/subscription" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sage)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        Upgrade Now <ChevronRight size={14} />
      </Link>
    </div>
  );

  return (
    <div className="profile-panel-premium">
      <style>{`
        .profile-panel-premium { font-family: 'Outfit', sans-serif; }
        .input-focus:focus { outline: none; border-color: var(--sage) !important; background: #fff !important; box-shadow: 0 0 0 4px var(--sage-pale); }
      `}</style>
      
      <div style={{
        padding: '2.5rem 2rem',
        background: 'var(--navy)',
        borderRadius: '32px 32px 0 0',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(74, 124, 111, 0.3), transparent 70%)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="var(--sage-pale)" />
            </div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>Patient Profile</h2>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.6rem', color: 'rgba(255,255,255,0.7)' }}>
            <span>Completeness</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{completeness}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${completeness}%`, height: '100%', background: '#D4793A', borderRadius: '4px', transition: 'width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px rgba(212, 121, 58, 0.5)' }}></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem', background: 'var(--white)', borderRadius: '0 0 32px 32px', border: '1px solid rgba(0,0,0,0.05)', borderTop: 'none' }}>
        
        {/* Section 1: Core Information */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggleSection('basic')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Sparkles size={18} color="var(--sage)" />
              <span style={{ fontWeight: 600 }}>Core Information</span>
            </div>
            <ChevronRight size={18} style={{ transform: expandedSections.basic ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
          </div>
          
          {expandedSections.basic && (
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} className="input-focus" type="text" value={profile.name || ''} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter patient name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Age *</label>
                  <input style={inputStyle} className="input-focus" type="number" value={profile.age || ''} onChange={(e) => handleChange('age', parseInt(e.target.value))} placeholder="Years" />
                </div>
                <div>
                  <label style={labelStyle}>Gender *</label>
                  <select style={inputStyle} className="input-focus" value={profile.gender || ''} onChange={(e) => handleChange('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Education Level *</label>
                <select style={inputStyle} className="input-focus" value={profile.education || ''} onChange={(e) => handleChange('education', e.target.value)}>
                  <option value="">Select level</option>
                  <option value="elementary">Elementary</option>
                  <option value="high-school">High School</option>
                  <option value="bachelors">Bachelor's</option>
                  <option value="masters">Master's</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Occupation *</label>
                <input style={inputStyle} className="input-focus" type="text" value={profile.occupation || ''} onChange={(e) => handleChange('occupation', e.target.value)} placeholder="e.g. Retired Engineer" />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Health & Lifestyle */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggleSection('clinical')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Activity size={18} color="var(--sage)" />
              <span style={{ fontWeight: 600 }}>Health & Lifestyle</span>
            </div>
            <ChevronRight size={18} style={{ transform: expandedSections.clinical ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
          </div>
          
          {expandedSections.clinical && (
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>BMI</label>
                  <input style={inputStyle} className="input-focus" type="number" step="0.1" value={profile.bmi || ''} onChange={(e) => handleChange('bmi', parseFloat(e.target.value))} placeholder="24.5" />
                </div>
                <div>
                  <label style={labelStyle}>Sleep Quality</label>
                  <input style={inputStyle} className="input-focus" type="number" min="1" max="10" value={profile.sleep_quality || ''} onChange={(e) => handleChange('sleep_quality', parseInt(e.target.value))} placeholder="1-10" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Smoking Status</label>
                <select style={inputStyle} className="input-focus" value={profile.smoking || ''} onChange={(e) => handleChange('smoking', e.target.value)}>
                  <option value="">Select</option>
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Medical Flags (PRO) */}
        <div style={{ ...sectionStyle, position: 'relative' }}>
          {!isPro && expandedSections.medical && lockOverlay}
          <div style={headerStyle} onClick={() => toggleSection('medical')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <ShieldAlert size={18} color={isPro ? "var(--sage)" : "var(--slate)"} />
              <span style={{ fontWeight: 600, color: isPro ? 'inherit' : 'var(--slate)' }}>Medical Flags</span>
              {!isPro && <Lock size={12} style={{ opacity: 0.5 }} />}
            </div>
            <ChevronRight size={18} style={{ transform: expandedSections.medical ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
          </div>
          
          {expandedSections.medical && (
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gap: '0.8rem', opacity: isPro ? 1 : 0.3 }}>
              {['Vision Impairment', 'Hearing Impairment', 'Motor Impairment', 'Diabetes', 'Hypertension', 'History of Stroke'].map(flag => (
                <label key={flag} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#F8FAFC', borderRadius: '12px', cursor: isPro ? 'pointer' : 'default' }}>
                  <input 
                    type="checkbox" 
                    disabled={!isPro}
                    checked={(profile.medicalFlags || []).includes(flag.toLowerCase().replace(' ', '-'))}
                    onChange={(e) => {
                      const current = profile.medicalFlags || [];
                      const val = flag.toLowerCase().replace(' ', '-');
                      const next = e.target.checked ? [...current, val] : current.filter(c => c !== val);
                      handleChange('medicalFlags', next);
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{flag}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Clinical Vitals (PRO) */}
        <div style={{ ...sectionStyle, position: 'relative' }}>
          {!isPro && expandedSections.vitals && lockOverlay}
          <div style={headerStyle} onClick={() => toggleSection('vitals')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Heart size={18} color={isPro ? "var(--sage)" : "var(--slate)"} />
              <span style={{ fontWeight: 600, color: isPro ? 'inherit' : 'var(--slate)' }}>Clinical Vitals</span>
              {!isPro && <Lock size={12} style={{ opacity: 0.5 }} />}
            </div>
            <ChevronRight size={18} style={{ transform: expandedSections.vitals ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
          </div>
          
          {expandedSections.vitals && (
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gap: '1.2rem', opacity: isPro ? 1 : 0.3 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Systolic BP</label>
                  <input style={inputStyle} disabled={!isPro} type="number" value={profile.systolic_bp || ''} onChange={(e) => handleChange('systolic_bp', parseInt(e.target.value))} placeholder="mmHg" />
                </div>
                <div>
                  <label style={labelStyle}>Diastolic BP</label>
                  <input style={inputStyle} disabled={!isPro} type="number" value={profile.diastolic_bp || ''} onChange={(e) => handleChange('diastolic_bp', parseInt(e.target.value))} placeholder="mmHg" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Total Cholesterol</label>
                <input style={inputStyle} disabled={!isPro} type="number" value={profile.cholesterol_total || ''} onChange={(e) => handleChange('cholesterol_total', parseFloat(e.target.value))} placeholder="mg/dL" />
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--sage-pale)', borderRadius: '16px', display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
          <AlertCircle size={18} color="var(--sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sage)', lineHeight: 1.5 }}>
            <strong>Privacy Note:</strong> All clinical data is encrypted. Your patient's identity remains private and is only used to calibrate assessment results.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePanel;