import React, { useState, useEffect } from 'react';
import { Target, Plus, Zap } from 'lucide-react';

const SkillProgress = ({ loadData }) => {
  const initialSkills = [
    { name: 'MERN Stack', progress: 75, color: '#00f2fe' },
    { name: 'Data Structures', progress: 40, color: '#f093fb' },
    { name: 'Computer Vision', progress: 65, color: '#4facfe' },
    { name: 'System Design', progress: 10, color: '#f5576c' }
  ];

  const [skills, setSkills] = useState(() => loadData('tracker_skills', initialSkills));
  const [milestones, setMilestones] = useState(() => loadData('tracker_milestones', [
    { text: 'Completed Health Metro API Update', date: '2026-05-15' },
    { text: 'Solved 50 LeetCode Problems', date: '2026-05-20' }
  ]));
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    localStorage.setItem('tracker_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('tracker_milestones', JSON.stringify(milestones));
  }, [milestones]);

  const addMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    setMilestones(prev => [
      { text: newMilestone, date: new Date().toISOString().split('T')[0] },
      ...prev
    ]);
    setNewMilestone('');
  };

  const updateSkill = (index, value) => {
    setSkills(prev => {
      const newSkills = [...prev];
      newSkills[index].progress = parseInt(value);
      return newSkills;
    });
  };

  return (
    <div className="glass-panel">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Zap color="var(--accent-4)" size={28} /> Competency Matrix
      </h2>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {skills.map((skill, index) => (
            <div key={skill.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1rem', fontWeight: '500' }}>
                <span>{skill.name}</span>
                <span style={{ color: skill.color }}>{skill.progress}%</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                 <div style={{ 
                   height: '100%', 
                   width: `${skill.progress}%`, 
                   background: skill.color,
                   boxShadow: `0 0 15px ${skill.color}`,
                   transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                 }} />
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={skill.progress}
                onChange={(e) => updateSkill(index, e.target.value)}
                style={{ width: '100%', opacity: 0, marginTop: '-12px', height: '12px', cursor: 'pointer', position: 'relative', zIndex: 10 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Event Log</h3>
        
        <form onSubmit={addMilestone} style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Log a new achievement..."
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              outline: 'none',
              fontSize: '1rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-1)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
          <button 
            type="submit"
            style={{
              background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
              border: 'none',
              borderRadius: '16px',
              padding: '0 1.5rem',
              color: 'var(--bg-dark)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={24} />
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '12px' }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid var(--accent-3)' }}>
              <p style={{ fontSize: '1.05rem', marginBottom: '6px', fontWeight: '500' }}>{m.text}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillProgress;
