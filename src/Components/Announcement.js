import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [activeTab, setActiveTab] = useState('announcements');
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = localStorage.getItem('userRole');
  const [announcements, setAnnouncements] = useState([
    {
      title: 'Mid-term Exams Schedule Released',
      date: '2024-01-15',
      tag: 'Academics',
      tagColor: '#f43f5e',
      tagBg: '#fee2e2',
      description: 'The mid-term examination schedule for all departments has been published.'
    },
    {
      title: 'Library Hours Extended',
      date: '2024-01-14',
      tag: 'Facilities',
      tagColor: '#63636b',
      tagBg: '#f1f5f9',
      description: 'Library will remain open until 11 PM during exam week.'
    }
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/announcements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load announcements');
      // Keep the static data as fallback
      setAnnouncements([
        {
          title: 'Mid-term Exams Schedule Released',
          date: '2024-01-15',
          tag: 'Academics',
          tagColor: '#f43f5e',
          tagBg: '#fee2e2',
          description: 'The mid-term examination schedule for all departments has been published.'
        },
        {
          title: 'Library Hours Extended',
          date: '2024-01-14',
          tag: 'Facilities',
          tagColor: '#63636b',
          tagBg: '#f1f5f9',
          description: 'Library will remain open until 11 PM during exam week.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idx) => {
    if (user?.role !== 'admin') return;

    try {
      const response = await fetch(`/api/announcements/${announcements[idx]._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setAnnouncements(announcements.filter((_, i) => i !== idx));
      }
    } catch (error) {
      setError('Failed to delete announcement');
      console.error('Error:', error);
    }
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditForm({
      title: announcements[idx].title,
      description: announcements[idx].description
    });
  };

  const handleEditSave = async (idx) => {
    if (user?.role !== 'admin') return;

    try {
      const response = await fetch(`/api/announcements/${announcements[idx]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updated = [...announcements];
        updated[idx] = { ...updated[idx], ...editForm };
        setAnnouncements(updated);
        setEditIndex(null);
      }
    } catch (error) {
      setError('Failed to update announcement');
      console.error('Error:', error);
    }
  };

  const handleAdd = async () => {
    if (user?.role !== 'admin') return;

    try {
      const newAnnouncement = {
        title: 'New Announcement',
        date: new Date().toISOString().split('T')[0],
        tag: 'General',
        tagColor: '#63636b',
        tagBg: '#f1f5f9',
        description: 'Description here.'
      };

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAnnouncement)
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncements([data, ...announcements]);
      }
    } catch (error) {
      setError('Failed to create announcement');
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px 16px 40px', background: 'white', boxShadow: '0 1px 0 #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M2 7.5L12 3L22 7.5L12 12L2 7.5Z" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/><path d="M6 10.5V15.5C6 17.433 9.13401 19 12 19C14.866 19 18 17.433 18 15.5V10.5" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/></svg>
          </span>
          <span style={{ fontWeight: 700, fontSize: 24, letterSpacing: -1 }}>CampusConnect</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#18181b', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#18181b" strokeWidth="1.5"/><path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#18181b" strokeWidth="1.5"/></svg>
            Profile
          </span>
          <span style={{ fontSize: 20, cursor: 'pointer' }} title="Theme toggle">&#9728;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#18181b', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Logout
          </span>
        </nav>
      </header>

      {/* Dashboard Title */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 0 0 0' }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, margin: 0 }}>Welcome to Your Dashboard</h1>
        <div style={{ color: '#63636b', fontSize: 20, margin: '10px 0 32px 0' }}>
          Manage your campus activities and stay connected
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, background: '#f7f7fa', borderRadius: 12, overflow: 'hidden', marginBottom: 36, maxWidth: 1100 }}>
          <button onClick={() => navigate('/home')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: '#fff', border: 'none', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 8px #f0f0f0', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z" stroke="#63636b" strokeWidth="2"/></svg>
            Announcements
          </button>
          <button onClick={() => navigate('/timetable')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: '#fff', border: 'none', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 8px #f0f0f0', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#63636b" strokeWidth="2"/><path d="M8 2V6" stroke="#63636b" strokeWidth="2"/><path d="M16 2V6" stroke="#63636b" strokeWidth="2"/></svg>
            Timetable
          </button>
          <button onClick={() => navigate('/compliants')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: '#fff', border: 'none', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 8px #f0f0f0', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 9V13" stroke="#f59e42" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="#f59e42"/><circle cx="12" cy="12" r="10" stroke="#f59e42" strokeWidth="2"/></svg>
            Complaints
          </button>
          <button onClick={() => navigate('/lostitem')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: '#fff', border: 'none', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 8px #f0f0f0', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#63636b" strokeWidth="2"/><path d="M8 12L11 15L16 10" stroke="#63636b" strokeWidth="2"/></svg>
            Lost & Found
          </button>
        </div>

        {/* Announcements Section */}
        {activeTab === 'announcements' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <input type="text" placeholder="Search announcements..." style={{ flex: 1, fontSize: 18, padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginRight: 18 }} />
              <button style={{ background: 'white', border: '1.5px solid #e5e5e5', borderRadius: 10, padding: '10px 22px', fontWeight: 600, fontSize: 18, color: '#18181b', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 6H21" stroke="#63636b" strokeWidth="2" strokeLinecap="round"/><path d="M6 10H18" stroke="#63636b" strokeWidth="2" strokeLinecap="round"/><path d="M9 14H15" stroke="#63636b" strokeWidth="2" strokeLinecap="round"/></svg>
                Filter
              </button>
              {role === 'admin' && (
                <button onClick={handleAdd} style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 600, fontSize: 18, marginLeft: 24, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="11" y="4" width="2" height="16" rx="1" fill="#fff"/><rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/></svg>
                  Add Announcement
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
                  onClick={fetchAnnouncements}
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
                  Retry
                </button>
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
                Loading announcements...
              </div>
            ) : (
              announcements.map((a, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', marginBottom: 24, border: '1.5px solid #f2f2f2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    {editIndex === i ? (
                      <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={{ fontWeight: 700, fontSize: 28, margin: 0, flex: 1 }} />
                    ) : (
                      <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0 }}>{a.title}</h2>
                    )}
                    <span style={{ background: a.tagBg, color: a.tagColor, borderRadius: 10, padding: '4px 14px', fontWeight: 600, fontSize: 15, marginLeft: 8 }}>{a.tag}</span>
                    {role === 'admin' && (
                      <>
                        {editIndex === i ? (
                          <>
                            <button onClick={() => handleEditSave(i)} style={{ marginLeft: 8, color: 'green', fontWeight: 600 }}>Save</button>
                            <button onClick={() => setEditIndex(null)} style={{ marginLeft: 8, color: 'gray' }}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(i)} style={{ marginLeft: 8 }}>Edit</button>
                            <button onClick={() => handleDelete(i)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#63636b', fontSize: 16, marginBottom: 10 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M8 7V3H16V7" stroke="#63636b" strokeWidth="1.5"/><rect x="4" y="7" width="16" height="14" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M16 11H8V13H16V11Z" fill="#63636b"/></svg>
                    {a.date}
                  </div>
                  <div style={{ fontSize: 18, color: '#18181b', marginBottom: 0 }}>
                    {editIndex === i ? (
                      <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ width: '100%', fontSize: 18 }} />
                    ) : (
                      a.description
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;