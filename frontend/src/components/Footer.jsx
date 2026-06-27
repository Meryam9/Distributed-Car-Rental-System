import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(8, 16, 29, 0.95)',
      borderTop: '1px solid #27456d',
      padding: '40px 20px 20px',
      marginTop: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* Brand Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(150deg, #2ea6ff, #0f72cf)',
              display: 'grid',
              placeItems: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 11c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v3c0 .55-.45 1-1 1h-1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2H3c-.55 0-1-.45-1-1v-3z" stroke="#fff" strokeWidth="1.4" fill="none"/>
                <circle cx="7.5" cy="16.5" r="1.1" stroke="#fff" strokeWidth="1.4" fill="none"/>
                <circle cx="16.5" cy="16.5" r="1.1" stroke="#fff" strokeWidth="1.4" fill="none"/>
                <path d="M6 10l1-3h10l1 3" stroke="#fff" strokeWidth="1.4" fill="none"/>
              </svg>
            </div>
            <div>
              <strong style={{ fontSize: '18px', display: 'block' }}>CarRental System</strong>
              <span style={{ color: '#9eb1d4', fontSize: '12px' }}>Premium rental experience</span>
            </div>
          </div>
          <p style={{ color: '#9eb1d4', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
            Pakistan's most trusted car rental service. Drive your dream car across Lahore, Karachi, and Islamabad!
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="#" style={{ color: '#9eb1d4', fontSize: '20px', textDecoration: 'none' }}>📘</a>
            <a href="#" style={{ color: '#9eb1d4', fontSize: '20px', textDecoration: 'none' }}>🐦</a>
            <a href="#" style={{ color: '#9eb1d4', fontSize: '20px', textDecoration: 'none' }}>📸</a>
            <a href="#" style={{ color: '#9eb1d4', fontSize: '20px', textDecoration: 'none' }}>🔗</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: '#9eb1d4', textDecoration: 'none', fontSize: '14px' }}>🏠 Home</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/cars" style={{ color: '#9eb1d4', textDecoration: 'none', fontSize: '14px' }}>🚗 Browse Cars</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/dashboard" style={{ color: '#9eb1d4', textDecoration: 'none', fontSize: '14px' }}>📊 Dashboard</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/my-rentals" style={{ color: '#9eb1d4', textDecoration: 'none', fontSize: '14px' }}>📋 My Rentals</Link></li>
          </ul>
        </div>

        {/* Our Cities */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Our Cities</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px', color: '#9eb1d4', fontSize: '14px' }}>📍 Lahore - 20+ Cars</li>
            <li style={{ marginBottom: '10px', color: '#9eb1d4', fontSize: '14px' }}>📍 Karachi - 20+ Cars</li>
            <li style={{ marginBottom: '10px', color: '#9eb1d4', fontSize: '14px' }}>📍 Islamabad - 20+ Cars</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Contact Info</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px', color: '#9eb1d4', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📞</span> +92-300-1234567
            </li>
            <li style={{ marginBottom: '10px', color: '#9eb1d4', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>✉️</span> support@carrental.pk
            </li>
            <li style={{ marginBottom: '10px', color: '#9eb1d4', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📍</span> Lahore, Pakistan
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #27456d',
        color: '#9eb1d4',
        fontSize: '12px'
      }}>
        <p>© 2024 CarRental System. All rights reserved. Drive safe!</p>
      </div>
    </footer>
  );
};

export default Footer;