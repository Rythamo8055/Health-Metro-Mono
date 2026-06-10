import React from 'react';
import { Target, Trophy, Flame, Code, Briefcase } from 'lucide-react';

const Dashboard = ({ xp }) => {
  const level = Math.floor(xp / 100) + 1;
  const progressToNext = xp % 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progressToNext / 100) * circumference;

  return (
    <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Trophy color="var(--accent-3)" size={32} /> Status Report
        </h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        
        {/* Level Ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', flex: '1', minWidth: '300px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="url(#gradient)" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent-1)" />
                  <stop offset="100%" stopColor="var(--accent-2)" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>{level}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Level</span>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Rank Up In Progress</h3>
            <p style={{ color: 'var(--text-muted)' }}>{100 - progressToNext} XP needed for Level {level + 1}</p>
          </div>
        </div>

        {/* Focus Areas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: '1', minWidth: '300px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
              <Briefcase color="var(--success)" />
            </div>
            <div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px', fontWeight: '600' }}>Health Metro Internship</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure that PPO. Deliver clean code.</p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(79, 172, 254, 0.02))', border: '1px solid rgba(79, 172, 254, 0.2)', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '12px', background: 'rgba(79, 172, 254, 0.2)', borderRadius: '12px' }}>
              <Code color="var(--accent-2)" />
            </div>
            <div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px', fontWeight: '600' }}>DSA Mastery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>2 Medium LeetCode problems daily.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
