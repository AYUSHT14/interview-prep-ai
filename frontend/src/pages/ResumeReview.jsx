import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import api from '../services/api';

export default function ResumeReview() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste your resume details first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/interviews/resume', { resumeText });
      setResult(response.data);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = () => {
    navigate('/interview', {
      state: {
        presetRole: 'Software Engineer (Resume Match)',
        presetType: 'Technical'
      }
    });
  };

  // Custom parser to translate markdown symbols to basic HTML nodes safely
  const renderMarkdown = (text) => {
    if (!text) return '';
    let parsed = text
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.15rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: hsl(var(--primary));">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 style="font-size: 1rem; margin-top: 1rem; margin-bottom: 0.4rem; color: hsl(var(--secondary));">$1</h4>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.35rem; margin-top: 1.75rem; margin-bottom: 0.75rem; border-bottom: 1px solid hsl(var(--border-light)); padding-bottom: 0.25rem;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.6rem; margin-top: 2rem; margin-bottom: 1rem;">$1</h1>')
      .replace(/^\- (.*$)/gim, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem; list-style-type: disc;">$1</li>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <FileText size={40} style={{ color: 'hsl(var(--primary))', marginBottom: '0.5rem' }} />
        <h1>AI Resume Critic</h1>
        <p style={{ color: 'hsl(var(--text-muted))', marginTop: '0.25rem' }}>
          Evaluate your resume structures and unlock tailored mock interview preparation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr' : '1fr', gap: '2rem' }}>
        {/* Input box */}
        {!result && (
          <div className="glass-card">
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'hsl(var(--danger) / 0.15)',
                border: '1px solid hsl(var(--danger) / 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                color: 'hsl(var(--danger))',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Paste Resume Content</label>
                <textarea 
                  rows="12" 
                  value={resumeText} 
                  onChange={(e) => setResumeText(e.target.value)} 
                  placeholder="Paste details of your resume (Work Experience, Skills, Education, Projects)..."
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                disabled={loading}
              >
                {loading ? 'Analyzing Content...' : 'Critique Resume'}
                <Cpu size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => setResult(null)} 
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem' }}
              >
                Back to Edit
              </button>
              
              <button 
                onClick={handleStartInterview} 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Start Tailored Mock Interview</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', alignItems: 'start' }}>
              {/* Analysis Critique */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={20} style={{ color: 'hsl(var(--primary))' }} />
                  AI Critique Report
                </h3>
                <div className="resume-critique-text" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {renderMarkdown(result.analysis)}
                </div>
              </div>

              {/* Tailored Questions list */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bookmark size={20} style={{ color: 'hsl(var(--secondary))' }} />
                  Tailored Practice Questions
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '1.25rem' }}>
                  Gemini generated these specific questions based directly on the credentials in your resume:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.tailoredQuestions && result.tailoredQuestions.map((q, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '1rem', 
                        backgroundColor: 'hsl(var(--bg-panel))', 
                        borderRadius: 'var(--radius-sm)', 
                        borderLeft: '3px solid hsl(var(--secondary))',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}
                    >
                      <strong style={{ color: 'hsl(var(--secondary))', display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>QUESTION {idx + 1}</strong>
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
