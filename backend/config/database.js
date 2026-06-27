const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(MONGODB_URI);

class DatabaseManager {
    constructor() {
        this.databases = {};
    }

    async connect() {
        try {
            await client.connect();
            console.log('✅ MongoDB connected successfully');
            
            this.databases = {
                global: client.db('global_carRentalDB'),
                lahore: client.db('lahore_carRentalDB'),
                karachi: client.db('karachi_carRentalDB'),
                islamabad: client.db('islamabad_carRentalDB')
            };
            
            // Ensure collections exist
            for (const [name, db] of Object.entries(this.databases)) {
                const collections = await db.listCollections().toArray();
                console.log(`   📁 ${name}: ${collections.length} collections`);
            }
            
            return client;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    getGlobalDB() {
        return this.databases.global;
    }

    getCityDB(city) {
        const cityMap = {
            'lahore': 'lahore',
            'karachi': 'karachi',
            'islamabad': 'islamabad'
        };
        const dbKey = cityMap[city.toLowerCase()];
        if (!this.databases[dbKey]) {
            throw new Error(`Database not found for city: ${city}`);
        }
        return this.databases[dbKey];
    }

    async close() {
        await client.close();
        console.log('📴 MongoDB connection closed');
    }
}

module.exports = new DatabaseManager();