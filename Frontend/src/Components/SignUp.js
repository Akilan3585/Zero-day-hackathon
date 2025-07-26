import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function SignUp() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', role: 'student', name: '', rollNumber: '', department: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.name) {
      newErrors.name = 'Name is required.';
    }
    if (!form.email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (form.role === 'student' && !form.rollNumber) {
      newErrors.rollNumber = 'Roll number is required.';
    }
    if (form.role === 'admin' && !form.department) {
      newErrors.department = 'Department is required.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      localStorage.setItem('userRole', form.role);
      setSuccess('Sign up successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1200);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
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
          {/* Role Select */}
          <div style={{ width: '100%', marginBottom: 18 }}>
            <label htmlFor="role" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', fontSize: 18, padding: '12px 10px', borderRadius: 8, border: '1.5px solid #e5e5e5', background: '#fafafd' }}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* Sign Up Form */}
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="name" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                style={{ border: 'none', outline: 'none', background: '#fafafd', fontSize: 18, padding: '14px 0', width: '100%', borderRadius: 8, border: '1.5px solid #e5e5e5' }}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && <div style={{ color: 'red', fontSize: 15, marginTop: 4 }}>{errors.name}</div>}
            </div>
            {form.role === 'student' && (
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="rollNumber" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Roll Number</label>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  placeholder="123456"
                  style={{ border: 'none', outline: 'none', background: '#fafafd', fontSize: 18, padding: '14px 0', width: '100%', borderRadius: 8, border: '1.5px solid #e5e5e5' }}
                  value={form.rollNumber}
                  onChange={e => setForm({ ...form, rollNumber: e.target.value })}
                  required
                />
                {errors.rollNumber && <div style={{ color: 'red', fontSize: 15, marginTop: 4 }}>{errors.rollNumber}</div>}
              </div>
            )}
            {form.role === 'admin' && (
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="department" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Department</label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Computer Science"
                  style={{ border: 'none', outline: 'none', background: '#fafafd', fontSize: 18, padding: '14px 0', width: '100%', borderRadius: 8, border: '1.5px solid #e5e5e5' }}
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  required
                />
                {errors.department && <div style={{ color: 'red', fontSize: 15, marginTop: 4 }}>{errors.department}</div>}
              </div>
            )}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Email</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fafafd', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '0 12px' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><rect x="3" y="5" width="18" height="14" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M3.5 6.5L12 13L20.5 6.5" stroke="#63636b" strokeWidth="1.5"/></svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@college.edu"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 18, padding: '14px 0', width: '100%' }}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              {errors.email && <div style={{ color: 'red', fontSize: 15, marginTop: 4 }}>{errors.email}</div>}
            </div>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="password" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Password</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fafafd', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '0 12px' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><rect x="5" y="10" width="14" height="8" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M12 14V16" stroke="#63636b" strokeWidth="1.5"/><circle cx="12" cy="13" r="1" fill="#63636b"/></svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=""
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 18, padding: '14px 0', width: '100%' }}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 6 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <div style={{ color: 'red', fontSize: 15, marginTop: 4 }}>{errors.password}</div>}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 16 }}>Confirm Password</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fafafd', border: '1.5px solid #e5e5e5', borderRadius: 8, padding: '0 12px' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><rect x="5" y="10" width="14" height="8" rx="3" stroke="#63636b" strokeWidth="1.5"/><path d="M12 14V16" stroke="#63636b" strokeWidth="1.5"/><circle cx="12" cy="13" r="1" fill="#63636b"/></svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder=""
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 18, padding: '14px 0', width: '100%' }}
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 6 }}>
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && <div style={{ color: 'red', fontSize: 15, marginTop: 4 }}>{errors.confirmPassword}</div>}
            </div>
            <button type="submit" style={{ width: '100%', background: '#a259ff', color: 'white', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 600, fontSize: 20, cursor: 'pointer', marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          {error && <div style={{ color: 'red', marginTop: 16, fontWeight: 500 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginTop: 16, fontWeight: 500 }}>{success}</div>}
        </div>
      </main>
      <div style={{ marginTop: 32, color: '#63636b', fontSize: 16, textAlign: 'center' }}>
        By signing up, you agree to our <a href="#" style={{ color: '#6c47ff', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: '#6c47ff', textDecoration: 'underline' }}>Privacy Policy</a>
      </div>
    </div>
  );
}

export default SignUp;
