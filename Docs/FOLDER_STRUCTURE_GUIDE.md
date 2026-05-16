# Project Folder Structure Guide

Complete breakdown of the Gold Token application folder structure and purposes.

---

## MAIN DIRECTORY STRUCTURE

```
gold-token-app/
├── frontend/                 # React Frontend
├── backend/                  # Express Backend  
├── GOLD_TToekn/              # Blockchain (Solidity Smart Contract)
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
├── docker-compose.yml        # Local dev environment
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

---

## FRONTEND FOLDER (`/frontend`)

```
frontend/
├── public/
│   ├── index.html           # Main HTML file
│   ├── favicon.ico
│   └── manifest.json        # PWA manifest
│
├── src/
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main user dashboard
│   │   ├── Mint.jsx         # Mint tokens page
│   │   ├── Burn.jsx         # Burn/redeem page
│   │   ├── History.jsx      # Transaction history
│   │   ├── Admin.jsx        # Admin panel
│   │   ├── Login.jsx        # Login/Register page
│   │   ├── NotFound.jsx     # 404 page
│   │   └── index.js         # Export all pages
│   │
│   ├── components/          # Reusable components
│   │   ├── Layout/
│   │   │   ├── Header.jsx      # Navigation bar + wallet connect
│   │   │   ├── Sidebar.jsx     # Side navigation (optional)
│   │   │   ├── Footer.jsx      # Footer
│   │   │   └── index.js
│   │   │
│   │   ├── Forms/
│   │   │   ├── MintForm.jsx     # Mint request form
│   │   │   ├── BurnForm.jsx     # Burn request form
│   │   │   ├── LoginForm.jsx    # Login form
│   │   │   ├── RegisterForm.jsx # Registration form
│   │   │   └── index.js
│   │   │
│   │   ├── Modals/
│   │   │   ├── ConfirmModal.jsx      # Confirm transaction
│   │   │   ├── TxStatusModal.jsx     # Show tx status
│   │   │   ├── ConnectWalletModal.jsx # MetaMask connect
│   │   │   ├── LoadingModal.jsx      # Loading spinner
│   │   │   └── index.js
│   │   │
│   │   ├── Cards/
│   │   │   ├── BalanceCard.jsx      # Display balance
│   │   │   ├── QuickActionCard.jsx  # Quick mint/burn
│   │   │   ├── StatsCard.jsx        # Statistics
│   │   │   └── index.js
│   │   │
│   │   ├── Tables/
│   │   │   ├── TransactionTable.jsx # Transaction history table
│   │   │   ├── UsersTable.jsx       # Admin: users list
│   │   │   ├── RedemptionTable.jsx  # Admin: pending redemptions
│   │   │   └── index.js
│   │   │
│   │   └── Common/
│   │       ├── ErrorBoundary.jsx    # Error handling
│   │       ├── Loading.jsx          # Loading spinner
│   │       ├── EmptyState.jsx       # Empty data display
│   │       └── index.js
│   │
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── authService.js   # Authentication API calls
│   │   │   ├── register()
│   │   │   ├── login()
│   │   │   ├── getNonce()
│   │   │   ├── verifySignature()
│   │   │   └── logout()
│   │   │
│   │   ├── tokenService.js  # Token balance queries
│   │   │   ├── getBalance()
│   │   │   ├── getTotalSupply()
│   │   │   └── getInfo()
│   │   │
│   │   ├── transactionService.js  # Transaction operations
│   │   │   ├── requestMint()
│   │   │   ├── requestBurn()
│   │   │   ├── getHistory()
│   │   │   └── getTransaction()
│   │   │
│   │   ├── web3Service.js   # MetaMask & blockchain interaction
│   │   │   ├── connectMetaMask()
│   │   │   ├── getAccount()
│   │   │   ├── signMessage()
│   │   │   ├── switchNetwork()
│   │   │   └── watchAccountChanges()
│   │   │
│   │   └── adminService.js  # Admin operations
│   │       ├── getUsers()
│   │       ├── getVaultBalance()
│   │       ├── getRedemptions()
│   │       ├── approveRedemption()
│   │       └── rejectRedemption()
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Authentication hook
│   │   │   ├── Returns: token, user, login(), logout()
│   │   │   └── Uses: authService, Redux
│   │   │
│   │   ├── useWeb3.js       # Web3 & MetaMask hook
│   │   │   ├── Returns: account, isConnected, connect(), disconnect()
│   │   │   └── Uses: web3Service, Redux
│   │   │
│   │   ├── useBalance.js    # Token balance hook
│   │   │   ├── Returns: balance, loading, error, refresh()
│   │   │   └── Uses: tokenService, Redux
│   │   │
│   │   ├── useTransactions.js # Transactions hook
│   │   │   ├── Returns: transactions, loading, pagination
│   │   │   └── Uses: transactionService
│   │   │
│   │   ├── useMint.js       # Mint operation hook
│   │   │   ├── Returns: mint(), isLoading, error
│   │   │   └── Uses: transactionService
│   │   │
│   │   └── useBurn.js       # Burn operation hook
│   │       ├── Returns: burn(), isLoading, error
│   │       └── Uses: transactionService
│   │
│   ├── store/               # Redux state management
│   │   ├── authSlice.js     # Auth state
│   │   │   ├── State: token, isAuth, user, role, permissions
│   │   │   └── Actions: setAuth(), logout(), setUser()
│   │   │
│   │   ├── userSlice.js     # User state
│   │   │   ├── State: profile, email, walletAddress
│   │   │   └── Actions: setProfile(), updatePreferences()
│   │   │
│   │   ├── tokenSlice.js    # Token state
│   │   │   ├── State: balance, totalSupply, allowance
│   │   │   └── Actions: setBalance(), refresh()
│   │   │
│   │   ├── web3Slice.js     # Web3 state
│   │   │   ├── State: account, chainId, isConnected, network
│   │   │   └── Actions: connect(), switchNetwork()
│   │   │
│   │   ├── transactionSlice.js  # Transaction state
│   │   │   ├── State: history, pending, lastTx
│   │   │   └── Actions: addTransaction(), setHistory()
│   │   │
│   │   └── store.js         # Redux store configuration
│   │       ├── Combines all slices
│   │       └── Configures middleware
│   │
│   ├── utils/               # Utility functions
│   │   ├── constants.js     # App constants
│   │   │   ├── API_ENDPOINTS
│   │   │   ├── NETWORK_CONFIG
│   │   │   ├── FORM_RULES
│   │   │   └── MESSAGES
│   │   │
│   │   ├── validation.js    # Form validation
│   │   │   ├── validateEmail()
│   │   │   ├── validatePassword()
│   │   │   ├── validateAmount()
│   │   │   └── validateAddress()
│   │   │
│   │   ├── formatters.js    # Data formatters
│   │   │   ├── formatBalance()    // 1.0 GLD
│   │   │   ├── formatAddress()    // 0x123...abc
│   │   │   ├── formatDate()       // 01/15/2024
│   │   │   ├── formatTxHash()     // 0xabc...123 (with link)
│   │   │   └── toWei(), fromWei() // Unit conversions
│   │   │
│   │   ├── helpers.js       # Helper functions
│   │   │   ├── getErrorMessage()   // User-friendly errors
│   │   │   ├── sleep()             // Delay promise
│   │   │   ├── retry()             // Retry logic
│   │   │   └── debounce(), throttle()
│   │   │
│   │   └── storage.js       # Local storage helpers
│   │       ├── setToken()
│   │       ├── getToken()
│   │       └── clearAuth()
│   │
│   ├── styles/              # Global styles
│   │   ├── globals.css      # Global styles
│   │   ├── variables.css    # CSS variables (colors, spacing)
│   │   ├── theme.js         # Ant Design theme customization
│   │   └── responsive.css   # Responsive design
│   │
│   ├── App.jsx              # Main App component
│   │   └── Wraps Router, Redux Provider
│   │
│   ├── Router.jsx           # React Router configuration
│   │   ├── Public routes (Login, Register)
│   │   ├── Protected routes (Dashboard, Mint, etc.)
│   │   └── Admin routes (Admin Panel)
│   │
│   ├── index.js             # Entry point
│   └── index.css            # Root styles
│
├── .env.example             # Example environment variables
├── .env.development         # Local dev (not in git)
├── .env.production          # Production (not in git)
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite config
└── README.md                # Frontend README
```

### Frontend Services Deep Dive

**api.js - Axios Configuration**
```javascript
// baseURL, timeout, interceptors for auth
// Automatically adds JWT to headers
// Handles 401/403 errors (logout if needed)
```

**authService.js - Auth API**
```javascript
// Email/password: register, login
// Web3: getNonce, verifySignature
// Session: logout, refreshToken
```

---

## BACKEND FOLDER (`/backend`)

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection setup
│   │   │   ├── Mongoose connection
│   │   │   ├── Connection pooling
│   │   │   └── Error handling
│   │   │
│   │   ├── web3.js          # Ethers.js setup
│   │   │   ├── Provider initialization
│   │   │   ├── Contract instance
│   │   │   ├── Admin wallet setup
│   │   │   └── Network configuration
│   │   │
│   │   ├── jwt.js           # JWT configuration
│   │   │   ├── Secret key
│   │   │   ├── Expiration times
│   │   │   └── Token generation
│   │   │
│   │   └── env.js           # Environment validation
│   │       └── Validates all required variables
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── User.js          # User model
│   │   │   ├── Fields: email, password, walletAddress, role, etc.
│   │   │   ├── Methods: hashPassword(), comparePassword()
│   │   │   └── Hooks: pre-save middleware
│   │   │
│   │   ├── Transaction.js   # Transaction model
│   │   │   ├── Fields: userId, type, amount, status, txHash
│   │   │   ├── Indexes: userId+date, status
│   │   │   └── Methods: getHistory(), getStats()
│   │   │
│   │   ├── Redemption.js    # Redemption request model
│   │   │   ├── Fields: userId, amount, status, reason
│   │   │   ├── Indexes: userId+status, status+date
│   │   │   └── References: approvedBy (user)
│   │   │
│   │   └── AdminSetting.js  # Admin settings model
│   │       ├── Key-value pairs
│   │       ├── Types: string, number, boolean
│   │       └── Examples: MIN_MINT, MAINTENANCE_MODE
│   │
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   │   ├── POST /register
│   │   │   ├── POST /login
│   │   │   ├── POST /nonce (Web3)
│   │   │   ├── POST /verify-signature (Web3)
│   │   │   └── POST /logout
│   │   │
│   │   ├── users.js         # User routes
│   │   │   ├── GET /profile
│   │   │   ├── PUT /profile
│   │   │   └── GET /:id (admin)
│   │   │
│   │   ├── tokens.js        # Token routes
│   │   │   ├── GET /balance
│   │   │   ├── GET /info
│   │   │   └── GET /vault-balance (admin)
│   │   │
│   │   ├── transactions.js  # Transaction routes
│   │   │   ├── POST /mint
│   │   │   ├── POST /burn
│   │   │   ├── GET /history
│   │   │   ├── GET /:id
│   │   │   └── POST /:id/cancel
│   │   │
│   │   └── admin.js         # Admin routes
│   │       ├── GET /users
│   │       ├── GET /vault
│   │       ├── GET /redemptions
│   │       ├── POST /redemptions/:id/approve
│   │       ├── POST /redemptions/:id/reject
│   │       └── PUT /settings/:key
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   │   ├── register()    // Hash password, create user
│   │   │   ├── login()       // Check password, generate JWT
│   │   │   ├── getNonce()    // Generate nonce for Web3
│   │   │   ├── verifySignature() // Verify signature, login
│   │   │   └── logout()
│   │   │
│   │   ├── userController.js
│   │   │   ├── getProfile()
│   │   │   ├── updateProfile()
│   │   │   └── getUser()
│   │   │
│   │   ├── tokenController.js
│   │   │   ├── getBalance()      // Call web3Service
│   │   │   ├── getInfo()         // Call web3Service
│   │   │   └── getVaultBalance() // Admin only
│   │   │
│   │   ├── transactionController.js
│   │   │   ├── requestMint()     // Create TX record, call web3Service
│   │   │   ├── requestBurn()     // Create redemption request
│   │   │   ├── getHistory()      // Query DB
│   │   │   ├── getTransaction()
│   │   │   └── cancelTransaction()
│   │   │
│   │   └── adminController.js
│   │       ├── getUsers()        // Query & paginate
│   │       ├── getVault()
│   │       ├── getRedemptions()  // Query pending
│   │       ├── approveRedemption() // Call web3Service to burn
│   │       ├── rejectRedemption()
│   │       └── updateSetting()
│   │
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   │   ├── generateJWT()
│   │   │   ├── verifyJWT()
│   │   │   ├── hashPassword()
│   │   │   ├── comparePassword()
│   │   │   ├── generateNonce()
│   │   │   └── verifySignature() // Ethers.js recovery
│   │   │
│   │   ├── web3Service.js   // Blockchain interaction
│   │   │   ├── getProvider()
│   │   │   ├── getContract()
│   │   │   ├── mint()           // Call contract.mint()
│   │   │   ├── burn()           // Call contract.burn()
│   │   │   ├── getBalance()     // Call contract.balanceOf()
│   │   │   ├── getTotalSupply() // Call contract.totalSupply()
│   │   │   ├── waitForTx()      // Poll for confirmation
│   │   │   └── handleError()    // Parse blockchain errors
│   │   │
│   │   ├── emailService.js
│   │   │   ├── sendMintNotification()
│   │   │   ├── sendBurnNotification()
│   │   │   ├── sendApprovalEmail()
│   │   │   ├── sendRejectionEmail()
│   │   │   └── sendWelcomeEmail()
│   │   │
│   │   ├── transactionService.js
│   │   │   ├── createMintRequest()
│   │   │   ├── createBurnRequest()
│   │   │   ├── approveBurn()
│   │   │   ├── rejectBurn()
│   │   │   ├── getHistory()
│   │   │   └── getStats() // Total minted/burned
│   │   │
│   │   └── adminService.js
│   │       ├── getSetting()
│   │       ├── updateSetting()
│   │       ├── getVaultInfo()
│   │       └── getSystemStats()
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          // Verify JWT
│   │   │   ├── Extracts token from header
│   │   │   ├── Verifies signature
│   │   │   └── Attaches user to req.user
│   │   │
│   │   ├── authorization.js // Role-based access
│   │   │   ├── requireAdmin()
│   │   │   └── requireUser()
│   │   │
│   │   ├── errorHandler.js
│   │   │   ├── Catches errors from routes
│   │   │   ├── Formats error response
│   │   │   ├── Logs errors
│   │   │   └── Sends to client
│   │   │
│   │   ├── requestLogger.js // Morgan configuration
│   │   │   └── Logs: method, path, status, response time
│   │   │
│   │   └── validation.js    // Request validation
│   │       ├── validateMint()
│   │       ├── validateBurn()
│   │       └── Uses: Joi schemas
│   │
│   ├── utils/               # Utility functions
│   │   ├── constants.js     // API constants
│   │   ├── helpers.js
│   │   │   ├── toWei()      // Convert to blockchain Wei
│   │   │   ├── fromWei()    // Convert from Wei
│   │   │   ├── isValidAddress()
│   │   │   └── sleep()
│   │   │
│   │   └── validators.js    // Validation schemas
│   │       ├── registerSchema
│   │       ├── loginSchema
│   │       ├── mintSchema
│   │       └── burnSchema
│   │
│   └── app.js               // Express app setup
│       ├── Middleware setup
│       ├── Routes mounting
│       ├── Error handler
│       └── Exports app instance
│
├── server.js                // Entry point
│   ├── Load .env
│   ├── Connect to DB
│   ├── Start server
│   └── Listen on PORT
│
├── scripts/
│   ├── deploy.js            // Deploy contract locally
│   ├── seed.js              // Seed test data
│   ├── createAdmin.js       // Create admin user
│   ├── initializeSettings.js // Setup admin settings
│   └── backup.js            // Database backup
│
├── .env.example             // Example variables
├── .env.development         // Local dev (not in git)
├── .env.production          // Production (not in git)
├── package.json             // Dependencies & scripts
└── README.md                // Backend README
```

### Backend Services Deep Dive

**web3Service.js - Blockchain Interaction**
```javascript
// Initializes Ethers.js provider
// Loads contract with admin wallet
// Methods to mint/burn/query balance
// Handles transaction confirmation
```

**authService.js - Security**
```javascript
// JWT generation & verification
// Password hashing with bcrypt
// Web3 signature verification (ethers.verifyMessage)
```

---

## BLOCKCHAIN FOLDER (`/GOLD_TToekn`)

```
GOLD_TToekn/
├── contracts/               # Smart Contracts
│   └── GoldToken.sol        // ERC20 token contract
│       ├── SPDX License
│       ├── Inherits: ERC20, Ownable
│       ├── Functions:
│       │   ├── mint()       // Only owner
│       │   ├── burn()       // Any holder
│       │   ├── transfer()   // Standard ERC20
│       │   ├── approve()    // Allowance
│       │   └── Events
│       └── ~100 lines code
│
├── test/                    // Smart contract tests
│   └── GoldToken.test.js    // Hardhat tests
│       ├── Test mint function
│       ├── Test burn function
│       ├── Test balance queries
│       └── Test access control
│
├── scripts/
│   ├── deploy.js            // Deployment script
│   │   ├── Deploy to local Hardhat
│   │   ├── Deploy to Sepolia testnet
│   │   └── Log contract address
│   │
│   └── verify.js            // Etherscan verification
│       └── Verify deployed contract
│
├── artifacts/               // Compiled output (generated)
│   ├── contracts/GoldToken.sol/
│   │   ├── GoldToken.json   // ABI + bytecode
│   │   └── GoldToken.dbg.json // Debug info
│   │
│   └── @openzeppelin/       // Imported OpenZeppelin contracts
│       └── Various dependencies
│
├── cache/                   // Hardhat cache (generated)
│   └── solidity-files-cache.json
│
├── deployments/             // Deployment records
│   ├── localhost-{timestamp}.json    // Local deployments
│   └── sepolia-{timestamp}.json      // Testnet deployments
│       └── Contains: contractAddress, abi, blockNumber
│
├── hardhat.config.js        // Hardhat configuration
│   ├── Networks:
│   │   ├── hardhat (local)
│   │   ├── sepolia (testnet)
│   │   └── mainnet (production)
│   ├── Paths
│   ├── Solidity compiler
│   └── Plugins
│
├── .env.example             // Example variables
├── .env.development         // Local dev (not in git)
├── package.json             // Dependencies
├── README.md                // Blockchain README
└── TROUBLESHOOTING.md       // Hardhat troubleshooting
```

---

## DOCS FOLDER (`/docs`)

```
docs/
├── FULL_STACK_ARCHITECTURE.md  // This comprehensive guide
├── API_DOCUMENTATION.md        // All endpoints reference
├── DATABASE_SCHEMA.md          // MongoDB collections & queries
├── DEPLOYMENT_GUIDE.md         // Production deployment
├── QUICK_START_LOCAL.md        // Local development setup
├── SMART_CONTRACT_GUIDE.md     // Solidity contract details
├── TROUBLESHOOTING.md          // Common issues & solutions
├── SECURITY.md                 // Security best practices
├── TESTING.md                  // Testing guidelines
└── CONTRIBUTING.md             // Contribution guidelines
```

---

## FILE DEPENDENCIES DIAGRAM

```
Frontend (React)
├── Calls APIs via services/api.js
│   └── Uses Axios interceptors for JWT
│
├── Uses web3Service for MetaMask
│   └── Calls ethers.js
│
└── Uses Redux store for state
    └── Dispatches from components

Backend (Node/Express)
├── Loads environment config/
├── Connects to MongoDB
├── Loads Web3 provider (Ethers.js)
├── Mounts routes that use controllers/
├── Controllers call services/
└── Services interact with DB & blockchain

Blockchain (Solidity)
├── Deployed on Sepolia network
├── ABI in artifacts/
├── Called via ethers.js from backend
└── Events monitored by services
```

---

## KEY FILES REFERENCE

| File | Purpose | Language |
|------|---------|----------|
| `frontend/src/pages/Dashboard.jsx` | Main user page | JSX |
| `backend/src/services/web3Service.js` | Blockchain calls | JS |
| `GOLD_TToekn/contracts/GoldToken.sol` | Token contract | Solidity |
| `backend/src/models/User.js` | User database schema | JS |
| `frontend/src/store/authSlice.js` | Auth state management | JS |
| `backend/src/routes/transactions.js` | Transaction endpoints | JS |
| `frontend/src/services/api.js` | HTTP client setup | JS |
| `backend/server.js` | Server entry point | JS |
| `frontend/src/App.jsx` | App root component | JSX |

---

## NAMING CONVENTIONS

### Frontend
- **Components**: PascalCase (Dashboard.jsx, MintForm.jsx)
- **Hooks**: camelCase starting with "use" (useAuth.js)
- **Services**: camelCase + "Service" (authService.js)
- **Utils**: camelCase (helpers.js, formatters.js)
- **Store slices**: camelCase + "Slice" (authSlice.js)
- **Variables**: camelCase (userName, isLoading)
- **Constants**: UPPER_SNAKE_CASE (MAX_AMOUNT, API_URL)

### Backend
- **Routes**: paths only lowercase (auth.js, /api/auth)
- **Controllers**: camelCase + "Controller" (authController.js)
- **Models**: PascalCase (User, Transaction)
- **Services**: camelCase + "Service" (web3Service.js)
- **Middleware**: camelCase (errorHandler.js)
- **Variables**: camelCase (userId, transactionHash)
- **Constants**: UPPER_SNAKE_CASE (MIN_MINT_AMOUNT)

### Blockchain
- **Contract**: PascalCase (GoldToken.sol)
- **Events**: PascalCase (TokenMinted, TokenBurned)
- **Functions**: camelCase (mint, burn, balanceOf)
- **Variables**: camelCase or UPPER_CASE if constant

---

## FILE SIZE GUIDELINES

### Frontend Components
- **Pages**: 200-500 lines max (split if larger)
- **Form Components**: 100-300 lines
- **Card Components**: 50-150 lines
- **Modals**: 100-250 lines

### Backend
- **Controllers**: 100-200 lines (delegate to services)
- **Services**: 150-300 lines
- **Routes**: 50-100 lines (define endpoints only)
- **Middleware**: 50-100 lines

---

## WHEN TO CREATE NEW FILES

### Frontend
**Create new component when:**
- Reused in multiple places
- Component gets > 200 lines
- Logical separation needed

**Keep in same file if:**
- Only used once
- Tightly coupled with parent

### Backend
**Create new service when:**
- Handles distinct business domain
- Can be reused by multiple controllers
- Testable in isolation

**Create new model when:**
- New database collection needed
- Represents distinct entity

---

## MODIFYING FILES

### Adding New API Endpoint

1. Create/update route in `routes/`
2. Create controller method in `controllers/`
3. Create service method in `services/`
4. Add to database model if needed
5. Test locally
6. Update `API_DOCUMENTATION.md`

### Adding New Frontend Page

1. Create component in `pages/`
2. Add route in `Router.jsx`
3. Create service methods if needed
4. Add Redux slice if needed
5. Create any reusable components in `components/`
6. Add tests

### Adding Smart Contract Function

1. Add function to `contracts/GoldToken.sol`
2. Add tests to `test/GoldToken.test.js`
3. Run tests: `npx hardhat test`
4. Deploy: `npx hardhat run scripts/deploy.js --network sepolia`
5. Verify on Etherscan
6. Update backend web3Service.js

---

## QUICK NAVIGATION

```
Need to:                           Look in:
Add login functionality         →  backend/src/services/authService.js
                                   frontend/src/pages/Login.jsx
Add transaction history        →  backend/src/services/transactionService.js
                                   frontend/src/pages/History.jsx
Deploy to production           →  DEPLOYMENT_GUIDE.md
Fix database schema            →  backend/src/models/
Add MetaMask feature           →  frontend/src/services/web3Service.js
Update UI theme                →  frontend/src/styles/theme.js
Add admin feature              →  backend/src/routes/admin.js
Create new blockchain call    →  backend/src/services/web3Service.js
Write unit tests              →  backend/__tests__/ or frontend/src/__tests__/
```

This folder structure is scalable, maintainable, and follows industry best practices. Each folder has a single responsibility, making it easy for new developers to understand and contribute.

