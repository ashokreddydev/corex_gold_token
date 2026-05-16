# QUICK START GUIDE - Local Development

Get the Gold Token full-stack app running locally in 15 minutes.

---

## PREREQUISITES

- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))
- MetaMask browser extension ([Install](https://metamask.io/))
- MongoDB Community or MongoDB Atlas account ([Sign up](https://www.mongodb.com/))

Verify installation:
```bash
node --version    # v18.0.0 or higher
npm --version     # v9.0.0 or higher
git --version     # 2.40.0 or higher
```

---

## SETUP (15 MINUTES)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/gold-token.git
cd gold-token
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env.development

# Edit .env with local settings
nano .env.development
```

**Minimal .env.development:**
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gold-token
JWT_SECRET=dev-secret-key-change-in-production-12345678
CHAIN_ID=31337  # Hardhat local
RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8a9c12c9334f8f50a4a  # Deploy and update
ADMIN_WALLET_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d6e7a01d2fa5c46de5d4
SMTP_HOST=localhost
SMTP_PORT=1025  # MailHog for dev
EMAIL_FROM=test@localhost
CORS_ORIGIN=http://localhost:3000
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env.development
```

**Frontend .env.development:**
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NETWORK_NAME=Hardhat
REACT_APP_CHAIN_ID=0x7a69
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8a9c12c9334f8f50a4a
```

### 4. Setup Blockchain

```bash
cd ../GOLD_TToekn

# Install dependencies
npm install

# Start Hardhat local network
npx hardhat node
# Keep this running in separate terminal

# In another terminal, deploy contract
npx hardhat run scripts/deploy.js --network localhost
# Copy the contract address and update .env files
```

### 5. Start Services

#### Terminal 1: MongoDB

```bash
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas
# Skip if using local - Atlas is already running in cloud
```

#### Terminal 2: Backend

```bash
cd backend
npm run dev
# Backend running at http://localhost:5000
```

#### Terminal 3: Frontend

```bash
cd frontend
npm run dev
# Frontend running at http://localhost:3000
```

---

## FIRST TIME SETUP

### 1. Create Admin User

```bash
# Backend terminal, run script
node scripts/createAdmin.js

# Or use MongoDB Compass
# Insert user document:
{
  email: "admin@localhost.dev",
  password: "$2b$10$hashed_bcrypt_password",  // Use bcrypt hash
  role: "admin",
  status: "active",
  createdAt: new Date()
}
```

### 2. Initialize Admin Settings

```bash
# Backend terminal
node scripts/initializeSettings.js

# Creates default min/max amounts, vault address, etc.
```

### 3. Connect MetaMask to Hardhat

1. Open MetaMask
2. Click "Add Network" (+ icon in network selector)
3. Network details:
   ```
   Network name: Hardhat Local
   RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency: ETH
   ```
4. Add account from Hardhat:
   - Click "Import account"
   - Private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d6e7a01d2fa5c46de5d4`
5. You now have 10000 ETH for testing

---

## VERIFY EVERYTHING WORKS

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/tokens/info

# Should return:
{
  "name": "Gold Token",
  "symbol": "GLD",
  "totalSupply": "1000000000000000000000000"
}
```

### 2. Test Frontend

1. Open http://localhost:3000 in browser
2. Should show login page
3. Try:
   - Register with email: `test@dev.com` / password: `Test123!`
   - Or login with MetaMask

### 3. Test Mint Flow

1. Login
2. Click "Mint Tokens"
3. Enter amount: 100
4. Click "Request Mint"
5. Should show success modal

### 4. Check Database

```bash
# Open another terminal
mongosh

# Connect
use gold-token

# Check collections
show collections

# Check documents
db.users.find()
db.transactions.find()
```

---

## USEFUL DEVELOPMENT COMMANDS

### Backend

```bash
# Start with auto-reload
npm run dev

# Run tests
npm run test

# Lint code
npm run lint

# Seed database with test data
node scripts/seed.js

# View API docs (if Swagger setup)
http://localhost:5000/api-docs
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Blockchain

```bash
# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia (testnet)
npx hardhat run scripts/deploy.js --network sepolia

# Interact with contract
npx hardhat console --network localhost
# Then: const contract = await ethers.getContractAt("GoldToken", "0x...");
```

---

## DEBUGGING TIPS

### Frontend Issues

**Blank page?**
```bash
# Check console for errors (F12)
# Check if backend is running
curl http://localhost:5000/api/tokens/info

# Clear browser cache
# Ctrl+Shift+Delete → Clear all
```

**API call failed?**
```bash
# Check backend running
npm run dev  # in backend folder

# Check CORS_ORIGIN in .env
# Should be http://localhost:3000

# Check Network tab in DevTools (F12)
```

**MetaMask not connecting?**
```bash
# Verify Hardhat network in MetaMask
# Chain ID should be 31337
# RPC URL should be http://127.0.0.1:8545

# Try refresh browser
# Try disconnect/reconnect in MetaMask
```

### Backend Issues

**Port already in use?**
```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000 → taskkill /PID {PID} /F
# Mac/Linux: lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

**Database connection error?**
```bash
# Verify MongoDB running
# Windows: Services → MongoDB → Start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# OR verify MONGODB_URI in .env
# Should be: mongodb://localhost:27017/gold-token
```

**Contract address not working?**
```bash
# Redeploy contract
cd GOLD_TToekn
npx hardhat run scripts/deploy.js --network localhost

# Copy new address
# Update .env files (backend & frontend)
# Restart services
```

---

## COMMON WORKFLOWS

### Adding a New Feature

1. Create feature branch:
   ```bash
   git checkout -b feature/user-dashboard
   ```

2. Make changes in frontend/backend

3. Test locally:
   ```bash
   npm run test
   npm run lint
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add user dashboard"
   git push origin feature/user-dashboard
   ```

5. Create pull request on GitHub

### Testing a Mint Request

1. Open http://localhost:3000
2. Login
3. Click "Dashboard" → "Mint Tokens"
4. Enter amount (e.g., 100)
5. Click "Request"
6. See success modal with transaction hash
7. Check in MongoDB:
   ```bash
   db.transactions.findOne()
   ```

### Testing Email Notifications (Optional)

```bash
# Install MailHog for local SMTP
# https://github.com/mailhog/MailHog

# On Windows (using chocolatey):
choco install mailhog
mailhog

# Then in .env:
SMTP_HOST=localhost
SMTP_PORT=1025

# View emails at:
http://localhost:8025
```

---

## QUICK REFERENCE

| Task | Command | Terminal |
|------|---------|----------|
| Start Backend | `cd backend && npm run dev` | T2 |
| Start Frontend | `cd frontend && npm run dev` | T3 |
| Start Blockchain | `cd GOLD_TToekn && npx hardhat node` | T1 |
| MongoDB Shell | `mongosh` | T4 |
| Backend Tests | `cd backend && npm test` | Any |
| Frontend Tests | `cd frontend && npm test` | Any |
| Lint Code | `npm run lint` | Any |
| View Logs | `pm2 logs` or `docker logs` | Any |

---

## NEXT STEPS AFTER SETUP

1. **Read Documentation**
   - [Full Stack Architecture](./FULL_STACK_ARCHITECTURE.md)
   - [API Documentation](./API_DOCUMENTATION.md)
   - [Database Schema](./DATABASE_SCHEMA.md)

2. **Explore Code**
   - Frontend: `frontend/src/pages/`
   - Backend: `backend/src/routes/`
   - Smart Contract: `GOLD_TToekn/contracts/GoldToken.sol`

3. **Try Features**
   - Login with email/password
   - Connect MetaMask wallet
   - Request tokens (mint)
   - Request redemption (burn)
   - View transaction history

4. **Make Changes**
   - Modify a component
   - Add API endpoint
   - Test locally
   - Submit PR

---

## TROUBLESHOOTING

### Everything crashes when I start?

```bash
# Check Node version
node --version  # Should be 18+

# Clear node_modules and reinstall
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install

# Check .env files are created
ls -la backend/.env
ls -la frontend/.env
```

### "Cannot find module" errors?

```bash
# Install dependencies again
npm install

# Clear npm cache if still failing
npm cache clean --force
npm install
```

### "Connection refused" errors?

```bash
# Make sure all services running:
# 1. MongoDB: mongod (or Atlas)
# 2. Backend: npm run dev
# 3. Frontend: npm run dev  
# 4. Blockchain: npx hardhat node
```

### MetaMask "Chain mismatch" error?

```bash
# Switch to correct network in MetaMask
# Should be "Hardhat Local" (Chain ID: 31337)
# Or "Sepolia" if using testnet
```

---

## SUPPORT

- **Issues?** Check [GitHub Issues](https://github.com/yourusername/gold-token/issues)
- **Documentation**: See main [README.md](./README.md)
- **Full Architecture**: [FULL_STACK_ARCHITECTURE.md](./FULL_STACK_ARCHITECTURE.md)
- **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

Happy coding! 🚀

