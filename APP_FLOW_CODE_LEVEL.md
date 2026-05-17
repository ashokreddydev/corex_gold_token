# Gold Token App - Code Level Flow Documentation

## Overview
This document explains the complete flow of the application at the code level, from UI to Backend to Database, with specific focus on the Admin login flow.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Redux)                 │
│                    Port: 3505                               │
├─────────────────────────────────────────────────────────────┤
│                    Vite Proxy                               │
│              /api → http://localhost:3505                   │
├─────────────────────────────────────────────────────────────┤
│                BACKEND (Node.js + Express)                  │
│              Port: 3505 (API endpoints)                     │
├─────────────────────────────────────────────────────────────┤
│              DATABASE (MongoDB)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Admin Login Flow - Complete Code Walkthrough

### Admin Credentials
```
Email: Admin@gmail.com
Password: Admin@2026
```

---

## 3. Step-by-Step Flow

### **STEP 1: Frontend - User Enters Credentials (LoginPage.jsx)**

**File:** `frontend/src/pages/LoginPage.jsx`

```javascript
// User fills email and password
const handleEmailLogin = async (values) => {
  try {
    setLoading(true)              // Show loading spinner
    setError('')                   // Clear any previous errors
    
    // values = { email: "Admin@gmail.com", password: "Admin@2026" }
    const response = await authService.login(
      values.email, 
      values.password
    )
    
    console.log('Login response:', response)
    // response = { token: "jwt_token_here", user: {...} }
    
    dispatch(setUser(response.user))  // Store user in Redux state
    setTimeout(() => navigate('/dashboard'), 100)  // Redirect to dashboard
    
  } catch (err) {
    setError(err.message || 'Login failed')  // Show error message
  } finally {
    setLoading(false)
  }
}
```

**What Happens:**
- User clicks "Login" button
- Form data is validated
- `authService.login()` is called

---

### **STEP 2: Frontend - API Call (authService.js)**

**File:** `frontend/src/services/authService.js`

```javascript
export const authService = {
  login: async (email, password) => {
    // Make HTTP POST request to backend
    const response = await apiClient.post('/auth/login', { 
      email: "Admin@gmail.com",      // ← Data being sent
      password: "Admin@2026"          // ← Data being sent
    });
    
    // response.data = { token, user }
    // The apiClient interceptor returns response.data automatically
    
    if (response.token) {
      // Store JWT token in browser localStorage
      localStorage.setItem('token', response.token);
    }
    
    return response;  // { token: "...", user: {...} }
  }
}
```

**What Happens:**
- Credentials are packaged as JSON: `{ email, password }`
- HTTP POST request sent to `/api/auth/login`
- JWT token is stored in localStorage for future requests

---

### **STEP 3: Frontend - API Client Setup (apiClient.js)**

**File:** `frontend/src/services/apiClient.js`

```javascript
const apiClient = axios.create({
  baseURL: "/api",  // Relative path - uses Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handles errors and auto-logout on 401
apiClient.interceptors.response.use(
  (response) => response.data,  // Returns only response.data
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';  // Auto-redirect to login
    }
    return Promise.reject(error.response?.data || error.message);
  },
);
```

**What Happens:**
- Request URL becomes: `http://localhost:3505/api/auth/login`
- Content-Type header is set to application/json
- Response returns only the data (not full axios response)

---

### **STEP 4: Vite Proxy Routes Request to Backend**

**File:** `frontend/vite.config.js`

```javascript
server: {
  port: 3505,
  proxy: {
    '/api': {
      target: 'http://localhost:3505',  // ← Routes to backend
      changeOrigin: true,
      secure: false
    },
  },
}
```

**HTTP Request Sent:**
```
POST /api/auth/login HTTP/1.1
Host: localhost:3505
Content-Type: application/json

{
  "email": "Admin@gmail.com",
  "password": "Admin@2026"
}
```

---

### **STEP 5: Backend - Express Route Handler (authRoutes.js)**

**File:** `backend/src/routes/authRoutes.js`

```javascript
import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,                    // Rate limiting middleware
  body('email').isEmail(),        // Validate email format
  body('password').isLength({ min: 6 }),  // Validate password length
  handleValidationErrors,         // Check for validation errors
  authController.login            // ← Call login controller
);

export default router;
```

**What Happens:**
1. Request matches the `/login` route
2. Rate limiter checks if user has exceeded request limits
3. Email and password are validated
4. If valid, `authController.login` is called

---

### **STEP 6: Backend - Controller (authController.js)**

**File:** `backend/src/controllers/authController.js`

```javascript
import * as authService from '../services/authService.js';

export const login = async (req, res, next) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;  
    // email = "Admin@gmail.com"
    // password = "Admin@2026"

    // Call authService to handle business logic
    const result = await authService.login(email, password);
    // result = { token: "jwt_token", user: {...} }

    // Send response back to frontend
    res.json(result);
    
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};
```

**What Happens:**
- Request body is extracted
- `authService.login()` is called
- Response is sent back to frontend

---

### **STEP 7: Backend - Service Layer (authService.js)**

**File:** `backend/src/services/authService.js`

```javascript
import User from '../models/User.js';

export const login = async (email, password) => {
  // 1. Find user by email in database
  const user = await User.findOne({ email });  
  // Searches: db.users.findOne({ email: "Admin@gmail.com" })

  // 2. Validate credentials
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }

  // 3. Check if account is active
  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  // 4. Update last login timestamp
  user.lastLogin = new Date();
  await user.save();
  // Updates: db.users.updateOne({ _id: user._id }, { lastLogin: "2026-05-17..." })

  // 5. Generate JWT token
  const token = generateToken(user._id, user.role);
  // token = jwt.sign({ userId, role }, secret, { expiresIn: "7d" })

  // 6. Return token and user data
  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,  // "admin" for Admin user
    },
  };
};

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    config.jwt.secret,  // Secret key from environment
    { expiresIn: config.jwt.expiresIn },  // Usually "7d"
  );
};
```

**What Happens:**
1. Database query: Find user with email "Admin@gmail.com"
2. Compare hashed password with provided password
3. Check if account is active
4. Update last login timestamp
5. Generate JWT token valid for 7 days
6. Return token and user data

---

### **STEP 8: Backend - Database Query (User Model)**

**File:** `backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { timestamps: true },  // Auto-adds createdAt, updatedAt
);

// Pre-save hook: Hash password before storing
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Instance method: Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcryptjs.compare(password, this.password);
  // Returns true/false by comparing:
  // - Provided password: "Admin@2026" (plain text)
  // - Stored password: "$2a$10$..." (hashed)
};

export default mongoose.model('User', userSchema);
```

**Database Document (Admin User):**
```javascript
{
  _id: ObjectId("..."),
  email: "Admin@gmail.com",
  password: "$2a$10$...",  // Hashed password
  fullName: "Admin User",
  role: "admin",           // Important: Admin role
  isActive: true,
  lastLogin: "2026-05-17T10:30:00Z",
  createdAt: "2026-05-17T09:00:00Z",
  updatedAt: "2026-05-17T10:30:00Z"
}
```

---

### **STEP 9: Response Sent Back to Frontend**

**HTTP Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "Admin@gmail.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

---

### **STEP 10: Frontend - Redux Store Update**

**File:** `frontend/src/store/slices/authSlice.js` (implicit in flow)

```javascript
// From LoginPage.jsx:
dispatch(setUser(response.user));
// Stores in Redux:
// state.auth = {
//   user: {
//     id: "507f1f77bcf86cd799439011",
//     email: "Admin@gmail.com",
//     fullName: "Admin User",
//     role: "admin"
//   }
// }
```

---

### **STEP 11: Frontend - Redirect to Dashboard**

```javascript
// After successful login and Redux update
setTimeout(() => navigate('/dashboard'), 100);
// Redirects user to /dashboard page
```

---

## 4. Subsequent API Calls with Authentication

After login, every API request automatically includes the JWT token:

```javascript
// Example: Getting current user
const getCurrentUser = async () => {
  return apiClient.get('/auth/me');
};

// Request sent to backend:
GET /api/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Auth Middleware** (`backend/src/middleware/auth.js`):
```javascript
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    // Extract token from "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, config.jwt.secret);
    // Verify token is valid and not expired
    
    req.user = decoded;  // { userId, role, iat, exp }
    next();  // Allow request to proceed
    
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

---

## 5. Admin-Specific Features

After login, the role determines what admin can access:

```javascript
// In Protected Routes / Components
if (user.role === 'admin') {
  // Show admin dashboard
  // Access to:
  // - /admin - Admin panel
  // - POST /api/admin/* - Admin endpoints
  // - User management
  // - System settings
} else if (user.role === 'user') {
  // Show user dashboard
  // Access to:
  // - /dashboard - User dashboard
  // - Burn/Mint tokens
  // - Transaction history
}
```

---

## 6. Error Handling Flow

### **Invalid Credentials Example:**

```
Frontend ← Error Message ← Backend
  ↓
  "Invalid email or password"
  ↓
User sees error in UI
Auto-redirect to login if token expired (401)
```

### **Error Handling Middleware:**

```javascript
// backend/src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    message: message,
    status: status,
  });
};
```

---

## 7. Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcryptjs with salt rounds (10) |
| **JWT Token** | Signed with secret, expires in 7 days |
| **Token Storage** | localStorage in browser |
| **Rate Limiting** | authLimiter on login/register endpoints |
| **HTTPS** | Should be enabled in production |
| **CORS** | Configured in backend to allow frontend domain |

---

## 8. Complete Flow Summary

```
1. User enters: Admin@gmail.com / Admin@2026
   ↓
2. LoginPage validates input
   ↓
3. authService.login() makes HTTP POST to /api/auth/login
   ↓
4. Vite proxy routes to http://localhost:3505/api/auth/login
   ↓
5. Express router matches POST /login route
   ↓
6. Validation middleware checks email format and password length
   ↓
7. authController.login() calls authService.login()
   ↓
8. authService queries MongoDB for user
   ↓
9. bcryptjs compares provided password with stored hash
   ↓
10. Updates lastLogin timestamp
   ↓
11. JWT token is generated (valid 7 days)
   ↓
12. Response sent: { token, user: {...} }
   ↓
13. Frontend stores token in localStorage
   ↓
14. Redux store updated with user data
   ↓
15. User redirected to /dashboard
   ↓
16. Future API calls include Authorization header with JWT token
```

---

## 9. File Structure Reference

```
Frontend:
├── src/pages/LoginPage.jsx          ← UI Layer
├── src/services/authService.js      ← API Service Layer
├── src/services/apiClient.js        ← HTTP Client
├── src/store/slices/authSlice.js    ← State Management
└── vite.config.js                   ← Vite Proxy

Backend:
├── src/routes/authRoutes.js         ← Route Definitions
├── src/controllers/authController.js ← Request Handler
├── src/services/authService.js      ← Business Logic
├── src/models/User.js               ← Database Schema
├── src/middleware/auth.js           ← JWT Verification
├── src/middleware/validation.js     ← Input Validation
├── src/middleware/errorHandler.js   ← Error Handling
└── src/server.js                    ← Express App

Database:
└── MongoDB (users collection)        ← Data Storage
```

---

## 10. Testing the Admin Login

**curl Command to Test:**
```bash
curl -X POST http://localhost:3505/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Admin@gmail.com","password":"Admin@2026"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "Admin@gmail.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

---

## 11. Key Code Locations

| Functionality | File | Lines |
|---------------|------|-------|
| Login Form UI | `frontend/src/pages/LoginPage.jsx` | 27-33 |
| API Call | `frontend/src/services/authService.js` | 3-11 |
| Axios Config | `frontend/src/services/apiClient.js` | 1-12 |
| Routes | `backend/src/routes/authRoutes.js` | 11-19 |
| Controller | `backend/src/controllers/authController.js` | 1-10 |
| Service | `backend/src/services/authService.js` | 6-35 |
| Model | `backend/src/models/User.js` | 4-65 |
| Auth Middleware | `backend/src/middleware/auth.js` | - |

---

## 12. Next Steps for Different Scenarios

### **After Admin Login:**
1. Access `/admin` dashboard
2. Manage users, view logs
3. Configure system settings

### **For Regular User:**
1. Access `/dashboard`
2. Burn/Mint tokens
3. View transaction history

### **Token Expiration:**
1. Frontend receives 401 error
2. Token automatically removed from localStorage
3. User redirected to login page
4. User must login again

---

**Last Updated:** May 17, 2026
**Version:** 1.0
