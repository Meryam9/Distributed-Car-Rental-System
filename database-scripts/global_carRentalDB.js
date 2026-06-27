// GLOBAL MASTER DATABASE 

db = db.getSiblingDB('global_carRentalDB');

db.customers.drop();
db.sync_log.drop();

// CUSTOMERS TABLE (MASTER COPY)
db.customers.insertMany([
  { 
    customer_id: "CUST001", 
    name: "Ahmed Khan", 
    email: "ahmed.khan@email.com", 
    password: "password123",
    phone: "+92-300-1234567",
    cnic: "12345-6789012-3",
    driving_license: "LHR-1234567",
    registered_date: new Date("2024-01-15"),
    original_city: "Lahore",
    status: "active",
    total_rentals: 3,
    total_spent: 39000
  },
  { 
    customer_id: "CUST002", 
    name: "Fatima Ali", 
    email: "fatima.ali@email.com", 
    password: "password123",
    phone: "+92-321-7654321",
    cnic: "12345-6789012-4",
    driving_license: "KHI-7654321",
    registered_date: new Date("2024-02-20"),
    original_city: "Karachi",
    status: "active",
    total_rentals: 2,
    total_spent: 9600
  },
  { 
    customer_id: "CUST003", 
    name: "Bilal Ahmed", 
    email: "bilal.ahmed@email.com", 
    password: "password123",
    phone: "+92-333-9876543",
    cnic: "12345-6789012-5",
    driving_license: "ISB-9876543",
    registered_date: new Date("2024-03-10"),
    original_city: "Islamabad",
    status: "active",
    total_rentals: 2,
    total_spent: 32800
  },
  { 
    customer_id: "CUST004", 
    name: "Sana Riaz", 
    email: "sana.riaz@email.com", 
    password: "password123",
    phone: "+92-312-4567890",
    cnic: "12345-6789012-6",
    driving_license: "LHR-2345678",
    registered_date: new Date("2024-01-25"),
    original_city: "Lahore",
    status: "active",
    total_rentals: 1,
    total_spent: 9000
  },
  { 
    customer_id: "CUST005", 
    name: "Omar Farooq", 
    email: "omar.farooq@email.com", 
    password: "password123",
    phone: "+92-345-5678901",
    cnic: "12345-6789012-7",
    driving_license: "KHI-3456789",
    registered_date: new Date("2024-03-05"),
    original_city: "Karachi",
    status: "active",
    total_rentals: 1,
    total_spent: 39000
  },
  { 
    customer_id: "CUST006", 
    name: "Zara Tariq", 
    email: "zara.tariq@email.com", 
    password: "password123",
    phone: "+92-334-6789012",
    cnic: "12345-6789012-8",
    driving_license: "ISB-4567890",
    registered_date: new Date("2024-04-12"),
    original_city: "Islamabad",
    status: "active",
    total_rentals: 1,
    total_spent: 17800
  },
  { 
    customer_id: "CUST007", 
    name: "Hassan Raza", 
    email: "hassan.raza@email.com", 
    password: "password123",
    phone: "+92-322-7890123",
    cnic: "12345-6789012-9",
    driving_license: "LHR-5678901",
    registered_date: new Date("2024-05-18"),
    original_city: "Lahore",
    status: "active",
    total_rentals: 1,
    total_spent: 40000
  },
  { 
    customer_id: "CUST008", 
    name: "Ayesha Malik", 
    email: "ayesha.malik@email.com", 
    password: "password123",
    phone: "+92-313-8901234",
    cnic: "12345-6789013-0",
    driving_license: "KHI-6789012",
    registered_date: new Date("2024-06-22"),
    original_city: "Karachi",
    status: "active",
    total_rentals: 0,
    total_spent: 0
  },
  { 
    customer_id: "CUST009", 
    name: "Usman Chaudhry", 
    email: "usman.c@email.com", 
    password: "password123",
    phone: "+92-301-9012345",
    cnic: "12345-6789013-1",
    driving_license: "ISB-7890123",
    registered_date: new Date("2024-07-30"),
    original_city: "Islamabad",
    status: "active",
    total_rentals: 0,
    total_spent: 0
  },
  { 
    customer_id: "CUST010", 
    name: "Nadia Khan", 
    email: "nadia.khan@email.com", 
    password: "password123",
    phone: "+92-335-0123456",
    cnic: "12345-6789013-2",
    driving_license: "LHR-8901234",
    registered_date: new Date("2024-08-14"),
    original_city: "Lahore",
    status: "active",
    total_rentals: 0,
    total_spent: 0
  }
]);

print("✓ MASTER Customers Table: " + db.customers.countDocuments() + " customers");

// Create users collection for authentication (plain text passwords)
db.users.drop();
db.customers.find().forEach(function(customer) {
  db.users.insertOne({
    customer_id: customer.customer_id,
    name: customer.name,
    email: customer.email,
    password: customer.password,
    phone: customer.phone,
    cnic: customer.cnic,
    driving_license: customer.driving_license,
    role: "customer",
    total_rentals: customer.total_rentals,
    total_spent: customer.total_spent,
    created_at: customer.registered_date
  });
});

print("✓ Users collection created: " + db.users.countDocuments() + " users");

// SYNC LOG TABLE
db.sync_log.insertMany([
  { sync_id: "SYNC001", table: "customers", sync_date: new Date(), status: "completed", message: "Initial sync" }
]);

db.sync_log.createIndex({ sync_date: -1 });

// Create indexes
db.customers.createIndex({ customer_id: 1 }, { unique: true });
db.customers.createIndex({ email: 1 }, { unique: true });
db.customers.createIndex({ cnic: 1 }, { unique: true });

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ customer_id: 1 }, { unique: true });

print("\n");
print("GLOBAL MASTER DATABASE SETUP COMPLETE!");
print("Database: global_carRentalDB");
print("Tables:");
print("  - customers (MASTER COPY): " + db.customers.countDocuments() + " records");
print("  - users (AUTHENTICATION): " + db.users.countDocuments() + " records");
print("  - sync_log: " + db.sync_log.countDocuments() + " records");
print("\n");