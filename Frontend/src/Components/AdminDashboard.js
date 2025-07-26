import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const stats = {
    totalUsers: 1250,
    activeComplaints: 23,
    pendingAnnouncements: 5,
    recentActivities: 12
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 0 0 0' }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, margin: 0 }}>Admin Dashboard</h1>
        <div style={{ color: '#63636b', fontSize: 20, margin: '10px 0 32px 0' }}>
          Manage campus services and monitor system activity
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#f8faff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#eef2ff', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#5b7cff" strokeWidth="2"/><path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#5b7cff" strokeWidth="2"/></svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>Total Users</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#5b7cff' }}>{stats.totalUsers}</div>
          </div>

          <div style={{ background: '#fff7ed', borderRadius: '16px', padding: '24px', border: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#fef3c7', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 9V13" stroke="#f59e42" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="#f59e42"/><circle cx="12" cy="12" r="10" stroke="#f59e42" strokeWidth="2"/></svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>Active Complaints</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e42' }}>{stats.activeComplaints}</div>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: '16px', padding: '24px', border: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#dcfce7', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z" stroke="#22c55e" strokeWidth="2"/></svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>Pending Announcements</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{stats.pendingAnnouncements}</div>
          </div>

          <div style={{ background: '#fef2f2', borderRadius: '16px', padding: '24px', border: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#fee2e2', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>Recent Activities</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ef4444' }}>{stats.recentActivities}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 0, background: '#f7f7fa', borderRadius: 12, overflow: 'hidden', marginBottom: 36, maxWidth: 1100 }}>
          <button onClick={() => setActiveTab('overview')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'overview' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'overview' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'overview' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18" stroke="currentColor" strokeWidth="2"/><path d="M9 21V9" stroke="currentColor" strokeWidth="2"/></svg>
            Overview
          </button>
          <button onClick={() => setActiveTab('users')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'users' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'users' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'users' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="2"/></svg>
            Users
          </button>
          <button onClick={() => setActiveTab('announcements')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'announcements' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'announcements' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'announcements' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z" stroke="currentColor" strokeWidth="2"/></svg>
            Announcements
          </button>
          <button onClick={() => setActiveTab('complaints')} style={{ flex: 1, padding: '16px 0', fontWeight: 600, fontSize: 20, background: activeTab === 'complaints' ? '#fff' : 'transparent', border: 'none', color: activeTab === 'complaints' ? '#18181b' : '#63636b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: activeTab === 'complaints' ? '0 2px 8px #f0f0f0' : 'none', transition: 'background 0.2s' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 9V13" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
            Complaints
          </button>
        </div>

        {/* Content Sections */}
        {activeTab === 'overview' && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
            <h2 style={{ fontWeight: 700, fontSize: 28, margin: '0 0 20px 0' }}>System Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }}>Recent Activity</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>New user registration - 2 minutes ago</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>Complaint resolved - 15 minutes ago</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>Announcement published - 1 hour ago</li>
                  <li style={{ padding: '8px 0' }}>System backup completed - 2 hours ago</li>
                </ul>
              </div>
              <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 600 }}>Create Announcement</button>
                  <button style={{ background: '#f1f1f1', color: '#18181b', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 600 }}>View All Complaints</button>
                  <button style={{ background: '#f1f1f1', color: '#18181b', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 600 }}>Manage Users</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
            <h2 style={{ fontWeight: 700, fontSize: 28, margin: '0 0 20px 0' }}>User Management</h2>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
              <p style={{ margin: 0, color: '#63636b' }}>User management functionality will be implemented here.</p>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
            <h2 style={{ fontWeight: 700, fontSize: 28, margin: '0 0 20px 0' }}>Announcement Management</h2>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
              <p style={{ margin: 0, color: '#63636b' }}>Announcement management functionality will be implemented here.</p>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f3f3', padding: '28px 32px', border: '1.5px solid #f2f2f2' }}>
            <h2 style={{ fontWeight: 700, fontSize: 28, margin: '0 0 20px 0' }}>Complaint Management</h2>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
              <p style={{ margin: 0, color: '#63636b' }}>Complaint management functionality will be implemented here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
