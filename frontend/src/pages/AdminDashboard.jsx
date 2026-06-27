import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCar, FaUsers, FaExclamationTriangle, FaMapMarkerAlt, FaPlus, FaCheckCircle, FaTrash, FaEdit } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

/* ─── Tokens ───────────── */
const T = {
  bg: '#080d14',
  surface: 'rgba(255,255,255,0.03)',
  surfaceRaised: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.07)',
  borderActive: 'rgba(14,90,212,0.4)',
  text: '#e8edf5',
  muted: '#64748b',
  dim: '#94a3b8',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const S = {
  root: { fontFamily: "'Sora','DM Sans',sans-serif", background: T.bg, color: T.text, minHeight: '100vh' },
  p: { padding: '0 24px' },

  /* ── Header ── */
  header: {
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(14,90,212,0.18), rgba(6,182,212,0.07))',
    border: `1px solid ${T.borderActive}`,
    borderRadius: '20px',
    margin: '24px 24px 0',
    padding: '36px 44px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    overflow: 'hidden',
  },
  headerBg: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(ellipse 50% 80% at 90% 50%, rgba(14,90,212,0.12), transparent)',
    pointerEvents: 'none',
  },
  headerCopy: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  headerEyebrow: { fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: T.accent },
  headerH1: {
    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '800', letterSpacing: '-0.5px', margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, #93c5fd 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  headerSub: { fontSize: '14px', color: T.dim, lineHeight: '1.6', maxWidth: '500px' },
  headerActions: { position: 'relative', zIndex: 1, display: 'flex', gap: '12px', alignItems: 'center' },

  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'linear-gradient(135deg, #1a6fd8, #0ea5e9)',
    color: '#fff', border: 'none', borderRadius: '10px',
    padding: '11px 20px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(14,90,212,0.3)',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: T.surface, border: `1px solid ${T.border}`,
    color: T.dim, borderRadius: '10px',
    padding: '11px 20px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'transparent', border: `1px solid rgba(96,165,250,0.3)`,
    color: '#60a5fa', borderRadius: '10px',
    padding: '8px 16px', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer',
  },
  btnIcon: {
    background: 'none', border: 'none',
    cursor: 'pointer', padding: '6px', borderRadius: '6px',
    transition: 'background .15s',
  },

  /* ── Stats ── */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '14px',
    margin: '18px 24px 0',
  },
  statCard: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: '14px',
    padding: '20px 16px',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  statLabel: { fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: T.muted },
  statValue: { fontSize: '1.5rem', fontWeight: '800', color: T.text, letterSpacing: '-0.5px', marginTop: '2px' },

  /* ── Tabs ── */
  tabBar: {
    display: 'flex', gap: '2px',
    margin: '20px 24px 0',
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: '12px',
    padding: '5px',
    width: 'fit-content',
    overflowX: 'auto',
  },
  tab: {
    padding: '8px 18px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', border: 'none',
    background: 'transparent', color: T.muted,
    whiteSpace: 'nowrap', transition: 'all .2s',
  },
  tabActive: {
    background: 'rgba(14,90,212,0.2)',
    color: '#93c5fd',
    border: `1px solid rgba(14,90,212,0.3)`,
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: '#ef4444', color: '#fff',
    borderRadius: '100px', minWidth: '18px', height: '18px',
    fontSize: '10px', fontWeight: '800',
    padding: '0 5px', marginLeft: '4px',
  },

  /* ── Content ── */
  shell: { margin: '18px 24px 40px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: {
    background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: '16px', padding: '28px',
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  sectionHdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
  eyebrow: { fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: T.accent, marginBottom: '6px' },
  cardH2: { fontSize: '1.15rem', fontWeight: '700', color: T.text, margin: 0 },
  chartTitle: { fontSize: '14px', fontWeight: '700', color: T.dim, marginBottom: '20px' },
  tooltipStyle: { backgroundColor: '#0d1b31', borderColor: '#27456d', borderRadius: '8px', fontSize: '12px' },

  /* ── Table ── */
  tableWrap: { overflowX: 'auto', borderRadius: '12px', border: `1px solid ${T.border}` },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: {
    padding: '12px 16px', textAlign: 'left',
    background: 'rgba(14,90,212,0.07)',
    color: T.muted, fontWeight: '700',
    fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  td: { padding: '13px 16px', borderBottom: `1px solid ${T.border}`, verticalAlign: 'middle' },

  /* ── Status badges ── */
  badgeActive: { display: 'inline-block', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', fontWeight: '700' },
  badgePending: { display: 'inline-block', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', fontWeight: '700' },
  badgeDone: { display: 'inline-block', background: 'rgba(100,116,139,0.15)', color: '#64748b', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', fontWeight: '700' },
  badgeMaint: { display: 'inline-block', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', fontWeight: '700' },

  /* ── Alert cards ── */
  alertCard: {
    display: 'flex', alignItems: 'flex-start', gap: '14px',
    background: 'rgba(245,158,11,0.07)',
    border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: '12px', padding: '18px 20px',
    marginBottom: '12px',
  },

  /* ── Location cards ── */
  locGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' },
  locCard: {
    background: T.surfaceRaised,
    border: `1px solid ${T.border}`,
    borderRadius: '14px', padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '6px',
  },

  emptyState: { textAlign: 'center', padding: '60px 20px', color: T.muted },
  emptyIcon: { fontSize: '44px', marginBottom: '14px', display: 'block' },

  /* ── Modal ── */
  modalOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    background: '#0d1b2e',
    border: `1px solid ${T.borderActive}`,
    borderRadius: '20px', padding: '32px',
    maxWidth: '480px', width: '90%',
    maxHeight: '85vh', overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  modalH3: { fontSize: '1.1rem', fontWeight: '700', color: T.text, marginBottom: '8px' },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: '#0a0f1a', border: `1px solid ${T.border}`,
    borderRadius: '10px', padding: '11px 14px',
    fontSize: '14px', color: T.text,
    outline: 'none',
    colorScheme: 'dark',
  },
  modalActions: { display: 'flex', gap: '10px', marginTop: '8px' },
};

/* ─── Helper ────────────── */
const StatusBadge = ({ status }) => {
  if (status === 'active' || status === 'available') return <span style={S.badgeActive}>{status}</span>;
  if (status === 'completed') return <span style={S.badgeDone}>{status}</span>;
  if (status === 'maintenance') return <span style={S.badgeMaint}>{status}</span>;
  return <span style={S.badgePending}>{status}</span>;
};
const CAR_PHOTO_IDS = {
  toyota:   'photo-1621007947382-bb3c3994e3fb',
  honda:    'photo-1606664515524-ed2f786a0bd6',
  suzuki:   'photo-1549317661-bd32c8ce0db2',
  bmw:      'photo-1555215695-3004980ad54e',
  mercedes: 'photo-1618843479313-40f8afb4b4d8',
  audi:     'photo-1606016159991-dfe4f2746ad5',
  hyundai:  'photo-1605559424843-9e4c228bf1c2',
  kia:      'photo-1533473359331-0135ef1b58bf',
  nissan:   'photo-1544636331-e26879cd4d9b',
  daihatsu: 'photo-1471444928139-48c5bf5173f8',
  changan:  'photo-1502877338535-766e1452684a',
  mg:       'photo-1519641471654-76ce0107ad1b',
  suv:      'photo-1519641471654-76ce0107ad1b',
  luxury:   'photo-1555215695-3004980ad54e',
  economy:  'photo-1549317661-bd32c8ce0db2',
  sedan:    'photo-1621007947382-bb3c3994e3fb',
  hatchback:'photo-1471444928139-48c5bf5173f8',
};
const getCarImage = (brand, type) => {
  const b = brand?.toLowerCase().trim();
  const t = type?.toLowerCase().trim();
  const id = CAR_PHOTO_IDS[b] || CAR_PHOTO_IDS[t] || CAR_PHOTO_IDS['sedan'];
  return `https://images.unsplash.com/${id}?w=400&h=220&fit=crop&auto=format`;
};


/* ─── Component ─────────── */
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0, totalRentals: 0, activeRentals: 0,
    totalRevenue: 0, totalPenalties: 0, totalCustomers: 0,
    carsByCity: {}, rentalsByCity: {},
  });
  const [alerts, setAlerts] = useState([]);
  const [carLocations, setCarLocations] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showEditCarModal, setShowEditCarModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [fleetView, setFleetView] = useState('table');
  const [fleetCity, setFleetCity] = useState('lahore');
  const [newCar, setNewCar] = useState({
    city: 'lahore', brand: '', model: '', year: 2024,
    type: 'Sedan', price_per_day: 5000, plate: '', location: '', features: [],
  });

  /* ── Event listeners (unchanged from original) ── */
  useEffect(() => {
    const handleTabChange = (event) => {
      const tabName = event.detail;
      setActiveTab(tabName);
      setTimeout(() => {
        const sectionMap = { overview: 'admin-overview', alerts: 'admin-alerts', rentals: 'admin-rentals', cars: 'admin-cars', customers: 'admin-customers', locations: 'admin-locations' };
        const section = document.getElementById(sectionMap[tabName]);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    };
    window.addEventListener('adminTabChange', handleTabChange);
    return () => window.removeEventListener('adminTabChange', handleTabChange);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['overview', 'alerts', 'rentals', 'cars', 'customers', 'locations'].includes(tab)) {
      setActiveTab(tab);
      setTimeout(() => {
        const section = document.getElementById(`admin-${tab}`);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchAdminData(), fetchAlerts(), fetchCarLocations(), fetchRentals(), fetchCustomers(), fetchCars()]);
    setLoading(false);
  };

  const fetchAdminData = async () => {
    try { const res = await axios.get('/api/admin/stats'); setStats(res.data); }
    catch (error) { console.error('Error fetching stats:', error); }
  };
  const fetchAlerts = async () => {
    try { const res = await axios.get('/api/admin/alerts'); if (res.data.success) setAlerts(res.data.alerts); }
    catch (error) { console.error('Error fetching alerts:', error); }
  };
  const fetchCarLocations = async () => {
    try { const res = await axios.get('/api/admin/car-locations'); if (res.data.success) setCarLocations(res.data.carLocations); }
    catch (error) { console.error('Error fetching car locations:', error); }
  };
  const fetchRentals = async () => {
    try { const res = await axios.get('/api/admin/rentals'); if (res.data.success) setRentals(res.data.rentals); }
    catch (error) { console.error('Error fetching rentals:', error); }
  };
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/admin/customers');
      if (res.data.success) { setCustomers(res.data.customers || []); console.log('✅ Customers loaded:', res.data.customers?.length || 0); }
    } catch (error) { console.error('Error fetching customers:', error); toast.error('Failed to load customers'); setCustomers([]); }
  };
  const fetchCars = async () => {
    try { const res = await axios.get('/api/admin/cars'); if (res.data.success) setCars(res.data.cars); }
    catch (error) { console.error('Error fetching cars:', error); }
  };

  const handleUpdateRentalStatus = async (rentalId, status) => {
    try { await axios.put(`/api/admin/rentals/${rentalId}/status`, { status }); toast.success(`Rental status updated to ${status}`); fetchRentals(); fetchAdminData(); }
    catch (error) { toast.error('Error updating rental status'); }
  };
  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/cars', newCar);
      toast.success('Car added successfully');
      setShowAddCarModal(false);
      setNewCar({ city: 'lahore', brand: '', model: '', year: 2024, type: 'Sedan', price_per_day: 5000, plate: '', location: '', features: [] });
      fetchCars(); fetchAdminData();
    } catch (error) { toast.error('Error adding car'); }
  };
  const handleEditCar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        brand: selectedCar.brand,
        model: selectedCar.model,
        year: selectedCar.year,
        type: selectedCar.type,
        price_per_day: selectedCar.price_per_day,
        plate: selectedCar.plate,
        location: selectedCar.location,
        status: selectedCar.status,   // ← explicitly included
        city: selectedCar.city,
      };
      const res = await axios.put(`/api/admin/cars/${selectedCar.car_id}`, payload);
      if (res.data && res.data.success === false) {
        toast.error(res.data.message || 'Failed to update car');
        return;
      }
      toast.success('Car updated successfully');
      setShowEditCarModal(false); setSelectedCar(null);
      fetchCars(); fetchAdminData();
    } catch (error) {
      console.error('Edit car error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating car');
    }
  };
  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try { await axios.delete(`/api/admin/cars/${carId}`); toast.success('Car deleted successfully'); fetchCars(); fetchAdminData(); }
      catch (error) { toast.error('Error deleting car'); }
    }
  };

  const handleQuickStatusChange = async (car, newStatus) => {
    try {
      const payload = {
        brand: car.brand, model: car.model, year: car.year,
        type: car.type, price_per_day: car.price_per_day,
        plate: car.plate, location: car.location,
        city: car.city, status: newStatus,
      };
      await axios.put(`/api/admin/cars/${car.car_id}`, payload);
      toast.success(`${car.brand} ${car.model} → ${newStatus}`);
      fetchCars(); fetchAdminData();
    } catch (error) {
      console.error('Quick status error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  const chartData = Object.entries(stats.carsByCity).map(([city, count]) => ({
    name: city.charAt(0).toUpperCase() + city.slice(1),
    cars: count,
    rentals: stats.rentalsByCity[city] || 0,
  }));
  const COLORS = ['#3b82f6', '#38bdf8', '#10b981'];

  if (loading) {
    return (
      <div style={{ ...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: T.muted, fontSize: '16px', fontWeight: '700' }}>Loading admin dashboard…</p>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'alerts', label: `⚠️ Alerts`, count: alerts.length },
    { key: 'rentals', label: `🚗 Rentals`, count: rentals.length },
    { key: 'cars', label: `🚙 Fleet`, count: cars.length },
    { key: 'customers', label: `👥 Customers`, count: customers.length },
    { key: 'locations', label: '📍 Locations' },
  ];

  return (
    <div style={S.root}>
      {/* ── Header ─── */}
      <div style={S.header}>
        <div style={S.headerBg} />
        <div style={S.headerCopy}>
          <p style={S.headerEyebrow}>Admin Console</p>
          <h1 style={S.headerH1}>Welcome, {user?.name} 👑</h1>
          <p style={S.headerSub}>Manage your entire car rental fleet, track rentals, monitor customer activity, and handle penalties.</p>
        </div>
        <div style={S.headerActions}>
          <button onClick={() => setShowAddCarModal(true)} style={S.btnPrimary}><FaPlus /> Add New Car</button>
          <button onClick={fetchAllData} style={S.btnSecondary}>🔄 Refresh</button>
        </div>
      </div>

      {/* ── Stats Grid ─── */}
      <div style={S.statsGrid}>
        {[
          { label: 'Total Cars', value: stats.totalCars },
          { label: 'Total Rentals', value: stats.totalRentals },
          { label: 'Active Rentals', value: stats.activeRentals, color: T.success },
          { label: 'Total Revenue', value: `₨ ${stats.totalRevenue?.toLocaleString()}` },
          { label: 'Penalties', value: `₨ ${stats.totalPenalties?.toLocaleString()}`, color: T.warning },
          { label: 'Customers', value: stats.totalCustomers },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statLabel}>{s.label}</div>
            <div style={{ ...S.statValue, color: s.color || T.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tab Bar ── */}
      <div style={S.tabBar}>
        {tabs.map(t => (
          <button
            key={t.key}
            style={{ ...S.tab, ...(activeTab === t.key ? S.tabActive : {}) }}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
            {t.count > 0 && <span style={S.badge}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Overview ─ */}
      <div id="admin-overview" style={{ scrollMarginTop: '80px' }}>
        {activeTab === 'overview' && (
          <div style={S.shell}>
            <div style={S.twoCol}>
              <div style={S.card}>
                <p style={S.chartTitle}>Cars & Rentals by City</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d44" />
                    <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={S.tooltipStyle} />
                    <Bar dataKey="cars" fill="#3b82f6" name="Cars" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rentals" fill="#38bdf8" name="Rentals" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={S.card}>
                <p style={S.chartTitle}>Fleet Distribution</p>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={chartData} cx="50%" cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90} dataKey="cars"
                    >
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={S.tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.sectionHdr}>
                <div>
                  <p style={S.eyebrow}>Recent Activity</p>
                  <h2 style={S.cardH2}>Latest Rentals</h2>
                </div>
              </div>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {['ID', 'Customer', 'Car', 'City', 'Pickup', 'Return', 'Amount', 'Status', ''].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.slice(0, 8).map(rental => (
                      <tr key={rental.rental_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={S.td}><span style={{ color: T.muted }}>{rental.rental_id}</span></td>
                        <td style={S.td}><strong>{rental.customer_name}</strong></td>
                        <td style={S.td}>{rental.car_name}</td>
                        <td style={S.td}>{rental.city}</td>
                        <td style={S.td}>{new Date(rental.pickup_date).toLocaleDateString()}</td>
                        <td style={S.td}>{rental.return_date ? new Date(rental.return_date).toLocaleDateString() : '—'}</td>
                        <td style={S.td}><strong>₨ {rental.total_amount?.toLocaleString()}</strong></td>
                        <td style={S.td}><StatusBadge status={rental.status} /></td>
                        <td style={S.td}>
                          {rental.status === 'active' && (
                            <button onClick={() => handleUpdateRentalStatus(rental.rental_id, 'completed')} style={S.btnGhost}>
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Alerts ─── */}
      <div id="admin-alerts" style={{ scrollMarginTop: '80px' }}>
        {activeTab === 'alerts' && (
          <div style={S.shell}>
            <div style={S.card}>
              <div style={S.sectionHdr}>
                <div>
                  <p style={S.eyebrow}>System Alerts</p>
                  <h2 style={S.cardH2}>Active Alerts & Notifications</h2>
                </div>
              </div>
              {alerts.length === 0 ? (
                <div style={S.emptyState}>
                  <span style={S.emptyIcon}><FaCheckCircle color={T.success} /></span>
                  <p>All clear — no active alerts!</p>
                </div>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} style={S.alertCard}>
                    <FaExclamationTriangle style={{ color: T.warning, fontSize: '22px', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: T.warning, display: 'block', marginBottom: '4px' }}>{alert.type.toUpperCase()}</strong>
                      <p style={{ margin: '0 0 4px', color: T.text, fontSize: '14px' }}>{alert.message}</p>
                      <small style={{ color: T.muted }}>City: {alert.city}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Rentals ── */}
      <div id="admin-rentals" style={{ scrollMarginTop: '80px' }}>
        {activeTab === 'rentals' && (
          <div style={S.shell}>
            <div style={S.card}>
              <div style={S.sectionHdr}>
                <div>
                  <p style={S.eyebrow}>All Rentals</p>
                  <h2 style={S.cardH2}>Complete Rental History ({rentals.length})</h2>
                </div>
                <button onClick={fetchRentals} style={S.btnGhost}>🔄 Refresh</button>
              </div>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {['ID', 'Customer', 'Car', 'City', 'Pickup', 'Return', 'Amount', 'Penalty', 'Status'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map(rental => (
                      <tr key={rental.rental_id}>
                        <td style={S.td}><span style={{ color: T.muted }}>{rental.rental_id}</span></td>
                        <td style={S.td}><strong>{rental.customer_name}</strong></td>
                        <td style={S.td}>{rental.car_name}</td>
                        <td style={S.td}>{rental.city}</td>
                        <td style={S.td}>{new Date(rental.pickup_date).toLocaleDateString()}</td>
                        <td style={S.td}>{rental.return_date ? new Date(rental.return_date).toLocaleDateString() : '—'}</td>
                        <td style={S.td}>₨ {rental.total_amount?.toLocaleString()}</td>
                        <td style={S.td}>
                          {rental.penalty_amount > 0
                            ? <span style={{ color: T.warning, fontWeight: '700' }}>₨ {rental.penalty_amount}</span>
                            : <span style={{ color: T.muted }}>—</span>}
                        </td>
                        <td style={S.td}><StatusBadge status={rental.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Fleet ──── */}
      <div id="admin-cars" style={{ scrollMarginTop: '80px' }}>
        {activeTab === 'cars' && (
          <div style={S.shell}>
            {/* ── City-wise Card View ── */}
            <div style={S.card}>
              <div style={S.sectionHdr}>
                <div>
                  <p style={S.eyebrow}>Fleet by City</p>
                  <h2 style={S.cardH2}>Cars in Each Location</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setFleetView(fleetView === 'cards' ? 'table' : 'cards')}
                    style={S.btnGhost}
                  >
                    {fleetView === 'cards' ? '📋 Table View' : '🃏 Card View'}
                  </button>
                  <button onClick={() => setShowAddCarModal(true)} style={S.btnPrimary}><FaPlus /> Add Car</button>
                </div>
              </div>

              {/* City filter buttons */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {[
                  { code: 'lahore', name: 'Lahore', icon: '🏛️' },
                  { code: 'karachi', name: 'Karachi', icon: '🌊' },
                  { code: 'islamabad', name: 'Islamabad', icon: '🏔️' },
                  { code: 'all', name: 'All Cities', icon: '🗺️' },
                ].map(city => (
                  <button
                    key={city.code}
                    onClick={() => setFleetCity(city.code)}
                    style={{
                      padding: '9px 20px', borderRadius: '10px',
                      fontSize: '14px', fontWeight: '600',
                      cursor: 'pointer',
                      border: fleetCity === city.code ? `1px solid rgba(14,90,212,0.4)` : `1px solid ${T.border}`,
                      background: fleetCity === city.code ? 'rgba(14,90,212,0.15)' : T.surface,
                      color: fleetCity === city.code ? '#93c5fd' : T.dim,
                      transition: 'all .2s',
                    }}
                  >
                    {city.icon} {city.name}
                  </button>
                ))}
              </div>

              {fleetView === 'cards' ? (
                /* Card Grid View */
                (() => {
                  const filtered = fleetCity === 'all' ? cars : cars.filter(c => c.city === fleetCity);
                  const carIcon = (type) => type === 'SUV' ? '🚙' : type === 'Sedan' ? '🚗' : type === 'Luxury' ? '🏎️' : '🚘';
                  return filtered.length === 0 ? (
                    <div style={S.emptyState}>
                      <span style={S.emptyIcon}>🚗</span>
                      <p>No cars found in {fleetCity === 'all' ? 'fleet' : fleetCity}.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                      {filtered.map(car => (
                        <div key={car.car_id} style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: `1px solid ${T.border}`,
                          borderRadius: '16px', padding: '22px',
                          display: 'flex', flexDirection: 'column', gap: '10px',
                          textAlign: 'center',
                        }}>
                          <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '4px', background: '#0a1628' }}>
                            <img src={getCarImage(car.brand, car.type)} alt={`${car.brand} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </div>
                          <h3 style={{ fontSize: '15px', fontWeight: '700', color: T.text, margin: 0 }}>
                            {car.brand} {car.model}
                          </h3>
                          <div style={{ fontSize: '12px', color: T.muted, display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                            <div>📝 {car.type} &nbsp;•&nbsp; {car.year}</div>
                            <div>📍 {car.location}</div>
                            <div>🏙️ {car.city}</div>
                            <div>🔖 {car.plate}</div>
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#38bdf8' }}>
                            ₨ {car.price_per_day?.toLocaleString()}
                            <span style={{ fontSize: '12px', fontWeight: '400', color: T.muted }}>/day</span>
                          </div>
                          <StatusBadge status={car.status} />
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '4px' }}>
                            <button
                              onClick={() => { setSelectedCar(car); setShowEditCarModal(true); }}
                              style={{ ...S.btnGhost, padding: '7px 14px', fontSize: '12px' }}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.car_id)}
                              style={{ ...S.btnGhost, padding: '7px 14px', fontSize: '12px', color: T.danger, borderColor: 'rgba(239,68,68,0.3)' }}
                            >
                              <FaTrash /> Del
                            </button>
                          </div>
                          {car.status !== 'available' && (
                            <button
                              onClick={() => handleQuickStatusChange(car, 'available')}
                              style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', padding: '7px 14px', fontSize: '12px', color: T.success, borderColor: 'rgba(16,185,129,0.3)' }}
                            >
                              <FaCheckCircle /> Mark Available
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                /* Table View */
                (() => {
                  const filtered = fleetCity === 'all' ? cars : cars.filter(c => c.city === fleetCity);
                  return (
                    <div style={S.tableWrap}>
                      <table style={S.table}>
                        <thead>
                          <tr>
                            {['ID', 'Car', 'Year', 'Type', 'City', 'Price/Day', 'Plate', 'Location', 'Status', 'Actions'].map(h => (
                              <th key={h} style={S.th}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(car => (
                            <tr key={car.car_id}>
                              <td style={S.td}><span style={{ color: T.muted }}>{car.car_id}</span></td>
                              <td style={S.td}><strong>{car.brand} {car.model}</strong></td>
                              <td style={S.td}>{car.year}</td>
                              <td style={S.td}>{car.type}</td>
                              <td style={S.td}>{car.city}</td>
                              <td style={S.td}><strong>₨ {car.price_per_day?.toLocaleString()}</strong></td>
                              <td style={S.td}>{car.plate}</td>
                              <td style={S.td}>{car.location}</td>
                              <td style={S.td}><StatusBadge status={car.status} /></td>
                              <td style={S.td}>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                  <button onClick={() => { setSelectedCar(car); setShowEditCarModal(true); }} style={{ ...S.btnIcon, color: T.accent }}>
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDeleteCar(car.car_id)} style={{ ...S.btnIcon, color: T.danger }}>
                                    <FaTrash />
                                  </button>
                                  {car.status !== 'available' && (
                                    <button
                                      onClick={() => handleQuickStatusChange(car, 'available')}
                                      title="Mark as Available"
                                      style={{ ...S.btnIcon, color: T.success, fontSize: '13px', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '4px 8px' }}
                                    >
                                      <FaCheckCircle />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Customers  */}
      <div id="admin-customers" style={{ scrollMarginTop: '80px' }}>
        {activeTab === 'customers' && (
          <div style={S.shell}>
            <div style={S.card}>
              <div style={S.sectionHdr}>
                <div>
                  <p style={S.eyebrow}>Customer Management</p>
                  <h2 style={S.cardH2}>Registered Customers ({customers.length})</h2>
                </div>
                <button onClick={fetchCustomers} style={S.btnGhost}>🔄 Refresh</button>
              </div>
              {customers.length === 0 ? (
                <div style={S.emptyState}>
                  <span style={S.emptyIcon}><FaUsers style={{ color: T.muted, fontSize: '44px' }} /></span>
                  <p>No customers found in database.</p>
                  <button onClick={fetchCustomers} style={{ ...S.btnPrimary, marginTop: '16px' }}>Load Customers</button>
                </div>
              ) : (
                <div style={S.tableWrap}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        {['ID', 'Name', 'Email', 'Phone', 'CNIC', 'License', 'Rentals', 'Spent', 'Penalties'].map(h => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(customer => (
                        <tr key={customer.customer_id}>
                          <td style={S.td}><span style={{ color: T.muted }}>{customer.customer_id}</span></td>
                          <td style={S.td}><strong>{customer.name}</strong></td>
                          <td style={S.td}>{customer.email}</td>
                          <td style={S.td}>{customer.phone || '—'}</td>
                          <td style={S.td}>{customer.cnic || '—'}</td>
                          <td style={S.td}>{customer.driving_license || '—'}</td>
                          <td style={S.td}>{customer.total_rentals || 0}</td>
                          <td style={S.td}>₨ {(customer.total_spent || 0).toLocaleString()}</td>
                          <td style={S.td}>
                            {customer.penalty_amount > 0
                              ? <span style={{ color: T.warning, fontWeight: '700' }}>₨ {customer.penalty_amount}</span>
                              : <span style={{ color: T.muted }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Locations  */}
      <div id="admin-locations" style={{ scrollMarginTop: '80px' }}>
        {activeTab === 'locations' && (
          <div style={S.shell}>
            <div style={S.card}>
              <div style={S.sectionHdr}>
                <div>
                  <p style={S.eyebrow}>Live Tracking</p>
                  <h2 style={S.cardH2}>Car Locations & Status</h2>
                </div>
              </div>
              {carLocations.length === 0 ? (
                <div style={S.emptyState}>
                  <span style={S.emptyIcon}><FaMapMarkerAlt style={{ color: T.muted, fontSize: '44px' }} /></span>
                  <p>No cars currently rented out.</p>
                </div>
              ) : (
                <div style={S.locGrid}>
                  {carLocations.map(car => (
                    <div key={car.car_id} style={S.locCard}>
                      <span style={{ fontSize: '28px' }}>🚗</span>
                      <strong style={{ color: T.text }}>{car.car_name}</strong>
                      <p style={{ margin: 0, fontSize: '13px', color: T.muted }}>
                        <strong>City:</strong> {car.current_city}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: T.muted }}>
                        <strong>Location:</strong> {car.current_location}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: T.dim }}>
                        Returns: {car.rented_until ? new Date(car.rented_until).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Add Car Modal ─ */}
      {showAddCarModal && (
        <div style={S.modalOverlay} onClick={() => setShowAddCarModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h3 style={S.modalH3}>Add New Car</h3>
            <form onSubmit={handleAddCar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select value={newCar.city} onChange={e => setNewCar({ ...newCar, city: e.target.value })} style={S.input} required>
                <option value="lahore">Lahore</option>
                <option value="karachi">Karachi</option>
                <option value="islamabad">Islamabad</option>
              </select>
              <input type="text" placeholder="Brand" value={newCar.brand} onChange={e => setNewCar({ ...newCar, brand: e.target.value })} style={S.input} required />
              <input type="text" placeholder="Model" value={newCar.model} onChange={e => setNewCar({ ...newCar, model: e.target.value })} style={S.input} required />
              <input type="number" placeholder="Year" value={newCar.year} onChange={e => setNewCar({ ...newCar, year: parseInt(e.target.value) })} style={S.input} required />
              <select value={newCar.type} onChange={e => setNewCar({ ...newCar, type: e.target.value })} style={S.input}>
                <option>Economy</option><option>Sedan</option><option>SUV</option><option>Luxury</option>
              </select>
              <input type="number" placeholder="Price per Day" value={newCar.price_per_day} onChange={e => setNewCar({ ...newCar, price_per_day: parseInt(e.target.value) })} style={S.input} required />
              <input type="text" placeholder="Plate Number" value={newCar.plate} onChange={e => setNewCar({ ...newCar, plate: e.target.value })} style={S.input} required />
              <input type="text" placeholder="Location" value={newCar.location} onChange={e => setNewCar({ ...newCar, location: e.target.value })} style={S.input} required />
              <div style={S.modalActions}>
                <button type="submit" style={{ ...S.btnPrimary, flex: 1, justifyContent: 'center' }}>Add Car</button>
                <button type="button" onClick={() => setShowAddCarModal(false)} style={{ ...S.btnSecondary, flex: 1, justifyContent: 'center' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Car Modal  */}
      {showEditCarModal && selectedCar && (
        <div style={S.modalOverlay} onClick={() => setShowEditCarModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h3 style={S.modalH3}>Edit Car</h3>
            <form onSubmit={handleEditCar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Brand" value={selectedCar.brand} onChange={e => setSelectedCar({ ...selectedCar, brand: e.target.value })} style={S.input} required />
              <input type="text" placeholder="Model" value={selectedCar.model} onChange={e => setSelectedCar({ ...selectedCar, model: e.target.value })} style={S.input} required />
              <input type="number" placeholder="Year" value={selectedCar.year} onChange={e => setSelectedCar({ ...selectedCar, year: parseInt(e.target.value) })} style={S.input} required />
              <select value={selectedCar.type} onChange={e => setSelectedCar({ ...selectedCar, type: e.target.value })} style={S.input}>
                <option>Economy</option><option>Sedan</option><option>SUV</option><option>Luxury</option>
              </select>
              <input type="number" placeholder="Price per Day" value={selectedCar.price_per_day} onChange={e => setSelectedCar({ ...selectedCar, price_per_day: parseInt(e.target.value) })} style={S.input} required />
              <input type="text" placeholder="Plate Number" value={selectedCar.plate} onChange={e => setSelectedCar({ ...selectedCar, plate: e.target.value })} style={S.input} required />
              <input type="text" placeholder="Location" value={selectedCar.location} onChange={e => setSelectedCar({ ...selectedCar, location: e.target.value })} style={S.input} required />
              <select value={selectedCar.status} onChange={e => setSelectedCar({ ...selectedCar, status: e.target.value })} style={S.input}>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div style={S.modalActions}>
                <button type="submit" style={{ ...S.btnPrimary, flex: 1, justifyContent: 'center' }}>Update Car</button>
                <button type="button" onClick={() => setShowEditCarModal(false)} style={{ ...S.btnSecondary, flex: 1, justifyContent: 'center' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;