import React, { useState, useEffect } from 'react';

function LostItem() {
  const [activeTab, setActiveTab] = useState('lostfound');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/lostfound/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      // Reset form and refresh items list
      setForm({
        itemName: '',
        status: 'lost',
        description: '',
        location: '',
        category: 'Electronics',
        date: new Date().toISOString().split('T')[0],
        imageUrl: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        roomNumber: ''
      });

      // Fetch updated items list
      const updatedResponse = await fetch('http://localhost:5000/api/lostfound');
      const updatedItems = await updatedResponse.json();
      setItems(updatedItems);

    } catch (err) {
      setError(err.message);
      console.error('Error submitting report:', err);
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState({
    itemName: '',
    status: 'lost',
    description: '',
    location: '',
    category: 'Electronics',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    roomNumber: ''
  });

  // Fetch lost and found items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/lostfound');
        const data = await response.json();
        if (response.ok) {
          setItems(data);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch items');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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
          <button onClick={() => setActiveTab('complaints')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'complaints' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'complaints' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'complaints' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 9V13" stroke="#f59e42" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="#f59e42"/><circle cx="12" cy="12" r="10" stroke="#f59e42" strokeWidth="2"/></svg>
            Complaints
          </button>
          <button onClick={() => setActiveTab('lostfound')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: '#fff', border: 'none', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 8px #f0f0f0', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#63636b" strokeWidth="2"/><path d="M8 12L11 15L16 10" stroke="#63636b" strokeWidth="2"/></svg>
            Lost & Found
          </button>
        </div>

        {/* Lost & Found Section */}
        {activeTab === 'lostfound' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>Lost & Found</h2>
              <button style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="11" y="4" width="2" height="16" rx="1" fill="#fff"/><rect x="4" y="11" width="16" height="2" rx="1" fill="#fff"/></svg>
                Report Item
              </button>
            </div>
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

            <form onSubmit={handleSubmitReport} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
              <h3 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>Report Lost/Found Item</h3>
              <div style={{ color: '#63636b', fontSize: 18, margin: '8px 0 24px 0' }}>Help others find their belongings</div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <input 
                  name="itemName"
                  value={form.itemName}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Item name" 
                  style={{ flex: 2, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                  required 
                />
                <select 
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
              <textarea 
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Item description..." 
                style={{ width: '100%', fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd', marginBottom: 16, minHeight: 80, resize: 'vertical' }}
                required 
              />
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <input 
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Location" 
                  style={{ flex: 2, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                  required 
                />
                <select 
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Books">Books</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Documents">Documents</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <input 
                  type="date" 
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                  required 
                />
                <input 
                  type="url" 
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Image URL (optional)"
                  style={{ flex: 2, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                />
              </div>
              
              <div style={{ marginTop: 24, marginBottom: 16 }}>
                <h4 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 16px 0' }}>Contact Information</h4>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <input 
                    name="contactName"
                    value={form.contactName}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Your Name" 
                    style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                    required 
                  />
                  <input 
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Room Number" 
                    style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                    required 
                  />
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <input 
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleInputChange}
                    type="email" 
                    placeholder="Email Address" 
                    style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                    required 
                  />
                  <input 
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleInputChange}
                    type="tel" 
                    placeholder="Phone Number" 
                    style={{ flex: 1, fontSize: 18, padding: '14px 18px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
                    required 
                  />
                </div>
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
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>

            {/* List of Items */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontWeight: 700, fontSize: 26, margin: '0 0 24px 0' }}>Recent Reports</h3>
              {loading && <div style={{ textAlign: 'center', padding: '20px', color: '#63636b' }}>Loading...</div>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ 
                    background: '#fff', 
                    borderRadius: 16, 
                    boxShadow: '0 2px 12px #f3f3f3', 
                    padding: '20px', 
                    border: '1.5px solid #f2f2f2' 
                  }}>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.itemName} 
                        style={{ 
                          width: '100%', 
                          height: 200, 
                          objectFit: 'cover', 
                          borderRadius: 8, 
                          marginBottom: 16 
                        }} 
                      />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <h4 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{item.itemName}</h4>
                      <span style={{ 
                        background: item.status === 'lost' ? '#fff1f0' : '#dcfce7',
                        color: item.status === 'lost' ? '#f43f5e' : '#22c55e',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 12px 0', color: '#63636b' }}>{item.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#63636b', fontSize: 14, marginBottom: 12 }}>
                      <span>📍 {item.location}</span>
                      <span>📅 {new Date(item.date.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                    <div style={{ 
                      marginTop: 16, 
                      padding: '12px', 
                      background: '#f8f9fa', 
                      borderRadius: 8,
                      border: '1px solid #e9ecef'
                    }}>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: '#18181b' }}>Contact Information</h5>
                      <div style={{ fontSize: 14, color: '#63636b' }}>
                        <p style={{ margin: '0 0 4px 0' }}>👤 {item.contactName} {item.roomNumber && `(Room: ${item.roomNumber})`}</p>
                        <p style={{ margin: '0 0 4px 0' }}>📧 {item.contactEmail}</p>
                        <p style={{ margin: 0 }}>📱 {item.contactPhone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LostItem; 