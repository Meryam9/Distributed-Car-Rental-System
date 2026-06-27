// KARACHI CITY DATABASE

db = db.getSiblingDB('karachi_carRentalDB');

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

// TABLE 2: CARS (KARACHI SPECIFIC - 20 cars)
db.cars.insertMany([
  { car_id: "KHI_CAR001", brand: "Toyota", model: "Corolla", year: 2024, type: "Sedan", price_per_day: 5200, status: "available", plate: "KHI-2001", location: "Jinnah Airport", features: ["1.8L", "Auto AC", "Cruise Control"] },
  { car_id: "KHI_CAR002", brand: "Suzuki", model: "Cultus", year: 2023, type: "Economy", price_per_day: 3200, status: "available", plate: "KHI-2002", location: "Clifton", features: ["AC", "Power Windows", "USB"] },
  { car_id: "KHI_CAR003", brand: "Honda", model: "Civic", year: 2024, type: "Sedan", price_per_day: 6500, status: "available", plate: "KHI-2003", location: "DHA Phase 8", features: ["Turbo", "Leather", "Sunroof"] },
  { car_id: "KHI_CAR004", brand: "KIA", model: "Sportage", year: 2023, type: "SUV", price_per_day: 8500, status: "available", plate: "KHI-2004", location: "Jinnah Airport", features: ["AWD", "Panoramic", "Push Start"] },
  { car_id: "KHI_CAR005", brand: "Suzuki", model: "Wagon R", year: 2024, type: "Economy", price_per_day: 2500, status: "available", plate: "KHI-2005", location: "Gulshan-e-Iqbal", features: ["Spacious", "Good Mileage", "Family Car"] },
  { car_id: "KHI_CAR006", brand: "Toyota", model: "Yaris", year: 2023, type: "Sedan", price_per_day: 4800, status: "available", plate: "KHI-2006", location: "North Nazimabad", features: ["1.3L", "Keyless", "Rear Camera"] },
  { car_id: "KHI_CAR007", brand: "Hyundai", model: "Elantra", year: 2024, type: "Sedan", price_per_day: 5800, status: "available", plate: "KHI-2007", location: "Clifton", features: ["Sunroof", "Wireless Charging", "Ambient Light"] },
  { car_id: "KHI_CAR008", brand: "Toyota", model: "Fortuner", year: 2024, type: "SUV", price_per_day: 13000, status: "available", plate: "KHI-2008", location: "DHA Phase 8", features: ["4x4 Diesel", "7 Seats", "Navigation"] },
  { car_id: "KHI_CAR009", brand: "Suzuki", model: "Swift", year: 2023, type: "Hatchback", price_per_day: 3500, status: "available", plate: "KHI-2009", location: "Jinnah Airport", features: ["Sporty", "ABS", "Airbags"] },
  { car_id: "KHI_CAR010", brand: "Honda", model: "BR-V", year: 2024, type: "SUV", price_per_day: 7800, status: "available", plate: "KHI-2010", location: "Gulshan-e-Iqbal", features: ["7 Seater", "Rear AC", "Fog Lights"] },
  { car_id: "KHI_CAR011", brand: "KIA", model: "Picanto", year: 2023, type: "Economy", price_per_day: 2300, status: "available", plate: "KHI-2011", location: "North Nazimabad", features: ["Auto", "Compact", "City Car"] },
  { car_id: "KHI_CAR012", brand: "Toyota", model: "Camry", year: 2024, type: "Luxury", price_per_day: 12000, status: "available", plate: "KHI-2012", location: "Clifton", features: ["Hybrid", "JBL Sound", "Heated Seats"] },
  { car_id: "KHI_CAR013", brand: "Suzuki", model: "Alto", year: 2024, type: "Economy", price_per_day: 1800, status: "available", plate: "KHI-2013", location: "Jinnah Airport", features: ["660cc", "AC", "Best for Rent"] },
  { car_id: "KHI_CAR014", brand: "Hyundai", model: "Tucson", year: 2023, type: "SUV", price_per_day: 8800, status: "available", plate: "KHI-2014", location: "DHA Phase 8", features: ["AWD", "Sunroof", "Digital Cluster"] },
  { car_id: "KHI_CAR015", brand: "Honda", model: "City", year: 2024, type: "Sedan", price_per_day: 5000, status: "available", plate: "KHI-2015", location: "Gulshan-e-Iqbal", features: ["1.5L", "Eco Mode", "Rear Sensor"] },
  { car_id: "KHI_CAR016", brand: "Toyota", model: "Prius", year: 2023, type: "Hybrid", price_per_day: 7200, status: "available", plate: "KHI-2016", location: "Clifton", features: ["Fuel Saver", "Electric", "Quiet Drive"] },
  { car_id: "KHI_CAR017", brand: "KIA", model: "Stonic", year: 2024, type: "Crossover", price_per_day: 5800, status: "available", plate: "KHI-2017", location: "Jinnah Airport", features: ["Sunroof", "Red", "Sporty"] },
  { car_id: "KHI_CAR018", brand: "Suzuki", model: "Vitara", year: 2023, type: "SUV", price_per_day: 6800, status: "available", plate: "KHI-2018", location: "North Nazimabad", features: ["4x4", "Roof Rails", "Alloy Rims"] },
  { car_id: "KHI_CAR019", brand: "Mercedes", model: "C-Class", year: 2024, type: "Luxury", price_per_day: 18000, status: "available", plate: "KHI-2019", location: "DHA Phase 8", features: ["AMG", "Burmester", "Ambient Light"] },
  { car_id: "KHI_CAR020", brand: "BMW", model: "X1", year: 2024, type: "Luxury SUV", price_per_day: 16000, status: "available", plate: "KHI-2020", location: "Clifton", features: ["xDrive", "Panoramic", "Heated Seats"] }
]);

print("✓ TABLE 2 - Cars (Karachi Only): " + db.cars.countDocuments() + " cars");

// TABLE 3: RENTALS (Karachi Transactions)
db.rentals.insertMany([
  {
    rental_id: "RENT_KHI_001",
    customer_id: "CUST002",
    customer_name: "Fatima Ali",
    car_id: "KHI_CAR002",
    car_name: "Suzuki Cultus",
    pickup_date: new Date("2024-12-21"),
    return_date: new Date("2024-12-24"),
    pickup_location: "Clifton",
    return_location: "Jinnah Airport",
    total_days: 3,
    daily_rate: 3200,
    total_amount: 9600,
    status: "completed",
    payment_status: "completed",
    created_at: new Date()
  },
  {
    rental_id: "RENT_KHI_002",
    customer_id: "CUST005",
    customer_name: "Omar Farooq",
    car_id: "KHI_CAR010",
    car_name: "Honda BR-V",
    pickup_date: new Date("2024-12-23"),
    return_date: new Date("2024-12-28"),
    pickup_location: "Gulshan-e-Iqbal",
    return_location: "DHA Phase 8",
    total_days: 5,
    daily_rate: 7800,
    total_amount: 39000,
    status: "active",
    payment_status: "partial",
    created_at: new Date()
  }
]);

print("✓ TABLE 3 - Rentals (Karachi): " + db.rentals.countDocuments() + " records");

// TABLE 4: PAYMENTS (Karachi Payments)
db.payments.insertMany([
  {
    payment_id: "PAY_KHI_001",
    rental_id: "RENT_KHI_001",
    customer_id: "CUST002",
    amount: 9600,
    payment_method: "Credit Card",
    payment_date: new Date("2024-12-21"),
    status: "completed",
    transaction_id: "TXN_001_KHI"
  },
  {
    payment_id: "PAY_KHI_002",
    rental_id: "RENT_KHI_002",
    customer_id: "CUST005",
    amount: 20000,
    payment_method: "Cash",
    payment_date: new Date("2024-12-23"),
    status: "partial",
    transaction_id: "TXN_002_KHI"
  }
]);

print("✓ TABLE 4 - Payments (Karachi): " + db.payments.countDocuments() + " records");

// TABLE 5: RENTAL HISTORY (Karachi)
db.rental_history.insertMany([
  {
    history_id: "HIST_KHI_001",
    rental_id: "RENT_KHI_001",
    customer_id: "CUST002",
    customer_name: "Fatima Ali",
    car_id: "KHI_CAR002",
    car_name: "Suzuki Cultus",
    pickup_date: new Date("2024-12-21"),
    return_date: new Date("2024-12-24"),
    pickup_location: "Clifton",
    return_location: "Jinnah Airport",
    total_days: 3,
    daily_rate: 3200,
    total_amount: 9600,
    status: "completed",
    payment_status: "completed",
    created_at: new Date("2024-12-21"),
    completed_at: new Date("2024-12-24"),
    history_type: "completed"
  },
  {
    history_id: "HIST_KHI_002",
    rental_id: "RENT_KHI_002",
    customer_id: "CUST005",
    customer_name: "Omar Farooq",
    car_id: "KHI_CAR010",
    car_name: "Honda BR-V",
    pickup_date: new Date("2024-12-23"),
    return_date: new Date("2024-12-28"),
    pickup_location: "Gulshan-e-Iqbal",
    return_location: "DHA Phase 8",
    total_days: 5,
    daily_rate: 7800,
    total_amount: 39000,
    status: "active",
    payment_status: "partial",
    created_at: new Date("2024-12-23"),
    history_type: "current"
  }
]);

print("✓ TABLE 5 - Rental History (Karachi): " + db.rental_history.countDocuments() + " records");

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
print("KARACHI DATABASE SETUP COMPLETE!");
print("Database: karachi_carRentalDB");
print("Tables:");
print("  - Customers: " + db.customers.countDocuments() + "/10");
print("  - Cars: " + db.cars.countDocuments() + "/20");
print("  - Rentals: " + db.rentals.countDocuments());
print("  - Payments: " + db.payments.countDocuments());
print("  - Rental History: " + db.rental_history.countDocuments());
print("KARACHI_SETUP COMPLETED! \n");