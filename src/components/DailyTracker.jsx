import React, { useState, useEffect } from 'react';
import { Calendar, Check, Circle, AlertCircle, Code2, ExternalLink, Video, BookOpen } from 'lucide-react';
import planData from '../data/planData.json';
import leetcodeBank from '../data/leetcodeBank.json';
import resourcesBank from '../data/resourcesBank.json';

const DailyTracker = ({ addXp, loadData }) => {
  const getFormattedDate = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const today = getFormattedDate(new Date());
  const [activeDate, setActiveDate] = useState(today);

  const generateDateTabs = () => {
    const tabs = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      tabs.push(getFormattedDate(date));
    }
    return tabs;
  };
  const dateTabs = generateDateTabs();

  const [completedTasks, setCompletedTasks] = useState(() => loadData('tracker_completed_tasks', {}));

  useEffect(() => {
    localStorage.setItem('tracker_completed_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const isCompleted = prev[taskId];
      if (!isCompleted) addXp(10); 
      return {
        ...prev,
        [taskId]: !isCompleted
      };
    });
  };

  const calculateProgress = (dateStr) => {
    const tasks = planData[dateStr] || [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => completedTasks[t.id]).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getDailyIndexes = (dateStr, maxLen) => {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    hash = Math.abs(hash);
    return [hash % maxLen, (hash + 1) % maxLen];
  };

  const extractCategory = (text) => {
    const match = text.match(/\((.*?)\)/);
    return match ? match[1] : null;
  };

  // Helper to find a matching resource based on task text
  const findResource = (text) => {
    for (const [key, resource] of Object.entries(resourcesBank)) {
      if (text.toLowerCase().includes(key.toLowerCase())) {
        return resource;
      }
    }
    return null;
  };

  const activeTasks = planData[activeDate] || [];

  return (
    <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar className="accent-text-blue" size={28} /> Master Plan Tracker
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Displaying tasks for {activeDate}</span>
      </div>
      
      {/* Date Navigation */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', scrollbarWidth: 'none' }}>
        {dateTabs.map(dateStr => {
          const progress = calculateProgress(dateStr);
          const isToday = dateStr === today;
          return (
            <button
              key={dateStr}
              onClick={() => setActiveDate(dateStr)}
              className={`pill-btn ${activeDate === dateStr ? 'active' : ''}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px', minWidth: '100px' }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{dateStr.substring(0, 5)}</span>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {isToday ? 'Today' : progress === 100 ? 'Done' : `${progress}%`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeTasks.length > 0 ? (
          activeTasks.map(task => {
            const isCompleted = !!completedTasks[task.id];
            
            let colorVar = 'var(--text-primary)';
            if (task.type === 'cat') colorVar = 'var(--warning)';
            if (task.type === 'gate') colorVar = 'var(--accent-1)';
            if (task.type === 'placement') colorVar = 'var(--accent-3)';
            if (task.type === 'dsa') colorVar = 'var(--accent-4)';

            let injectedProblems = null;
            if (task.type === 'dsa') {
              const category = extractCategory(task.text);
              if (category && leetcodeBank[category] && leetcodeBank[category].length >= 2) {
                const problems = leetcodeBank[category];
                const [idx1, idx2] = getDailyIndexes(activeDate, problems.length);
                injectedProblems = [problems[idx1], problems[idx2]];
              }
            }

            const resource = findResource(task.text);

            return (
              <div 
                key={task.id}
                className={`task-item ${isCompleted ? 'completed' : ''}`}
                style={{ position: 'relative', overflow: 'hidden', alignItems: 'flex-start', cursor: 'default' }}
              >
                {!isCompleted && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: colorVar }} />}
                
                <div 
                  onClick={() => toggleTask(task.id)}
                  style={{ 
                    width: '28px', height: '28px', borderRadius: '50%', 
                    border: `2px solid ${isCompleted ? 'var(--success)' : 'var(--glass-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isCompleted ? 'var(--success)' : 'transparent',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    marginTop: '2px'
                  }}>
                  {isCompleted && <Check color="white" size={16} strokeWidth={3} />}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span onClick={() => toggleTask(task.id)} className="task-text" style={{ fontSize: '1.1rem', fontWeight: '500', cursor: 'pointer' }}>
                    {task.text}
                  </span>
                  
                  {/* Resource Injection */}
                  {resource && task.type !== 'dsa' && (
                    <div style={{ marginTop: '12px' }}>
                      <a 
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px',
                          color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem',
                          border: '1px solid var(--glass-border)', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = colorVar; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                      >
                        {resource.type === 'video' ? <Video size={16} color="#ef4444" /> : <BookOpen size={16} color="var(--accent-1)" />}
                        <span>{resource.title}</span>
                      </a>
                    </div>
                  )}

                  {/* LeetCode Injection */}
                  {injectedProblems && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Code2 size={14} /> LeetCode Problem Bank Pick
                      </div>
                      {injectedProblems.map((p, i) => (
                        <a 
                          key={i}
                          href={`https://leetcode.com/problems/${p.titleSlug}/`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '12px',
                            color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)' }}
                        >
                          <div>
                            <span style={{ fontWeight: '500', marginRight: '8px' }}>{p.title}</span>
                            <span style={{ 
                              fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px',
                              background: p.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: p.difficulty === 'Hard' ? '#ef4444' : '#fbbf24'
                            }}>
                              {p.difficulty}
                            </span>
                          </div>
                          <ExternalLink size={16} opacity={0.5} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={40} opacity={0.5} />
            <p>No tasks scheduled for {activeDate}. Take a break!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTracker;
