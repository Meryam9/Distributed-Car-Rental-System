import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaCar } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="page-frame">
      <div className="auth-shell">
        <div className="auth-card" style={{ maxWidth: '450px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div className="brand-mark" style={{ width: '60px', height: '60px', margin: '0 auto 20px' }}>
              <FaCar style={{ fontSize: '30px', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome Back</h1>
            <p style={{ color: '#9eb1d4', fontSize: '14px' }}>Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-control"
                  style={{ paddingLeft: '45px' }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-control"
                  style={{ paddingLeft: '45px' }}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px' }} /> Remember me
              </label>
              <a href="#" style={{ color: '#2ea6ff', textDecoration: 'none', fontSize: '13px' }}>Forgot Password?</a>
            </div>

            <button type="submit" disabled={loading} className="submit-button" style={{ padding: '14px', fontSize: '16px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #2b4a73' }}>
            <p style={{ color: '#9eb1d4', fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2ea6ff', fontWeight: 'bold', textDecoration: 'none' }}>
                Create Account
              </Link>
            </p>
            <p style={{ color: '#6b8cae', fontSize: '12px', marginTop: '15px' }}>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;