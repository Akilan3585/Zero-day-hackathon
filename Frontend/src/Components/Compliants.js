import React, { useState } from 'react';

function Compliants() {
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch complaints from backend
  React.useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/complaints');
        const data = await response.json();
        if (response.ok) {
          setComplaints(data);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch complaints');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: 'Water',
    roomNumber: '',
    block: '',
    status: 'pending',
    priority: 'medium'
  });

  // Handle form input change
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit new complaint
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      
      if (response.ok) {
        setComplaints(prev => [data.complaint, ...prev]);
        setForm({ 
          title: '', 
          description: '', 
          category: 'Water',
          roomNumber: '',
          block: '',
          status: 'pending',
          priority: 'medium'
        });
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to submit complaint');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error submitting complaint:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete complaint
  const handleDeleteComplaint = id => {
    setLoading(true);
    fetch(`http://localhost:5000/api/complaints/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          setComplaints(prev => prev.filter(c => c._id !== id));
        } else {
          setError('Failed to delete complaint');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to delete complaint');
        setLoading(false);
      });
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

        {/* Complaints Section */}
        <div>
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
            
            {/* Loading State */}
            {loading && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#63636b' 
              }}>
                Loading...
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>Hostel Complaints</h2>
              <button style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="11" y="4" width="2" height="16" rx="1" fill="#fff"/><rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/></svg>
                New Complaint
              </button>
            </div>
            <form onSubmit={handleSubmitComplaint} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
              <h3 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>Submit New Complaint</h3>
              <div style={{ color: '#63636b', fontSize: 18, margin: '8px 0 24px 0' }}>Report hostel maintenance issues</div>
              <input name="title" value={form.title} onChange={handleFormChange} type="text" placeholder="Complaint title" style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16 }} required />
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Describe the issue in detail..." style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16, minHeight: 80, resize: 'vertical' }} required />
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <input name="roomNumber" value={form.roomNumber} onChange={handleFormChange} type="text" placeholder="Room Number" style={{ width: '50%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }} required />
                <input name="block" value={form.block} onChange={handleFormChange} type="text" placeholder="Block/Wing" style={{ width: '50%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }} required />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <select name="category" value={form.category} onChange={handleFormChange} style={{ flex: 1, fontSize: 18, padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Internet">Internet</option>
                  <option value="Other">Other</option>
                </select>
                <select name="priority" value={form.priority} onChange={handleFormChange} style={{ flex: 1, fontSize: 18, padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '14px 32px', fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>
                Submit Complaint
              </button>
            </form>
            {complaints.map((c, i) => (
              <div key={c._id || i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', marginBottom: 24, border: '1.5px solid #f2f2f2', marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0 }}>{c.title}</h2>
                  <span style={{ background: '#f1f5f9', color: '#63636b', borderRadius: 10, padding: '4px 14px', fontWeight: 600, fontSize: 15, marginLeft: 8 }}>{c.category}</span>
                  <span style={{ background: c.status === 'pending' ? '#fff1f0' : '#f1f5f9', color: c.status === 'pending' ? '#f43f5e' : '#63636b', borderRadius: 10, padding: '4px 14px', fontWeight: 600, fontSize: 15, marginLeft: 8 }}>{c.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#63636b', fontSize: 16, marginBottom: 10 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M8 7V3H16V7" stroke="#63636b" strokeWidth="1.5"/><rect x="4" y="7" width="16" height="14" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M16 11H8V13H16V11Z" fill="#63636b"/></svg>
                  {c.date}
                </div>
                <div style={{ fontSize: 18, color: '#18181b', marginBottom: 0 }}>{c.description}</div>
                <span style={{ float: 'right', cursor: 'pointer', marginTop: -32 }} title="Delete" onClick={() => handleDeleteComplaint(c._id)}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" stroke="#f43f5e" strokeWidth="2"/><path d="M15 9L9 15M9 9l6 6" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"/></svg>
                </span>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

export default Compliants;
