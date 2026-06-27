// LAHORE CITY DATABASE

db = db.getSiblingDB('lahore_carRentalDB');

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

print("✓ TABLE 1 - Customers: " + db.customers.countDocuments() + " records");

// TABLE 2: CARS (LAHORE SPECIFIC - 20 cars)
db.cars.insertMany([
  { car_id: "LHR_CAR001", brand: "Suzuki", model: "Cultus", year: 2023, type: "Economy", price_per_day: 3500, status: "available", plate: "LHR-1001", location: "Lahore Airport", features: ["AC", "Power Steering", "USB"] },
  { car_id: "LHR_CAR002", brand: "Toyota", model: "Corolla", year: 2024, type: "Sedan", price_per_day: 5000, status: "available", plate: "LHR-1002", location: "Gulberg", features: ["GPS", "Climate Control", "Bluetooth"] },
  { car_id: "LHR_CAR003", brand: "Honda", model: "Civic", year: 2024, type: "Sedan", price_per_day: 6000, status: "available", plate: "LHR-1003", location: "MM Alam Road", features: ["Sunroof", "Leather Seats", "Push Start"] },
  { car_id: "LHR_CAR004", brand: "Suzuki", model: "Wagon R", year: 2023, type: "Economy", price_per_day: 2800, status: "available", plate: "LHR-1004", location: "Johar Town", features: ["AC", "Good Fuel Average", "Spacious"] },
  { car_id: "LHR_CAR005", brand: "Toyota", model: "Yaris", year: 2023, type: "Sedan", price_per_day: 4500, status: "available", plate: "LHR-1005", location: "DHA Phase 5", features: ["Keyless Entry", "Rear Camera", "Bluetooth"] },
  { car_id: "LHR_CAR006", brand: "Honda", model: "City", year: 2024, type: "Sedan", price_per_day: 4800, status: "available", plate: "LHR-1006", location: "Model Town", features: ["CVT", "Eco Mode", "Sunroof"] },
  { car_id: "LHR_CAR007", brand: "Suzuki", model: "Swift", year: 2023, type: "Hatchback", price_per_day: 3800, status: "available", plate: "LHR-1007", location: "Lahore Airport", features: ["Sporty Look", "ABS", "Airbags"] },
  { car_id: "LHR_CAR008", brand: "Toyota", model: "Fortuner", year: 2024, type: "SUV", price_per_day: 12000, status: "available", plate: "LHR-1008", location: "Gulberg", features: ["4x4", "7 Seats", "Diesel"] },
  { car_id: "LHR_CAR009", brand: "KIA", model: "Sportage", year: 2023, type: "SUV", price_per_day: 8000, status: "available", plate: "LHR-1009", location: "DHA Phase 5", features: ["Sunroof", "360 Camera", "Heated Seats"] },
  { car_id: "LHR_CAR010", brand: "Hyundai", model: "Sonata", year: 2024, type: "Luxury", price_per_day: 9000, status: "available", plate: "LHR-1010", location: "MM Alam Road", features: ["Panoramic Roof", "Bose Sound", "Digital Dash"] },
  { car_id: "LHR_CAR011", brand: "Suzuki", model: "Alto", year: 2024, type: "Economy", price_per_day: 2000, status: "available", plate: "LHR-1011", location: "Johar Town", features: ["AC", "Power Windows", "Best for City"] },
  { car_id: "LHR_CAR012", brand: "Honda", model: "BR-V", year: 2023, type: "SUV", price_per_day: 7500, status: "available", plate: "LHR-1012", location: "Lahore Airport", features: ["7 Seats", "Climate Control", "Rear AC"] },
  { car_id: "LHR_CAR013", brand: "Toyota", model: "Camry", year: 2024, type: "Luxury", price_per_day: 11000, status: "available", plate: "LHR-1013", location: "Gulberg", features: ["Hybrid", "V6 Engine", "Premium Sound"] },
  { car_id: "LHR_CAR014", brand: "KIA", model: "Picanto", year: 2023, type: "Economy", price_per_day: 2500, status: "available", plate: "LHR-1014", location: "Model Town", features: ["Auto", "Power Steering", "Compact"] },
  { car_id: "LHR_CAR015", brand: "Hyundai", model: "Tucson", year: 2024, type: "SUV", price_per_day: 8500, status: "available", plate: "LHR-1015", location: "DHA Phase 5", features: ["AWD", "Wireless Charging", "Panoramic"] },
  { car_id: "LHR_CAR016", brand: "Suzuki", model: "Vitara", year: 2023, type: "SUV", price_per_day: 6500, status: "available", plate: "LHR-1016", location: "Lahore Airport", features: ["4x4", "Roof Rails", "Alloy Wheels"] },
  { car_id: "LHR_CAR017", brand: "Toyota", model: "Prius", year: 2024, type: "Hybrid", price_per_day: 7000, status: "available", plate: "LHR-1017", location: "Gulberg", features: ["Fuel Efficient", "Electric Mode", "Eco Friendly"] },
  { car_id: "LHR_CAR018", brand: "Honda", model: "Accord", year: 2023, type: "Luxury", price_per_day: 10000, status: "available", plate: "LHR-1018", location: "MM Alam Road", features: ["V6", "Leather", "Navigation"] },
  { car_id: "LHR_CAR019", brand: "KIA", model: "Stonic", year: 2024, type: "Crossover", price_per_day: 5500, status: "available", plate: "LHR-1019", location: "Johar Town", features: ["Sunroof", "Red Color", "Sporty"] },
  { car_id: "LHR_CAR020", brand: "BMW", model: "3 Series", year: 2024, type: "Luxury", price_per_day: 15000, status: "available", plate: "LHR-1020", location: "DHA Phase 5", features: ["M Sport", "Digital Cluster", "Ambient Light"] }
]);

print("✓ TABLE 2 - Cars (Lahore): " + db.cars.countDocuments() + " cars");

// TABLE 3: RENTALS (Lahore Transactions)
db.rentals.insertMany([
  {
    rental_id: "RENT_LHR_001",
    customer_id: "CUST001",
    customer_name: "Ahmed Khan",
    car_id: "LHR_CAR003",
    car_name: "Honda Civic",
    pickup_date: new Date("2024-12-20"),
    return_date: new Date("2024-12-25"),
    pickup_location: "MM Alam Road",
    return_location: "Lahore Airport",
    total_days: 5,
    daily_rate: 6000,
    total_amount: 30000,
    status: "active",
    created_at: new Date()
  },
  {
    rental_id: "RENT_LHR_002",
    customer_id: "CUST004",
    customer_name: "Sana Riaz",
    car_id: "LHR_CAR005",
    car_name: "Toyota Yaris",
    pickup_date: new Date("2024-12-22"),
    return_date: new Date("2024-12-24"),
    pickup_location: "DHA Phase 5",
    return_location: "Gulberg",
    total_days: 2,
    daily_rate: 4500,
    total_amount: 9000,
    status: "completed",
    created_at: new Date()
  },
  {
    rental_id: "RENT_LHR_003",
    customer_id: "CUST007",
    customer_name: "Hassan Raza",
    car_id: "LHR_CAR009",
    car_name: "KIA Sportage",
    pickup_date: new Date("2024-12-23"),
    return_date: new Date("2024-12-28"),
    pickup_location: "DHA Phase 5",
    return_location: "DHA Phase 5",
    total_days: 5,
    daily_rate: 8000,
    total_amount: 40000,
    status: "active",
    created_at: new Date()
  }
]);

print("✓ TABLE 3 - Rentals: " + db.rentals.countDocuments() + " records");

// TABLE 4: PAYMENTS (Lahore Payments)
db.payments.insertMany([
  {
    payment_id: "PAY_LHR_001",
    rental_id: "RENT_LHR_001",
    customer_id: "CUST001",
    amount: 30000,
    payment_method: "Credit Card",
    payment_date: new Date("2024-12-20"),
    status: "completed",
    transaction_id: "TXN_001_LHR"
  },
  {
    payment_id: "PAY_LHR_002",
    rental_id: "RENT_LHR_002",
    customer_id: "CUST004",
    amount: 9000,
    payment_method: "Cash",
    payment_date: new Date("2024-12-22"),
    status: "completed",
    transaction_id: "TXN_002_LHR"
  },
  {
    payment_id: "PAY_LHR_003",
    rental_id: "RENT_LHR_003",
    customer_id: "CUST007",
    amount: 20000,
    payment_method: "Debit Card",
    payment_date: new Date("2024-12-23"),
    status: "partial",
    transaction_id: "TXN_003_LHR"
  }
]);

print("✓ TABLE 4 - Payments: " + db.payments.countDocuments() + " records");

// TABLE 5: RENTAL HISTORY
db.rental_history.insertMany([
  {
    history_id: "HIST_LHR_001",
    rental_id: "RENT_LHR_001",
    customer_id: "CUST001",
    customer_name: "Ahmed Khan",
    car_id: "LHR_CAR003",
    car_name: "Honda Civic",
    pickup_date: new Date("2024-12-20"),
    return_date: new Date("2024-12-25"),
    pickup_location: "MM Alam Road",
    return_location: "Lahore Airport",
    total_days: 5,
    daily_rate: 6000,
    total_amount: 30000,
    status: "active",
    created_at: new Date("2024-12-20"),
    history_type: "current"
  },
  {
    history_id: "HIST_LHR_002",
    rental_id: "RENT_LHR_002",
    customer_id: "CUST004",
    customer_name: "Sana Riaz",
    car_id: "LHR_CAR005",
    car_name: "Toyota Yaris",
    pickup_date: new Date("2024-12-22"),
    return_date: new Date("2024-12-24"),
    pickup_location: "DHA Phase 5",
    return_location: "Gulberg",
    total_days: 2,
    daily_rate: 4500,
    total_amount: 9000,
    status: "completed",
    created_at: new Date("2024-12-22"),
    completed_at: new Date("2024-12-24"),
    history_type: "completed"
  },
  {
    history_id: "HIST_LHR_003",
    rental_id: "RENT_LHR_003",
    customer_id: "CUST007",
    customer_name: "Hassan Raza",
    car_id: "LHR_CAR009",
    car_name: "KIA Sportage",
    pickup_date: new Date("2024-12-23"),
    return_date: new Date("2024-12-28"),
    pickup_location: "DHA Phase 5",
    return_location: "DHA Phase 5",
    total_days: 5,
    daily_rate: 8000,
    total_amount: 40000,
    status: "active",
    created_at: new Date("2024-12-23"),
    history_type: "current"
  }
]);

print("✓ TABLE 5 - Rental History: " + db.rental_history.countDocuments() + " records");

// CREATE INDEXES
db.customers.createIndex({ customer_id: 1 }, { unique: true });
db.customers.createIndex({ email: 1 });
db.cars.createIndex({ car_id: 1 }, { unique: true });
db.cars.createIndex({ status: 1 });
db.cars.createIndex({ type: 1 });
db.rentals.createIndex({ rental_id: 1 }, { unique: true });
db.rentals.createIndex({ customer_id: 1 });
db.rentals.createIndex({ status: 1 });
db.payments.createIndex({ payment_id: 1 }, { unique: true });
db.payments.createIndex({ rental_id: 1 });
db.rental_history.createIndex({ rental_id: 1 }, { unique: true });
db.rental_history.createIndex({ customer_id: 1 });
db.rental_history.createIndex({ status: 1 });
db.rental_history.createIndex({ history_type: 1 });
db.rental_history.createIndex({ created_at: -1 });

print("\n");
print("LAHORE DATABASE SETUP COMPLETE!");
print("Database: lahore_carRentalDB");
print("Tables:");
print("  - Customers: " + db.customers.countDocuments() + "/10");
print("  - Cars: " + db.cars.countDocuments() + "/20");
print("  - Rentals: " + db.rentals.countDocuments());
print("  - Payments: " + db.payments.countDocuments());
print("  - Rental History: " + db.rental_history.countDocuments());
print("LHR SETUP COMPLETED!\n");