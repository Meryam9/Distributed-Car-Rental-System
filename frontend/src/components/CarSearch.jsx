import React, { useState, useEffect } from 'react';
import { searchCars } from '../services/api';

const CarSearch = ({ selectedCity, onBookCar }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ carType: '', minPrice: '', maxPrice: '' });

    useEffect(() => {
        if (selectedCity) {
            loadCars();
        }
    }, [selectedCity]);

    const loadCars = async (overrideFilters = filters) => {
        setLoading(true);
        const result = await searchCars(selectedCity, overrideFilters);
        if (result.success) {
            setCars(result.cars);
        }
        setLoading(false);
    };

    const clearFilters = () => {
        const nextFilters = { carType: '', minPrice: '', maxPrice: '' };
        setFilters(nextFilters);
        loadCars(nextFilters);
    };

    const getCityName = (code) => {
        const names = { islamabad: 'Islamabad', karachi: 'Karachi', lahore: 'Lahore' };
        return names[code] || code;
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <p className="eyebrow">Fleet search</p>
                    <h2>Available cars in {getCityName(selectedCity)}</h2>
                </div>
            </div>

            <div className="search-filters">
                <select
                    onChange={(e) => setFilters({ ...filters, carType: e.target.value })}
                    className="input-control"
                >
                    <option value="">All Types</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Price"
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="input-control"
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="input-control"
                />
                <button
                    onClick={loadCars}
                    className="primary-button"
                >
                    🔍 Search
                </button>
            </div>

            {loading ? (
                <div className="summary-card">Loading cars...</div>
            ) : cars.length === 0 ? (
                <div className="summary-card">
                    <p style={{ marginTop: 0 }}>No cars available in {getCityName(selectedCity)} for the current filters.</p>
                    <p style={{ marginBottom: 12, color: 'var(--muted)' }}>
                        Try clearing the price range or switching to a different city.
                    </p>
                    <button type="button" onClick={clearFilters} className="ghost-button">
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="fleet-grid">
                    {cars.map(car => (
                        <div key={car.car_id} className="fleet-card">
                            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>
                                {car.type === 'SUV' ? '🚙' : car.type === 'Sedan' ? '🚗' : '🚘'}
                            </div>
                            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
                                {car.brand} {car.model}
                            </h3>
                            <div style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--muted)' }}>
                                <div>🔧 {car.transmission} | 💺 {car.seats} seats | ⛽ {car.fuel_type}</div>
                                <div>📝 Type: {car.type}</div>
                                <div>📍 Location: {car.city_location}</div>
                            </div>
                            <div className="fleet-price" style={{ color: '#7dd3fc', textAlign: 'center' }}>
                                Rs {car.rate_per_day.toLocaleString()}
                                <span style={{ fontSize: '14px', fontWeight: 'normal' }}>/day</span>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', color: 'var(--muted)' }}>
                                Deposit: Rs {car.deposit?.toLocaleString()}
                            </div>
                            <button
                                onClick={() => onBookCar(car)}
                                className="submit-button"
                            >
                                Book Now →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarSearch;