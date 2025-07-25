import React, { useState, useEffect } from 'react';

function Announcement() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin] = useState(true); // TODO: Replace with actual auth check
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Academic',
    announcementDate: new Date().toISOString().split('T')[0],
    author: 'Admin'
  });

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/announcements');
        const data = await response.json();
        if (response.ok) {
          setAnnouncements(data);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch announcements');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmitAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your admin authentication token here
          'Authorization': 'Bearer your-admin-token'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setAnnouncements(prev => [data.data, ...prev]);
        setForm({
          title: '',
          description: '',
          category: 'Academic',
          announcementDate: new Date().toISOString().split('T')[0],
          author: 'Admin'
        });
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to create announcement');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error creating announcement:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 0' }}>
      {/* Error Message */}
      {error && (
        <div style={{ 
          background: '#fff1f0', 
          color: '#f43f5e', 
          padding: '12px 20px', 
          borderRadius: 8, 
          marginBottom: 24, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8 
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {/* Admin Form */}
      {isAdmin && (
        <form onSubmit={handleSubmitAnnouncement} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2', marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>Create Announcement</h3>
          <div style={{ color: '#63636b', fontSize: 18, margin: '8px 0 24px 0' }}>Post a new announcement for students</div>
          
          <input 
            name="title"
            value={form.title}
            onChange={handleInputChange}
            type="text" 
            placeholder="Announcement Title" 
            style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16 }}
            required 
          />

          <textarea 
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Announcement Details..." 
            style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16, minHeight: 120, resize: 'vertical' }}
            required 
          />

          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <select 
              name="category"
              value={form.category}
              onChange={handleInputChange}
              style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
            >
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Holiday">Holiday</option>
              <option value="Important">Important</option>
              <option value="Other">Other</option>
            </select>

            <input 
              type="date" 
              name="announcementDate"
              value={form.announcementDate}
              onChange={handleInputChange}
              style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
              required 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              background: loading ? '#e5e5e5' : '#a259ff', 
              color: 'white', 
              border: 'none', 
              borderRadius: 10, 
              padding: '14px 32px', 
              fontWeight: 600, 
              fontSize: 18, 
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Posting...' : 'Post Announcement'}
          </button>
        </form>
      )}

      {/* Announcements List */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: 32, margin: '0 0 24px 0' }}>Announcements</h2>
        
        {loading && !announcements.length && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#63636b' }}>
            Loading announcements...
          </div>
        )}

        <div style={{ display: 'grid', gap: '24px' }}>
          {announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              style={{ 
                background: '#fff', 
                borderRadius: 16, 
                boxShadow: '0 2px 12px #f3f3f3', 
                padding: '24px', 
                border: '1.5px solid #f2f2f2' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 600, flex: 1 }}>
                  {announcement.title}
                </h3>
                <span style={{ 
                  background: '#f1f5f9', 
                  color: '#64748b', 
                  padding: '6px 16px', 
                  borderRadius: 20, 
                  fontSize: 14, 
                  fontWeight: 500 
                }}>
                  {announcement.category}
                </span>
              </div>

              <p style={{ 
                margin: '0 0 16px 0', 
                fontSize: 18, 
                lineHeight: 1.6, 
                color: '#374151' 
              }}>
                {announcement.description}
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 16, 
                color: '#63636b', 
                fontSize: 14,
                borderTop: '1px solid #f2f2f2',
                paddingTop: 16
              }}>
                <span>👤 {announcement.author}</span>
                <span>📅 {new Date(announcement.announcementDate).toLocaleDateString()}</span>
                <span>🕒 Posted: {new Date(announcement.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Announcement;
