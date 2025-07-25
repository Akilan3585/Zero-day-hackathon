import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: 'linear-gradient(180deg, #f8f6ff 0%, #fff 100%)', minHeight: '100vh', color: '#18181b' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px 16px 40px', background: 'white', boxShadow: '0 1px 0 #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {/* Graduation Cap SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M2 7.5L12 3L22 7.5L12 12L2 7.5Z" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/><path d="M6 10.5V15.5C6 17.433 9.13401 19 12 19C14.866 19 18 17.433 18 15.5V10.5" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/></svg>
          </span>
          <span style={{ fontWeight: 700, fontSize: 24, letterSpacing: -1 }}>CampusConnect</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/login" style={{ color: '#18181b', textDecoration: 'none', fontWeight: 500, fontSize: 16 }}>Login</Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginLeft: 8 }}>Sign Up</button>
          </Link>
          <span style={{ marginLeft: 16, fontSize: 20, cursor: 'pointer' }} title="Theme toggle">&#9728;</span>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '60px 20px 40px 20px', textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ background: '#f4f0ff', color: '#18181b', borderRadius: 16, padding: '4px 16px', fontWeight: 500, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 7.5L12 3L22 7.5L12 12L2 7.5Z" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/></svg>
            Student Services Platform
          </span>
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
          Your Campus,<br />
          <span style={{ color: '#a259ff' }}>Simplified</span>
        </h1>
        <p style={{ fontSize: 22, color: '#63636b', margin: '32px 0 0 0', maxWidth: 700 }}>
          Streamline your college experience with our all-in-one platform for announcements, scheduling, complaints, and more. Built by students, for students.
        </p>
        <div style={{ marginTop: 40, display: 'flex', gap: 20, justifyContent: 'center' }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '16px 36px', fontWeight: 600, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              Get Started <span style={{ fontSize: 22 }}>&#8594;</span>
            </button>
          </Link>
          <button style={{ background: 'white', color: '#18181b', border: '1.5px solid #e5e5e5', borderRadius: 10, padding: '16px 36px', fontWeight: 600, fontSize: 20, cursor: 'pointer' }}>
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'white', padding: '60px 0 40px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 48, fontWeight: 700, margin: 0 }}>Everything You Need</h2>
        <p style={{ textAlign: 'center', color: '#63636b', fontSize: 22, margin: '16px 0 48px 0' }}>
          Powerful features designed to make your campus life easier and more organized
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, maxWidth: 1200, margin: '0 auto' }}>
          {/* Feature Card 1 */}
          <div style={{ background: '#f8faff', borderRadius: 18, boxShadow: '0 2px 12px #eaeaea', padding: '32px 36px', minWidth: 340, maxWidth: 400, flex: '1 1 340px', marginBottom: 24 }}>
            <div style={{ background: '#eef2ff', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z" stroke="#5b7cff" strokeWidth="2"/></svg>
            </div>
            <h3 style={{ fontWeight: 600, fontSize: 24, margin: 0 }}>Campus Announcements</h3>
            <p style={{ color: '#63636b', fontSize: 18, margin: '10px 0 0 0' }}>Stay updated with important campus news, events, and academic notices in real-time.</p>
          </div>
          {/* Feature Card 2 */}
          <div style={{ background: '#f8faff', borderRadius: 18, boxShadow: '0 2px 12px #eaeaea', padding: '32px 36px', minWidth: 340, maxWidth: 400, flex: '1 1 340px', marginBottom: 24 }}>
            <div style={{ background: '#eafff3', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="2"/><path d="M8 12L11 15L16 10" stroke="#4ade80" strokeWidth="2"/></svg>
            </div>
            <h3 style={{ fontWeight: 600, fontSize: 24, margin: 0 }}>Lost &amp; Found</h3>
            <p style={{ color: '#63636b', fontSize: 18, margin: '10px 0 0 0' }}>Report lost items or help others find their belongings with our smart search system.</p>
          </div>
          {/* Feature Card 3 */}
          <div style={{ background: '#f8faff', borderRadius: 18, boxShadow: '0 2px 12px #eaeaea', padding: '32px 36px', minWidth: 340, maxWidth: 400, flex: '1 1 340px', marginBottom: 24 }}>
            <div style={{ background: '#f4f0ff', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#a259ff" strokeWidth="2"/><path d="M8 2V6" stroke="#a259ff" strokeWidth="2"/><path d="M16 2V6" stroke="#a259ff" strokeWidth="2"/></svg>
            </div>
            <h3 style={{ fontWeight: 600, fontSize: 24, margin: 0 }}>Smart Timetable</h3>
            <p style={{ color: '#63636b', fontSize: 18, margin: '10px 0 0 0' }}>Organize your class schedule with an intuitive calendar interface and reminders.</p>
          </div>
          {/* Feature Card 4 */}
          <div style={{ background: '#f8faff', borderRadius: 18, boxShadow: '0 2px 12px #eaeaea', padding: '32px 36px', minWidth: 340, maxWidth: 400, flex: '1 1 340px', marginBottom: 24 }}>
            <div style={{ background: '#fff7ed', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 9V13" stroke="#f59e42" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="#f59e42"/><circle cx="12" cy="12" r="10" stroke="#f59e42" strokeWidth="2"/></svg>
            </div>
            <h3 style={{ fontWeight: 600, fontSize: 24, margin: 0 }}>Hostel Complaints</h3>
            <p style={{ color: '#63636b', fontSize: 18, margin: '10px 0 0 0' }}>Submit and track maintenance requests for your hostel with real-time status updates.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'white', padding: '32px 0 32px 0', display: 'flex', justifyContent: 'center', gap: 80, fontWeight: 700, fontSize: 32, color: '#a259ff', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ textAlign: 'center' }}>
          1000+<div style={{ color: '#63636b', fontWeight: 400, fontSize: 18, marginTop: 8 }}>Active Students</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          500+<div style={{ color: '#63636b', fontWeight: 400, fontSize: 18, marginTop: 8 }}>Daily Announcements</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          98%<div style={{ color: '#63636b', fontWeight: 400, fontSize: 18, marginTop: 8 }}>Issue Resolution</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          24/7<div style={{ color: '#63636b', fontWeight: 400, fontSize: 18, marginTop: 8 }}>System Uptime</div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{ background: '#f8f6ff', padding: '64px 0 48px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 48, fontWeight: 700, margin: 0 }}>Ready to Transform Your Campus Experience?</h2>
        <p style={{ color: '#63636b', fontSize: 22, margin: '18px 0 40px 0' }}>
          Join thousands of students already using CampusConnect to stay organized and connected.
        </p>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '18px 48px', fontWeight: 600, fontSize: 22, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start Your Journey <span style={{ fontSize: 26 }}>&#8594;</span>
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: 'white', borderTop: '1px solid #f0f0f0', padding: '32px 0 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 40 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M2 7.5L12 3L22 7.5L12 12L2 7.5Z" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/><path d="M6 10.5V15.5C6 17.433 9.13401 19 12 19C14.866 19 18 17.433 18 15.5V10.5" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/></svg>
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: -1 }}>CampusConnect</span>
        </div>
        <div style={{ color: '#63636b', fontSize: 16, marginRight: 40 }}>
          © 2024 CampusConnect. Built for students, by students.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
