import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function SkillExchange() {
  const { user } = useAuth();
  const role = localStorage.getItem('userRole');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    maxParticipants: '',
    category: '',
    location: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/upskilling/open', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    if (!newSession.title || !newSession.description || !newSession.instructor || !newSession.date) {
      setError('Title, description, instructor, and date are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/upskilling/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newSession,
          createdBy: user?.uid
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
      }

      const data = await response.json();
      setSessions([data, ...sessions]);
      setNewSession({
        title: '',
        description: '',
        instructor: '',
        date: '',
        time: '',
        duration: '',
        maxParticipants: '',
        category: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating session:', error);
      setError(error.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (sessionId) => {
    try {
      const response = await fetch('http://localhost:3000/api/upskilling/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          userId: user?.uid
        })
      });

      if (response.ok) {
        // Update the session to show it's booked
        setSessions(sessions.map(session => 
          session._id === sessionId 
            ? { ...session, isBooked: true, participants: (session.participants || 0) + 1 }
            : session
        ));
      } else {
        setError('Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      setError('Failed to book session');
    }
  };

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Data Science',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Cybersecurity',
    'Other'
  ];

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            Skill Exchange & Upskilling
          </h1>
          <p style={{ color: '#63636b', fontSize: '18px', margin: 0 }}>
            Join skill development sessions and share your expertise with others
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '16px',
            margin: '0 0 24px 0',
            background: '#fee2e2',
            color: '#ef4444',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            {error}
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                padding: '8px 16px',
                background: '#fecaca',
                border: 'none',
                borderRadius: '6px',
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create Session Form for Admin */}
        {role === 'admin' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Session</h3>
            <form onSubmit={handleCreateSession}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Title: *</label>
                  <input
                    type="text"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    placeholder="Enter session title"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Instructor: *</label>
                  <input
                    type="text"
                    value={newSession.instructor}
                    onChange={(e) => setNewSession({ ...newSession, instructor: e.target.value })}
                    placeholder="Enter instructor name"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category:</label>
                  <select
                    value={newSession.category}
                    onChange={(e) => setNewSession({ ...newSession, category: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Date: *</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Time:</label>
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Duration:</label>
                  <input
                    type="text"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Max Participants:</label>
                  <input
                    type="number"
                    value={newSession.maxParticipants}
                    onChange={(e) => setNewSession({ ...newSession, maxParticipants: e.target.value })}
                    placeholder="e.g., 20"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location:</label>
                  <input
                    type="text"
                    value={newSession.location}
                    onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                    placeholder="e.g., Room 101, Online"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description: *</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="Describe the session content, learning objectives, and what participants will gain..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '120px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#ccc' : '#a259ff',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Creating...' : 'Create Session'}
                </button>
                <button
                  type="button"
                  onClick={() => setNewSession({
                    title: '',
                    description: '',
                    instructor: '',
                    date: '',
                    time: '',
                    duration: '',
                    maxParticipants: '',
                    category: '',
                    location: ''
                  })}
                  style={{
                    background: '#f1f1f1',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#63636b',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e5e5e5'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 style={{ margin: '0 0 8px 0' }}>No sessions found</h3>
            <p style={{ margin: 0 }}>No upskilling sessions are currently available.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {sessions.map((session, index) => (
              <div key={session._id || index} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      {session.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', color: '#666' }}>by {session.instructor}</span>
                      {session.category && (
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '16px', 
                          background: '#e8f5e8',
                          color: '#22c55e',
                          fontSize: '14px'
                        }}>
                          {session.category}
                        </span>
                      )}
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        background: session.isBooked ? '#fee2e2' : '#e8f5e8',
                        color: session.isBooked ? '#ef4444' : '#22c55e',
                        fontSize: '14px'
                      }}>
                        {session.isBooked ? 'Booked' : 'Available'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
                  </div>
                  {session.time && (
                    <div>
                      <strong>Time:</strong> {session.time}
                    </div>
                  )}
                  {session.duration && (
                    <div>
                      <strong>Duration:</strong> {session.duration}
                    </div>
                  )}
                  {session.location && (
                    <div>
                      <strong>Location:</strong> {session.location}
                    </div>
                  )}
                  {session.maxParticipants && (
                    <div>
                      <strong>Max Participants:</strong> {session.maxParticipants}
                    </div>
                  )}
                  <div>
                    <strong>Current Participants:</strong> {session.participants || 0}
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <strong>Description:</strong>
                  <p style={{ margin: '8px 0 0 0', lineHeight: '1.6' }}>{session.description}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  {!session.isBooked ? (
                    <button
                      onClick={() => handleBookSession(session._id)}
                      style={{
                        padding: '8px 16px',
                        background: '#a259ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Book Session
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{
                        padding: '8px 16px',
                        background: '#ccc',
                        color: '#666',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'not-allowed'
                      }}
                    >
                      Already Booked
                    </button>
                  )}
                  <button
                    style={{
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillExchange;