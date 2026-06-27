import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaCar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cnic: '',
    driving_license: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    // Prepare data for API - only send required fields
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || '',
      cnic: formData.cnic || '',
      driving_license: formData.driving_license || '',
      address: formData.address || ''
    };
    
    try {
      const success = await register(userData);
      if (success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-frame">
      <div className="auth-shell">
        <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div className="brand-mark" style={{ width: '50px', height: '50px', margin: '0 auto 15px' }}>
              <FaCar style={{ fontSize: '25px', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>Create Account</h1>
            <p style={{ color: '#9eb1d4', fontSize: '13px' }}>Join Pak Wheels today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4', fontSize: '12px' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-control"
                  style={{ paddingLeft: '35px' }}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4', fontSize: '12px' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-control"
                  style={{ paddingLeft: '35px' }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4', fontSize: '12px' }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-control"
                  style={{ paddingLeft: '35px' }}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4', fontSize: '12px' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-control"
                  style={{ paddingLeft: '35px' }}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <FaPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4', fontSize: '12px' }} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-control"
                  style={{ paddingLeft: '35px' }}
                  placeholder="+92-XXX-XXXXXXX"
                />
              </div>
            </div>

            <div className="field-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>CNIC (Optional)</label>
              <div style={{ position: 'relative' }}>
                <FaIdCard style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9eb1d4', fontSize: '12px' }} />
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  className="input-control"
                  style={{ paddingLeft: '35px' }}
                  placeholder="12345-6789012-3"
                />
              </div>
            </div>

            <div className="field-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Driving License (Optional)</label>
              <input
                type="text"
                name="driving_license"
                value={formData.driving_license}
                onChange={handleChange}
                className="input-control"
                placeholder="LHR-1234567"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-button" style={{ padding: '12px', fontSize: '15px', marginTop: '10px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #2b4a73' }}>
            <p style={{ color: '#9eb1d4', fontSize: '13px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2ea6ff', fontWeight: 'bold', textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;