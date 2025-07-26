import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function Booking() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newBooking, setNewBooking] = useState({
    sessionId: '',
    date: '',
    time: '',
    purpose: '',
    notes: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/book/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    
    if (!newBooking.sessionId || !newBooking.date || !newBooking.time) {
      setError('Session ID, date, and time are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/book/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newBooking,
          userId: user?.uid
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create booking: ${response.status}`);
      }

      const data = await response.json();
      setBookings([data, ...bookings]);
      setNewBooking({
        sessionId: '',
        date: '',
        time: '',
        purpose: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/book/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setBookings(bookings.filter(booking => booking._id !== bookingId));
        } else {
          setError('Failed to cancel booking');
        }
      } catch (error) {
        console.error('Error canceling booking:', error);
        setError('Failed to cancel booking');
      }
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            Session Bookings
          </h1>
          <p style={{ color: '#63636b', fontSize: '18px', margin: 0 }}>
            Book sessions with mentors, workshops, or other campus resources
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

        {/* Create Booking Form */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
          <h3 style={{ marginBottom: '16px' }}>Book a New Session</h3>
          <form onSubmit={handleCreateBooking}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Session ID: *</label>
                <input
                  type="text"
                  value={newBooking.sessionId}
                  onChange={(e) => setNewBooking({ ...newBooking, sessionId: e.target.value })}
                  placeholder="Enter session ID"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Date: *</label>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Time: *</label>
                <input
                  type="time"
                  value={newBooking.time}
                  onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Purpose:</label>
                <input
                  type="text"
                  value={newBooking.purpose}
                  onChange={(e) => setNewBooking({ ...newBooking, purpose: e.target.value })}
                  placeholder="e.g., Academic guidance, Career advice"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Notes:</label>
              <textarea
                value={newBooking.notes}
                onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                placeholder="Any additional notes or requirements..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
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
                {loading ? 'Booking...' : 'Book Session'}
              </button>
              <button
                type="button"
                onClick={() => setNewBooking({
                  sessionId: '',
                  date: '',
                  time: '',
                  purpose: '',
                  notes: ''
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

        {/* Bookings List */}
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
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#63636b',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e5e5e5'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <path d="M8 2V6" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2V6" stroke="currentColor" strokeWidth="2"/>
              <rect x="4" y="4" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 10H16" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 14H16" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 18H12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3 style={{ margin: '0 0 8px 0' }}>No bookings found</h3>
            <p style={{ margin: 0 }}>You haven't made any session bookings yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {bookings.map((booking, index) => (
              <div key={booking._id || index} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      Session: {booking.sessionId}
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '16px', color: '#666' }}>
                      <span>Date: {booking.date}</span>
                      <span>Time: {booking.time}</span>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        background: '#e8f5e8',
                        color: '#22c55e',
                        fontSize: '14px'
                      }}>
                        Confirmed
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    style={{
                      padding: '8px 16px',
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
                
                {booking.purpose && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Purpose:</strong> {booking.purpose}
                  </div>
                )}
                
                {booking.notes && (
                  <div>
                    <strong>Notes:</strong> {booking.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking; 