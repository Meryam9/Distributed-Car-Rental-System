// MASTER SETUP 

print("\n");
print("     PAKISTAN CAR RENTAL SYSTEM - DISTRIBUTED SETUP                           ");
print("     Architecture: Customers Master in Global, Replicated to ALL Cities       ");
print("     Rental History: Stored ONLY in individual city databases                 ");
print("\n");

const scripts = [
    "global_carRentalDB.js",
    "lahore_carRentalDB.js",
    "karachi_carRentalDB.js",
    "islamabad_carRentalDB.js"
];

for (let script of scripts) {
    print(`\n>>> Executing ${script}...`);
    try {
        load(script);
        print(`✅ ${script} completed\n`);
    } catch(e) {
        print(`❌ Error in ${script}: ${e}\n`);
    }
}

// FINAL VERIFICATION
print("\n");
print("                    SYSTEM VERIFICATION                                       ");
print("\n");

// Check each city database
const cities = [
    { name: "Lahore", db: "lahore_carRentalDB" },
    { name: "Karachi", db: "karachi_carRentalDB" },
    { name: "Islamabad", db: "islamabad_carRentalDB" }
];

let totalCars = 0;
let totalRentals = 0;
let totalPayments = 0;
let totalHistory = 0;

for (let city of cities) {
    let dbConn = db.getSiblingDB(city.db);
    let cars = dbConn.cars.countDocuments();
    let rentals = dbConn.rentals.countDocuments();
    let payments = dbConn.payments.countDocuments();
    let history = dbConn.rental_history ? dbConn.rental_history.countDocuments() : 0;
    let customers = dbConn.customers.countDocuments();
    
    totalCars += cars;
    totalRentals += rentals;
    totalPayments += payments;
    totalHistory += history;
    
    print(` ${city.name.toUpperCase()}:`);
    print(`   ├─ Customers (Replica): ${customers}/10`);
    print(`   ├─ Cars (Local Fleet): ${cars}/20`);
    print(`   ├─ Active Rentals: ${rentals}`);
    print(`   ├─ Payments: ${payments}`);
    print(`   └─ Rental History: ${history}\n`);
}

// Global DB check (MASTER DATA ONLY)
let globalDB = db.getSiblingDB('global_carRentalDB');
let masterCustomers = globalDB.customers.countDocuments();
let syncLogs = globalDB.sync_log.countDocuments();

print("🌍 GLOBAL MASTER DATABASE (MASTER DATA ONLY):");
print(`   ├─ Master Customers: ${masterCustomers}/10`);
print(`   ├─ Sync Logs: ${syncLogs}`);
print(`   └─ ⚠️  NO rental history stored here (only in city DBs)\n`);

print("                    SETUP COMPLETE!                                          ");
print(`  Total Cars:         ${totalCars}/60                                        `);
print(`  Total Active Rentals:  ${totalRentals}                                     `);
print(`  Total Payments:      ${totalPayments}                                      `);
print(`  Total Rental History: ${totalHistory} records                              `);
print(`  Cities:              3 (Lahore, Karachi, Islamabad)                        `);
print(`  Architecture:        Customers Master in Global → Replicated to Cities     `);
print(`  Rental History:      Stored ONLY in individual city databases              `);
print("\n");

// Sample Cross-City Query Examples
print("📝 SAMPLE QUERIES:\n");

print("1. Get master customer data (Global DB):");
print("   use global_carRentalDB");
print("   db.customers.find({ original_city: 'Lahore' });\n");

print("2. Get rental history for a customer (City DB):");
print("   use lahore_carRentalDB");
print("   db.rental_history.find({ customer_id: 'CUST001' }).pretty();\n");

print("3. Get all active rentals across a city:");
print("   use karachi_carRentalDB");
print("   db.rentals.find({ status: 'active' }).pretty();\n");

print("4. Get customer spending summary (from city DBs):");
print("   db.rentals.aggregate([");
print("     { $group: {");
print("         _id: '$customer_id',");
print("         total_spent: { $sum: '$total_amount' },");
print("         rental_count: { $sum: 1 }");
print("       }");
print("     },");
print("     { $sort: { total_spent: -1 } }");
print("   ]);\n");

print("5. Replicate new customer from Global to all cities:");
print("   // Run this in global_carRentalDB after inserting new customer");
print("   const newCustomer = db.customers.findOne({ customer_id: 'CUST011' });");
print("   ['lahore', 'karachi', 'islamabad'].forEach(city => {");
print("     db.getSiblingDB(city + '_carRentalDB').customers.insertOne(newCustomer);");
print("   });\n");

print("✅ System ready with proper separation of concerns!");
print("   • Global DB: Master customer data only");
print("   • City DBs: Cars, Rentals, Payments, Rental History");