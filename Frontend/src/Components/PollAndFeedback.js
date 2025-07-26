import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';

function PollAndFeedback() {
  const role = localStorage.getItem('userRole');
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    type: 'poll'
  });

  const [userVotes, setUserVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [showResults, setShowResults] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    question: '',
    options: ['', ''],
    type: 'poll',
    status: 'active'
  });

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://zerodayhackathon.onrender.com/api/polls/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, '']
    });
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    
    if (!newPoll.question.trim() || newPoll.options.filter(opt => opt.trim()).length < 2) {
      setError('Question and at least 2 options are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pollData = {
        question: newPoll.question,
        options: newPoll.options.filter(option => option.trim() !== ''),
        type: newPoll.type,
        status: 'active'
      };

      const response = await fetch('https://zerodayhackathon.onrender.com/api/polls/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(pollData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create poll: ${response.status}`);
      }

      const data = await response.json();
      setPolls([data, ...polls]);
      setNewPoll({
        question: '',
        options: ['', ''],
        type: 'poll'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating poll:', error);
      setError(error.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    if (userVotes[pollId]) return;

    try {
      const response = await fetch('https://zerodayhackathon.onrender.com/api/polls/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          pollId,
          optionIndex
        })
      });

      if (response.ok) {
        const updatedPolls = polls.map(poll => {
          if (poll._id === pollId) {
            const newVotes = [...(poll.votes || [])];
            newVotes[optionIndex] = (newVotes[optionIndex] || 0) + 1;
            return {
              ...poll,
              votes: newVotes,
              totalVotes: (poll.totalVotes || 0) + 1
            };
          }
          return poll;
        });

        setPolls(updatedPolls);
        setUserVotes({ ...userVotes, [pollId]: true });
        setShowResults({ ...showResults, [pollId]: true });
      } else {
        setError('Failed to submit vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to submit vote');
    }
  };

  const handleEdit = (index) => {
    if (role !== 'admin') return;
    
    const poll = polls[index];
    setEditIndex(index);
    setEditForm({
      question: poll.question || '',
      options: poll.options || ['', ''],
      type: poll.type || 'poll',
      status: poll.status || 'active'
    });
  };

  const handleEditSave = async (index) => {
    if (role !== 'admin') return;

    try {
      const response = await fetch(`https://zerodayhackathon.onrender.com/api/polls/${polls[index]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updated = [...polls];
        updated[index] = { ...updated[index], ...editForm };
        setPolls(updated);
        setEditIndex(null);
      } else {
        setError('Failed to update poll');
      }
    } catch (error) {
      console.error('Error updating poll:', error);
      setError('Failed to update poll');
    }
  };

  const handleDelete = async (index) => {
    if (role !== 'admin') return;

    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        const response = await fetch(`https://zerodayhackathon.onrender.com/api/polls/${polls[index]._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const updated = polls.filter((_, i) => i !== index);
          setPolls(updated);
        } else {
          setError('Failed to delete poll');
        }
      } catch (error) {
        console.error('Error deleting poll:', error);
        setError('Failed to delete poll');
      }
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            Polls & Feedback
          </h1>
          {role === 'admin' && (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                background: '#a259ff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Create Poll
            </button>
          )}
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

        {showCreateForm && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Poll</h3>
            <form onSubmit={handleCreatePoll}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Question: *</label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  placeholder="Enter your question..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Options: *</label>
                {newPoll.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll({ ...newPoll, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '8px' }}
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  style={{
                    background: '#f1f1f1',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Add Option
                </button>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Type:</label>
                <select
                  value={newPoll.type}
                  onChange={(e) => setNewPoll({ ...newPoll, type: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="poll">Poll</option>
                  <option value="feedback">Feedback</option>
                </select>
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
                  {loading ? 'Creating...' : 'Create Poll'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    background: '#f1f1f1',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
            Loading polls...
          </div>
        ) : polls.length === 0 ? (
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
            <h3 style={{ margin: '0 0 8px 0' }}>No polls found</h3>
            <p style={{ margin: 0 }}>No polls have been created yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {polls.map((poll, index) => (
              <div key={poll._id || index} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    {editIndex === index ? (
                      <input
                        value={editForm.question}
                        onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                        style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0', width: '100%' }}
                      />
                    ) : (
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{poll.question}</h3>
                    )}
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#666' }}>
                      <span>Created by: {poll.createdBy || 'Admin'}</span>
                      <span>Date: {poll.createdAt || new Date().toISOString().split('T')[0]}</span>
                      {editIndex === index ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          style={{ 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            background: editForm.status === 'active' ? '#e8f5e8' : '#f0f0f0',
                            color: editForm.status === 'active' ? '#2d5a2d' : '#666',
                            border: 'none'
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>
                      ) : (
                        <span style={{ 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          background: poll.status === 'active' ? '#e8f5e8' : '#f0f0f0',
                          color: poll.status === 'active' ? '#2d5a2d' : '#666'
                        }}>
                          {poll.status}
                        </span>
                      )}
                    </div>
                  </div>
                  {role === 'admin' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {editIndex === index ? (
                        <>
                          <button
                            onClick={() => handleEditSave(index)}
                            style={{
                              padding: '6px 12px',
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditIndex(null)}
                            style={{
                              padding: '6px 12px',
                              background: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(index)}
                            style={{
                              padding: '6px 12px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            style={{
                              padding: '6px 12px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {!userVotes[poll._id] && poll.status === 'active' ? (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {poll.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleVote(poll._id, optionIndex)}
                        style={{
                          background: '#f8f9fa',
                          border: '1px solid #e5e5e5',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#e9ecef'}
                        onMouseOut={(e) => e.target.style.background = '#f8f9fa'}
                      >
                        {editIndex === index ? (
                          <input
                            value={editForm.options[optionIndex] || ''}
                            onChange={(e) => {
                              const newOptions = [...editForm.options];
                              newOptions[optionIndex] = e.target.value;
                              setEditForm({ ...editForm, options: newOptions });
                            }}
                            style={{ width: '100%', border: 'none', background: 'transparent' }}
                          />
                        ) : (
                          option
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {poll.options.map((option, optionIndex) => {
                      const percentage = (poll.totalVotes || 0) > 0 ? ((poll.votes?.[optionIndex] || 0) / (poll.totalVotes || 1)) * 100 : 0;
                      return (
                        <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ 
                              background: '#a259ff', 
                              height: '40px', 
                              width: `${percentage}%`,
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 12px',
                              color: 'white',
                              fontWeight: 500
                            }}>
                              {option}
                            </div>
                          </div>
                          <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: 500 }}>
                            {poll.votes?.[optionIndex] || 0} ({percentage.toFixed(1)}%)
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', fontWeight: 500 }}>
                      Total Votes: {poll.totalVotes || 0}
                    </div>
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

export default PollAndFeedback;