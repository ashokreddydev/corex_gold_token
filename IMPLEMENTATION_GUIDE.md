# Gold Token - Full Stack Application

Complete frontend and backend implementation for the Gold Token application.

## 📁 Project Structure

```
New_app_gold/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── pages/              # Application pages
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API & Web3 services
│   │   ├── hooks/              # Custom hooks
│   │   ├── store/              # Redux store
│   │   ├── styles/             # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── backend/                     # Express.js backend
│   ├── src/
│   │   ├── config/             # Database & configuration
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── GOLD_TToekn/               # Smart Contract (Blockchain)
│   └── [contract files]
│
└── [Documentation files]
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or MongoDB Atlas)
- MetaMask browser extension (for Web3 features)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# - MongoDB URI
# - JWT secret
# - Web3 credentials
# - Email credentials

# Start development server
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your configuration
# - API base URL (http://localhost:3000/api)
# - Web3 provider URLs
# - Gold Token address

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎯 Features Implemented

### Authentication
- ✅ Email/Password login and registration
- ✅ MetaMask Web3 login
- ✅ JWT token-based sessions (7-day expiry)
- ✅ Protected routes

### Token Operations
- ✅ View token balance
- ✅ Mint tokens (with admin approval)
- ✅ Burn tokens (with admin approval)
- ✅ Transaction history
- ✅ Vault balance display

### User Management
- ✅ View profile
- ✅ Update profile information
- ✅ Change password
- ✅ Account settings

### Admin Features
- ✅ View pending burn requests
- ✅ Approve/reject burn requests
- ✅ User management dashboard
- ✅ Admin access control

### Security
- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers

## 📱 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email/password or Web3 login |
| Dashboard | `/dashboard` | Main dashboard with balance |
| Mint | `/mint` | Request token minting |
| Burn | `/burn` | Request token burning |
| History | `/history` | View all transactions |
| Profile | `/profile` | Edit profile and settings |
| Admin | `/admin` | Manage burn requests (admin only) |

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login           - Login with email/password
POST   /api/auth/register        - Register new account
POST   /api/auth/web3-login      - Login with Web3
GET    /api/auth/me              - Get current user
POST   /api/auth/logout          - Logout
```

### Tokens
```
GET    /api/tokens/balance       - Get balance
GET    /api/tokens/info          - Get token info
POST   /api/tokens/mint          - Mint tokens
POST   /api/tokens/burn          - Burn tokens
GET    /api/tokens/history       - Get history
GET    /api/tokens/vault-balance - Get vault balance
GET    /api/tokens/burn-requests - Get burn requests
```

### Users
```
GET    /api/users/profile        - Get profile
PUT    /api/users/profile        - Update profile
POST   /api/users/change-password - Change password
GET    /api/users/settings       - Get settings
PUT    /api/users/settings       - Update settings
```

### Admin
```
GET    /api/admin/burn-requests           - Get burn requests
POST   /api/admin/burn-requests/:id/approve - Approve
POST   /api/admin/burn-requests/:id/reject  - Reject
GET    /api/admin/users                   - Get users
```

## 💾 Database Models

### User
- email (unique)
- password (hashed)
- fullName
- phone
- walletAddress (optional)
- role (user/admin)
- isVerified
- isActive
- lastLogin

### Transaction
- userId (reference)
- type (mint/burn/transfer/receive)
- amount
- from/to addresses
- txHash
- blockNumber
- status (pending/confirmed/failed)

### BurnRequest
- userId (reference)
- amount
- reason
- status (pending/approved/rejected/completed)
- approvedBy (reference)
- txHash
- rejectionReason

### AuditLog
- userId (reference)
- action
- resource
- details
- ipAddress
- userAgent
- Auto-deleted after 90 days

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gold-token
JWT_SECRET=your_secret_key
ADMIN_PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
GOLD_TOKEN_ADDRESS=0x...
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
VITE_GOLD_TOKEN_ADDRESS=0x...
VITE_CHAIN_ID=11155111
```

## 🛠️ Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## 📚 Technology Stack

### Frontend
- React 18
- Vite
- Redux Toolkit
- Ant Design
- Axios
- Ethers.js
- React Hook Form
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Ethers.js
- Nodemailer
- Helmet

### Blockchain
- Solidity (Smart Contract)
- Hardhat
- Sepolia Testnet
- Ethers.js

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deployment
```bash
# Backend (Heroku)
git push heroku main

# Frontend (Vercel)
vercel --prod

# Frontend (Netlify)
netlify deploy --prod
```

## 📖 Documentation

- [FULL_STACK_ARCHITECTURE.md](FULL_STACK_ARCHITECTURE.md) - Complete architecture
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Database design
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment instructions
- [QUICK_START_LOCAL.md](QUICK_START_LOCAL.md) - Local development setup
- [FOLDER_STRUCTURE_GUIDE.md](FOLDER_STRUCTURE_GUIDE.md) - Code organization

## ⚠️ Important Notes

### Smart Contract
The smart contract in `GOLD_TToekn/` is already deployed and should not be modified. The backend integrates with this contract using Ethers.js.

### Admin Setup
To create admin users, you'll need to manually update the MongoDB database or create an admin registration endpoint.

### Email Configuration
For email notifications to work, you need to:
1. Set up Gmail App Password or use SendGrid/another email service
2. Update EMAIL_USER and EMAIL_PASSWORD in backend .env

### Web3 Integration
- Ensure MetaMask is installed in the browser
- Network must be set to Sepolia testnet
- Gold Token address must match the deployed contract

## 🔄 Testing Workflow

1. Start MongoDB locally or connect to MongoDB Atlas
2. Start backend: `npm run dev` in backend folder
3. Start frontend: `npm run dev` in frontend folder
4. Navigate to http://localhost:5173
5. Test login (email or MetaMask)
6. Test token operations

## 🐛 Common Issues

### MongoDB Connection Failed
- Check MongoDB is running: `mongosh`
- Verify connection string in .env
- For Atlas, check IP whitelist

### Frontend Cannot Connect to Backend
- Check backend is running on port 3000
- Verify VITE_API_BASE_URL in .env.local
- Check CORS settings in backend

### MetaMask Issues
- Install MetaMask extension
- Switch to Sepolia testnet
- Add Gold Token address to MetaMask

### Token not showing balance
- Verify Gold Token address is correct
- Check wallet is connected
- Ensure admin has minted tokens

## 📞 Support

For issues or questions, refer to:
1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Check environment configuration

## ✅ Checklist Before Production

- [ ] Change JWT_SECRET in .env
- [ ] Set up MongoDB Atlas
- [ ] Configure email service
- [ ] Deploy smart contract to mainnet (if needed)
- [ ] Set up CORS_ORIGIN for production domain
- [ ] Enable HTTPS
- [ ] Set up SSL certificates
- [ ] Configure environment variables for production
- [ ] Run security audit
- [ ] Set up monitoring and logging
- [ ] Create admin users
- [ ] Test all API endpoints
- [ ] Test Web3 integration
- [ ] Backup database strategy

## 📄 License

Proprietary - All rights reserved

---

**Happy coding! 🚀**
