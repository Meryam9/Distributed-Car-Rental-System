
// ISLAMABAD CITY DATABASE
// Contains: Customers + Cars + Rentals + Payments + Rental History

db = db.getSiblingDB('islamabad_carRentalDB');

db.customers.drop();
db.cars.drop();
db.rentals.drop();
db.payments.drop();
db.rental_history.drop();

// TABLE 1: CUSTOMERS (FULL REPLICA FROM GLOBAL)
db.customers.insertMany([
  { customer_id: "CUST001", name: "Ahmed Khan", email: "ahmed.khan@email.com", password: "password123", phone: "+92-300-1234567", cnic: "12345-6789012-3", driving_license: "LHR-1234567", registered_date: new Date("2024-01-15"), original_city: "Lahore", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST002", name: "Fatima Ali", email: "fatima.ali@email.com", password: "password123", phone: "+92-321-7654321", cnic: "12345-6789012-4", driving_license: "KHI-7654321", registered_date: new Date("2024-02-20"), original_city: "Karachi", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST003", name: "Bilal Ahmed", email: "bilal.ahmed@email.com", password: "password123", phone: "+92-333-9876543", cnic: "12345-6789012-5", driving_license: "ISB-9876543", registered_date: new Date("2024-03-10"), original_city: "Islamabad", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST004", name: "Sana Riaz", email: "sana.riaz@email.com", password: "password123", phone: "+92-312-4567890", cnic: "12345-6789012-6", driving_license: "LHR-2345678", registered_date: new Date("2024-01-25"), original_city: "Lahore", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST005", name: "Omar Farooq", email: "omar.farooq@email.com", password: "password123", phone: "+92-345-5678901", cnic: "12345-6789012-7", driving_license: "KHI-3456789", registered_date: new Date("2024-03-05"), original_city: "Karachi", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST006", name: "Zara Tariq", email: "zara.tariq@email.com", password: "password123", phone: "+92-334-6789012", cnic: "12345-6789012-8", driving_license: "ISB-4567890", registered_date: new Date("2024-04-12"), original_city: "Islamabad", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST007", name: "Hassan Raza", email: "hassan.raza@email.com", password: "password123", phone: "+92-322-7890123", cnic: "12345-6789012-9", driving_license: "LHR-5678901", registered_date: new Date("2024-05-18"), original_city: "Lahore", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST008", name: "Ayesha Malik", email: "ayesha.malik@email.com", password: "password123", phone: "+92-313-8901234", cnic: "12345-6789013-0", driving_license: "KHI-6789012", registered_date: new Date("2024-06-22"), original_city: "Karachi", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST009", name: "Usman Chaudhry", email: "usman.c@email.com", password: "password123", phone: "+92-301-9012345", cnic: "12345-6789013-1", driving_license: "ISB-7890123", registered_date: new Date("2024-07-30"), original_city: "Islamabad", status: "active", replicated_from: "global", last_sync: new Date() },
  { customer_id: "CUST010", name: "Nadia Khan", email: "nadia.khan@email.com", password: "password123", phone: "+92-335-0123456", cnic: "12345-6789013-2", driving_license: "LHR-8901234", registered_date: new Date("2024-08-14"), original_city: "Lahore", status: "active", replicated_from: "global", last_sync: new Date() }
]);

print("✓ TABLE 1 - Customers (Full Replica): " + db.customers.countDocuments() + " records");

// TABLE 2: CARS (ISLAMABAD SPECIFIC - 20 cars)
db.cars.insertMany([
  { car_id: "ISB_CAR001", brand: "Toyota", model: "Corolla", year: 2024, type: "Sedan", price_per_day: 5500, status: "available", plate: "ISB-3001", location: "New Islamabad Airport", features: ["Altis", "Leather", "Sunroof"] },
  { car_id: "ISB_CAR002", brand: "Honda", model: "Civic", year: 2023, type: "Sedan", price_per_day: 6200, status: "available", plate: "ISB-3002", location: "F-7 Markaz", features: ["RS Turbo", "Paddle Shift", "Sport Mode"] },
  { car_id: "ISB_CAR003", brand: "Suzuki", model: "Cultus", year: 2024, type: "Economy", price_per_day: 3000, status: "available", plate: "ISB-3003", location: "Blue Area", features: ["AC", "Power Steering", "Good Fuel"] },
  { car_id: "ISB_CAR004", brand: "KIA", model: "Sportage", year: 2024, type: "SUV", price_per_day: 8200, status: "available", plate: "ISB-3004", location: "New Islamabad Airport", features: ["AWD", "Sunroof", "360 Camera"] },
  { car_id: "ISB_CAR005", brand: "Hyundai", model: "Sonata", year: 2023, type: "Luxury", price_per_day: 9500, status: "available", plate: "ISB-3005", location: "F-10 Markaz", features: ["Panoramic", "Bose Sound", "Ventilated Seats"] },
  { car_id: "ISB_CAR006", brand: "Toyota", model: "Yaris", year: 2024, type: "Sedan", price_per_day: 4700, status: "available", plate: "ISB-3006", location: "E-11", features: ["1.3L", "Keyless", "Rear Camera"] },
  { car_id: "ISB_CAR007", brand: "Suzuki", model: "Swift", year: 2023, type: "Hatchback", price_per_day: 3600, status: "available", plate: "ISB-3007", location: "G-11", features: ["Sporty", "Auto AC", "Airbags"] },
  { car_id: "ISB_CAR008", brand: "Toyota", model: "Fortuner", year: 2024, type: "SUV", price_per_day: 14000, status: "available", plate: "ISB-3008", location: "F-7 Markaz", features: ["Diesel 4x4", "7 Seats", "Navigation"] },
  { car_id: "ISB_CAR009", brand: "Honda", model: "City", year: 2024, type: "Sedan", price_per_day: 5200, status: "available", plate: "ISB-3009", location: "New Islamabad Airport", features: ["1.5L Aspire", "Sunroof", "CVT"] },
  { car_id: "ISB_CAR010", brand: "KIA", model: "Picanto", year: 2023, type: "Economy", price_per_day: 2200, status: "available", plate: "ISB-3010", location: "Blue Area", features: ["Auto", "City Car", "Parking Easy"] },
  { car_id: "ISB_CAR011", brand: "Hyundai", model: "Tucson", year: 2024, type: "SUV", price_per_day: 8900, status: "available", plate: "ISB-3011", location: "F-10 Markaz", features: ["AWD", "Digital Cluster", "Sunroof"] },
  { car_id: "ISB_CAR012", brand: "Suzuki", model: "Alto", year: 2024, type: "Economy", price_per_day: 1900, status: "available", plate: "ISB-3012", location: "G-11", features: ["660cc", "AC", "Economic"] },
  { car_id: "ISB_CAR013", brand: "Toyota", model: "Camry", year: 2023, type: "Luxury", price_per_day: 11500, status: "available", plate: "ISB-3013", location: "E-11", features: ["Hybrid", "JBL Sound", "Heated"] },
  { car_id: "ISB_CAR014", brand: "Honda", model: "BR-V", year: 2024, type: "SUV", price_per_day: 8000, status: "available", plate: "ISB-3014", location: "New Islamabad Airport", features: ["7 Seater", "Rear AC", "Roof Rails"] },
  { car_id: "ISB_CAR015", brand: "KIA", model: "Stonic", year: 2023, type: "Crossover", price_per_day: 5600, status: "available", plate: "ISB-3015", location: "F-7 Markaz", features: ["Sunroof", "Sporty Design", "Red"] },
  { car_id: "ISB_CAR016", brand: "Suzuki", model: "Wagon R", year: 2024, type: "Economy", price_per_day: 2700, status: "available", plate: "ISB-3016", location: "Blue Area", features: ["Spacious", "Family Car", "Good Mileage"] },
  { car_id: "ISB_CAR017", brand: "Toyota", model: "Prius", year: 2023, type: "Hybrid", price_per_day: 7500, status: "available", plate: "ISB-3017", location: "F-10 Markaz", features: ["Fuel Efficient", "Electric Mode", "Quiet"] },
  { car_id: "ISB_CAR018", brand: "Mercedes", model: "E-Class", year: 2024, type: "Luxury", price_per_day: 22000, status: "available", plate: "ISB-3018", location: "E-11", features: ["Executive", "Burmester", "Air Suspension"] },
  { car_id: "ISB_CAR019", brand: "BMW", model: "5 Series", year: 2024, type: "Luxury", price_per_day: 20000, status: "available", plate: "ISB-3019", location: "F-7 Markaz", features: ["M Package", "Digital Cluster", "Laser Lights"] },
  { car_id: "ISB_CAR020", brand: "Audi", model: "A4", year: 2024, type: "Luxury", price_per_day: 17000, status: "available", plate: "ISB-3020", location: "New Islamabad Airport", features: ["Quattro", "Virtual Cockpit", "Bang & Olufsen"] }
]);

print("✓ TABLE 2 - Cars (Islamabad Only): " + db.cars.countDocuments() + " cars");

// TABLE 3: RENTALS (Islamabad Transactions)
db.rentals.insertMany([
  {
    rental_id: "RENT_ISB_001",
    customer_id: "CUST003",
    customer_name: "Bilal Ahmed",
    car_id: "ISB_CAR003",
    car_name: "Suzuki Cultus",
    pickup_date: new Date("2024-12-22"),
    return_date: new Date("2024-12-27"),
    pickup_location: "Blue Area",
    return_location: "New Islamabad Airport",
    total_days: 5,
    daily_rate: 3000,
    total_amount: 15000,
    status: "active",
    payment_status: "completed",
    created_at: new Date()
  },
  {
    rental_id: "RENT_ISB_002",
    customer_id: "CUST006",
    customer_name: "Zara Tariq",
    car_id: "ISB_CAR011",
    car_name: "Hyundai Tucson",
    pickup_date: new Date("2024-12-24"),
    return_date: new Date("2024-12-26"),
    pickup_location: "F-10 Markaz",
    return_location: "F-7 Markaz",
    total_days: 2,
    daily_rate: 8900,
    total_amount: 17800,
    status: "confirmed",
    payment_status: "pending",
    created_at: new Date()
  }
]);

print("✓ TABLE 3 - Rentals (Islamabad): " + db.rentals.countDocuments() + " records");

// TABLE 4: PAYMENTS (Islamabad Payments)
db.payments.insertMany([
  {
    payment_id: "PAY_ISB_001",
    rental_id: "RENT_ISB_001",
    customer_id: "CUST003",
    amount: 15000,
    payment_method: "Credit Card",
    payment_date: new Date("2024-12-22"),
    status: "completed",
    transaction_id: "TXN_001_ISB"
  }
]);

print("✓ TABLE 4 - Payments (Islamabad): " + db.payments.countDocuments() + " records");

// TABLE 5: RENTAL HISTORY (Islamabad)
db.rental_history.insertMany([
  {
    history_id: "HIST_ISB_001",
    rental_id: "RENT_ISB_001",
    customer_id: "CUST003",
    customer_name: "Bilal Ahmed",
    car_id: "ISB_CAR003",
    car_name: "Suzuki Cultus",
    pickup_date: new Date("2024-12-22"),
    return_date: new Date("2024-12-27"),
    pickup_location: "Blue Area",
    return_location: "New Islamabad Airport",
    total_days: 5,
    daily_rate: 3000,
    total_amount: 15000,
    status: "active",
    payment_status: "completed",
    created_at: new Date("2024-12-22"),
    history_type: "current"
  },
  {
    history_id: "HIST_ISB_002",
    rental_id: "RENT_ISB_002",
    customer_id: "CUST006",
    customer_name: "Zara Tariq",
    car_id: "ISB_CAR011",
    car_name: "Hyundai Tucson",
    pickup_date: new Date("2024-12-24"),
    return_date: new Date("2024-12-26"),
    pickup_location: "F-10 Markaz",
    return_location: "F-7 Markaz",
    total_days: 2,
    daily_rate: 8900,
    total_amount: 17800,
    status: "confirmed",
    payment_status: "pending",
    created_at: new Date("2024-12-24"),
    history_type: "current"
  }
]);

print("✓ TABLE 5 - Rental History (Islamabad): " + db.rental_history.countDocuments() + " records");

// Create indexes
db.customers.createIndex({ customer_id: 1 }, { unique: true });
db.customers.createIndex({ email: 1 });
db.cars.createIndex({ car_id: 1 }, { unique: true });
db.cars.createIndex({ status: 1 });
db.rentals.createIndex({ rental_id: 1 }, { unique: true });
db.rentals.createIndex({ customer_id: 1 });
db.rentals.createIndex({ status: 1 });
db.payments.createIndex({ payment_id: 1 }, { unique: true });
db.rental_history.createIndex({ rental_id: 1 }, { unique: true });
db.rental_history.createIndex({ customer_id: 1 });

print("\n");
print("ISLAMABAD DATABASE SETUP COMPLETE!");
print("Database: islamabad_carRentalDB");
print("Tables:");
print("  - Customers: " + db.customers.countDocuments() + "/10");
print("  - Cars: " + db.cars.countDocuments() + "/20");
print("  - Rentals: " + db.rentals.countDocuments());
print("  - Payments: " + db.payments.countDocuments());
print("  - Rental History: " + db.rental_history.countDocuments());
print("ISL SETUP COMPLETED!\n");