import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful signup
    navigate('/home');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Segoe UI, Arial, sans-serif', color: '#18181b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      {/* Header */}
      <header style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 8, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M2 7.5L12 3L22 7.5L12 12L2 7.5Z" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/><path d="M6 10.5V15.5C6 17.433 9.13401 19 12 19C14.866 19 18 17.433 18 15.5V10.5" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/></svg>
          <span style={{ fontWeight: 700, fontSize: 28, letterSpacing: -1 }}>CampusConnect</span>
        </div>
        <span style={{ position: 'absolute', right: 40, top: 0, fontSize: 22, cursor: 'pointer' }} title="Theme toggle">&#9728;</span>
      </header>
      <div style={{ marginBottom: 16 }}>
        <span style={{ background: '#f4f0ff', color: '#18181b', borderRadius: 16, padding: '4px 16px', fontWeight: 500, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 7.5L12 3L22 7.5L12 12L2 7.5Z" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/></svg>
          Student Services Platform
        </span>
      </div>
      {/* Card */}
      <main style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
        <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 4px 24px #ececec', padding: '40px 32px 32px 32px', minWidth: 400, maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1.5px solid #f2f2f2' }}>
          <h2 style={{ fontWeight: 600, fontSize: 32, margin: 0, marginBottom: 6 }}>Create Account</h2>
          <div style={{ color: '#63636b', fontSize: 18, marginBottom: 28 }}>Sign up to access campus services</div>
          {/* Tabs */}
          <div style={{ display: 'flex', width: '100%', marginBottom: 24, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #f2f2f2', background: '#f7f7fa' }}>
            <Link
              to="/login"
              style={{
                flex: 1,
                padding: '12px 0',
                fontWeight: 500,
                fontSize: 18,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#63636b',
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'background 0.2s',
                lineHeight: '32px',
              }}
            >
              Login
            </Link>
            <button
              style={{
                flex: 1,
                padding: '12px 0',
                fontWeight: 600,
                fontSize: 18,
                background: '#fff',
                border: 'none',
                outline: 'none',
                color: '#18181b',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #f0f0f0',
                transition: 'background 0.2s',
              }}
              disabled
            >
              Sign Up
            </button>
          </div>
          {/* Sign Up Form */}
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Email</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fafafd', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '0 12px' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><rect x="3" y="5" width="18" height="14" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M3.5 6.5L12 13L20.5 6.5" stroke="#63636b" strokeWidth="1.5"/></svg>
                <input
                  id="email"
                  type="email"
                  placeholder="student@college.edu"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 18, padding: '14px 0', width: '100%' }}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="password" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Password</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fafafd', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '0 12px' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><rect x="5" y="10" width="14" height="8" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M12 14V16" stroke="#63636b" strokeWidth="1.5"/><circle cx="12" cy="13" r="1" fill="#63636b"/></svg>
                <input
                  id="password"
                  type="password"
                  placeholder=""
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 18, padding: '14px 0', width: '100%' }}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Confirm Password</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fafafd', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '0 12px' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><rect x="5" y="10" width="14" height="8" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M12 14V16" stroke="#63636b" strokeWidth="1.5"/><circle cx="12" cy="13" r="1" fill="#63636b"/></svg>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder=""
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 18, padding: '14px 0', width: '100%' }}
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" style={{ width: '100%', background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 600, fontSize: 20, cursor: 'pointer', marginTop: 8 }}>
              Sign Up
            </button>
          </form>
        </div>
      </main>
      <div style={{ marginTop: 32, color: '#63636b', fontSize: 16, textAlign: 'center' }}>
        By signing up, you agree to our <a href="#" style={{ color: '#6c47ff', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: '#6c47ff', textDecoration: 'underline' }}>Privacy Policy</a>
      </div>
    </div>
  );
}

export default SignUp;
