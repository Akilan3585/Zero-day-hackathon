import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function LostItem() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://zerodayhackathon.onrender.com/api/items/search?q=${searchTerm}&filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchItems();
  };

  const handleMarkResolved = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/items/resolve/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setItems(items.map(item => 
          item._id === itemId ? { ...item, status: 'resolved' } : item
        ));
      } else {
        setError('Failed to mark item as resolved');
      }
    } catch (error) {
      console.error('Error marking item as resolved:', error);
      setError('Failed to mark item as resolved');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            Lost & Found
          </h1>
          <p style={{ color: '#63636b', fontSize: '18px', margin: 0 }}>
            Report lost items and help others find their belongings
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

        {/* Search and Filter Section */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
          <h3 style={{ marginBottom: '16px' }}>Search Items</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <input 
                  type="text" 
              placeholder="Search by item name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '12px 24px',
                background: '#a259ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Search
            </button>
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
              All Items
            </button>
            <button
              onClick={() => setFilter('lost')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filter === 'lost' ? '#a259ff' : '#f1f1f1',
                color: filter === 'lost' ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              Lost Items
            </button>
            <button
              onClick={() => setFilter('found')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filter === 'found' ? '#a259ff' : '#f1f1f1',
                color: filter === 'found' ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              Found Items
            </button>
              </div>
              </div>
              
        {/* Items List */}
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
            Loading items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#63636b',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e5e5e5'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 style={{ margin: '0 0 8px 0' }}>No items found</h3>
            <p style={{ margin: 0 }}>No items match your search criteria.</p>
                </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredItems.map((item, index) => (
              <div key={item._id || index} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      {item.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        background: item.type === 'lost' ? '#fee2e2' : '#e8f5e8',
                        color: item.type === 'lost' ? '#ef4444' : '#22c55e',
                        fontSize: '14px',
                        fontWeight: 600
                      }}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        background: item.status === 'resolved' ? '#e8f5e8' : '#fef3c7',
                        color: item.status === 'resolved' ? '#22c55e' : '#f59e42',
                        fontSize: '14px'
                      }}>
                        {item.status === 'resolved' ? 'Resolved' : 'Active'}
                      </span>
                </div>
              </div>
                  {item.status !== 'resolved' && (
              <button 
                      onClick={() => handleMarkResolved(item._id)}
                style={{ 
                        padding: '8px 16px',
                        background: '#e8f5e8',
                        color: '#22c55e',
                  border: 'none', 
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Mark Resolved
              </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <strong>Category:</strong> {item.category}
                  </div>
                  <div>
                    <strong>Location:</strong> {item.location}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(item.date || Date.now()).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Contact:</strong> {item.contact}
                  </div>
                </div>
                
                {item.description && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Description:</strong>
                    <p style={{ margin: '8px 0 0 0', lineHeight: '1.6' }}>{item.description}</p>
                  </div>
                )}
                
                {item.image && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Image:</strong>
                    <div style={{ marginTop: '8px' }}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          border: '1px solid #e5e5e5'
                        }}
                      />
                    </div>
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
                    Contact Owner
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
                    Report Similar Item
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

export default LostItem; 