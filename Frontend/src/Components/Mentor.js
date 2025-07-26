import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function Mentor() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    department: '',
    expertise: '',
    availability: '',
    bio: ''
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/mentor/getall', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMentor = async (e) => {
    e.preventDefault();
    
    if (!newMentor.name || !newMentor.email || !newMentor.department) {
      setError('Name, email, and department are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/mentor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newMentor,
          userId: user?.uid
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create mentor: ${response.status}`);
      }

      const data = await response.json();
      setMentors([data, ...mentors]);
      setNewMentor({
        name: '',
        email: '',
        department: '',
        expertise: '',
        availability: '',
        bio: ''
      });
    } catch (error) {
      console.error('Error creating mentor:', error);
      setError(error.message || 'Failed to create mentor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMentor = async (mentorId) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/mentor/${mentorId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setMentors(mentors.filter(mentor => mentor._id !== mentorId));
        } else {
          setError('Failed to delete mentor');
        }
      } catch (error) {
        console.error('Error deleting mentor:', error);
        setError('Failed to delete mentor');
      }
    }
  };

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Business Administration',
    'Economics',
    'Psychology',
    'English',
    'History',
    'Other'
  ];

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            Mentor Directory
          </h1>
          <p style={{ color: '#63636b', fontSize: '18px', margin: 0 }}>
            Connect with experienced mentors for academic and career guidance
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

        {/* Create Mentor Form */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
          <h3 style={{ marginBottom: '16px' }}>Add New Mentor</h3>
          <form onSubmit={handleCreateMentor}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Name: *</label>
                <input
                  type="text"
                  value={newMentor.name}
                  onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                  placeholder="Enter mentor name"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email: *</label>
                <input
                  type="email"
                  value={newMentor.email}
                  onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                  placeholder="Enter email address"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Department: *</label>
                <select
                  value={newMentor.department}
                  onChange={(e) => setNewMentor({ ...newMentor, department: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Expertise:</label>
                <input
                  type="text"
                  value={newMentor.expertise}
                  onChange={(e) => setNewMentor({ ...newMentor, expertise: e.target.value })}
                  placeholder="e.g., Machine Learning, Web Development"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Availability:</label>
                <input
                  type="text"
                  value={newMentor.availability}
                  onChange={(e) => setNewMentor({ ...newMentor, availability: e.target.value })}
                  placeholder="e.g., Mon-Fri 2-5 PM"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Bio:</label>
              <textarea
                value={newMentor.bio}
                onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
                placeholder="Brief description about the mentor's background and experience..."
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
                {loading ? 'Adding...' : 'Add Mentor'}
              </button>
              <button
                type="button"
                onClick={() => setNewMentor({
                  name: '',
                  email: '',
                  department: '',
                  expertise: '',
                  availability: '',
                  bio: ''
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

        {/* Mentors List */}
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
            Loading mentors...
          </div>
        ) : mentors.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#63636b',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e5e5e5'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3 style={{ margin: '0 0 8px 0' }}>No mentors found</h3>
            <p style={{ margin: 0 }}>No mentors have been added to the directory yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {mentors.map((mentor, index) => (
              <div key={mentor._id || index} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      {mentor.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', color: '#666' }}>{mentor.email}</span>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        background: '#e8f5e8',
                        color: '#22c55e',
                        fontSize: '14px'
                      }}>
                        {mentor.department}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMentor(mentor._id)}
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
                    Remove
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  {mentor.expertise && (
                    <div>
                      <strong>Expertise:</strong> {mentor.expertise}
                    </div>
                  )}
                  {mentor.availability && (
                    <div>
                      <strong>Availability:</strong> {mentor.availability}
                    </div>
                  )}
                </div>
                
                {mentor.bio && (
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }}>
                    <strong>Bio:</strong>
                    <p style={{ margin: '8px 0 0 0', lineHeight: '1.6' }}>{mentor.bio}</p>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    View Profile
                  </button>
                  <button
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Mentor; 