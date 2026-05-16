# Gold Token - Complete Architecture & Documentation Index

Welcome to the Gold Token Full-Stack Application! This document serves as your main entry point to all architectural and implementation documentation.

---

## 🎯 WHAT IS THIS PROJECT?

A complete, production-ready Web3 application for managing Gold Tokens with:
- **Frontend**: React + Ant Design (Modern UI)
- **Backend**: Express.js + MongoDB (Scalable API)
- **Blockchain**: Solidity ERC20 Smart Contract on Sepolia testnet
- **Authentication**: Email/Password + MetaMask Web3

Users can connect their wallets, mint/burn tokens, and view transaction history. Admins can approve redemptions and manage vault.

---

## 📚 DOCUMENTATION ROADMAP

### START HERE (Choose your role)

#### 👨‍💻 I want to understand the big picture
→ Read: [1. HIGH-LEVEL ARCHITECTURE](#1-high-level-architecture) (5 min)
→ Then: [2. FOLDER STRUCTURE](#2-folder-structure) (10 min)

#### 🚀 I want to start developing locally
→ Read: [QUICK_START_LOCAL.md](./QUICK_START_LOCAL.md) (15 min)
→ Then: [FOLDER_STRUCTURE_GUIDE.md](./FOLDER_STRUCTURE_GUIDE.md) (reference)

#### 📖 I want complete architecture details
→ Read: [FULL_STACK_ARCHITECTURE.md](./FULL_STACK_ARCHITECTURE.md) (40 min)
→ Reference: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
→ Reference: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

#### 🌐 I want to deploy to production
→ Read: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (60 min)
→ Checklist: [Pre-Deployment Checklist](#deployment-checklist)

#### 🔧 I have a specific question
→ Use: [Documentation Index by Topic](#documentation-index-by-topic)

---

## 1. HIGH-LEVEL ARCHITECTURE

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│ USERS IN BROWSER                                             │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ React Frontend: Dashboard, Mint, Burn, History, Admin   ││
│ │ (Ant Design Components, Redux State, Axios HTTP Client) ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
  │
  ├─→ AXIOS HTTP CALLS to Backend API
  │
  └─→ METAMASK WALLET (Web3 Provider)
      └─→ For: Login, Transaction signing, Balance queries

┌─────────────────────────────────────────────────────────────┐
│ EXPRESS BACKEND SERVER                                       │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ REST API with JWT Authentication                        ││
│ │ Business Logic: Auth, Transactions, Admin Operations    ││
│ │ Services: Web3, Email, Database                         ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Database: MongoDB                  Blockchain: Ethers.js ││
│ │ Collections:                       Network: Sepolia      ││
│ │ - users                            Contract: GoldToken   ││
│ │ - transactions                     Functions: mint/burn  ││
│ │ - redemptions                                           ││
│ │ - admin_settings                   Provider: Infura/    ││
│ │                                    Alchemy              ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
  │
  ├─→ Queries blockchain via Ethers.js
  │   └─→ Gets balances, calls contract functions
  │
  └─→ Stores records in MongoDB
      └─→ Tracks users, transactions, redemptions
```

### Key Flows

**User Mint Flow**: User → Frontend → Backend → Smart Contract → Blockchain ✓

**User Burn Flow**: User → Request → Admin → Approve → Backend → Burn on Contract ✓

**Authentication**: Email/Password OR MetaMask Web3 Login ✓

---

## 2. FOLDER STRUCTURE

```
gold-token-app/
├── frontend/                   # React App (Port 3000)
│   ├── src/pages/             # Pages: Dashboard, Mint, Burn, Admin
│   ├── src/components/        # UI Components: Forms, Cards, Tables
│   ├── src/services/          # API Calls & Web3 Integration
│   ├── src/store/             # Redux State Management
│   └── src/hooks/             # Custom React Hooks
│
├── backend/                    # Express Server (Port 5000)
│   ├── src/routes/            # API Endpoints
│   ├── src/controllers/       # Request Handlers
│   ├── src/services/          # Business Logic
│   ├── src/models/            # MongoDB Schemas
│   └── src/middleware/        # Auth, Validation, Errors
│
├── GOLD_TToekn/                # Blockchain (Hardhat)
│   ├── contracts/             # Solidity ERC20 Contract
│   ├── scripts/               # Deploy & interact scripts
│   ├── test/                  # Contract tests
│   └── deployments/           # Deployment records
│
└── docs/                       # Documentation
    ├── FULL_STACK_ARCHITECTURE.md
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    └── DEPLOYMENT_GUIDE.md
```

For detailed folder breakdown, see: [FOLDER_STRUCTURE_GUIDE.md](./FOLDER_STRUCTURE_GUIDE.md)

---

## 📖 DOCUMENTATION INDEX BY TOPIC

### Getting Started
| Document | Time | For |
|----------|------|-----|
| [QUICK_START_LOCAL.md](./QUICK_START_LOCAL.md) | 15 min | Local development setup |
| [FOLDER_STRUCTURE_GUIDE.md](./FOLDER_STRUCTURE_GUIDE.md) | 20 min | Understanding project organization |
| [README.md](./README.md) | 5 min | Project overview |

### Architecture & Design
| Document | Time | For |
|----------|------|-----|
| [FULL_STACK_ARCHITECTURE.md](./FULL_STACK_ARCHITECTURE.md) | 60 min | Complete architecture details |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | 30 min | All API endpoints reference |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | 20 min | MongoDB collections & queries |

### Deployment & Operations
| Document | Time | For |
|----------|------|-----|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | 60 min | Production deployment |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | 10 min | Common issues & solutions |

### Implementation Details

**Frontend**
- React component structure
- Redux state management
- Custom hooks pattern
- API service integration
- MetaMask Web3 connection

→ See: FULL_STACK_ARCHITECTURE.md → Section 3

**Backend**
- Express middleware pipeline
- Service layer pattern
- MongoDB integration
- Ethers.js blockchain calls
- JWT authentication

→ See: FULL_STACK_ARCHITECTURE.md → Section 4

**Blockchain**
- Solidity contract structure
- Mint/burn functions
- Access control
- Event emissions

→ See: FULL_STACK_ARCHITECTURE.md → Section 5

---

## 🔑 KEY CONCEPTS

### Architecture Principles

1. **SIMPLICITY**: No microservices, single backend server
2. **MODULARITY**: Separation of concerns (routes → controllers → services)
3. **SCALABILITY**: Easy to add features later (databases, caching, etc.)
4. **SECURITY**: JWT auth, password hashing, input validation
5. **MAINTAINABILITY**: Clean code, clear naming, comprehensive docs

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI Framework |
| UI Components | Ant Design | Pre-built components |
| HTTP Client | Axios | API calls with interceptors |
| State | Redux Toolkit | Global state management |
| Blockchain | Ethers.js v6 | Web3 interaction |
| Backend | Express.js | REST API server |
| Database | MongoDB | NoSQL data storage |
| ORM | Mongoose | MongoDB schema & validation |
| Auth | JWT | Stateless authentication |
| Web3 Auth | MetaMask | Wallet connection & signing |
| Smart Contract | Solidity | ERC20 token implementation |
| Testing | Hardhat | Blockchain testing & local node |

### Authentication Methods

**Method 1: Email/Password**
```
User enters email + password
→ Backend hashes password
→ Compares with stored hash
→ Generates JWT token
→ Frontend stores in localStorage
```

**Method 2: MetaMask Web3**
```
User clicks "Connect Wallet"
→ MetaMask popup appears
→ User approves
→ Frontend requests nonce from backend
→ User signs message in MetaMask
→ Frontend sends signature to backend
→ Backend verifies signature
→ Generates JWT token
→ User logged in without password
```

### Token Flows

**MINT (Add Tokens)**
```
1. User requests mint (100 GLD)
2. Backend creates transaction record (PENDING)
3. Backend calls admin wallet to mint on blockchain
4. Waits for blockchain confirmation
5. Updates transaction status (CONFIRMED)
6. Sends email notification
7. User sees success message + transaction hash
```

**BURN (Remove Tokens)**
```
1. User requests burn (50 GLD) - creates redemption request
2. Backend notifies admin
3. Admin reviews and approves in admin panel
4. Backend calls admin wallet to burn on blockchain
5. Updates redemption status (APPROVED)
6. Sends confirmation email to user
7. Tokens removed from user's balance
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [ ] All tests passing: `npm test`
- [ ] No security warnings: `npm audit`
- [ ] Environment variables configured
- [ ] Database backups scheduled
- [ ] SSL certificates ready
- [ ] Domain registered
- [ ] Contract deployed & verified

### Deployment
- [ ] Backend deployed (Heroku/AWS/Railway)
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Database initialized (MongoDB Atlas)
- [ ] DNS records updated
- [ ] SSL enforced (HTTPS)
- [ ] Monitoring active
- [ ] Team notified

### Post-Deployment
- [ ] All endpoints tested
- [ ] Authentication verified
- [ ] Transactions tested
- [ ] Performance checked
- [ ] Security validated
- [ ] Logs monitored

---

## 🚀 COMMON TASKS

### Local Development

**Setup**
```bash
# Clone repo
git clone <repo-url>
cd gold-token

# Backend
cd backend && npm install
cp .env.example .env.development
npm run dev

# Frontend (new terminal)
cd frontend && npm install
cp .env.example .env.development
npm run dev

# Open http://localhost:3000
```

**Make Changes**
```bash
# Create feature branch
git checkout -b feature/my-feature

# Edit code
# Both frontend & backend auto-reload on save

# Test changes locally
npm test

# Commit & push
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

### Adding New API Endpoint

1. **Add route** in `backend/src/routes/`
2. **Create controller** in `backend/src/controllers/`
3. **Add service** in `backend/src/services/` if needed
4. **Update database** model if needed
5. **Test** with curl or Postman
6. **Document** in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

Example:
```bash
# Create new feature for admin dashboard stats
# Edit: backend/src/routes/admin.js
# Add: GET /api/admin/stats

# Create: backend/src/controllers/adminController.js
# Add: getStats() method

# Update: API_DOCUMENTATION.md
# Document: /api/admin/stats endpoint
```

### Deploying Changes

```bash
# Test everything works
npm test
npm run lint
npm run build

# Push to main branch
git push origin main

# GitHub Actions (if setup)
# Automatically runs tests
# Deploys to staging
# If tests pass, deploys to production
```

---

## 🐛 TROUBLESHOOTING

### Common Issues

**"Cannot connect to MongoDB"**
→ See: [QUICK_START_LOCAL.md - Troubleshooting](./QUICK_START_LOCAL.md#troubleshooting)

**"MetaMask connection failed"**
→ See: [FULL_STACK_ARCHITECTURE.md - MetaMask Integration](./FULL_STACK_ARCHITECTURE.md#11-metamask-integration-flow)

**"Smart contract not deploying"**
→ See: [GOLD_TToekn/TROUBLESHOOTING.md](./GOLD_TToekn/TROUBLESHOOTING.md)

**"API returns 401 Unauthorized"**
→ See: [API_DOCUMENTATION.md - Error Responses](./API_DOCUMENTATION.md#error-responses)

**"Mint transaction failing"**
→ See: [FULL_STACK_ARCHITECTURE.md - Error Handling](./FULL_STACK_ARCHITECTURE.md#error-handling-examples)

---

## 📊 PROJECT STATISTICS

| Metric | Value |
|--------|-------|
| Frontend Components | 15+ |
| Backend Routes | 20+ |
| Database Collections | 4 |
| Smart Contract Functions | 5+ |
| API Endpoints | 25+ |
| Documentation Pages | 6 |
| Total Lines of Docs | 3000+ |

---

## 🎓 LEARNING PATH

### If you have 30 minutes
1. Read: [High-Level Architecture](#1-high-level-architecture)
2. Read: [Folder Structure](#2-folder-structure)
3. Skim: [QUICK_START_LOCAL.md](./QUICK_START_LOCAL.md)

### If you have 2 hours
1. Read: [FULL_STACK_ARCHITECTURE.md](./FULL_STACK_ARCHITECTURE.md)
2. Reference: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Reference: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
4. Follow: [QUICK_START_LOCAL.md](./QUICK_START_LOCAL.md)

### If you have a full day
1. Complete setup from [QUICK_START_LOCAL.md](./QUICK_START_LOCAL.md)
2. Study [FULL_STACK_ARCHITECTURE.md](./FULL_STACK_ARCHITECTURE.md)
3. Reference [FOLDER_STRUCTURE_GUIDE.md](./FOLDER_STRUCTURE_GUIDE.md)
4. Explore code in IDE
5. Make a small feature

---

## 🤝 CONTRIBUTING

See: [CONTRIBUTING.md](./CONTRIBUTING.md)

Key points:
- Create feature branch from `develop`
- Follow naming conventions
- Write tests for new features
- Update documentation
- Submit pull request
- Code review required before merge

---

## 📞 GETTING HELP

### Resources

- **Architecture Questions**: See [FULL_STACK_ARCHITECTURE.md](./FULL_STACK_ARCHITECTURE.md)
- **API Questions**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Database Questions**: See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Deployment Questions**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Local Issues**: See [QUICK_START_LOCAL.md](./QUICK_START_LOCAL.md)
- **General Issues**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Still Stuck?

1. Search [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Check GitHub Issues
3. Review error message in browser/terminal logs
4. Ask in team Slack/Discord
5. Consult individual documentation files

---

## 📋 DOCUMENTATION CHECKLIST

- [x] Architecture overview
- [x] Folder structure guide
- [x] Quick start guide
- [x] API documentation
- [x] Database schema
- [x] Deployment guide
- [x] Component patterns
- [x] Security best practices
- [x] Error handling
- [x] Testing guidelines
- [x] Troubleshooting guide
- [x] Contributing guide

---

## 🎯 SUCCESS CRITERIA

After studying this documentation, you should be able to:

✅ Understand the overall architecture
✅ Set up local development environment
✅ Create new frontend components
✅ Add new API endpoints
✅ Query the database
✅ Interact with blockchain
✅ Deploy to production
✅ Debug common issues
✅ Contribute to the project

---

## 📝 VERSION & HISTORY

- **Version**: 1.0.0
- **Last Updated**: January 2024
- **Status**: Complete & Production-Ready
- **Architecture**: Complete ✓

---

## 📖 QUICK REFERENCE

### Key Files
- Frontend entry: `frontend/src/index.js`
- Backend entry: `backend/server.js`
- Smart contract: `GOLD_TToekn/contracts/GoldToken.sol`
- Main API routes: `backend/src/routes/`
- Main pages: `frontend/src/pages/`

### Key Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-signature` - Web3 login
- `POST /api/transactions/mint` - Request mint
- `POST /api/transactions/burn` - Request burn
- `GET /api/transactions/history` - Get history
- `POST /api/admin/redemptions/:id/approve` - Admin approve

### Key Services
- `authService` - Authentication
- `web3Service` - Blockchain interaction
- `transactionService` - Transaction handling
- `emailService` - Notifications
- `adminService` - Admin operations

---

## 🙏 THANK YOU

This comprehensive documentation was created to help you succeed with the Gold Token application. It's designed to be:

- **Beginner-friendly**: Clear explanations without jargon
- **Comprehensive**: Covers all aspects of the application
- **Practical**: Includes real examples and code snippets
- **Maintainable**: Easy to update and extend
- **Scalable**: Foundation for growth

Good luck with your development! 🚀

---

**Questions? Issues? Improvements?**
→ Update this documentation as you learn more!

