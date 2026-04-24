# MeterFlow - Usage-Based API Billing Platform

A full-stack MERN application for API usage tracking, rate limiting, and billing based on API consumption.

## 🚀 Project Overview

MeterFlow is a SaaS platform that allows developers to:
- Create and manage APIs
- Generate API keys for consumers
- Track usage (per request)
- Apply rate limiting
- Calculate billing based on usage

This simulates real-world systems used by API companies like Stripe, RapidAPI, and AWS API Gateway.

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Cache/Rate Limiting:** Redis
- **Authentication:** JWT

### Frontend
- **Framework:** React
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **Charts:** Chart.js

## 📁 Project Structure

```
meterflow/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & Redis config
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # JWT utilities
│   │   └── index.js      # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/        # React pages
    │   ├── services/     # API services
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🔑 Core Features

### 1. Authentication System
- JWT-based authentication
- Role-based access (Admin, API Owner, Consumer)
- Token refresh mechanism

### 2. API Management
- Create, update, delete APIs
- Generate API keys
- Revoke and rotate keys

### 3. API Gateway (Core Feature) ⚡
- Validates API keys
- Applies rate limiting
- Logs every request
- Forwards requests to target APIs

### 4. Usage Tracking
- Logs each API request
- Tracks endpoint, method, status code, response time
- Provides analytics and stats

### 5. Billing Engine
- Free tier: 1,000 requests/month
- Paid tier: ₹0.50 per 100 requests
- Billing period tracking

### 6. Rate Limiting
- Per API key rate limits
- Redis-based implementation
- Configurable limits

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis

### Backend Setup

```bash
cd meterflow/backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meterflow
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
```

Start backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd meterflow/frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get profile

### API Management
- `GET /api/apis` - List all APIs
- `POST /api/apis` - Create API
- `GET /api/apis/:id` - Get API details
- `PUT /api/apis/:id` - Update API
- `DELETE /api/apis/:id` - Delete API
- `POST /api/apis/:id/keys` - Create API key
- `PUT /api/apis/:id/keys/:keyId/revoke` - Revoke key
- `POST /api/apis/:id/keys/:keyId/rotate` - Rotate key

### Usage & Billing
- `GET /api/usage/:apiId/logs` - Get usage logs
- `GET /api/usage/:apiId/stats` - Get usage stats
- `GET /api/usage/:apiId/billing` - Get billing info

### Gateway
- `/*` - All requests go through gateway with API key validation

## 📱 Frontend Pages

- **Login/Register** - Authentication
- **Dashboard** - Overview with charts
- **API Management** - CRUD for APIs
- **API Details** - View API with keys and logs
- **Billing** - Usage and billing information

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meterflow
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
REDIS_URL=redis://localhost:6379
```

## 📝 License

ISC