import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function Placements() {
  const { user } = useAuth();
  const role = localStorage.getItem('userRole');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newsItems, setNewsItems] = useState([]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    type: '',
    deadline: '',
    description: '',
    requirements: [],
    location: '',
    status: ''
  });
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    company: '',
    type: '',
    deadline: '',
    description: '',
    requirements: [],
    location: '',
    status: 'Active'
  });

  const categories = ['Internships', 'Jobs', 'Hackathons', 'Competitions', 'Workshops'];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/resources/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = filter === 'all' || opp.type?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSaveItem = (item) => {
    setSavedItems([...savedItems, item]);
  };

  const handleEdit = (index) => {
    if (role !== 'admin') return;
    
    const opp = opportunities[index];
    setEditIndex(index);
    setEditForm({
      title: opp.title || '',
      company: opp.company || '',
      type: opp.type || '',
      deadline: opp.deadline || '',
      description: opp.description || '',
      requirements: opp.requirements || [],
      location: opp.location || '',
      status: opp.status || 'Active'
    });
  };

  const handleEditSave = async (index) => {
    if (role !== 'admin') return;

    try {
      const response = await fetch(`http://localhost:3000/api/resources/${opportunities[index]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updated = [...opportunities];
        updated[index] = { ...updated[index], ...editForm };
        setOpportunities(updated);
        setEditIndex(null);
      } else {
        setError('Failed to update opportunity');
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      setError('Failed to update opportunity');
    }
  };

  const handleDelete = async (index) => {
    if (role !== 'admin') return;

    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/resources/${opportunities[index]._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const updated = opportunities.filter((_, i) => i !== index);
          setOpportunities(updated);
        } else {
          setError('Failed to delete opportunity');
        }
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        setError('Failed to delete opportunity');
      }
    }
  };

  const handleAddOpportunity = async () => {
    if (role !== 'admin') return;

    if (!newOpportunity.title || !newOpportunity.company || !newOpportunity.description) {
      setError('Title, company, and description are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/resources/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newOpportunity,
          resourceType: newOpportunity.type || 'Opportunity'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create opportunity: ${response.status}`);
      }

      const data = await response.json();
      setOpportunities([data, ...opportunities]);
      setNewOpportunity({
        title: '',
        company: '',
        type: '',
        deadline: '',
        description: '',
        requirements: [],
        location: '',
        status: 'Active'
      });
    } catch (error) {
      console.error('Error adding opportunity:', error);
      setError(error.message || 'Failed to add opportunity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
          Tech Opportunities & News
        </h1>
            {role === 'admin' && (
              <button
                onClick={handleAddOpportunity}
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
                {loading ? 'Adding...' : 'Add Opportunity'}
              </button>
            )}
          </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filter === 'all' ? '#a259ff' : '#f1f1f1',
              color: filter === 'all' ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category.toLowerCase())}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filter === category.toLowerCase() ? '#a259ff' : '#f1f1f1',
                color: filter === category.toLowerCase() ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
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

        {/* Add Opportunity Form for Admin */}
        {role === 'admin' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
            <h3 style={{ marginBottom: '16px' }}>Add New Opportunity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Title: *</label>
                <input
                  type="text"
                  value={newOpportunity.title}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                  placeholder="Enter opportunity title"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Company: *</label>
                <input
                  type="text"
                  value={newOpportunity.company}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, company: e.target.value })}
                  placeholder="Enter company name"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Type:</label>
                <select
                  value={newOpportunity.type}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, type: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Type</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Deadline:</label>
                <input
                  type="date"
                  value={newOpportunity.deadline}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, deadline: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
        <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location:</label>
                <input
                  type="text"
                  value={newOpportunity.location}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
                  placeholder="e.g., Remote, On-site"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description: *</label>
              <textarea
                value={newOpportunity.description}
                onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                placeholder="Enter opportunity description"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Requirements:</label>
              <input
                type="text"
                value={newOpportunity.requirements.join(', ')}
                onChange={(e) => setNewOpportunity({ 
                  ...newOpportunity, 
                  requirements: e.target.value.split(',').map(r => r.trim()).filter(r => r) 
                })}
                placeholder="React, Node.js, JavaScript (comma-separated)"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddOpportunity}
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
                {loading ? 'Adding...' : 'Add Opportunity'}
              </button>
              <button
                onClick={() => setNewOpportunity({
                  title: '',
                  company: '',
                  type: '',
                  deadline: '',
                  description: '',
                  requirements: [],
                  location: '',
                  status: 'Active'
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
          </div>
        )}

        {/* Opportunities Grid */}
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
            Loading opportunities...
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#63636b',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e5e5e5'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 style={{ margin: '0 0 8px 0' }}>No opportunities found</h3>
            <p style={{ margin: 0 }}>No opportunities match your search criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px', marginBottom: '40px' }}>
            {filteredOpportunities.map((opp, index) => (
              <div key={opp._id || index} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    {editIndex === index ? (
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', width: '100%' }}
                      />
                    ) : (
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{opp.title}</h3>
                    )}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                      {editIndex === index ? (
                        <input
                          value={editForm.company}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                          style={{ fontSize: '16px', color: '#666' }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', color: '#666' }}>{opp.company}</span>
                      )}
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                        background: opp.status === 'Active' ? '#e8f5e8' : '#fef3c7',
                        color: opp.status === 'Active' ? '#22c55e' : '#f59e42',
                    fontSize: '14px'
                  }}>
                        {opp.status}
                  </span>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <strong>Type:</strong> {editIndex === index ? (
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        style={{ marginLeft: '8px' }}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ marginLeft: '8px' }}>{opp.type}</span>
                    )}
                  </div>
                  <div>
                    <strong>Deadline:</strong> {editIndex === index ? (
                      <input
                        type="date"
                        value={editForm.deadline}
                        onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                        style={{ marginLeft: '8px' }}
                      />
                    ) : (
                      <span style={{ marginLeft: '8px' }}>{opp.deadline}</span>
                    )}
                  </div>
                  <div>
                    <strong>Location:</strong> {editIndex === index ? (
                      <input
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        style={{ marginLeft: '8px' }}
                      />
                    ) : (
                      <span style={{ marginLeft: '8px' }}>{opp.location}</span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <strong>Description:</strong>
                  {editIndex === index ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      style={{ 
                        display: 'block', 
                        width: '100%', 
                        marginTop: '8px',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  ) : (
                    <p style={{ margin: '8px 0 0 0' }}>{opp.description}</p>
                  )}
                </div>

                <div>
                  <strong>Requirements:</strong>
                  {editIndex === index ? (
                    <input
                      value={editForm.requirements.join(', ')}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        requirements: e.target.value.split(',').map(r => r.trim()) 
                      })}
                      style={{ 
                        display: 'block', 
                        width: '100%', 
                        marginTop: '8px',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                      placeholder="React, Node.js, JavaScript"
                    />
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {opp.requirements && opp.requirements.map((req, i) => (
                        <span key={i} style={{ 
                          padding: '4px 8px', 
                          background: '#f3f4f6', 
                          borderRadius: '12px', 
                          fontSize: '14px' 
                        }}>
                        {req}
                      </span>
                    ))}
                  </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    onClick={() => handleSaveItem(opp)}
                    style={{
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Save for Later
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
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Section */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Latest News</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {newsItems.length === 0 ? (
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
                <h3 style={{ margin: '0 0 8px 0' }}>No news available</h3>
                <p style={{ margin: 0 }}>Check back later for updates.</p>
              </div>
            ) : (
              newsItems.map(news => (
                <div key={news.id} style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{news.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <span>{news.source}</span>
                    <span>{news.date}</span>
                    <span style={{ 
                      padding: '2px 8px', 
                      background: '#f3f4f6', 
                      borderRadius: '12px' 
                    }}>
                      {news.category}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#374151' }}>{news.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Placements;