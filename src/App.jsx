import React, { useState, useEffect } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import SkillProgress from './components/SkillProgress';
import DailyTest from './components/DailyTest';

function App() {
  const loadData = (key, initialValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  };

  const [xp, setXp] = useState(() => loadData('tracker_xp', 0));
  
  useEffect(() => {
    localStorage.setItem('tracker_xp', JSON.stringify(xp));
  }, [xp]);

  const addXp = (amount) => {
    setXp((prev) => prev + amount);
  };

  return (
    <>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="app-wrapper">
        <header className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
              <div className="pulse-circle"></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '500' }}>System Online</p>
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1.5px', lineHeight: '1.1' }} className="gradient-text">
              Nexus <span className="accent-text-blue">Protocol</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '1.5rem 2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
            <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Total Experience</div>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1' }} className="accent-text-pink">{xp} <span style={{fontSize: '1.5rem'}}>XP</span></div>
          </div>
        </header>
        
        <div className="dashboard-grid">
          <Dashboard xp={xp} />
          <DailyTracker addXp={addXp} loadData={loadData} />
          <SkillProgress loadData={loadData} />
          <DailyTest addXp={addXp} loadData={loadData} />
        </div>
      </div>
    </>
  );
}

export default App;
