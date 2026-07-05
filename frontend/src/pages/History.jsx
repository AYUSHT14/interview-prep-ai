import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  History, 
  Calendar, 
  ChevronRight, 
  Award, 
  MessageSquare,
  HelpCircle,
  Check,
  ChevronDown,
  Sparkles,
  BookOpen,
  Trash2
} from 'lucide-react';
import api from '../services/api';

export default function HistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Track which question transcripts are toggled open
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/interviews/history');
        const data = response.data;
        setHistory(data);

        // Check if there is a hash pointing to a specific session
        const hash = window.location.hash;
        if (hash) {
          const sessionId = hash.replace('#', '');
          const match = data.find(item => item._id === sessionId);
          if (match) {
            setSelectedSession(match);
          } else if (data.length > 0) {
            setSelectedSession(data[0]);
          }
        } else if (data.length > 0) {
          setSelectedSession(data[0]);
        }
      } catch (err) {
        console.error('Error fetching history details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [location]);

  // Handle manual selection
  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setExpandedQuestions({}); // Reset collapse states
  };

  const handleResumeSession = (session) => {
    navigate('/interview', { state: { resumeSession: session } });
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this mock interview session from history?')) {
      return;
    }

    try {
      await api.delete(`/interviews/${sessionId}`);
      const updatedHistory = history.filter(item => item._id !== sessionId);
      setHistory(updatedHistory);
      
      if (selectedSession?._id === sessionId) {
        if (updatedHistory.length > 0) {
          setSelectedSession(updatedHistory[0]);
        } else {
          setSelectedSession(null);
        }
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Failed to delete the session. Please try again.');
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Normalize line endings to avoid Carriage Return quirks on Windows/other systems
    let html = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
      
    // Parse Javascript/generic code blocks
    html = html.replace(/\`\`\`javascript([\s\S]*?)\`\`\`/gim, (match, code) => {
      return `<pre style="background: hsl(var(--bg-dark)); padding: 0.75rem; border-radius: var(--radius-sm); margin: 0.5rem 0; font-family: monospace; font-size: 0.85rem; overflow-x: auto; border: 1px solid hsl(var(--border-light)); color: #a9b1d6;">${code.trim()}</pre>`;
    });
    
    html = html.replace(/\`\`\`([\s\S]*?)\`\`\`/gim, (match, code) => {
      return `<pre style="background: hsl(var(--bg-dark)); padding: 0.75rem; border-radius: var(--radius-sm); margin: 0.5rem 0; font-family: monospace; font-size: 0.85rem; overflow-x: auto; border: 1px solid hsl(var(--border-light));">${code.trim()}</pre>`;
    });

    // Parse inline code segments
    html = html.replace(/\`([^\`]+)\`/gim, '<code style="background: hsl(var(--bg-dark)); padding: 0.1rem 0.3rem; border-radius: 3px; font-family: monospace; font-size: 0.9rem;">$1</code>');

    // Parse lines to detect header patterns, lists and bullets
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return `<h4 style="margin: 1rem 0 0.5rem 0; color: hsl(var(--secondary)); font-weight: 600; font-size: 1.05rem;">${trimmed.substring(3).trim()}</h4>`;
      }
      if (trimmed.startsWith('##')) {
        return `<h3 style="margin: 1.25rem 0 0.75rem 0; color: hsl(var(--primary)); font-weight: 700; font-size: 1.2rem;">${trimmed.substring(2).trim()}</h3>`;
      }
      if (trimmed.startsWith('#')) {
        return `<h2 style="margin: 1.5rem 0 1rem 0; color: hsl(var(--primary)); font-weight: 700; font-size: 1.4rem;">${trimmed.substring(1).trim()}</h2>`;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return `<li style="margin-left: 1.25rem; margin-bottom: 0.35rem; list-style-type: disc;">${trimmed.substring(1).trim()}</li>`;
      }
      return line;
    });

    html = processedLines.join('\n');

    // Parse bold tags
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert breaks
    html = html.replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const toggleExpandQuestion = (idx) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="animate-fade-in" style={{ height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={24} style={{ color: 'hsl(var(--primary))' }} />
          Session History logs
        </h1>
        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
          Review detailed report transcripts, metrics, and critiques of all your completed mock sessions.
        </p>
      </div>

      {loading ? (
        <div>Loading history logs...</div>
      ) : history.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
          <h3>No mock sessions logged yet</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Go to the Mock Interview room or Dashboard to launch a practice session!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Left Session list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 'calc(100vh - 12rem)', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {history.map((session) => {
              const isSelected = selectedSession?._id === session._id;
              return (
                <div 
                  key={session._id}
                  className="glass-card"
                  style={{ 
                    padding: '1.25rem', 
                    cursor: 'pointer',
                    borderColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border-light))',
                    backgroundColor: isSelected ? 'hsl(var(--bg-panel))' : 'linear-gradient(135deg, hsl(var(--bg-card) / 0.7), hsl(var(--bg-panel) / 0.4))',
                    transform: isSelected ? 'translateY(-2px)' : 'none'
                  }}
                  onClick={() => handleSelectSession(session)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      {session.role}
                    </h4>
                    {session.status === 'completed' ? (
                      <span style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 'bold', 
                        color: session.overallScore >= 80 ? 'hsl(var(--success))' : session.overallScore >= 65 ? 'hsl(var(--warning))' : 'hsl(var(--danger))' 
                      }}>
                        {session.overallScore}%
                      </span>
                    ) : (
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Active</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{session.type}</span>
                    <span className="badge badge-secondary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', textTransform: 'capitalize' }}>{session.difficulty}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                    <Calendar size={12} />
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Report Detail panel */}
          {selectedSession && (
            <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
              {/* Report Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid hsl(var(--border-light))', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem' }}>{selectedSession.role}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-primary">{selectedSession.type}</span>
                    <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{selectedSession.difficulty}</span>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {new Date(selectedSession.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  {selectedSession.status === 'completed' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={24} style={{ color: 'hsl(var(--secondary))' }} />
                      <span style={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        color: selectedSession.overallScore >= 80 ? 'hsl(var(--success))' : selectedSession.overallScore >= 65 ? 'hsl(var(--warning))' : 'hsl(var(--danger))' 
                      }}>
                        {selectedSession.overallScore}/100
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="badge badge-primary" style={{ padding: '0.4rem 0.8rem', height: 'fit-content' }}>In-Progress</div>
                      <button 
                        onClick={() => handleResumeSession(selectedSession)} 
                        className="btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }}
                      >
                        Resume Session
                      </button>
                    </div>
                  )}

                  <button 
                    onClick={() => handleDeleteSession(selectedSession._id)} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'hsl(var(--danger))', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      opacity: 0.8,
                      padding: 0
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.8}
                  >
                    <Trash2 size={14} />
                    <span>Delete Session</span>
                  </button>
                </div>
              </div>

              {/* Overall feedback section */}
              {selectedSession.status === 'completed' && (
                <div style={{ backgroundColor: 'hsl(var(--bg-panel))', border: '1px solid hsl(var(--border-light))', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'hsl(var(--primary))' }}>
                    <MessageSquare size={18} />
                    Interviewer Overall feedback
                  </h3>
                  <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'hsl(var(--text-muted))' }}>
                    {renderMarkdown(selectedSession.overallFeedback)}
                  </div>
                </div>
              )}

              {/* Transcripts Section */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: 'hsl(var(--secondary))' }} />
                  Session Transcript ({selectedSession.questions.length} questions)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedSession.questions.map((q, idx) => {
                    const isExpanded = expandedQuestions[idx];
                    return (
                      <div 
                        key={idx}
                        style={{
                          border: '1px solid hsl(var(--border-light))',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Accordion Trigger bar */}
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 1.25rem',
                            backgroundColor: isExpanded ? 'hsl(var(--bg-panel))' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                          onClick={() => toggleExpandQuestion(idx)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, paddingRight: '1rem' }}>
                            <span style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%', 
                              backgroundColor: 'hsl(var(--primary) / 0.15)',
                              color: 'hsl(var(--primary))',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              Q{idx + 1}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                              {q.questionText}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {q.feedback ? (
                              <span style={{ 
                                fontSize: '0.85rem', 
                                fontWeight: 'bold', 
                                color: q.feedback.score >= 80 ? 'hsl(var(--success))' : q.feedback.score >= 65 ? 'hsl(var(--warning))' : 'hsl(var(--danger))' 
                              }}>
                                {q.feedback.score}/100
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontStyle: 'italic' }}>Pending</span>
                            )}
                            {isExpanded ? <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {/* Accordion Content Panel */}
                        {isExpanded && (
                          <div style={{ padding: '1.5rem', borderTop: '1px solid hsl(var(--border-light))', backgroundColor: 'hsl(var(--bg-panel) / 0.4)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-dark))', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Full Question Text</strong>
                              <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{q.questionText}</p>
                            </div>

                            {q.userAnswer ? (
                              <div>
                                <strong style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-dark))', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Your Response</strong>
                                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', fontStyle: 'italic' }}>"{q.userAnswer}"</p>
                              </div>
                            ) : (
                              <div style={{ fontStyle: 'italic', color: 'hsl(var(--text-dark))', fontSize: '0.9rem' }}>No answer submitted.</div>
                            )}

                            {q.feedback && (
                              <>
                                <div style={{ borderTop: '1px solid hsl(var(--border-light))', paddingTop: '1rem' }}>
                                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-dark))', textTransform: 'uppercase', marginBottom: '0.25rem' }}>AI Critique feedback</strong>
                                  <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>{q.feedback.comments}</p>
                                </div>

                                <div style={{ backgroundColor: 'hsl(var(--primary) / 0.04)', borderLeft: '3px solid hsl(var(--primary))', padding: '1rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                                  <strong style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'hsl(var(--primary))', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                    <Sparkles size={12} />
                                    Model answer response
                                  </strong>
                                  <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
                                    {renderMarkdown(q.feedback.betterAnswer)}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
