import React, { useState, useEffect } from 'react';
import { createBooking } from '../services/api';

/* ── Payment modal styles ────────────────────────────────────────────────── */
const P = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
  },
  box: {
    background: '#0d1520', border: '1px solid rgba(14,90,212,0.4)',
    borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '460px',
    display: 'flex', flexDirection: 'column', gap: '22px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  title: { fontSize: '1.25rem', fontWeight: '800', color: '#e8edf5', margin: 0 },
  sub: { fontSize: '13px', color: '#64748b', margin: '4px 0 0' },
  choiceRow: { display: 'flex', gap: '14px' },
  choice: {
    flex: 1, padding: '20px 16px', borderRadius: '14px', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    fontSize: '14px', fontWeight: '600', color: '#94a3b8', transition: 'all .2s', textAlign: 'center',
  },
  choiceActive: { border: '1px solid rgba(14,90,212,0.55)', background: 'rgba(14,90,212,0.12)', color: '#93c5fd' },
  choiceHint: { fontSize: '11px', color: '#475569', fontWeight: '400', lineHeight: '1.4' },
  label: { fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px', display: 'block' },
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
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', fontSize: '14px',
    padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  cashNote: {
    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#6ee7b7', lineHeight: '1.6',
  },
  unavailBox: {
    textAlign: 'center', padding: '40px 20px',
    background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '14px', color: '#f87171',
  },
  maintBox: {
    textAlign: 'center', padding: '40px 20px',
    background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: '14px', color: '#fbbf24',
  },
};

const BookingForm = ({ car, customerId, onBookingComplete }) => {
  const [pickupDate,  setPickupDate]  = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [totalDays,   setTotalDays]   = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [submitting,  setSubmitting]  = useState(false);

  /* ── Payment modal state ── */
  const [payModal,  setPayModal]  = useState(false);
  const [payStep,   setPayStep]   = useState('choose');
  const [payMethod, setPayMethod] = useState('cash');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  useEffect(() => {
    if (pickupDate && dropoffDate && car) {
      const days = Math.max(1, Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / 86400000));
      setTotalDays(days);
      setTotalAmount(days * car.rate_per_day);
    }
  }, [pickupDate, dropoffDate, car]);

  /* ── Car status checks ── */
  const isRented      = car?.status === 'rented';
  const isMaintenance = car?.status === 'maintenance' || car?.status === 'unavailable';
  const isAvailable   = !isRented && !isMaintenance;

  /* Step 1: validate → open modal */
  const handleFormNext = (e) => {
    e.preventDefault();
    if (!pickupDate || !dropoffDate) { alert('Please select both pickup and dropoff dates'); return; }
    setPayStep('choose'); setPayMethod('cash');
    setCard({ number: '', name: '', expiry: '', cvv: '' });
    setPayModal(true);
  };

  /* Final submit */
  const handleConfirm = async () => {
    setSubmitting(true);
    const result = await createBooking({
      customer_id:  customerId,
      car_id:       car.car_id,
      pickup_city:  car.city_location.toLowerCase(),
      pickup_date:  new Date(pickupDate),
      dropoff_date: new Date(dropoffDate),
      total_amount: totalAmount,
      payment_method: payMethod,
      ...(payMethod === 'card' && { card_last4: card.number.replace(/\s/g, '').slice(-4) }),
    });
    if (result.success) {
      alert(`✅ Booking confirmed! Rental ID: ${result.rental_id}`);
      onBookingComplete();
    } else {
      alert(`❌ Booking failed: ${result.error}`);
    }
    setSubmitting(false);
    setPayModal(false);
  };

  const cardValid = card.number.replace(/\s/g,'').length === 16 && card.name.trim() && card.expiry.length === 5 && card.cvv.length === 3;

  if (!car) return <div>Loading...</div>;

  return (
    <div className="booking-layout">

      {/* ── Left: Form ────────────────────────────────────────────── */}
      <div className="form-card">
        <p className="eyebrow">Booking Form</p>
        <h2 style={{ marginBottom: '20px' }}>Complete Your Booking</h2>

        {/* Car details — no Security Deposit line */}
        <div className="summary-card" style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '15px' }}>Car Details</h3>
          <p><strong>Model:</strong> {car.brand} {car.model}</p>
          <p><strong>Type:</strong> {car.type}</p>
          <p><strong>Pickup City:</strong> {car.city_location}</p>
          <p><strong>Daily Rate:</strong> Rs {car.rate_per_day.toLocaleString()}</p>

          {/* Availability status banner */}
          {isRented && (
            <div style={{ marginTop: '14px', padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#f87171', fontWeight: '700', fontSize: '14px' }}>
              🚫 This car is currently booked and unavailable
            </div>
          )}
          {isMaintenance && (
            <div style={{ marginTop: '14px', padding: '12px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', color: '#fbbf24', fontWeight: '700', fontSize: '14px' }}>
              🔧 This car is under maintenance and unavailable
            </div>
          )}
          {isAvailable && (
            <div style={{ marginTop: '14px', padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', color: '#6ee7b7', fontWeight: '700', fontSize: '14px' }}>
              ✅ Available for booking
            </div>
          )}
        </div>

        {/* Only show form if car is available */}
        {!isAvailable ? (
          <div style={isRented ? P.unavailBox : P.maintBox}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{isRented ? '🚫' : '🔧'}</div>
            <h3 style={{ margin: '0 0 8px' }}>{isRented ? 'Car Already Booked' : 'Under Maintenance'}</h3>
            <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
              {isRented ? 'This car is currently rented. Please choose another car.' : 'This car is being serviced. Please choose another car.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormNext} className="form-stack">
            <div className="field-group">
              <label>Pickup Date & Time</label>
              <input type="datetime-local" value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                className="input-control" required />
            </div>
            <div className="field-group">
              <label>Dropoff Date & Time</label>
              <input type="datetime-local" value={dropoffDate}
                onChange={e => setDropoffDate(e.target.value)}
                className="input-control" required />
            </div>

            {totalDays > 0 && (
              <div className="summary-card">
                <h3>💰 Price Summary</h3>
                {[
                  ['Rental Days', `${totalDays} day${totalDays > 1 ? 's' : ''}`],
                  ['Daily Rate',  `Rs ${car.rate_per_day.toLocaleString()}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>{k}:</span><strong>{v}</strong>
                  </div>
                ))}
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span style={{ color: '#7dd3fc' }}>Rs {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button type="submit" className="submit-button">
              Proceed to Payment →
            </button>
          </form>
        )}
      </div>

      {/* ── Right: Summary ────────────────────────────────────────── */}
      <aside className="summary-card">
        <p className="eyebrow">Trip Overview</p>
        <h3>{car.brand} {car.model}</h3>
        <p><strong>Type:</strong> {car.type}</p>
        <p><strong>Pickup City:</strong> {car.city_location}</p>
        <p><strong>Daily Rate:</strong> Rs {car.rate_per_day.toLocaleString()}</p>
        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Use the left panel to finalize dates and total price.</p>
        {totalDays > 0 && (
          <>
            <hr />
            <p><strong>Total days:</strong> {totalDays}</p>
            <p><strong>Grand total:</strong> Rs {totalAmount.toLocaleString()}</p>
          </>
        )}
      </aside>

      {/* ════════════════════ Payment Modal ════════════════════════ */}
      {payModal && (
        <div style={P.overlay} onClick={() => setPayModal(false)}>
          <div style={P.box} onClick={e => e.stopPropagation()}>

            {/* Step 1: Choose method */}
            {payStep === 'choose' && (
              <>
                <div>
                  <h2 style={P.title}>How would you like to pay?</h2>
                  <p style={P.sub}>{car.brand} {car.model} · Rs {totalAmount.toLocaleString()} · {totalDays} day{totalDays > 1 ? 's' : ''}</p>
                </div>
                <div style={P.choiceRow}>
                  <div style={{ ...P.choice, ...(payMethod === 'cash' ? P.choiceActive : {}) }} onClick={() => setPayMethod('cash')}>
                    <span style={{ fontSize: '30px' }}>💵</span>
                    <span>Cash on Site</span>
                    <span style={P.choiceHint}>Pay in cash when you pick up the car</span>
                  </div>
                  <div style={{ ...P.choice, ...(payMethod === 'card' ? P.choiceActive : {}) }} onClick={() => setPayMethod('card')}>
                    <span style={{ fontSize: '30px' }}>💳</span>
                    <span>Credit Card</span>
                    <span style={P.choiceHint}>Pay now securely with your card</span>
                  </div>
                </div>
                <div style={P.actions}>
                  <button style={P.btnBack} onClick={() => setPayModal(false)}>Cancel</button>
                  <button style={P.btnNext} onClick={() => setPayStep(payMethod === 'card' ? 'card' : 'confirm')}>Continue →</button>
                </div>
              </>
            )}

            {/* Step 2: Card details */}
            {payStep === 'card' && (
              <>
                <div>
                  <h2 style={P.title}>Enter Card Details</h2>
                  <p style={P.sub}>Your payment is secure and encrypted</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={P.label}>Card Number</label>
                    <input style={P.input} placeholder="1234 5678 9012 3456" maxLength={19} value={card.number}
                      onChange={e => { const v = e.target.value.replace(/\D/g,'').slice(0,16); setCard(c => ({ ...c, number: v.replace(/(.{4})/g,'$1 ').trim() })); }} />
                  </div>
                  <div>
                    <label style={P.label}>Cardholder Name</label>
                    <input style={P.input} placeholder="Ahmed Khan" value={card.name}
                      onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                  </div>
                  <div style={P.inputRow}>
                    <div>
                      <label style={P.label}>Expiry (MM/YY)</label>
                      <input style={P.input} placeholder="06/28" maxLength={5} value={card.expiry}
                        onChange={e => { let v = e.target.value.replace(/\D/g,'').slice(0,4); if (v.length >= 3) v = v.slice(0,2)+'/'+v.slice(2); setCard(c => ({ ...c, expiry: v })); }} />
                    </div>
                    <div>
                      <label style={P.label}>CVV</label>
                      <input style={P.input} placeholder="•••" maxLength={3} type="password" value={card.cvv}
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,'').slice(0,3) }))} />
                    </div>
                  </div>
                </div>
                <div style={P.actions}>
                  <button style={P.btnBack} onClick={() => setPayStep('choose')}>← Back</button>
                  <button style={{ ...P.btnNext, opacity: cardValid ? 1 : 0.45, cursor: cardValid ? 'pointer' : 'not-allowed' }}
                    onClick={() => cardValid && setPayStep('confirm')}>Review Booking →</button>
                </div>
              </>
            )}

            {/* Step 3: Confirm */}
            {payStep === 'confirm' && (
              <>
                <div>
                  <h2 style={P.title}>Confirm Your Booking</h2>
                  <p style={P.sub}>Review before confirming</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {[
                    ['Car',      `${car.brand} ${car.model}`],
                    ['City',     car.city_location],
                    ['Duration', `${totalDays} day${totalDays > 1 ? 's' : ''}`],
                    ['Total',    `Rs ${totalAmount.toLocaleString()}`],
                    ['Payment',  payMethod === 'cash' ? '💵 Cash on Site' : `💳 Card ···· ${card.number.replace(/\s/g,'').slice(-4)}`],
                  ].map(([k, v]) => (
                    <div key={k} style={P.summaryRow}>
                      <span style={{ color: '#64748b' }}>{k}</span>
                      <span style={{ color: k === 'Total' ? '#7dd3fc' : '#e8edf5', fontWeight: '600' }}>{v}</span>
                    </div>
                  ))}
                </div>
                {payMethod === 'cash' && (
                  <div style={P.cashNote}>
                    💵 <strong>Cash Payment:</strong> Bring <strong>Rs {totalAmount.toLocaleString()}</strong> in cash at pickup. Your booking is reserved — payment collected on site.
                  </div>
                )}
                <div style={P.actions}>
                  <button style={P.btnBack} onClick={() => setPayStep(payMethod === 'card' ? 'card' : 'choose')}>← Back</button>
                  <button style={{ ...P.btnNext, opacity: submitting ? 0.6 : 1 }} onClick={!submitting ? handleConfirm : undefined}>
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

export default BookingForm;
