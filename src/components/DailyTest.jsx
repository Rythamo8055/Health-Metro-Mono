import React, { useState, useEffect } from 'react';
import { BrainCircuit, Send, CheckCircle2 } from 'lucide-react';
import planData from '../data/planData.json';

const DailyTest = ({ addXp, loadData }) => {
  const getFormattedDate = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const today = getFormattedDate(new Date());
  
  // Try to find today's primary technical task (GATE or DSA)
  const todayTasks = planData[today] || [];
  const technicalTask = todayTasks.find(t => t.type === 'gate' || t.type === 'dsa');
  const topicString = technicalTask ? technicalTask.text.split(':')[1].strip : "Today's Core Concepts";

  const [testAnswer, setTestAnswer] = useState('');
  const [testSubmitted, setTestSubmitted] = useState(() => {
    const submittedTests = loadData('tracker_submitted_tests', {});
    return !!submittedTests[today];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (testAnswer.length < 20) {
      alert("Please write a bit more to truly test your recall!");
      return;
    }

    // Mark as submitted
    setTestSubmitted(true);
    addXp(50); // Massive XP bonus for doing the active recall test

    // Save state
    const submittedTests = loadData('tracker_submitted_tests', {});
    submittedTests[today] = true;
    localStorage.setItem('tracker_submitted_tests', JSON.stringify(submittedTests));
  };

  return (
    <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        <BrainCircuit className="accent-text-pink" size={32} />
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Active Recall Test</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The ultimate proof of learning.</p>
        </div>
      </div>

      {testSubmitted ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
          <CheckCircle2 color="var(--success)" size={48} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--success)', marginBottom: '8px' }}>Test Completed!</h3>
          <p style={{ color: 'var(--text-muted)' }}>You've successfully cemented today's knowledge. +50 XP granted.</p>
        </div>
      ) : (
        <div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-3)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>Topic: {topicString}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Without looking at your notes, explain the core concepts you learned today in your own words. What were the key takeaways? What challenged you?
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <textarea 
              value={testAnswer}
              onChange={(e) => setTestAnswer(e.target.value)}
              placeholder="Start typing your recall summary here..."
              rows="5"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                fontFamily: 'inherit',
                fontSize: '1rem',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-1)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-3), var(--accent-4))',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 'bold',
                  boxShadow: '0 0 20px rgba(240, 147, 251, 0.4)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Submit & Claim XP <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DailyTest;
