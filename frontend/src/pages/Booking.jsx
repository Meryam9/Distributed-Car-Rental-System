import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaShieldAlt } from 'react-icons/fa';

/* ── Payment step styles ─────────────────────────────────────────────────── */
const P = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px',
  },
  box: {
    background: '#0d1520',
    border: '1px solid rgba(14,90,212,0.4)',
    borderRadius: '20px',
    padding: '36px',
    width: '100%', maxWidth: '460px',
    display: 'flex', flexDirection: 'column', gap: '22px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  title: { fontSize: '1.25rem', fontWeight: '800', color: '#e8edf5', margin: 0 },
  sub: { fontSize: '13px', color: '#64748b', margin: '4px 0 0' },
  choiceRow: { display: 'flex', gap: '14px' },
  choice: {
    flex: 1, padding: '20px 16px', borderRadius: '14px', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    fontSize: '14px', fontWeight: '600', color: '#94a3b8',
    transition: 'all .2s', textAlign: 'center',
  },
  choiceActive: {
    border: '1px solid rgba(14,90,212,0.55)',
    background: 'rgba(14,90,212,0.12)', color: '#93c5fd',
  },
  choiceEmoji: { fontSize: '30px' },
  choiceHint: { fontSize: '11px', color: '#475569', fontWeight: '400', lineHeight: '1.4' },
  label: {
    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
    textTransform: 'uppercase', color: '#64748b', marginBottom: '6px', display: 'block',
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px',
    padding: '12px 14px', color: '#e8edf5', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  actions: { display: 'flex', gap: '12px', marginTop: '4px' },
  btnBack: {
    flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer',
    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
    color: '#64748b', fontSize: '14px', fontWeight: '600',
  },
  btnNext: {
    flex: 2, padding: '12px', borderRadius: '10px', cursor: 'pointer',
    background: 'linear-gradient(135deg, #1a6fd8, #0ea5e9)',
    border: 'none', color: '#fff', fontSize: '14px', fontWeight: '700',
    boxShadow: '0 4px 16px rgba(14,90,212,0.35)',
  },
  btnNextDisabled: { opacity: 0.45, cursor: 'not-allowed' },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '14px', padding: '6px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  summaryKey: { color: '#64748b' },
  summaryVal: { color: '#e8edf5', fontWeight: '600' },
  cashNote: {
    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '10px', padding: '14px 16px',
    fontSize: '13px', color: '#6ee7b7', lineHeight: '1.6',
  },
};

const Booking = () => {
  const { city, carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    pickup_date: '', return_date: '',
    pickup_location: '', return_location: '',
  });

  /* ── Payment modal state ── */
  const [payModal, setPayModal] = useState(false);   // open/close
  const [payStep, setPayStep] = useState('choose');  // 'choose' | 'card' | 'confirm'
  const [payMethod, setPayMethod] = useState('cash');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  useEffect(() => {
    fetchCar();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter  = new Date(); dayAfter.setDate(dayAfter.getDate() + 3);
    setBookingData(prev => ({
      ...prev,
      pickup_date: tomorrow.toISOString().slice(0, 16),
      return_date: dayAfter.toISOString().slice(0, 16),
    }));
  }, [city, carId]);

  const fetchCar = async () => {
    try {
      const res = await axios.get(`/api/cars/${city}`);
      if (res.data.success) {
        const found = res.data.cars.find(c => c.car_id === carId);
        if (found) setCar(found);
        else { toast.error('Car not found'); navigate('/cars'); }
      }
    } catch { toast.error('Error loading car details'); navigate('/cars'); }
    setLoading(false);
  };

  const calcDays = () => {
    if (!bookingData.pickup_date || !bookingData.return_date) return 1;
    const d = Math.ceil((new Date(bookingData.return_date) - new Date(bookingData.pickup_date)) / 86400000);
    return Math.max(1, d);
  };
  const calcTotal = () => (car ? calcDays() * car.price_per_day : 0);

  /* ── Step 1: validate form → open modal ── */
  const handleFormNext = (e) => {
    e.preventDefault();
    if (!bookingData.pickup_location || !bookingData.return_location) {
      toast.error('Please select pickup and return locations');
      return;
    }
    setPayStep('choose');
    setPayMethod('cash');
    setCard({ number: '', name: '', expiry: '', cvv: '' });
    setPayModal(true);
  };

  /* ── Final submit ── */
  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post('/api/rentals/create', {
        car_id: car.car_id, city,
        pickup_date: bookingData.pickup_date,
        return_date: bookingData.return_date,
        pickup_location: bookingData.pickup_location,
        return_location: bookingData.return_location,
        total_amount: calcTotal(),
        total_days: calcDays(),
        payment_method: payMethod,
        ...(payMethod === 'card' && { card_last4: card.number.replace(/\s/g, '').slice(-4) }),
      });
      if (res.data.success) {
        toast.success(`Booking confirmed! ID: ${res.data.rental_id}`);
        navigate('/my-rentals');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Car may no longer be available.');
    }
    setSubmitting(false);
    setPayModal(false);
  };

  const cardValid = card.number.replace(/\s/g, '').length === 16 && card.name.trim() && card.expiry.length === 5 && card.cvv.length === 3;

  if (loading && !car) {
    return (
      <div className="page-frame">
        <div className="content-shell" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  const days = calcDays();
  const total = calcTotal();

  return (
    <div className="page-frame">
      <div className="booking-layout">

        {/* ── Left: Car Details + Form ─────────────────────────────── */}
        <div className="form-card">
          <p className="eyebrow">Review Your Booking</p>
          <h2 style={{ marginBottom: '20px' }}>Complete Your Reservation</h2>

          <div className="summary-card" style={{ marginBottom: '25px' }}>
            <h3 style={{ marginBottom: '15px' }}>🚗 Car Details</h3>
            <p><strong>Model:</strong> {car?.brand} {car?.model} ({car?.year})</p>
            <p><strong>Type:</strong> {car?.type}</p>
            <p><strong>Pickup City:</strong> {city?.charAt(0).toUpperCase() + city?.slice(1)}</p>
            <p><strong>Daily Rate:</strong> Rs {car?.price_per_day?.toLocaleString()}</p>
            <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(46,166,255,0.1)', borderRadius: '8px' }}>
              <small><FaShieldAlt /> Full insurance coverage included</small>
            </div>
          </div>

          <form onSubmit={handleFormNext}>
            <div className="field-group">
              <label>📅 Pickup Date & Time *</label>
              <input type="datetime-local" value={bookingData.pickup_date}
                onChange={e => setBookingData({ ...bookingData, pickup_date: e.target.value })}
                className="input-control" required />
            </div>
            <div className="field-group">
              <label>📅 Return Date & Time *</label>
              <input type="datetime-local" value={bookingData.return_date}
                onChange={e => setBookingData({ ...bookingData, return_date: e.target.value })}
                className="input-control" required />
            </div>
            <div className="field-group">
              <label>📍 Pickup Location *</label>
              <select value={bookingData.pickup_location}
                onChange={e => setBookingData({ ...bookingData, pickup_location: e.target.value })}
                className="input-control" required>
                <option value="">Select pickup location</option>
                <option value={car?.location}>{car?.location}</option>
                <option value="City Center">City Center</option>
                <option value="Airport">Airport</option>
              </select>
            </div>
            <div className="field-group">
              <label>📍 Return Location *</label>
              <select value={bookingData.return_location}
                onChange={e => setBookingData({ ...bookingData, return_location: e.target.value })}
                className="input-control" required>
                <option value="">Select return location</option>
                <option value={car?.location}>{car?.location}</option>
                <option value="City Center">City Center</option>
                <option value="Airport">Airport</option>
              </select>
            </div>

            <button type="submit" className="submit-button">
              Proceed to Payment → Rs {total.toLocaleString()}
            </button>
          </form>
        </div>

        {/* ── Right: Price Summary ─────────────────────────────────── */}
        <aside className="summary-card">
          <p className="eyebrow">Trip Summary</p>
          <h3>{car?.brand} {car?.model}</h3>
          <hr />
          <div style={{ marginTop: '15px' }}>
            <p><strong>📅 Rental Period:</strong></p>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
              {bookingData.pickup_date ? new Date(bookingData.pickup_date).toLocaleString() : 'Select date'} –{' '}
              {bookingData.return_date  ? new Date(bookingData.return_date).toLocaleString()  : 'Select date'}
            </p>
          </div>
          <div style={{ marginTop: '15px' }}>
            <p><strong>💰 Price Breakdown:</strong></p>
            {[
              ['Daily Rate', `Rs ${car?.price_per_day?.toLocaleString()}`],
              ['Number of Days', `${days} day${days > 1 ? 's' : ''}`],
              ['Subtotal', `Rs ${total.toLocaleString()}`],
              ['Insurance', '✅ Included'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{k}:</span><span>{v}</span>
              </div>
            ))}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
              <span>Total:</span>
              <span style={{ color: '#7dd3fc' }}>Rs {total.toLocaleString()}</span>
            </div>
          </div>
          <hr />
          <div style={{ marginTop: '15px' }}>
            <p><strong>📋 Important Info:</strong></p>
            <ul style={{ fontSize: '12px', color: 'var(--muted)', paddingLeft: '20px' }}>
              <li>Valid driving license required</li>
              <li>Security deposit refundable on return</li>
              <li>Free cancellation up to 24 hours before</li>
              <li>Damage penalty applies as per policy</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ════════════════════════════════════════════════════════════
          Payment Modal
      ════════════════════════════════════════════════════════════ */}
      {payModal && (
        <div style={P.overlay} onClick={() => setPayModal(false)}>
          <div style={P.box} onClick={e => e.stopPropagation()}>

            {/* ── Step 1: Choose method ── */}
            {payStep === 'choose' && (
              <>
                <div>
                  <h2 style={P.title}>How would you like to pay?</h2>
                  <p style={P.sub}>{car?.brand} {car?.model} · Rs {total.toLocaleString()} · {days} day{days > 1 ? 's' : ''}</p>
                </div>
                <div style={P.choiceRow}>
                  <div style={{ ...P.choice, ...(payMethod === 'cash' ? P.choiceActive : {}) }}
                    onClick={() => setPayMethod('cash')}>
                    <span style={P.choiceEmoji}>💵</span>
                    <span>Cash on Site</span>
                    <span style={P.choiceHint}>Pay in cash when you pick up the car</span>
                  </div>
                  <div style={{ ...P.choice, ...(payMethod === 'card' ? P.choiceActive : {}) }}
                    onClick={() => setPayMethod('card')}>
                    <span style={P.choiceEmoji}>💳</span>
                    <span>Credit Card</span>
                    <span style={P.choiceHint}>Pay now securely with your card</span>
                  </div>
                </div>
                <div style={P.actions}>
                  <button style={P.btnBack} onClick={() => setPayModal(false)}>Cancel</button>
                  <button style={P.btnNext} onClick={() => setPayStep(payMethod === 'card' ? 'card' : 'confirm')}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* ── Step 2: Card details ── */}
            {payStep === 'card' && (
              <>
                <div>
                  <h2 style={P.title}>Enter Card Details</h2>
                  <p style={P.sub}>Your payment information is secure and encrypted</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={P.label}>Card Number</label>
                    <input style={P.input} placeholder="1234 5678 9012 3456" maxLength={19}
                      value={card.number}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setCard(c => ({ ...c, number: v.replace(/(.{4})/g, '$1 ').trim() }));
                      }} />
                  </div>
                  <div>
                    <label style={P.label}>Cardholder Name</label>
                    <input style={P.input} placeholder="Ahmed Khan"
                      value={card.name}
                      onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                  </div>
                  <div style={P.inputRow}>
                    <div>
                      <label style={P.label}>Expiry (MM/YY)</label>
                      <input style={P.input} placeholder="06/28" maxLength={5}
                        value={card.expiry}
                        onChange={e => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                          setCard(c => ({ ...c, expiry: v }));
                        }} />
                    </div>
                    <div>
                      <label style={P.label}>CVV</label>
                      <input style={P.input} placeholder="•••" maxLength={3} type="password"
                        value={card.cvv}
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))} />
                    </div>
                  </div>
                </div>
                <div style={P.actions}>
                  <button style={P.btnBack} onClick={() => setPayStep('choose')}>← Back</button>
                  <button
                    style={{ ...P.btnNext, ...(cardValid ? {} : P.btnNextDisabled) }}
                    onClick={() => cardValid && setPayStep('confirm')}
                  >
                    Review Booking →
                  </button>
                </div>
              </>
            )}

            {/* ── Step 3: Confirm ── */}
            {payStep === 'confirm' && (
              <>
                <div>
                  <h2 style={P.title}>Confirm Your Booking</h2>
                  <p style={P.sub}>Review everything before confirming</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {[
                    ['Car',      `${car?.brand} ${car?.model} (${car?.year})`],
                    ['City',     city?.charAt(0).toUpperCase() + city?.slice(1)],
                    ['Pickup',   bookingData.pickup_location],
                    ['Return',   bookingData.return_location],
                    ['Duration', `${days} day${days > 1 ? 's' : ''}`],
                    ['Total',    `Rs ${total.toLocaleString()}`],
                    ['Payment',  payMethod === 'cash' ? '💵 Cash on Site' : `💳 Card ending ···· ${card.number.replace(/\s/g,'').slice(-4)}`],
                  ].map(([k, v]) => (
                    <div key={k} style={P.summaryRow}>
                      <span style={P.summaryKey}>{k}</span>
                      <span style={{ ...P.summaryVal, color: k === 'Total' ? '#7dd3fc' : '#e8edf5' }}>{v}</span>
                    </div>
                  ))}
                </div>
                {payMethod === 'cash' && (
                  <div style={P.cashNote}>
                    💵 <strong>Cash Payment:</strong> Please bring <strong>Rs {total.toLocaleString()}</strong> in cash when you arrive to pick up the car. Your booking is reserved — payment is collected on site.
                  </div>
                )}
                <div style={P.actions}>
                  <button style={P.btnBack} onClick={() => setPayStep(payMethod === 'card' ? 'card' : 'choose')}>← Back</button>
                  <button style={{ ...P.btnNext, opacity: submitting ? 0.6 : 1 }}
                    onClick={!submitting ? handleConfirm : undefined}>
                    {submitting ? 'Confirming…' : '✓ Confirm Booking'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
