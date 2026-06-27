const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dbManager = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_super_secret_jwt_key_change_this';

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Auth middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

let dbInitialized = false;

const initDB = async () => {
    if (!dbInitialized) {
        await dbManager.connect();
        dbInitialized = true;
    }
};

//  AUTH ENDPOINTS 

// Register new customer - saves to customers table
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone, cnic, driving_license, address } = req.body;
    
    console.log('📝 Registration attempt for:', email);
    
    try {
        await initDB();
        const globalDB = dbManager.getGlobalDB();
        
        // Check if email exists in customers table
        const existingCustomer = await globalDB.collection('customers').findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // Create new customer with PLAIN TEXT password
        const customerId = `CUST${Date.now()}`;
        const newCustomer = {
            customer_id: customerId,
            name,
            email,
            password: password,  // Plain text password
            phone: phone || '',
            cnic: cnic || '',
            driving_license: driving_license || '',
            address: address || '',
            role: 'customer',
            total_rentals: 0,
            total_spent: 0,
            penalty_amount: 0,
            created_at: new Date(),
            registered_date: new Date(),
            original_city: null,
            status: 'active'
        };
        
        // Save to global customers table
        await globalDB.collection('customers').insertOne(newCustomer);
        console.log(`✅ Customer saved to global customers table: ${customerId}`);
        
        // Keep global users collection in sync (auth fallback)
        await globalDB.collection('users').updateOne(
            { customer_id: customerId },
            { $setOnInsert: { ...newCustomer } },
            { upsert: true }
        );
        console.log(`✅ Customer saved to global users table: ${customerId}`);
        
        // Replicate to all city databases customers table
        const cities = ['lahore', 'karachi', 'islamabad'];
        for (const city of cities) {
            try {
                const cityDB = dbManager.getCityDB(city);
                await cityDB.collection('customers').insertOne({
                    ...newCustomer,
                    replicated_from: 'global',
                    last_sync: new Date()
                });
                console.log(`✅ Customer replicated to ${city} customers table`);
            } catch (cityError) {
                console.log(`⚠️ Could not replicate to ${city}:`, cityError.message);
            }
        }
        
        // Create token
        const token = jwt.sign({ userId: customerId, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            success: true,
            token,
            user: {
                id: customerId,
                name,
                email,
                role: 'customer'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login - Check from customers table
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt for:', email);
    
    try {
        await initDB();
        
        // Check for hardcoded admin
        if (email === 'admin@carrental.com' && password === 'Admin@123') {
            const token = jwt.sign({ userId: 'ADMIN001', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({
                success: true,
                token,
                user: {
                    id: 'ADMIN001',
                    name: 'System Administrator',
                    email: 'admin@carrental.com',
                    role: 'admin'
                }
            });
        }
        
        // Check customer in GLOBAL customers table
        const globalDB = dbManager.getGlobalDB();
        const customer = await globalDB.collection('customers').findOne({ email });
        
        if (!customer) {
            console.log('❌ Customer not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Direct plain text password comparison
        if (customer.password !== password) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        console.log('✅ Login successful for:', email);
        
        const token = jwt.sign({ userId: customer.customer_id, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            success: true,
            token,
            user: {
                id: customer.customer_id,
                name: customer.name,
                email: customer.email,
                role: 'customer'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get current user from customers table
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        await initDB();
        
        if (req.userRole === 'admin') {
            return res.json({
                id: 'ADMIN001',
                name: 'System Administrator',
                email: 'admin@carrental.com',
                role: 'admin'
            });
        }
        
        const globalDB = dbManager.getGlobalDB();
        const customer = await globalDB.collection('customers').findOne({ customer_id: req.userId });
        
        if (!customer) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            id: customer.customer_id,
            name: customer.name,
            email: customer.email,
            role: 'customer'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  CAR ENDPOINTS 

// Get available cars by city
app.get('/api/cars/:city', authMiddleware, async (req, res) => {
    const { city } = req.params;
    
    try {
        await initDB();
        const db = dbManager.getCityDB(city);
        
        // Fetch ALL cars — trust the status stored in the car document.
        // Only override with 'rented' if there is a genuinely active rental
        const allCars = await db.collection('cars').find({}).toArray();
        const activeRentals = await db.collection('rentals').find({ status: 'active' }).toArray();
        const rentedCarIds = new Set(activeRentals.map(r => r.car_id));
        const cars = allCars.map(car => ({
            ...car,
            // Only force 'rented' if DB says available but an active rental exists.
            // If admin manually set it to available/maintenance, respect that — the
            // active rental will have been cancelled by the PUT route.
            status: (rentedCarIds.has(car.car_id) && car.status === 'available')
                ? 'rented'
                : car.status
        }));
        
        const formattedCars = cars.map(car => ({
            ...car,
            rate_per_day: car.price_per_day,
            deposit: Math.floor(car.price_per_day * 3),
            city_location: city.charAt(0).toUpperCase() + city.slice(1)
        }));
        
        res.json({ success: true, cars: formattedCars });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search Cars with filters
app.post('/api/cars/search', authMiddleware, async (req, res) => {
    const { city, filters } = req.body;
    
    try {
        await initDB();
        const db = dbManager.getCityDB(city);
        let query = { status: 'available' };
        
        if (filters?.carType && filters.carType !== '') {
            query.type = filters.carType;
        }
        if (filters?.minPrice && filters.minPrice !== '') {
            query.price_per_day = { $gte: parseInt(filters.minPrice) };
        }
        if (filters?.maxPrice && filters.maxPrice !== '') {
            query.price_per_day = { ...query.price_per_day, $lte: parseInt(filters.maxPrice) };
        }
        
        let cars = await db.collection('cars').find(query).toArray();
        
        cars = cars.map(car => ({
            ...car,
            rate_per_day: car.price_per_day,
            deposit: Math.floor(car.price_per_day * 3),
            city_location: city.charAt(0).toUpperCase() + city.slice(1),
            transmission: car.features?.includes('Auto') ? 'Automatic' : 'Manual',
            seats: car.type === 'SUV' ? 7 : 5
        }));
        
        res.json({ success: true, cars });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  RENTAL ENDPOINTS 

// Create booking
app.post('/api/rentals/create', authMiddleware, async (req, res) => {
    console.log('\n🚀 NEW SERVER.JS IS RUNNING — /api/rentals/create hit');
    console.log('📦 Body received:', JSON.stringify(req.body));
    const { car_id, city, pickup_date, return_date, pickup_location, return_location, total_amount, total_days, payment_method, card_last4 } = req.body;
    const rental_id = `RENT_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const payment_id = `PAY_${city.slice(0,3).toUpperCase()}_${Date.now()}`;
    const transaction_id = `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    try {
        await initDB();
        const db = dbManager.getCityDB(city);
        const globalDB = dbManager.getGlobalDB();

        const car = await db.collection('cars').findOne({ car_id });
        if (!car || car.status !== 'available') {
            return res.status(400).json({ error: 'Car not available' });
        }

        const customer = await globalDB.collection('customers').findOne({ customer_id: req.userId });

        const rental = {
            rental_id,
            customer_id: req.userId,
            customer_name: customer.name,
            car_id: car.car_id,
            car_name: `${car.brand} ${car.model}`,
            city,
            pickup_date: new Date(pickup_date),
            return_date: new Date(return_date),
            pickup_location,
            return_location,
            total_days,
            daily_rate: car.price_per_day,
            total_amount,
            payment_method: payment_method || 'cash',
            status: 'active',
            created_at: new Date()
        };

        await db.collection('rentals').insertOne(rental);
        await db.collection('rental_history').insertOne({ ...rental, history_type: 'current' });

        // ── Save to payments collection 
        const paymentRecord = {
            payment_id,
            rental_id,
            customer_id: req.userId,
            customer_name: customer.name,
            car_id: car.car_id,
            car_name: `${car.brand} ${car.model}`,
            city,
            amount: total_amount,
            payment_method: payment_method === 'card' ? 'Credit Card' : 'Cash',
            ...(payment_method === 'card' && card_last4 && { card_last4 }),
            payment_date: new Date(),
            status: payment_method === 'card' ? 'completed' : 'partial',
            transaction_id,
            created_at: new Date()
        };
        const payResult = await db.collection('payments').insertOne(paymentRecord);
        console.log(`✅ Payment saved to ${city}DB — payment_id: ${payment_id}, _id: ${payResult.insertedId}`);

        await db.collection('cars').updateOne(
            { car_id },
            { $set: { status: 'rented', rented_by: req.userId, rented_until: new Date(return_date) } }
        );

        await globalDB.collection('customers').updateOne(
            { customer_id: req.userId },
            { $inc: { total_rentals: 1, total_spent: total_amount } }
        );

        const cities = ['lahore', 'karachi', 'islamabad'];
        for (const cityName of cities) {
            try {
                const cityDB = dbManager.getCityDB(cityName);
                await cityDB.collection('customers').updateOne(
                    { customer_id: req.userId },
                    { $inc: { total_rentals: 1, total_spent: total_amount } }
                );
            } catch (e) {}
        }

        res.json({ success: true, rental_id, payment_id });
    } catch (error) {
        console.error('❌ Booking error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get customer's rentals
app.get('/api/rentals/my-rentals', authMiddleware, async (req, res) => {
    try {
        await initDB();
        const allRentals = [];
        const cities = ['lahore', 'karachi', 'islamabad'];
        
        for (const city of cities) {
            try {
                const db = dbManager.getCityDB(city);
                const rentals = await db.collection('rentals').find({ customer_id: req.userId }).toArray();
                allRentals.push(...rentals.map(r => ({ ...r, city })));
            } catch (e) {}
        }
        
        res.json({ success: true, rentals: allRentals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Return car
app.post('/api/rentals/return', authMiddleware, async (req, res) => {
    const { rental_id, return_location, damage_amount } = req.body;
    
    try {
        await initDB();
        let rentalData = null;
        let cityDB = null;
        
        const cities = ['lahore', 'karachi', 'islamabad'];
        for (const city of cities) {
            try {
                const db = dbManager.getCityDB(city);
                const rental = await db.collection('rentals').findOne({ rental_id });
                if (rental) {
                    rentalData = rental;
                    cityDB = db;
                    break;
                }
            } catch (e) {}
        }
        
        if (!rentalData) {
            return res.status(404).json({ error: 'Rental not found' });
        }
        
        const penaltyAmount = damage_amount || 0;
        
        await cityDB.collection('rentals').updateOne(
            { rental_id },
            { $set: { status: 'completed', return_date: new Date(), return_location, penalty_amount: penaltyAmount, completed_at: new Date() } }
        );
        
        await cityDB.collection('rental_history').updateOne(
            { rental_id },
            { $set: { status: 'completed', history_type: 'completed', completed_at: new Date(), penalty_amount: penaltyAmount } }
        );
        
        await cityDB.collection('cars').updateOne(
            { car_id: rentalData.car_id },
            { $set: { status: 'available', rented_by: null, rented_until: null } }
        );

        // ── Mark payment as completed on return 
        await cityDB.collection('payments').updateOne(
            { rental_id },
            { $set: { status: 'completed', completed_at: new Date(), ...(penaltyAmount > 0 && { penalty_amount: penaltyAmount }) } }
        );
        console.log(`✅ Payment marked completed for rental: ${rental_id}`);
        // ─────────────

        if (penaltyAmount > 0) {
            const globalDB = dbManager.getGlobalDB();
            await globalDB.collection('customers').updateOne(
                { customer_id: rentalData.customer_id },
                { $inc: { penalty_amount: penaltyAmount } }
            );
        }
        
        res.json({ success: true, message: penaltyAmount > 0 ? `Penalty: Rs ${penaltyAmount}` : 'Car returned successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  ADMIN ENDPOINTS 

app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await initDB();
        const globalDB = dbManager.getGlobalDB();
        const cities = ['lahore', 'karachi', 'islamabad'];
        
        let totalCars = 0, totalRentals = 0, activeRentals = 0, totalRevenue = 0, totalPenalties = 0;
        let carsByCity = {}, rentalsByCity = {};
        
        for (const city of cities) {
            const db = dbManager.getCityDB(city);
            const cars = await db.collection('cars').countDocuments();
            const rentals = await db.collection('rentals').countDocuments();
            const active = await db.collection('rentals').countDocuments({ status: 'active' });
            const revenue = await db.collection('rentals').aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$total_amount' } } }]).toArray();
            const penalties = await db.collection('rentals').aggregate([{ $group: { _id: null, total: { $sum: '$penalty_amount' } } }]).toArray();
            
            totalCars += cars;
            totalRentals += rentals;
            activeRentals += active;
            totalRevenue += revenue[0]?.total || 0;
            totalPenalties += penalties[0]?.total || 0;
            carsByCity[city] = cars;
            rentalsByCity[city] = rentals;
        }
        
        const totalCustomers = await globalDB.collection('customers').countDocuments({ role: 'customer' });
        
        res.json({ totalCars, totalRentals, activeRentals, totalRevenue, totalPenalties, totalCustomers, carsByCity, rentalsByCity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/rentals', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await initDB();
        const cities = ['lahore', 'karachi', 'islamabad'];
        const allRentals = [];
        
        for (const city of cities) {
            const db = dbManager.getCityDB(city);
            const rentals = await db.collection('rentals').find().sort({ created_at: -1 }).toArray();
            allRentals.push(...rentals.map(r => ({ ...r, city })));
        }
        
        res.json({ success: true, rentals: allRentals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all customers (admin) - FIXED
app.get('/api/admin/customers', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await initDB();
        const globalDB = dbManager.getGlobalDB();
        
        // Try to get customers from 'customers' collection first
        let customers = await globalDB.collection('customers').find({}).toArray();
        
        // If no customers found, try 'users' collection
        if (customers.length === 0) {
            customers = await globalDB.collection('users').find({ role: 'customer' }).toArray();
        }
        
        // Remove password field for security
        const safeCustomers = customers.map(({ password, ...rest }) => rest);
        
        console.log(`✅ Found ${safeCustomers.length} customers in database`);
        
        res.json({ 
            success: true, 
            customers: safeCustomers 
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            customers: [] 
        });
    }
});

app.get('/api/admin/cars', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await initDB();
        const cities = ['lahore', 'karachi', 'islamabad'];
        const allCars = [];
        
        for (const city of cities) {
            const db = dbManager.getCityDB(city);
            const cars = await db.collection('cars').find().toArray();
            allCars.push(...cars.map(c => ({ ...c, city })));
        }
        
        res.json({ success: true, cars: allCars });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/alerts', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await initDB();
        const cities = ['lahore', 'karachi', 'islamabad'];
        const alerts = [];
        const now = new Date();
        
        for (const city of cities) {
            const db = dbManager.getCityDB(city);
            const overdueRentals = await db.collection('rentals').find({ status: 'active', return_date: { $lt: now } }).toArray();
            for (const rental of overdueRentals) {
                alerts.push({ type: 'overdue', severity: 'high', message: `Rental ${rental.rental_id} is overdue`, rental, city });
            }
        }
        
        res.json({ success: true, alerts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/car-locations', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await initDB();
        const cities = ['lahore', 'karachi', 'islamabad'];
        const carLocations = [];
        
        for (const city of cities) {
            const db = dbManager.getCityDB(city);
            const rentedCars = await db.collection('cars').find({ status: 'rented' }).toArray();
            for (const car of rentedCars) {
                carLocations.push({
                    car_id: car.car_id,
                    car_name: `${car.brand} ${car.model}`,
                    current_city: city,
                    current_location: car.location,
                    rented_until: car.rented_until
                });
            }
        }
        
        res.json({ success: true, carLocations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/cars', authMiddleware, adminMiddleware, async (req, res) => {
    const { city, brand, model, year, type, price_per_day, plate, location, features } = req.body;
    
    try {
        await initDB();
        const db = dbManager.getCityDB(city);
        const car_id = `${city.toUpperCase()}_CAR${Date.now()}`;
        
        const newCar = {
            car_id,
            brand,
            model,
            year: parseInt(year),
            type,
            price_per_day: parseInt(price_per_day),
            status: 'available',
            plate,
            location,
            features: features || [],
            created_at: new Date()
        };
        
        await db.collection('cars').insertOne(newCar);
        res.json({ success: true, car: newCar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update car details (including status) - ADMIN
app.put('/api/admin/cars/:carId', authMiddleware, adminMiddleware, async (req, res) => {
    const { carId } = req.params;
    const { brand, model, year, type, price_per_day, plate, location, city, status } = req.body;

    console.log(`🔧 Admin updating car: ${carId} — requested status: "${status}"`);

    try {
        await initDB();
        const allCities = ['lahore', 'karachi', 'islamabad'];
        let updated = false;
        let foundInCity = null;

        // Step 1: Update the car document in the correct city DB
        for (const c of allCities) {
            const db = dbManager.getCityDB(c);

            const updateFields = {
                brand:         brand,
                model:         model,
                year:          parseInt(year),
                type:          type,
                price_per_day: parseInt(price_per_day),
                plate:         plate,
                location:      location,
                status:        status,
                updated_at:    new Date()
            };

            // If admin is marking available, clear rental fields too
            if (status === 'available') {
                updateFields.rented_by = null;
                updateFields.rented_until = null;
            }

            const result = await db.collection('cars').updateOne(
                { car_id: carId },
                { $set: updateFields }
            );

            if (result.matchedCount > 0) {
                updated = true;
                foundInCity = c;
                console.log(`✅ Car ${carId} updated in ${c} DB — new status: "${status}", modifiedCount: ${result.modifiedCount}`);
                break;
            }
        }

        if (!updated) {
            console.warn(`⚠️ Car ${carId} not found in any city DB`);
            return res.status(404).json({ success: false, message: 'Car not found in any city database' });
        }

        // Step 2: If admin force-sets to available or maintenance,
        // also cancel/close any active rental for this car so the
        // GET /api/cars/:city status-override logic stays in sync.
        if (status === 'available' || status === 'maintenance') {
            const db = dbManager.getCityDB(foundInCity);
            const activeRental = await db.collection('rentals').findOne({
                car_id: carId,
                status: 'active'
            });

            if (activeRental) {
                await db.collection('rentals').updateOne(
                    { rental_id: activeRental.rental_id },
                    {
                        $set: {
                            status: 'admin_cancelled',
                            admin_cancelled_at: new Date(),
                            admin_cancel_reason: `Admin manually set car to ${status}`
                        }
                    }
                );
                // Also update rental_history if it exists
                await db.collection('rental_history').updateOne(
                    { rental_id: activeRental.rental_id },
                    {
                        $set: {
                            status: 'admin_cancelled',
                            history_type: 'admin_cancelled',
                            admin_cancelled_at: new Date()
                        }
                    }
                );
                console.log(`🚫 Active rental ${activeRental.rental_id} cancelled by admin (car forced to ${status})`);
            }
        }

        res.json({ success: true, message: 'Car updated successfully' });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete car - ADMIN
app.delete('/api/admin/cars/:carId', authMiddleware, adminMiddleware, async (req, res) => {
    const { carId } = req.params;

    try {
        await initDB();
        const cities = ['lahore', 'karachi', 'islamabad'];
        let deleted = false;

        for (const c of cities) {
            const db = dbManager.getCityDB(c);
            const result = await db.collection('cars').deleteOne({ car_id: carId });
            if (result.deletedCount > 0) {
                deleted = true;
                console.log(`✅ Car ${carId} deleted from ${c} DB`);
                break;
            }
        }

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        res.json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/admin/rentals/:rentalId/status', authMiddleware, adminMiddleware, async (req, res) => {
    const { status } = req.body;
    const { rentalId } = req.params;
    
    try {
        await initDB();
        const cities = ['lahore', 'karachi', 'islamabad'];
        let updated = false;
        
        for (const city of cities) {
            const db = dbManager.getCityDB(city);
            const result = await db.collection('rentals').updateOne(
                { rental_id: rentalId },
                { $set: { status, updated_at: new Date() } }
            );
            if (result.modifiedCount > 0) {
                updated = true;
                break;
            }
        }
        
        if (!updated) {
            return res.status(404).json({ error: 'Rental not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const startServer = async () => {
    try {
        await dbManager.connect();
        app.listen(PORT, () => {
            console.log(`\n🚀 Car Rental System Backend Running on http://localhost:${PORT}`);
            console.log(`   Admin Login: admin@carrental.com / Admin@123`);
            console.log(`   Customer Login: Check from customers table with plain text password\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();