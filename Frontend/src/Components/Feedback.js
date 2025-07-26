import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function Feedback() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newFeedback, setNewFeedback] = useState({
    eventId: '',
    rating: 5,
    comment: '',
    category: 'general'
  });

  const [selectedEvent, setSelectedEvent] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      fetchFeedbackForEvent(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchFeedbackForEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://zerodayhackathon.onrender.com/api/feedback/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!newFeedback.eventId || !newFeedback.comment.trim()) {
      setError('Event ID and comment are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://zerodayhackathon.onrender.com/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newFeedback,
          userId: user?.uid,
          userName: user?.displayName || 'Anonymous'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.status}`);
      }

      const data = await response.json();
      setFeedbacks([data, ...feedbacks]);
      setNewFeedback({
        eventId: '',
        rating: 5,
        comment: '',
        category: 'general'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#22c55e';
    if (rating >= 3) return '#f59e42';
    return '#ef4444';
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            Event Feedback
          </h1>
          <p style={{ color: '#63636b', fontSize: '18px', margin: 0 }}>
            Share your thoughts and experiences about campus events
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

        {/* Submit Feedback Form */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
          <h3 style={{ marginBottom: '16px' }}>Submit New Feedback</h3>
          <form onSubmit={handleSubmitFeedback}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Event ID: *</label>
                <input
                  type="text"
                  value={newFeedback.eventId}
                  onChange={(e) => setNewFeedback({ ...newFeedback, eventId: e.target.value })}
                  placeholder="Enter event ID"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category:</label>
                <select
                  value={newFeedback.category}
                  onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="social">Social</option>
                  <option value="technical">Technical</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Rating: *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: star <= newFeedback.rating ? '#f59e42' : '#d1d5db'
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ marginLeft: '8px', color: '#666' }}>
                    {newFeedback.rating}/5
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Comment: *</label>
              <textarea
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                placeholder="Share your experience, suggestions, or thoughts about the event..."
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
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={() => setNewFeedback({
                  eventId: '',
                  rating: 5,
                  comment: '',
                  category: 'general'
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

        {/* View Feedback Section */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
          <h3 style={{ marginBottom: '16px' }}>View Event Feedback</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Enter event ID to view feedback"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
            <button
              onClick={() => selectedEvent && fetchFeedbackForEvent(selectedEvent)}
              disabled={!selectedEvent}
              style={{
                padding: '12px 24px',
                background: selectedEvent ? '#a259ff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedEvent ? 'pointer' : 'not-allowed',
                fontWeight: 600
              }}
            >
              View Feedback
            </button>
          </div>

          {/* Feedback List */}
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
              Loading feedback...
            </div>
          ) : selectedEvent && feedbacks.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#63636b',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e5e5e5'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 style={{ margin: '0 0 8px 0' }}>No feedback found</h3>
              <p style={{ margin: 0 }}>No feedback has been submitted for this event yet.</p>
            </div>
          ) : selectedEvent && feedbacks.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {feedbacks.map((feedback, index) => (
                <div key={feedback._id || index} style={{ 
                  background: '#f8f9fa', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: '1px solid #e5e5e5'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                        {feedback.userName || 'Anonymous'}
                      </h4>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#666' }}>
                        <span>Event: {feedback.eventId}</span>
                        <span style={{ 
                          padding: '2px 8px', 
                          background: '#e5e7eb', 
                          borderRadius: '12px' 
                        }}>
                          {feedback.category}
                        </span>
                        <span>{new Date(feedback.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '20px', 
                        color: getRatingColor(feedback.rating),
                        marginBottom: '4px'
                      }}>
                        {getRatingStars(feedback.rating)}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {feedback.rating}/5
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: 'white', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }}>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>{feedback.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Feedback; 