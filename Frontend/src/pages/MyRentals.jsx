import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCar, FaCalendar, FaMapMarker, FaRupeeSign, FaCheckCircle, FaClock, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const MyRentals = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [returnData, setReturnData] = useState({
    return_location: '',
    damage_description: '',
    damage_amount: 0
  });

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await axios.get('/api/rentals/my-rentals');
      if (res.data.success) {
        setRentals(res.data.rentals);
      }
    } catch (error) {
      toast.error('Error loading rentals');
    }
    setLoading(false);
  };

  const handleReturn = async () => {
    if (!returnData.return_location) {
      toast.error('Please select return location');
      return;
    }

    try {
      const res = await axios.post('/api/rentals/return', {
        rental_id: selectedRental.rental_id,
        return_location: returnData.return_location,
        damage_description: returnData.damage_description,
        damage_amount: returnData.damage_amount
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setShowReturnModal(false);
        setSelectedRental(null);
        setReturnData({ return_location: '', damage_description: '', damage_amount: 0 });
        fetchRentals();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error returning car');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <FaCheckCircle style={{ color: '#14c78c' }} />;
    if (status === 'active') return <FaSpinner className="animate-spin-slow" style={{ color: '#2ea6ff' }} />;
    return <FaClock style={{ color: '#f59e0b' }} />;
  };

  const getStatusClass = (status) => {
    if (status === 'completed') return 'muted';
    if (status === 'active') return 'success';
    return 'warning';
  };

  const getStatusLabel = (status) => {
    if (status === 'active') return 'ACTIVE';
    if (status === 'completed') return 'COMPLETED';
    return status?.toUpperCase();
  };

  if (loading) {
    return (
      <div className="page-frame">
        <div className="content-shell" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
          <p>Loading your rental history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-frame">
      <div className="content-shell">
        <div className="section-header">
          <div>
            <p className="eyebrow">My Rentals</p>
            <h2>Your Booking History</h2>
            <p className="muted">{rentals.length} rental{rentals.length !== 1 ? 's' : ''} found</p>
          </div>
          <button onClick={fetchRentals} className="ghost-button">Refresh</button>
        </div>

        {rentals.length === 0 ? (
          <div className="summary-card" style={{ textAlign: 'center', padding: '60px' }}>
            <FaCar style={{ fontSize: '48px', color: 'var(--muted)', marginBottom: '20px' }} />
            <h3>No Rentals Yet</h3>
            <p>You haven't made any bookings yet.</p>
            <a href="/cars" className="primary-button" style={{ display: 'inline-block', marginTop: '20px' }}>Browse Cars</a>
          </div>
        ) : (
          <div className="history-list">
            {rentals.map(rental => (
              <div key={rental.rental_id} className="history-card">
                <div className="history-card-top">
                  <div>
                    <strong>{rental.car_name}</strong>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>
                      {rental.city?.charAt(0).toUpperCase() + rental.city?.slice(1)}
                      {rental.status === 'active' && ' • 🟢 Currently Active'}
                      {rental.status === 'completed' && ' • ✅ Returned'}
                      {rental.status === 'pending' && ' • 🕐 Pending'}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusClass(rental.status)}`}>
                    {getStatusIcon(rental.status)} {getStatusLabel(rental.status)}
                  </span>
                </div>
                
                <div className="history-meta">
                  <span><FaCalendar /> Pickup: {new Date(rental.pickup_date).toLocaleDateString()}</span>
                  <span><FaCalendar /> Return: {new Date(rental.return_date).toLocaleDateString()}</span>
                  <span><FaMapMarker /> From: {rental.pickup_location}</span>
                  <span><FaMapMarker /> To: {rental.return_location}</span>
                  <span><FaRupeeSign /> Total: Rs {rental.total_amount?.toLocaleString()}</span>
                </div>
                
                {rental.penalty_amount > 0 && (
                  <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px' }}>
                    <FaExclamationTriangle style={{ color: '#f43f5e', marginRight: '8px' }} />
                    <span style={{ color: '#f43f5e' }}>Penalty Applied: Rs {rental.penalty_amount?.toLocaleString()}</span>
                  </div>
                )}
                
                {rental.status === 'active' && (
                  <div style={{ marginTop: '15px' }}>
                    <button 
                      className="primary-button" 
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                      onClick={() => {
                        setSelectedRental(rental);
                        setShowReturnModal(true);
                      }}
                    >
                      Return Car
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Return Modal */}
      {showReturnModal && selectedRental && (
        <div className="modal-overlay" onClick={() => setShowReturnModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px' }}>Return Car: {selectedRental.car_name}</h3>
            
            <div className="field-group">
              <label>Return Location *</label>
              <select
                value={returnData.return_location}
                onChange={(e) => setReturnData({ ...returnData, return_location: e.target.value })}
                className="input-control"
              >
                <option value="">Select return location</option>
                <option value={selectedRental.pickup_location}>{selectedRental.pickup_location}</option>
                <option value="Airport">Airport</option>
                <option value="City Center">City Center</option>
              </select>
            </div>
            
            <div className="field-group">
              <label>Damage Description (if any)</label>
              <textarea
                value={returnData.damage_description}
                onChange={(e) => setReturnData({ ...returnData, damage_description: e.target.value })}
                className="input-control"
                rows="3"
                placeholder="Describe any damage to the car..."
              />
            </div>
            
            <div className="field-group">
              <label>Damage Penalty Amount (Rs)</label>
              <input
                type="number"
                value={returnData.damage_amount}
                onChange={(e) => setReturnData({ ...returnData, damage_amount: parseInt(e.target.value) || 0 })}
                className="input-control"
                placeholder="0"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleReturn} className="primary-button">Confirm Return</button>
              <button onClick={() => setShowReturnModal(false)} className="ghost-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;