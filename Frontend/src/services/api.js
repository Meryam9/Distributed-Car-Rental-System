const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const searchCars = async (city, filters = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cars/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city, filters })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, cars: [], error: error.message };
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
};

export const getCustomerRentals = async (customerId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}/rentals`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, rentals: [], error: error.message };
    }
};

export const getAvailableCars = async (city) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cars/${city}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, cars: [] };
    }
};

export const returnCar = async (rentalId, returnCity) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rentals/return`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rental_id: rentalId, return_city: returnCity })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
};