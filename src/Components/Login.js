import React, { useState } from 'react';
import { auth, createUserRole } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      if (isNewUser) {
        await createUserRole(result.user.uid);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Handle login logic here
      console.log('Login attempt:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f7f7fa' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px #f3f3f3' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M2 7.5L12 3L22 7.5L12 12L2 7.5Z" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M6 10.5V15.5C6 17.433 9.13401 19 12 19C14.866 19 18 17.433 18 15.5V10.5" stroke="#a259ff" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0' }}>Welcome Back</h1>
          <p style={{ color: '#63636b', fontSize: '16px', margin: 0 }}>Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '16px' }}
            />
            {errors.email && <span style={{ color: '#f43f5e', fontSize: '14px' }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e5e5e5', fontSize: '16px' }}
            />
            {errors.password && <span style={{ color: '#f43f5e', fontSize: '14px' }}>{errors.password}</span>}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#a259ff',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            Sign In
          </button>

          <p style={{ textAlign: 'center', margin: '0', color: '#63636b' }}>
            Don't have an account?{' '}
            <a
              href="/signup"
              style={{ color: '#a259ff', textDecoration: 'none', fontWeight: 600 }}
            >
              Sign Up
            </a>
          </p>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
          <div style={{ height: '1px', background: '#e5e5e5', flexGrow: 1, marginRight: '16px' }} />
          <span style={{ color: '#a259ff', fontWeight: 600 }}>or</span>
          <div style={{ height: '1px', background: '#e5e5e5', flexGrow: 1, marginLeft: '16px' }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px',
            marginTop: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px' }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
