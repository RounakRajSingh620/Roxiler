# 🏪 Rating Platform - Store Rating & Management System

A full-stack web application for managing stores and user ratings with role-based access control (Admin, Store Owner, User).

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://roxiler-cyan.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend-API-blue)](https://roxiler-5cq0.onrender.com/)

## 🌐 Live Links

- **Frontend:** [https://roxiler-cyan.vercel.app/](https://roxiler-cyan.vercel.app/)
- **Backend API:** [https://roxiler-5cq0.onrender.com/](https://roxiler-5cq0.onrender.com/)
- **Repository:** [https://github.com/RounakRajSingh620/Roxiler](https://github.com/RounakRajSingh620/Roxiler)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Demo Credentials](#-demo-credentials)
- [Screenshots](#-screenshots)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👨‍💼 Admin Features
- 📊 Dashboard with comprehensive statistics
- 👥 User management (Create, Read, Update, Delete)
- 🏪 Store management with owner assignment
- 🔍 Advanced filtering and sorting capabilities
- 📈 View all ratings and analytics

### 🏪 Store Owner Features
- 📊 Store-specific dashboard
- ⭐ View average ratings
- 👥 See list of users who rated their store
- 📧 Access to rater contact information
- 📉 Rating trends and insights

### 👤 User Features
- ⭐ Rate stores (1-5 stars)
- 📝 Update existing ratings
- 🔍 Browse and search stores
- 🔐 Secure authentication
- 👤 Profile management

### 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS protection
- Secure password requirements

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js
- **Styling:** Tailwind CSS / CSS3
- **HTTP Client:** Axios
- **Routing:** React Router
- **State Management:** React Context API / Redux
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (Railway)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Deployment:** Render

### Database
- **Database:** MySQL 8.0
- **Hosting:** Railway
- **ORM/Query Builder:** mysql2 with promises

## 🔑 Demo Credentials

### Admin Account
```
Email: admin@platform.com
Password: Admin@123
```

### Test User Account (Create via signup)
```
You can register a new user account through the signup page
```

### Test Store Owner (Create via Admin)
```
Admin can create store owners from the admin dashboard
```

## 🏗 System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │─────▶│  Express API    │─────▶│  MySQL Database │
│    (Vercel)     │      │    (Render)     │      │    (Railway)    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🚀 Installation

### Prerequisites
- Node.js >= 18.0.0
- MySQL 8.0 or higher
- Git

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/RounakRajSingh620/Roxiler.git
cd Roxiler
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd rating-platform/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**.env Configuration:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rating_platform
DB_PORT=3306

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_jwt_secret_here

# CORS
FRONTEND_URL=http://localhost:5173
```

```bash
# Initialize database tables
npm run init-db

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
nano .env
```

**.env Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📡 API Documentation

### Base URL
```
Production: https://roxiler-5cq0.onrender.com/api
Local: http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe Example User Name Here",
  "email": "user@example.com",
  "password": "Password@123",
  "address": "123 Main Street, City, State, ZIP"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Password
```http
PUT /auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

### Store Endpoints

#### Get All Stores
```http
GET /stores
Authorization: Bearer <token>

#### Create Store (Admin Only)
```http
POST /stores
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Example Store Name Goes Here Now",
  "email": "store@example.com",
  "password": "Password@123",
  "address": "456 Store Street, City, State, ZIP"
}
```

#### Get Store Dashboard (Store Owner Only)
```http
GET /stores/dashboard
Authorization: Bearer <token>
```

### Rating Endpoints

#### Submit/Update Rating (User Only)
```http
POST /ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "storeId": 1,
  "rating": 5
}
```

#### Get User's Rating for Store
```http
GET /ratings/store/:storeId
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Dashboard Stats (Admin Only)
```http
GET /users/dashboard/stats
Authorization: Bearer <token>
```

#### Create User (Admin Only)
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New User Full Name Goes Here",
  "email": "newuser@example.com",
  "password": "Password@123",
  "address": "789 User Avenue, City, State, ZIP",
  "role": "user"
}
```

#### Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer <token>


#### Get User Details (Admin Only)
```http
GET /users/:id
Authorization: Bearer <token>
```

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_name (name)
);
```

### Stores Table
```sql
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400) NOT NULL,
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_name (name),
  INDEX idx_email (email),
  INDEX idx_owner (owner_id)
);
```

### Ratings Table
```sql
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (user_id, store_id),
  INDEX idx_store (store_id),
  INDEX idx_user (user_id)
);
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin master
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `rating-platform/frontend`
   - Add environment variable:
     ```
     VITE_API_URL=https://roxiler-5cq0.onrender.com/api
     ```
   - Deploy

### Backend Deployment (Render)

1. **Set up Railway MySQL Database**
   - Create account on [railway.app](https://railway.app)
   - Create new MySQL database
   - Note the connection credentials

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repository
   - Set root directory to `rating-platform/backend`
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     DB_HOST=your-railway-host
     DB_USER=root
     DB_PASSWORD=your-railway-password
     DB_NAME=railway
     DB_PORT=your-railway-port
     JWT_SECRET=your-jwt-secret
     FRONTEND_URL=https://roxiler-cyan.vercel.app
     ```
   - Deploy

3. **Initialize Database**
   - After deployment, call the setup endpoint once:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/setup/initialize \
     -H "Content-Type: application/json" \
     -d '{"secret":"my-secret-key-12345"}'
   ```

## 📝 Validation Rules

### User/Store Name
- Length: 20-60 characters
- Required field

### Email
- Valid email format
- Unique in database

### Password
- Length: 8-16 characters
- Must contain at least one uppercase letter
- Must contain at least one special character (!@#$%^&*(),.?":{}|<>)

### Address
- Maximum length: 400 characters
- Required field

### Rating
- Integer value between 1-5
- Required field


<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Rounak Raj Singh](https://github.com/RounakRajSingh620)

</div>
