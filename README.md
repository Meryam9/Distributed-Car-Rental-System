# 🚗Distributed CarRental System — Pakistan
A distributed car rental management system built with React, Node.js, and MongoDB: featuring city-wise fleet management across Lahore, Karachi &amp; Islamabad, real-time booking, admin dashboard, and a multi-database architecture.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Distributed — 4 DBs) |
| Auth | JWT / Session-based |
| Notifications | React Hot Toast |

---

## 🗄 Database Architecture

The system uses a **distributed MongoDB setup** with 4 separate databases:

```
global_carRentalDB     → Master customer data + authentication (users)
lahore_carRentalDB     → Lahore fleet, rentals, payments, history
karachi_carRentalDB    → Karachi fleet, rentals, payments, history
islamabad_carRentalDB  → Islamabad fleet, rentals, payments, history
```

- Every new customer is **replicated to all 3 city DBs** automatically on registration
- Rental history is stored **only in city DBs** (not global)
- `global_carRentalDB` acts as the single source of truth for customer identity

---

## ✨ Features

**Customer**
- Register & login with email/password
- Browse 60+ cars across 3 cities
- Book a car with pickup/return dates and locations
- View active and past rentals

**Admin**
- Overview dashboard with key stats
- Manage fleet (add/edit/remove cars)
- View all rentals and payments across cities
- Manage customers and locations
- Real-time alerts panel

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally on port `27017`

### 1. Seed the databases
```bash
cd database-scripts
mongosh --file setup_all_databases.js
```

### 2. Start the backend
```bash
cd backend
npm install
node server.js
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000` — backend at `http://localhost:5000`.

---

## 📁 Project Structure

```
CAR RENTAL SYSTEM/
├── backend/
│   ├── config/
│   │   └── database.js        # MongoDB connection manager
│   └── server.js              # Express API routes
├── database-scripts/
│   ├── setup_all_databases.js # Run once to seed all DBs
│   ├── global_carRentalDB.js
│   ├── lahore_carRentalDB.js
│   ├── karachi_carRentalDB.js
│   └── islamabad_carRentalDB.js
└── frontend/
    └── src/
        ├── components/        # Navbar, Footer, CarSearch, BookingForm
        ├── context/           # AuthContext
        ├── pages/             # Home, Cars, Booking, Dashboards, Auth
        └── services/          # api.js
```

---

## 🔑 Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | meryam.gmail.com | 124578 |
| Customer | fatima.ali@email.com | password123 |

> ⚠️ Passwords are stored in plain text for academic/demo purposes only. Do not use in production.

---

## 📍 Cities & Fleet

| City | Locations | Cars |
|------|-----------|------|
| Lahore | Airport, Gulberg, DHA, MM Alam, Model Town, Johar Town | 20 |
| Karachi | Jinnah Airport, Clifton, DHA, Gulshan, North Nazimabad | 20 |
| Islamabad | New Islamabad Airport, F-7, F-10, Blue Area, G-11, E-11 | 20 |

Car types: Economy · Sedan · Hatchback · SUV · Crossover · Hybrid · Luxury


*Built as a Database Systems project — demonstrating distributed database design with MongoDB.*
