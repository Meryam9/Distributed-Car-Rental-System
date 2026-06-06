import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };


  const scrollToSection = (sectionId) => {
    // Wait longer for the page to render
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  // Handle admin tab click - goes to dashboard and scrolls to section
  const handleAdminClick = (tabName, sectionId) => {
    setIsMobileMenuOpen(false);
    
    if (location.pathname === '/dashboard') {
      // Already on dashboard, just scroll
      window.history.pushState({}, '', `/dashboard?tab=${tabName}`);
      // Dispatch event to update tab in dashboard
      window.dispatchEvent(new CustomEvent('adminTabChange', { detail: tabName }));
      scrollToSection(sectionId);
    } else {
      // Go to dashboard with tab parameter
      navigate(`/dashboard?tab=${tabName}`);
      // Give more time for page to load then scroll
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 800);
    }
  };

  return (
    <header className="topbar">
      <div className="brand-block" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="brand-mark" aria-hidden="true">
          <svg className="brand-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v3c0 .55-.45 1-1 1h-1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2H3c-.55 0-1-.45-1-1v-3z"/>
              <circle cx="7.5" cy="16.5" r="1.1" />
              <circle cx="16.5" cy="16.5" r="1.1" />
              <path d="M6 10l1-3h10l1 3" />
            </g>
          </svg>
        </div>
        <div>
          <strong>CarRental System</strong>
        </div>
      </div>

      {/* Navigation Buttons */}
      <nav className="topnav" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {user ? (
          user.role === 'admin' ? (
            // ADMIN NAVIGATION
            <>
              <button onClick={() => handleAdminClick('overview', 'admin-overview')}>Overview</button>
              <button onClick={() => handleAdminClick('alerts', 'admin-alerts')}>Alerts</button>
              <button onClick={() => handleAdminClick('rentals', 'admin-rentals')}>Rentals</button>
              <button onClick={() => handleAdminClick('cars', 'admin-cars')}>Fleet</button>
              <button onClick={() => handleAdminClick('customers', 'admin-customers')}>Customers</button>
              <button onClick={() => handleAdminClick('locations', 'admin-locations')}>Locations</button>
            </>
          ) : (
            // CUSTOMER NAVIGATION
            <>
              <button onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button onClick={() => navigate('/cars')}>Search Cars</button>
              <button onClick={() => navigate('/my-rentals')}>My Rentals</button>
            </>
          )
        ) : (
          // NON-LOGGED IN NAVIGATION
          <>
            <button onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                  const section = document.getElementById('home');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }, 500);
              } else {
                const section = document.getElementById('home');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }
            }}>Home</button>
            <button onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                  const section = document.getElementById('cities-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }, 500);
              } else {
                const section = document.getElementById('cities-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }
            }}>Cities</button>
            <button onClick={() => navigate('/cars')}>Browse Cars</button>
          </>
        )}
      </nav>

      {/* Auth Actions */}
      <div className="auth-actions">
        {user ? (
          <>
            <span className={`user-pill ${user.role}`}>
              {user.role === 'customer' ? '👤 Customer' : '👑 Admin'}
            </span>
            <button className="ghost-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="ghost-button" onClick={() => navigate('/login')}>Login</button>
            <button className="primary-button compact" onClick={() => navigate('/register')}>Sign up</button>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
      >☰</button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" style={{ position: 'absolute', top: '70px', left: 0, right: 0, background: '#0d1b31', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #27456d', zIndex: 100 }}>
          {user ? (
            user.role === 'admin' ? (
              <>
                <button onClick={() => { handleAdminClick('overview', 'admin-overview'); setIsMobileMenuOpen(false); }}>Overview</button>
                <button onClick={() => { handleAdminClick('alerts', 'admin-alerts'); setIsMobileMenuOpen(false); }}>Alerts</button>
                <button onClick={() => { handleAdminClick('rentals', 'admin-rentals'); setIsMobileMenuOpen(false); }}>Rentals</button>
                <button onClick={() => { handleAdminClick('cars', 'admin-cars'); setIsMobileMenuOpen(false); }}>Fleet</button>
                <button onClick={() => { handleAdminClick('customers', 'admin-customers'); setIsMobileMenuOpen(false); }}>Customers</button>
                <button onClick={() => { handleAdminClick('locations', 'admin-locations'); setIsMobileMenuOpen(false); }}>Locations</button>
                <hr />
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>Dashboard</button>
                <button onClick={() => { navigate('/cars'); setIsMobileMenuOpen(false); }}>Search Cars</button>
                <button onClick={() => { navigate('/my-rentals'); setIsMobileMenuOpen(false); }}>My Rentals</button>
                <hr />
                <button onClick={handleLogout}>Logout</button>
              </>
            )
          ) : (
            <>
              <button onClick={() => { 
                if (location.pathname !== '/') navigate('/');
                setTimeout(() => { const section = document.getElementById('home'); if (section) section.scrollIntoView({ behavior: 'smooth' }); }, 500);
                setIsMobileMenuOpen(false);
              }}>Home</button>
              <button onClick={() => { 
                if (location.pathname !== '/') navigate('/');
                setTimeout(() => { const section = document.getElementById('cities-section'); if (section) section.scrollIntoView({ behavior: 'smooth' }); }, 500);
                setIsMobileMenuOpen(false);
              }}>Cities</button>
              <button onClick={() => { navigate('/cars'); setIsMobileMenuOpen(false); }}>Browse Cars</button>
              <hr />
              <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>Login</button>
              <button onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>Sign up</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;