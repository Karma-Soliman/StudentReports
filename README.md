# User Management REST API

A full-featured REST API built with Node.js, Express, and SQLite for user management with authentication and authorization.

## 🚀 Features

- **User CRUD Operations** - Create, Read, Update, Delete users
- **Authentication System** - JWT-based authentication with register/login
- **API Key Protection** - Secure endpoints with API key validation
- **SQLite Database** - Lightweight database with better-sqlite3
- **Password Hashing** - Secure password storage with bcrypt
- **Development Seeding** - Auto-populate sample data in dev mode
- **Environment Configuration** - Flexible config with dotenv
- **Middleware Architecture** - Logging, authentication, and API key validation
- **Error Handling** - Comprehensive error responses

## 📁 Project Structure
```
├── src/
│   ├── config/
│   │   ├── config.js          # Environment configuration
│   │   └── database.js        # Database setup & initialization
│   ├── controllers/
│   │   ├── authController.js  # Auth endpoints (register/login)
│   │   └── userController.js  # User CRUD endpoints
│   ├── middleware/
│   │   ├── apiKey.js          # API key validation
│   │   ├── authen.js          # JWT token verification
│   │   └── middleware.js      # Request logging
│   ├── models/
│   │   └── User.js            # User model & database operations
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── userRoutes.js      # User management routes
│   ├── services/
│   │   └── userServices.js    # Business logic layer
│   └── index.js               # App entry point
├── .env                       # Environment variables (not in git)
├── .env.example               # Example environment variables
├── database.sqlite            # SQLite database (auto-generated)
└── package.json
```

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcrypt
- **Environment Management**: dotenv

## ⚙️ Setup Instructions

### 1. Clone and Install
```bash
# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=./database.sqlite
API_KEY=your-secret-api-key-here
JWT_SECRET=your-jwt-secret-min-32-characters
JWT_EXPIRES_IN=24h
```

### 3. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3000`

## 📡 API Endpoints

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message & API info |
| GET | `/health` | Health check endpoint |
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### Protected Endpoints (Require JWT Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me` | Get current user info |

### Protected Endpoints (Require API Key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |