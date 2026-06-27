import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';


// Specific Unsplash photo IDs — actual car photos, always load, free, no key needed
const CAR_PHOTO_IDS = {
  toyota:   'photo-1621007947382-bb3c3994e3fb',  // Toyota Corolla white
  honda:    'photo-1606664515524-ed2f786a0bd6',  // Honda Civic
  suzuki:   'photo-1549317661-bd32c8ce0db2',      // small hatchback
  bmw:      'photo-1555215695-3004980ad54e',      // BMW blue
  mercedes: 'photo-1618843479313-40f8afb4b4d8',  // Mercedes white
  audi:     'photo-1606016159991-dfe4f2746ad5',  // Audi
  hyundai:  'photo-1605559424843-9e4c228bf1c2',  // Hyundai Tucson
  kia:      'photo-1533473359331-0135ef1b58bf',  // car road
  nissan:   'photo-1544636331-e26879cd4d9b',      // silver sedan
  daihatsu: 'photo-1471444928139-48c5bf5173f8',  // economy car
  changan:  'photo-1502877338535-766e1452684a',  // sedan city
  mg:       'photo-1519641471654-76ce0107ad1b',  // SUV
  // type fallbacks
  suv:      'photo-1519641471654-76ce0107ad1b',
  luxury:   'photo-1555215695-3004980ad54e',
  economy:  'photo-1549317661-bd32c8ce0db2',
  sedan:    'photo-1621007947382-bb3c3994e3fb',
  hatchback:'photo-1471444928139-48c5bf5173f8',
  hybrid:   'photo-1606664515524-ed2f786a0bd6',
};

const getCarImage = (brand, type) => {
  const b = brand?.toLowerCase().trim();
  const t = type?.toLowerCase().trim();
  const photoId = CAR_PHOTO_IDS[b] || CAR_PHOTO_IDS[t] || CAR_PHOTO_IDS['sedan'];
  return `https://images.unsplash.com/${photoId}?w=640&h=360&fit=crop&auto=format`;
};

const CarImage = ({ brand, model, type }) => (
  <div style={{ width: '100%', height: '150px', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px', background: '#0a1628' }}>
    <img
      src={getCarImage(brand, type)}
      alt={`${brand} ${model}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  </div>
);

const Cars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('lahore');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ carType: '', minPrice: '', maxPrice: '' });

  const cities = [
    { code: 'lahore', name: 'Lahore' },
    { code: 'karachi', name: 'Karachi' },
    { code: 'islamabad', name: 'Islamabad' }
  ];

  useEffect(() => {
    fetchCars();
  }, [selectedCity]);

  useEffect(() => {
    applyFilters();
  }, [filters, cars]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/cars/${selectedCity}`);
      if (res.data.success) {
        setCars(res.data.cars);
        setFilteredCars(res.data.cars);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...cars];
    
    if (filters.carType) {
      filtered = filtered.filter(car => car.type === filters.carType);
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(car => car.price_per_day >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.price_per_day <= parseInt(filters.maxPrice));
    }
    
    setFilteredCars(filtered);
  };

  const clearFilters = () => {
    setFilters({ carType: '', minPrice: '', maxPrice: '' });
    setFilteredCars(cars);
  };

  const carTypes = ['All', 'Economy', 'Sedan', 'SUV', 'Luxury', 'Hatchback'];

  return (
    <div className="page-frame">
      {/* City Selection */}
      <div className="module-grid">
        <div className="section-header">
          <div>
            <p className="eyebrow">Select City</p>
            <h2>Choose Your Pickup Location</h2>
          </div>
        </div>
        <div className="card-grid city-picker-grid">
          {cities.map((city) => (
            <button
              key={city.code}
              className={`info-card ${selectedCity === city.code ? 'selected' : ''}`}
              onClick={() => setSelectedCity(city.code)}
            >
              <span className="card-icon">📍</span>
              <h3>{city.name}</h3>
              <p>{city.name === 'Lahore' ? 'Heart of Punjab' : city.name === 'Karachi' ? 'City of Lights' : 'Capital City'}</p>
              <strong>20+ Cars Available</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Cars */}
      <div className="content-shell">
        <div className="section-header">
          <div>
            <p className="eyebrow">Available Fleet</p>
            <h2>Cars in {cities.find(c => c.code === selectedCity)?.name}</h2>
            <p className="muted">{filteredCars.length} cars available for rent</p>
          </div>
          <button className="ghost-button" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="search-filters" style={{ marginBottom: '20px' }}>
            <select
              value={filters.carType}
              onChange={(e) => setFilters({ ...filters, carType: e.target.value })}
              className="input-control"
            >
              <option value="">All Types</option>
              {carTypes.filter(t => t !== 'All').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price (Rs)"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="input-control"
            />
            <input
              type="number"
              placeholder="Max Price (Rs)"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="input-control"
            />
            <button onClick={fetchCars} className="primary-button"><FaSearch /> Search</button>
            <button onClick={clearFilters} className="ghost-button">Clear</button>
          </div>
        )}

        {/* Cars Grid */}
        {loading ? (
          <div className="summary-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <p>Loading available cars...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="summary-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '10px' }}>🚗</p>
            <h3>No cars found</h3>
            <p>Try adjusting your filters or select a different city.</p>
            <button onClick={clearFilters} className="ghost-button" style={{ marginTop: '10px' }}>Clear Filters</button>
          </div>
        ) : (
          <div className="fleet-grid">
            {filteredCars.map(car => (
              <div key={car.car_id} className="fleet-card">
                {/* Status badge at top */}
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  {car.status === 'rented' && (
                    <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '100px', padding: '3px 12px',
                      background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                      ● RENTED
                    </span>
                  )}
                  {(car.status === 'maintenance' || car.status === 'unavailable') && (
                    <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '100px', padding: '3px 12px',
                      background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
                      ● MAINTENANCE
                    </span>
                  )}
                  {car.status !== 'rented' && car.status !== 'maintenance' && car.status !== 'unavailable' && (
                    <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '100px', padding: '3px 12px',
                      background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                      ● AVAILABLE
                    </span>
                  )}
                </div>
                <CarImage brand={car.brand} model={car.model} type={car.type} />
                <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
                  {car.brand} {car.model} ({car.year})
                </h3>
                <div style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--muted)' }}>
                  <div>📝 Type: {car.type}</div>
                  <div>📍 Location: {car.location}</div>
                  <div>🔧 Features: {car.features?.slice(0, 2).join(', ')}</div>
                </div>
                <div className="fleet-price" style={{ color: '#7dd3fc', textAlign: 'center', marginBottom: '4px' }}>
                  Rs {car.price_per_day.toLocaleString()}
                  <span style={{ fontSize: '14px', fontWeight: 'normal' }}>/day</span>
                </div>
                <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
                  Deposit: Rs {(car.price_per_day * 3).toLocaleString()}
                </div>
                {car.status === 'rented' ? (
                  <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '10px', padding: '10px', fontWeight: '700', fontSize: '14px' }}>
                    🚫 Already Booked
                  </div>
                ) : car.status === 'maintenance' || car.status === 'unavailable' ? (
                  <div style={{ textAlign: 'center', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', borderRadius: '10px', padding: '10px', fontWeight: '700', fontSize: '14px' }}>
                    🔧 Under Maintenance
                  </div>
                ) : user ? (
                  <Link to={`/booking/${selectedCity}/${car.car_id}`} className="submit-button" style={{ display: 'block', textAlign: 'center' }}>
                    Book Now →
                  </Link>
                ) : (
                  <Link to="/login" className="submit-button" style={{ display: 'block', textAlign: 'center' }}>
                    Login to Book →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;