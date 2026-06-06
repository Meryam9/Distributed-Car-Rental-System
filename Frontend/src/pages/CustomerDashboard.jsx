import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaWallet } from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

/* ─── Design Tokens ─────────────────────────────────────────────────────── */
const T = {
  bg: '#080d14',
  surface: 'rgba(255,255,255,0.03)',
  surfaceHover: 'rgba(255,255,255,0.055)',
  border: 'rgba(255,255,255,0.07)',
  borderActive: 'rgba(14,90,212,0.4)',
  text: '#e8edf5',
  muted: '#64748b',
  dim: '#94a3b8',
  accent: '#3b82f6',
  accentGlow: 'rgba(14,90,212,0.25)',
  success: '#10b981',
  warning: '#f59e0b',
};

const S = {
  root: { fontFamily: "'Sora','DM Sans',sans-serif", background: T.bg, color: T.text, minHeight: '100vh' },

  /* ── Hero banner ── */
  heroBanner: {
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(14,90,212,0.18) 0%, rgba(6,182,212,0.08) 100%)',
    border: `1px solid ${T.borderActive}`,
    borderRadius: '20px',
    margin: '24px 24px 0',
    padding: '40px 48px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '40px',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(14,90,212,0.12), transparent)',
    pointerEvents: 'none',
  },
  heroCopy: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  heroEyebrow: { fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: T.accent },
  heroH1: { fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: '800', letterSpacing: '-0.5px', margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, #93c5fd 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { fontSize: '14px', color: T.dim, lineHeight: '1.6', maxWidth: '460px' },
  heroActions: { display: 'flex', gap: '12px', marginTop: '8px' },
  heroCard: {
    position: 'relative', zIndex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${T.border}`,
    borderRadius: '16px',
    padding: '24px 32px',
    textAlign: 'center', minWidth: '160px',
  },
  heroCardLabel: { fontSize: '11px', color: T.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  heroCardVal: { fontSize: '1.3rem', fontWeight: '800', color: T.text, margin: '8px 0 4px' },
  heroCardSub: { fontSize: '12px', color: '#22d3ee' },

  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'linear-gradient(135deg, #1a6fd8, #0ea5e9)',
    color: '#fff', border: 'none', borderRadius: '10px',
    padding: '11px 22px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(14,90,212,0.3)',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${T.border}`,
    color: T.dim, borderRadius: '10px',
    padding: '11px 22px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', textDecoration: 'none',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'transparent', border: `1px solid rgba(96,165,250,0.3)`,
    color: '#60a5fa', borderRadius: '10px',
    padding: '9px 18px', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', textDecoration: 'none',
  },

  /* ── Stats Row ── */
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    margin: '20px 24px 0',
  },
  statCard: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: '16px',
    padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  statLabel: { fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: T.muted },
  statValue: { fontSize: '1.8rem', fontWeight: '800', color: T.text, letterSpacing: '-0.5px' },
  statSub: { fontSize: '12px', color: T.muted, marginTop: '2px' },

  /* ── Tabs ── */
  tabBar: {
    display: 'flex', gap: '4px',
    margin: '24px 24px 0',
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: '12px',
    padding: '6px',
    width: 'fit-content',
  },
  tab: {
    padding: '9px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', border: 'none',
    background: 'transparent', color: T.muted,
    transition: 'all .2s',
  },
  tabActive: {
    background: 'rgba(14,90,212,0.2)',
    color: '#93c5fd',
    border: `1px solid rgba(14,90,212,0.3)`,
  },

  /* ── Content shell ── */
  shell: { margin: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: '16px',
    padding: '28px',
  },
  sectionHdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
  eyebrow: { fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: T.accent, marginBottom: '6px' },
  cardH2: { fontSize: '1.2rem', fontWeight: '700', color: T.text, margin: 0 },

  /* ── History list ── */
  historyItem: {
    background: 'rgba(255,255,255,0.025)',
    border: `1px solid ${T.border}`,
    borderRadius: '12px',
    padding: '18px 20px',
    marginBottom: '10px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  historyLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  historyName: { fontSize: '15px', fontWeight: '700', color: T.text },
  historyMeta: { fontSize: '13px', color: T.muted },
  historyRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  historyAmount: { fontSize: '15px', fontWeight: '700', color: T.text },
  badge: { fontSize: '11px', fontWeight: '700', borderRadius: '100px', padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  badgeActive: { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
  badgeDone: { background: 'rgba(100,116,139,0.15)', color: '#64748b', border: '1px solid rgba(100,116,139,0.3)' },

  /* ── Quick action cards ── */
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  quickCard: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: '16px',
    padding: '28px',
    textDecoration: 'none',
    display: 'flex', flexDirection: 'column', gap: '10px',
    transition: 'border-color .2s',
    cursor: 'pointer',
  },
  quickIcon: { fontSize: '28px' },
  quickTitle: { fontSize: '1rem', fontWeight: '700', color: T.text, margin: 0 },
  quickDesc: { fontSize: '13px', color: T.muted, lineHeight: '1.5' },
  quickCta: { fontSize: '13px', fontWeight: '700', color: T.accent },

  /* ── Analytics grid ── */
  analyticsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },

  /* ── Fleet cards ── */
  fleetGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' },
  fleetCard: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: '16px',
    padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '10px',
    textAlign: 'center',
  },
  fleetEmoji: { fontSize: '48px' },
  fleetName: { fontSize: '1rem', fontWeight: '700', color: T.text, margin: 0 },
  fleetPrice: { fontSize: '1.3rem', fontWeight: '800', color: '#38bdf8' },
  fleetBtn: {
    display: 'block', textAlign: 'center', textDecoration: 'none',
    background: 'linear-gradient(135deg, #1a6fd8, #0ea5e9)',
    color: '#fff', borderRadius: '10px', padding: '11px',
    fontWeight: '700', fontSize: '14px', marginTop: '6px',
  },

  /* ── City buttons ── */
  cityRow: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  cityBtn: {
    padding: '10px 22px', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', border: `1px solid ${T.border}`,
    background: T.surface, color: T.dim,
    transition: 'all .2s',
  },
  cityBtnActive: {
    background: 'rgba(14,90,212,0.15)',
    border: `1px solid ${T.borderActive}`,
    color: '#93c5fd',
  },

  fleetBtnRented: {
    display: 'block', textAlign: 'center',
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', borderRadius: '10px', padding: '11px',
    fontWeight: '700', fontSize: '14px', marginTop: '6px',
  },
  fleetBtnMaint: {
    display: 'block', textAlign: 'center',
    background: 'rgba(245,158,11,0.12)',
    border: '1px solid rgba(245,158,11,0.3)',
    color: '#fbbf24', borderRadius: '10px', padding: '11px',
    fontWeight: '700', fontSize: '14px', marginTop: '6px',
  },
  statusDot: {
    display: 'inline-block', width: '8px', height: '8px',
    borderRadius: '50%', marginRight: '6px',
  },

  emptyState: { textAlign: 'center', padding: '60px 20px', color: T.muted },
  emptyIcon: { fontSize: '48px', marginBottom: '16px', display: 'block' },

  chartTitle: { fontSize: '14px', fontWeight: '700', color: T.dim, marginBottom: '20px' },
  tooltipStyle: { backgroundColor: '#0d1b31', borderColor: '#27456d', borderRadius: '8px', fontSize: '13px' },
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalRentals: 0, activeRentals: 0, totalSpent: 0, totalDays: 0, penaltyAmount: 0 });
  const [recentRentals, setRecentRentals] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCity, setSelectedCity] = useState('lahore');
  const [loading, setLoading] = useState(true);
  const [dashboardTab, setDashboardTab] = useState('overview');

  const cities = [
    { code: 'lahore', name: 'Lahore', icon: '🏛️' },
    { code: 'karachi', name: 'Karachi', icon: '🌊' },
    { code: 'islamabad', name: 'Islamabad', icon: '🏔️' },
  ];

  useEffect(() => { fetchDashboardData(); fetchAvailableCars(); }, [selectedCity]);

  const fetchDashboardData = async () => {
    try {
      const rentalsRes = await axios.get('/api/rentals/my-rentals');
      const rentals = rentalsRes.data.rentals || [];
      setStats({
        totalRentals: rentals.length,
        activeRentals: rentals.filter(r => r.status === 'active').length,
        totalSpent: rentals.reduce((sum, r) => sum + (r.total_amount || 0), 0),
        totalDays: rentals.reduce((sum, r) => sum + (r.total_days || 0), 0),
        penaltyAmount: rentals.reduce((sum, r) => sum + (r.penalty_amount || 0), 0),
      });
      setRecentRentals(rentals.slice(0, 5));
      setLoading(false);
    } catch (error) { console.error('Error fetching dashboard data:', error); setLoading(false); }
  };

  const fetchAvailableCars = async () => {
    try {
      const res = await axios.get(`/api/cars/${selectedCity}`);
      if (res.data.success) setAvailableCars(res.data.cars.slice(0, 3));
    } catch (error) { console.error('Error fetching cars:', error); }
  };

  const monthlyData = [
    { month: 'Jan', rentals: 2, amount: 15000 }, { month: 'Feb', rentals: 3, amount: 25000 },
    { month: 'Mar', rentals: 1, amount: 8000 }, { month: 'Apr', rentals: 4, amount: 35000 },
    { month: 'May', rentals: 2, amount: 18000 }, { month: 'Jun', rentals: 3, amount: 28000 },
  ];
  const carTypeData = [
    { name: 'Sedan', value: 45, color: '#f97316' },
    { name: 'SUV', value: 30, color: '#3b82f6' },
    { name: 'Economy', value: 25, color: '#10b981' },
  ];

  const carIcon = (type) => type === 'SUV' ? '🚙' : type === 'Sedan' ? '🚗' : '🚘';
  const activeCityName = cities.find(c => c.code === selectedCity)?.name;

  if (loading) {
    return (
      <div style={{ ...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: T.muted }}>
          <p style={{ fontSize: '18px', fontWeight: '700' }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div style={S.heroBanner}>
        <div style={S.heroBg} />
        <div style={S.heroCopy}>
          <p style={S.heroEyebrow}>Welcome Back</p>
          <h1 style={S.heroH1}>Hello, {user?.name} 👋</h1>
          <p style={S.heroSub}>
            Your car rental journey with Pak Wheels. Track your rentals, manage bookings, and explore new rides.
          </p>
          <div style={S.heroActions}>
            <Link to="/cars" style={S.btnPrimary}>Book a Car →</Link>
            <Link to="/my-rentals" style={S.btnSecondary}>View History</Link>
          </div>
        </div>
        <div style={S.heroCard}>
          <div style={S.heroCardLabel}>Member Since</div>
          <div style={S.heroCardVal}>{new Date().getFullYear()}</div>
          <div style={S.heroCardSub}>✦ Premium Customer</div>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────── */}
      <div style={S.statsRow}>
        {[
          { label: 'Total Rentals', value: stats.totalRentals, sub: 'Lifetime bookings' },
          { label: 'Active Rentals', value: stats.activeRentals, sub: 'Currently ongoing', color: T.success },
          { label: 'Total Spent', value: `₨ ${stats.totalSpent.toLocaleString()}`, sub: 'All time spending' },
          { label: 'Days on Road', value: stats.totalDays, sub: 'Total rental days' },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statLabel}>{s.label}</div>
            <div style={{ ...S.statValue, color: s.color || T.text }}>{s.value}</div>
            <div style={S.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tab Bar ──────────────────────────────────────────────────── */}
      <div style={{ margin: '20px 24px 0' }}>
        <div style={S.tabBar}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'recommended', label: 'Recommended Cars' },
          ].map(t => (
            <button
              key={t.key}
              style={{ ...S.tab, ...(dashboardTab === t.key ? S.tabActive : {}) }}
              onClick={() => setDashboardTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview Tab ─────────────────────────────────────────────── */}
      {dashboardTab === 'overview' && (
        <div style={S.shell}>
          {/* Recent Rentals */}
          <div style={S.card}>
            <div style={S.sectionHdr}>
              <div>
                <p style={S.eyebrow}>Recent Activity</p>
                <h2 style={S.cardH2}>Your Recent Rentals</h2>
              </div>
              <Link to="/my-rentals" style={S.btnGhost}>View All →</Link>
            </div>

            {recentRentals.length === 0 ? (
              <div style={S.emptyState}>
                <span style={S.emptyIcon}>🚗</span>
                <p>No rentals yet. Start your first journey!</p>
                <Link to="/cars" style={{ ...S.btnPrimary, marginTop: '16px', display: 'inline-flex' }}>Browse Cars</Link>
              </div>
            ) : (
              recentRentals.map(rental => (
                <div key={rental.rental_id} style={S.historyItem}>
                  <div style={S.historyLeft}>
                    <span style={S.historyName}>{rental.car_name}</span>
                    <span style={S.historyMeta}>
                      📍 {rental.city} &nbsp;•&nbsp; 📅 {new Date(rental.pickup_date).toLocaleDateString()}
                      &nbsp;•&nbsp; {rental.total_days} days
                    </span>
                  </div>
                  <div style={S.historyRight}>
                    <span style={S.historyAmount}>₨ {rental.total_amount?.toLocaleString()}</span>
                    <span style={{ ...S.badge, ...(rental.status === 'active' ? S.badgeActive : S.badgeDone) }}>
                      {rental.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <p style={{ ...S.eyebrow, marginBottom: '16px' }}>Quick Actions</p>
            <div style={S.quickGrid}>
              {[
                { to: '/cars', icon: '🚗', title: 'Rent a Car', desc: 'Browse available cars and book your next ride', cta: 'Book Now →' },
                { to: '/my-rentals', icon: '📋', title: 'My Rentals', desc: 'View your booking history and active rentals', cta: 'View History →' },
                { to: '#', icon: '🎫', title: 'Special Offers', desc: 'Get 20% off on your next booking', cta: 'Use Code: WELCOME20' },
              ].map(q => (
                <Link key={q.title} to={q.to} style={S.quickCard}>
                  <span style={S.quickIcon}>{q.icon}</span>
                  <h3 style={S.quickTitle}>{q.title}</h3>
                  <p style={S.quickDesc}>{q.desc}</p>
                  <span style={S.quickCta}>{q.cta}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Analytics Tab ────────────────────────────────────────────── */}
      {dashboardTab === 'analytics' && (
        <div style={S.shell}>
          <div style={S.analyticsGrid}>
            <div style={S.card}>
              <p style={S.chartTitle}>Monthly Rentals</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d44" />
                  <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={S.tooltipStyle} />
                  <Bar dataKey="rentals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={S.card}>
              <p style={S.chartTitle}>Monthly Spending (₨)</p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d44" />
                  <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={S.tooltipStyle} />
                  <Line type="monotone" dataKey="amount" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: '#38bdf8', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={S.card}>
            <p style={S.chartTitle}>Car Type Preference</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={carTypeData}
                  cx="50%" cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90} dataKey="value"
                >
                  {carTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={S.tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Recommended Tab ──────────────────────────────────────────── */}
      {dashboardTab === 'recommended' && (
        <div style={S.shell}>
          <div style={S.card}>
            <p style={S.eyebrow}>Pickup City</p>
            <h2 style={{ ...S.cardH2, marginBottom: '20px' }}>Choose Your Location</h2>
            <div style={S.cityRow}>
              {cities.map(city => (
                <button
                  key={city.code}
                  style={{ ...S.cityBtn, ...(selectedCity === city.code ? S.cityBtnActive : {}) }}
                  onClick={() => setSelectedCity(city.code)}
                >
                  {city.icon} {city.name}
                </button>
              ))}
            </div>

            <p style={{ ...S.eyebrow, marginBottom: '16px' }}>Recommended in {activeCityName}</p>
            <div style={S.fleetGrid}>
              {availableCars.map(car => {
                const isRented = car.status === 'rented';
                const isMaint = car.status === 'maintenance' || car.status === 'unavailable';
                const isAvailable = !isRented && !isMaint;
                return (
                  <div key={car.car_id} style={S.fleetCard}>
                    <div style={S.fleetEmoji}>{carIcon(car.type)}</div>
                    {/* Status badge */}
                    <div style={{ marginBottom: '4px' }}>
                      {isRented && (
                        <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '100px', padding: '3px 10px',
                          background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                          <span style={{ ...S.statusDot, background: '#ef4444' }} />RENTED
                        </span>
                      )}
                      {isMaint && (
                        <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '100px', padding: '3px 10px',
                          background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
                          <span style={{ ...S.statusDot, background: '#f59e0b' }} />MAINTENANCE
                        </span>
                      )}
                      {isAvailable && (
                        <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '100px', padding: '3px 10px',
                          background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                          <span style={{ ...S.statusDot, background: '#10b981' }} />AVAILABLE
                        </span>
                      )}
                    </div>
                    <h3 style={S.fleetName}>{car.brand} {car.model}</h3>
                    <div style={{ fontSize: '13px', color: T.muted }}>
                      <div>📝 {car.type}</div>
                      <div>📍 {car.location}</div>
                    </div>
                    <div style={S.fleetPrice}>
                      ₨ {car.price_per_day.toLocaleString()}
                      <span style={{ fontSize: '13px', fontWeight: '400', color: T.muted }}>/day</span>
                    </div>
                    {isRented ? (
                      <div style={S.fleetBtnRented}>🚫 Already Booked</div>
                    ) : isMaint ? (
                      <div style={S.fleetBtnMaint}>🔧 Under Maintenance</div>
                    ) : (
                      <Link to={`/booking/${selectedCity}/${car.car_id}`} style={S.fleetBtn}>
                        Book Now →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
