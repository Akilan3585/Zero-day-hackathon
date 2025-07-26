import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentAnnouncements();
  }, []);

  const fetchRecentAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/announcement/announcements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.slice(0, 3)); // Get only 3 recent announcements
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickAccessServices = [
    {
      title: 'Announcements',
      description: 'Stay updated with campus news and important updates',
      icon: '📢',
      route: '/announcements',
      color: '#a259ff'
    },
    {
      title: 'Placements',
      description: 'Explore job opportunities and career resources',
      icon: '💼',
      route: '/placements',
      color: '#22c55e'
    },
    {
      title: 'Polls & Feedback',
      description: 'Participate in polls and share your feedback',
      icon: '📊',
      route: '/polls',
      color: '#f59e42'
    },
    {
      title: 'TimeTable',
      description: 'Manage your class schedule and academic calendar',
      icon: '📅',
      route: '/timetable',
      color: '#3b82f6'
    },
    {
      title: 'Lost & Found',
      description: 'Report lost items and help others find belongings',
      icon: '🔍',
      route: '/lostfound',
      color: '#ef4444'
    },
    {
      title: 'Complaints',
      description: 'Submit complaints and track their resolution',
      icon: '⚠️',
      route: '/complaints',
      color: '#8b5cf6'
    },
    {
      title: 'Session Booking',
      description: 'Book sessions with mentors and workshops',
      icon: '📚',
      route: '/booking',
      color: '#06b6d4'
    },
    {
      title: 'Event Feedback',
      description: 'Share feedback about campus events',
      icon: '⭐',
      route: '/feedback',
      color: '#f97316'
    },
    {
      title: 'Mentor Directory',
      description: 'Connect with experienced mentors',
      icon: '👨‍🏫',
      route: '/mentor',
      color: '#10b981'
    },
    {
      title: 'Skill Exchange',
      description: 'Join skill development sessions',
      icon: '🎓',
      route: '/skill-exchange',
      color: '#ec4899'
    }
  ];

  const stats = [
    { label: 'Active Announcements', value: announcements.length, icon: '📢' },
    { label: 'Upcoming Events', value: '5', icon: '📅' },
    { label: 'Open Polls', value: '3', icon: '📊' },
    { label: 'Available Sessions', value: '8', icon: '📚' }
  ];

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            Welcome back, {user?.displayName || 'Student'}! 👋
          </h1>
          <p style={{ color: '#63636b', fontSize: '18px', margin: 0 }}>
            Your campus hub for announcements, opportunities, and resources
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e5e5e5',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#63636b' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Access Services */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            Quick Access Services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {quickAccessServices.map((service, index) => (
              <div
                key={index}
                onClick={() => navigate(service.route)}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e5e5',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderLeft: `4px solid ${service.color}`
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{service.icon}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: service.color }}>
                    {service.title}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#63636b', fontSize: '14px', lineHeight: '1.4' }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              Recent Announcements
            </h2>
            <button
              onClick={() => navigate('/announcements')}
              style={{
                background: '#a259ff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              View All
            </button>
          </div>
          
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
          ) : announcements.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#63636b',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e5e5e5'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
                <path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 style={{ margin: '0 0 8px 0' }}>No announcements</h3>
              <p style={{ margin: 0 }}>No recent announcements to display.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {announcements.map((announcement, index) => (
                <div key={announcement._id || index} style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e5e5'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      {announcement.title}
                    </h3>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '16px', 
                      background: '#e8f5e8',
                      color: '#22c55e',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {announcement.tag || 'General'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', color: '#63636b', lineHeight: '1.5' }}>
                    {announcement.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(announcement.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
