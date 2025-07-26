import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Compliants() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([
    {
      title: 'Water Supply Issue - Block A',
      date: '2024-01-15',
      tag: 'Water',
      tagColor: '#63636b',
      tagBg: '#f1f5f9',
      status: 'pending',
      statusColor: '#fff1f0',
      statusTextColor: '#f43f5e',
      description: 'No water supply in Block A, Room 204',
    },
    {
      title: 'Electricity Fluctuation',
      date: '2024-01-14',
      tag: 'Electricity',
      tagColor: '#63636b',
      tagBg: '#f1f5f9',
      status: 'in-progress',
      statusColor: '#f1f5f9',
      statusTextColor: '#63636b',
      description: 'Frequent power cuts in Block B',
    },
  ]);
  const [form, setForm] = useState({ title: '', description: '', category: 'Water' });
  const [announcements, setAnnouncements] = useState([
    {
      title: 'Holiday Notice',
      date: '2024-01-20',
      content: 'Campus will be closed for Republic Day',
      type: 'Holiday'
    }
  ]);
  const [announcementForm, setAnnouncementForm] = useState({ 
    title: '', 
    content: '', 
    type: 'Holiday' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [isEditingComplaint, setIsEditingComplaint] = useState(false);

  const statusColors = {
    pending: { bg: '#fff1f0', text: '#f43f5e' },
    'in-progress': { bg: '#fff7ed', text: '#f97316' },
    resolved: { bg: '#f0fdf4', text: '#22c55e' }
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      ...announcementForm,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setAnnouncementForm({ title: '', content: '', type: 'Holiday' });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditingComplaint 
        ? `/api/complaints/${editingComplaint._id}`
        : '/api/complaints';
      
      const method = isEditingComplaint ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const data = await response.json();
        if (isEditingComplaint) {
          setComplaints(complaints.map(c => 
            c._id === editingComplaint._id ? data : c
          ));
        } else {
          setComplaints([data, ...complaints]);
        }
        setForm({ title: '', description: '', category: 'Water' });
        setShowComplaintForm(false);
        setIsEditingComplaint(false);
        setEditingComplaint(null);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updatedComplaint = await response.json();
        setComplaints(complaints.map(c => 
          c._id === complaintId ? updatedComplaint : c
        ));
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const deleteComplaint = async (id) => {
    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setComplaints(complaints.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  const filteredComplaints = complaintFilter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === complaintFilter);

  // Admin functions for announcements
  const handleEditAnnouncement = (announcement) => {
    setIsEditing(true);
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type
    });
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/announcements/${editingAnnouncement._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(announcementForm)
      });
      if (response.ok) {
        // Update local state
        setAnnouncements(announcements.map(a => 
          a._id === editingAnnouncement._id ? { ...a, ...announcementForm } : a
        ));
        setIsEditing(false);
        setEditingAnnouncement(null);
        setAnnouncementForm({ title: '', content: '', type: 'Holiday' });
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setAnnouncements(announcements.filter(a => a._id !== id));
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  // Add search filter function
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button onClick={() => setActiveTab('announcements')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'announcements' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'announcements' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'announcements' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z" stroke="#63636b" strokeWidth="2"/></svg>
            Announcements
          </button>
          <button onClick={() => setActiveTab('timetable')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'timetable' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'timetable' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'timetable' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#63636b" strokeWidth="2"/><path d="M8 2V6" stroke="#63636b" strokeWidth="2"/><path d="M16 2V6" stroke="#63636b" strokeWidth="2"/></svg>
            Timetable
          </button>
          <button onClick={() => setActiveTab('complaints')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: '#fff', border: 'none', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 8px #f0f0f0', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 9V13" stroke="#f59e42" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="#f59e42"/><circle cx="12" cy="12" r="10" stroke="#f59e42" strokeWidth="2"/></svg>
            Complaints
          </button>
          <button onClick={() => setActiveTab('lostfound')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'lostfound' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'lostfound' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'lostfound' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#63636b" strokeWidth="2"/><path d="M8 12L11 15L16 10" stroke="#63636b" strokeWidth="2"/></svg>
            Lost & Found
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'announcements' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>Announcements</h2>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => setShowAnnouncementForm(true)}
                  style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <rect x="11" y="4" width="2" height="16" rx="1" fill="#fff"/>
                    <rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/>
                  </svg>
                  New Announcement
                </button>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 18px', 
                  fontSize: 16, 
                  borderRadius: 10, 
                  border: '1.5px solid #e5e5e5', 
                  background: '#fafafd'
                }}
              />
            </div>

            {(user?.role === 'admin' && showAnnouncementForm) && (
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>{isEditing ? 'Edit Announcement' : 'Create Announcement'}</h3>
                  <button 
                    onClick={() => {
                      setShowAnnouncementForm(false);
                      setIsEditing(false);
                      setAnnouncementForm({ title: '', content: '', type: 'Holiday' });
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#63636b" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (isEditing) {
                    handleUpdateAnnouncement(e);
                  } else {
                    handleAnnouncementSubmit(e);
                  }
                  setShowAnnouncementForm(false);
                }}>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                    placeholder="Announcement title"
                    style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16 }}
                  />
                  <textarea
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                    placeholder="Announcement content..."
                    style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16, minHeight: 80, resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <select
                      value={announcementForm.type}
                      onChange={(e) => setAnnouncementForm({...announcementForm, type: e.target.value})}
                      style={{ flex: 1, fontSize: 18, padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                    >
                      <option>Holiday</option>
                      <option>Event</option>
                      <option>Notice</option>
                      <option>Other</option>
                    </select>
                    <button type="submit" style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '14px 32px', fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>
                      {isEditing ? 'Update Announcement' : 'Post Announcement'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredAnnouncements.map((a, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', marginBottom: 24, border: '1.5px solid #f2f2f2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0 }}>{a.title}</h2>
                  <span style={{ background: '#f1f5f9', color: '#63636b', borderRadius: 10, padding: '4px 14px', fontWeight: 600, fontSize: 15 }}>{a.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#63636b', fontSize: 16, marginBottom: 10 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M8 7V3H16V7" stroke="#63636b" strokeWidth="1.5"/><rect x="4" y="7" width="16" height="14" rx="3" stroke="#63636b" strokeWidth="1.5"/></svg>
                  {a.date}
                </div>
                <div style={{ fontSize: 18, color: '#18181b' }}>{a.content}</div>
                {user?.role === 'admin' && (
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                    <button onClick={() => handleEditAnnouncement(a)} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteAnnouncement(a._id)} style={{ padding: '8px 16px', background: '#fff1f0', color: '#f43f5e', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Complaints Section */}
        {activeTab === 'complaints' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>Hostel Complaints</h2>
              {user?.role === 'student' && (
                <button 
                  onClick={() => setShowComplaintForm(true)}
                  style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <rect x="11" y="4" width="2" height="16" rx="1" fill="#fff"/>
                    <rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/>
                  </svg>
                  New Complaint
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button 
                onClick={() => setComplaintFilter('all')}
                style={{ 
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: complaintFilter === 'all' ? '#f4f4f5' : 'transparent',
                  color: complaintFilter === 'all' ? '#18181b' : '#71717a',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              {Object.keys(statusColors).map(status => (
                <button
                  key={status}
                  onClick={() => setComplaintFilter(status)}
                  style={{ 
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: complaintFilter === status ? statusColors[status].bg : 'transparent',
                    color: complaintFilter === status ? statusColors[status].text : '#71717a',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {user?.role === 'student' && showComplaintForm && (
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>
                    {isEditingComplaint ? 'Edit Complaint' : 'Submit New Complaint'}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowComplaintForm(false);
                      setIsEditingComplaint(false);
                      setEditingComplaint(null);
                      setForm({ title: '', description: '', category: 'Water' });
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#63636b" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleComplaintSubmit}>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Complaint title"
                    style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16 }}
                  />
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16, minHeight: 80, resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      style={{ flex: 1, fontSize: 18, padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                    >
                      <option>Water</option>
                      <option>Electricity</option>
                      <option>Internet</option>
                      <option>Other</option>
                    </select>
                    <button type="submit" style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '14px 32px', fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>
                      {isEditingComplaint ? 'Update Complaint' : 'Submit Complaint'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredComplaints.map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', marginBottom: 24, border: '1.5px solid #f2f2f2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0 }}>{c.title}</h2>
                    <span style={{ background: c.tagBg, color: c.tagColor, borderRadius: 10, padding: '4px 14px', fontWeight: 600, fontSize: 15 }}>{c.tag}</span>
                    <span style={{ background: c.statusColor, color: c.statusTextColor, borderRadius: 10, padding: '4px 14px', fontWeight: 600, fontSize: 15 }}>{c.status}</span>
                    {user?.role === 'admin' && (
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        style={{ 
                          padding: '4px 12px',
                          borderRadius: 8,
                          border: '1.5px solid #e5e5e5',
                          background: '#fff',
                          color: '#18181b',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#63636b', fontSize: 16, marginBottom: 10 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M8 7V3H16V7" stroke="#63636b" strokeWidth="1.5"/><rect x="4" y="7" width="16" height="14" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M16 11H8V13H16V11Z" fill="#63636b"/></svg>
                    {c.date}
                  </div>
                  <div style={{ fontSize: 18, color: '#18181b', marginBottom: 0 }}>{c.description}</div>
                  <span style={{ float: 'right', cursor: 'pointer', marginTop: -32 }} title="Delete" onClick={() => deleteComplaint(i)}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" stroke="#f43f5e" strokeWidth="2"/><path d="M15 9L9 15M9 9l6 6" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"/></svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timetable Section */}
        {activeTab === 'timetable' && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 32, margin: '0 0 24px 0' }}>Class Timetable</h2>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Time</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Monday</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Tuesday</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Wednesday</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Thursday</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Friday</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add your timetable rows here */}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lost & Found Section */}
        {activeTab === 'lostfound' && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 32, margin: '0 0 24px 0' }}>Lost & Found</h2>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
              <form>
                <h3 style={{ fontWeight: 700, fontSize: 26, margin: '0 0 24px 0' }}>Report Lost/Found Item</h3>
                <input
                  type="text"
                  placeholder="Item name"
                  style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16 }}
                />
                <textarea
                  placeholder="Item description..."
                  style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16, minHeight: 80, resize: 'vertical' }}
                />
                <select style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16 }}>
                  <option value="lost">Lost Item</option>
                  <option value="found">Found Item</option>
                </select>
                <button style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '14px 32px', fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compliants;
