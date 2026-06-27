import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

/* ─── Inline Styles ──────── */
const S = {
  root: {
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    background: '#080d14',
    color: '#e8edf5',
    minHeight: '100vh',
    overflowX: 'hidden',
  },

  /* ── Hero ── */
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '80px 5% 60px',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0, zIndex: 0,
    background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(14,90,212,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,195,180,0.10) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroGrid: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative', zIndex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  heroCopy: { display: 'flex', flexDirection: 'column', gap: '24px' },
  pill: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(14,90,212,0.15)',
    border: '1px solid rgba(14,90,212,0.35)',
    borderRadius: '100px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#60a5fa',
    letterSpacing: '0.5px',
    width: 'fit-content',
  },
  heroH1: {
    fontSize: 'clamp(2.4rem, 5vw, 4rem)',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-1px',
    margin: 0,
    background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 60%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: { fontSize: '1.05rem', color: '#8fa5c8', lineHeight: '1.7', margin: 0 },
  heroActions: { display: 'flex', gap: '14px', flexWrap: 'wrap' },

  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'linear-gradient(135deg, #1a6fd8, #0ea5e9)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 4px 24px rgba(14,90,212,0.35)',
    transition: 'transform .2s, box-shadow .2s',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(255,255,255,0.05)',
    color: '#93c5fd',
    border: '1px solid rgba(148,163,184,0.2)',
    borderRadius: '12px',
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background .2s',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'transparent',
    color: '#60a5fa',
    border: '1px solid rgba(96,165,250,0.3)',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background .2s',
  },

  metrics: {
    display: 'flex', gap: '20px', flexWrap: 'wrap', paddingTop: '8px',
  },
  metricItem: {
    display: 'flex', flexDirection: 'column',
    borderLeft: '2px solid rgba(14,90,212,0.5)',
    paddingLeft: '14px',
  },
  metricVal: { fontSize: '1.1rem', fontWeight: '800', color: '#e2e8f0' },
  metricLbl: { fontSize: '12px', color: '#64748b', marginTop: '2px' },

  /* ── Hero Visual ── */
  heroVisual: {
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  glassCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    backdropFilter: 'blur(12px)',
    overflow: 'hidden',
    padding: '0',
  },
  spotlightImg: { width: '100%', height: '220px', objectFit: 'cover', display: 'block' },
  spotlightMeta: { padding: '18px 20px' },
  spotlightBadge: { fontSize: '12px', color: '#60a5fa', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
  spotlightTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#e2e8f0', margin: '0 0 4px' },
  spotlightSub: { fontSize: '13px', color: '#60a5fa' },
  accentCard: {
    background: 'linear-gradient(135deg, rgba(14,90,212,0.2), rgba(6,182,212,0.1))',
    border: '1px solid rgba(14,90,212,0.3)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  accentBadge: { fontSize: '12px', color: '#22d3ee', fontWeight: '700' },
  accentTitle: { fontSize: '1rem', fontWeight: '700', color: '#e2e8f0', margin: '4px 0 2px' },
  accentSub: { fontSize: '13px', color: '#7dd3fc' },

  /* ── Sections ── */
  section: { padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' },
  sectionHdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
  eyebrow: { fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#3b82f6', marginBottom: '8px' },
  sectionH2: { fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', margin: 0, color: '#f1f5f9', letterSpacing: '-0.5px' },

  divider: { height: '1px', background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.1), transparent)', margin: '0 5%' },

  /* ── Feature Cards ── */
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  featCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '28px',
    transition: 'border-color .2s, background .2s',
    cursor: 'default',
  },
  featIcon: { fontSize: '28px', marginBottom: '14px', display: 'block' },
  featTitle: { fontSize: '1rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '8px' },
  featDesc: { fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 },

  /* ── City Cards ── */
  cityGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  cityCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '28px',
    cursor: 'pointer',
    transition: 'all .2s',
    textAlign: 'center',
  },
  cityCardActive: {
    background: 'rgba(14,90,212,0.12)',
    border: '1px solid rgba(14,90,212,0.4)',
    boxShadow: '0 0 24px rgba(14,90,212,0.15)',
  },
  cityIcon: { fontSize: '36px', display: 'block', marginBottom: '12px' },
  cityName: { fontSize: '1.1rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' },
  cityDesc: { fontSize: '13px', color: '#64748b', marginBottom: '14px', lineHeight: '1.5' },
  cityCount: {
    display: 'inline-block',
    background: 'rgba(14,90,212,0.15)',
    border: '1px solid rgba(14,90,212,0.3)',
    borderRadius: '100px',
    padding: '4px 14px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#60a5fa',
  },

  /* ── Fleet Cards ── */
  fleetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },
  fleetCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '12px',
    transition: 'border-color .2s, transform .2s',
  },
  fleetEmoji: { fontSize: '52px', textAlign: 'center' },
  fleetName: { fontSize: '1.05rem', fontWeight: '700', color: '#e2e8f0', textAlign: 'center', margin: 0 },
  fleetMeta: { fontSize: '13px', color: '#64748b', lineHeight: '1.8' },
  fleetPrice: { textAlign: 'center', fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' },
  fleetDeposit: { textAlign: 'center', fontSize: '12px', color: '#475569' },
  fleetBtn: {
    display: 'block', textAlign: 'center',
    background: 'linear-gradient(135deg, #1a6fd8, #0ea5e9)',
    color: '#fff', textDecoration: 'none',
    borderRadius: '10px', padding: '12px',
    fontWeight: '700', fontSize: '14px',
    border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(14,90,212,0.25)',
    transition: 'opacity .2s',
    marginTop: 'auto',
  },

  /* ── Testimonials ── */
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  testimonialCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  tStars: { fontSize: '14px', letterSpacing: '2px', color: '#f59e0b' },
  tName: { fontSize: '1rem', fontWeight: '700', color: '#e2e8f0', margin: 0 },
  tText: { fontSize: '14px', color: '#64748b', lineHeight: '1.7', margin: 0, fontStyle: 'italic' },
  tCar: { fontSize: '12px', color: '#3b82f6', fontWeight: '600' },

  /* ── CTA Banner ── */
  ctaBanner: {
    margin: '0 5% 80px',
    background: 'linear-gradient(135deg, rgba(14,90,212,0.25) 0%, rgba(6,182,212,0.15) 100%)',
    border: '1px solid rgba(14,90,212,0.3)',
    borderRadius: '24px',
    padding: '60px',
    textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
  },
  ctaH2: { fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: '800', color: '#f1f5f9', margin: 0, letterSpacing: '-0.5px' },
  ctaSub: { fontSize: '1rem', color: '#94a3b8', maxWidth: '500px', lineHeight: '1.6' },

  /* ── Loading ── */
  loading: { padding: '60px', textAlign: 'center', color: '#475569', fontSize: '15px' },
};

/* ─── Component ──────────── */
const Home = () => {
  const { user } = useAuth();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [selectedCity, setSelectedCity] = useState('lahore');

  useEffect(() => { fetchFeaturedCars(); }, [selectedCity]);

  const fetchFeaturedCars = async () => {
    try {
      const res = await axios.get(`/api/cars/${selectedCity}`);
      if (res.data.success) setFeaturedCars(res.data.cars.slice(0, 4));
    } catch (error) { console.error('Error fetching cars:', error); }
  };

  const cities = [
    { name: 'Lahore', code: 'lahore', description: 'Heart of Punjab — rich culture & history', icon: '🏛️', cars: 20 },
    { name: 'Karachi', code: 'karachi', description: 'City of Lights — the business hub', icon: '🌊', cars: 20 },
    { name: 'Islamabad', code: 'islamabad', description: 'Capital city — peaceful & scenic', icon: '🏔️', cars: 20 },
  ];

  const features = [
    { icon: '🚗', title: 'Wide Range of Cars', desc: 'From economy to luxury, we have the perfect car for every need and budget.' },
    { icon: '🛡️', title: 'Secure & Insured', desc: 'All cars are fully insured and regularly maintained for your safety.' },
    { icon: '💳', title: 'Easy Booking', desc: 'Book online in minutes with our simple and secure payment system.' },
    { icon: '📍', title: 'Multiple Locations', desc: 'Pick up and drop off at any of our 3 major city locations.' },
    { icon: '🎧', title: '24/7 Support', desc: 'Our dedicated team is always ready to assist you anytime, anywhere.' },
    { icon: '⚡', title: 'Instant Confirmation', desc: 'Get instant booking confirmation and driver details via email.' },
  ];

  const testimonials = [
    { name: 'Ahmed Khan', stars: 5, text: 'Amazing service! The car was in perfect condition and the pickup was super smooth. Highly recommend Pak Wheels!', car: 'Toyota Corolla' },
    { name: 'Fatima Ali', stars: 5, text: 'Best rental experience in Karachi. Professional staff and great car selection. Will definitely use again!', car: 'Honda Civic' },
    { name: 'Bilal Ahmed', stars: 5, text: 'Cross-city rental made easy! Drove from Islamabad to Lahore without any issues. Support team was very helpful.', car: 'KIA Sportage' },
  ];

  const carIcon = (type) => type === 'SUV' ? '🚙' : type === 'Sedan' ? '🚗' : '🚘';
  const activeCityName = cities.find(c => c.code === selectedCity)?.name;

  return (
    <div style={S.root}>
      {/* ── Hero ──────── */}
      <section style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroGrid} />
        <div style={S.heroContent}>
          <div style={S.heroCopy}>
            <span style={S.pill}>🚗 Premium Car Rental — Pakistan</span>
            <h1 style={S.heroH1}>Drive Your Dream Car<br />Across Pakistan</h1>
            <p style={S.heroSubtitle}>
              Choose from 60+ luxury and economy cars across Lahore, Karachi, and Islamabad.
              Book online in minutes with Pak Wheels.
            </p>
            <div style={S.heroActions}>
              {!user ? (
                <Link to="/register" style={S.btnPrimary}>Get Started →</Link>
              ) : (
                <Link to="/cars" style={S.btnPrimary}>Browse Cars →</Link>
              )}
              <button
                style={S.btnSecondary}
                onClick={() => document.getElementById('cities-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Locations
              </button>
            </div>
            <div style={S.metrics}>
              {[
                { val: '3 Cities', lbl: 'Covered' },
                { val: '60+ Vehicles', lbl: 'Fleet Size' },
                { val: '4.9 / 5', lbl: '2k+ Reviews' },
              ].map(m => (
                <div key={m.lbl} style={S.metricItem}>
                  <span style={S.metricVal}>{m.val}</span>
                  <span style={S.metricLbl}>{m.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={S.heroVisual}>
            <div style={S.glassCard}>
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury car rental"
                style={S.spotlightImg}
              />
              <div style={S.spotlightMeta}>
                <p style={S.spotlightBadge}>✨ Featured Deal</p>
                <h3 style={S.spotlightTitle}>20% OFF First Rental</h3>
                <span style={S.spotlightSub}>Use code: FIRST20</span>
              </div>
            </div>
            <div style={S.accentCard}>
              <span style={S.accentBadge}>🎯 Limited Time Offer</span>
              <h3 style={S.accentTitle}>Free Insurance</h3>
              <span style={S.accentSub}>On all bookings above 3 days</span>
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ── Features ──── */}
      <div style={S.section}>
        <div style={S.sectionHdr}>
          <div>
            <p style={S.eyebrow}>Why Choose Us</p>
            <h2 style={S.sectionH2}>Premium Features</h2>
          </div>
        </div>
        <div style={S.featGrid}>
          {features.map(f => (
            <div key={f.title} style={S.featCard}>
              <span style={S.featIcon}>{f.icon}</span>
              <h3 style={S.featTitle}>{f.title}</h3>
              <p style={S.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={S.divider} />

      {/* ── Cities ────── */}
      <div style={S.section} id="cities-section">
        <div style={S.sectionHdr}>
          <div>
            <p style={S.eyebrow}>Our Locations</p>
            <h2 style={S.sectionH2}>Choose Your Pickup City</h2>
          </div>
        </div>
        <div style={S.cityGrid}>
          {cities.map(city => (
            <div
              key={city.code}
              style={{ ...S.cityCard, ...(selectedCity === city.code ? S.cityCardActive : {}) }}
              onClick={() => setSelectedCity(city.code)}
            >
              <span style={S.cityIcon}>{city.icon}</span>
              <h3 style={S.cityName}>{city.name}</h3>
              <p style={S.cityDesc}>{city.description}</p>
              <span style={S.cityCount}>{city.cars}+ Cars Available</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.divider} />

      {/* ── Featured Fleet (customers & guests only) ─────────────────── */}
      {user?.role !== 'admin' && (
        <>
          <div style={S.section}>
            <div style={S.sectionHdr}>
              <div>
                <p style={S.eyebrow}>Featured Fleet</p>
                <h2 style={S.sectionH2}>Popular Cars in {activeCityName}</h2>
              </div>
              <Link to="/cars" style={S.btnGhost}>View All →</Link>
            </div>

            {featuredCars.length === 0 ? (
              <p style={S.loading}>Loading available cars…</p>
            ) : (
              <div style={S.fleetGrid}>
                {featuredCars.map(car => (
                  <div key={car.car_id} style={S.fleetCard}>
                    <div style={S.fleetEmoji}>{carIcon(car.type)}</div>
                    <h3 style={S.fleetName}>{car.brand} {car.model}</h3>
                    <div style={S.fleetMeta}>
                      <div>📝 {car.type}</div>
                      <div>📍 {car.location}</div>
                      <div>⭐ 4.8 / 5 (120 reviews)</div>
                    </div>
                    <div style={S.fleetPrice}>
                      Rs {car.price_per_day.toLocaleString()}
                      <span style={{ fontSize: '14px', fontWeight: '400', color: '#64748b' }}> / day</span>
                    </div>
                    {user ? (
                      <Link to={`/booking/${selectedCity}/${car.car_id}`} style={S.fleetBtn}>Book Now →</Link>
                    ) : (
                      <Link to="/login" style={S.fleetBtn}>Login to Book →</Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={S.divider} />
        </>
      )}

      {/* ── Testimonials  */}
      <div style={S.section}>
        <div style={S.sectionHdr}>
          <div>
            <p style={S.eyebrow}>Testimonials</p>
            <h2 style={S.sectionH2}>What Our Customers Say</h2>
          </div>
        </div>
        <div style={S.testimonialGrid}>
          {testimonials.map(t => (
            <div key={t.name} style={S.testimonialCard}>
              <span style={S.tStars}>{'★'.repeat(t.stars)}</span>
              <h3 style={S.tName}>{t.name}</h3>
              <p style={S.tText}>"{t.text}"</p>
              <span style={S.tCar}>🚗 Rented: {t.car}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner (customers & guests only) ────────────────────── */}
      {user?.role !== 'admin' && (
        <div style={S.ctaBanner}>
          <p style={S.eyebrow}>Ready to Hit the Road?</p>
          <h2 style={S.ctaH2}>Join Thousands of Happy Customers</h2>
          <p style={S.ctaSub}>Sign up today and get special discounts on your first rental experience!</p>
          {!user && (
            <Link to="/register" style={S.btnPrimary}>Create Free Account →</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
