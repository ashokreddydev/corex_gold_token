# Gold Token Full-Stack Architecture

## 📊 1. HIGH-LEVEL ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         React Frontend (Ant Design + Axios)                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Pages: Dashboard, Mint, Burn, History, Admin Panel      │ │  │
│  │  │ Components: Modals, Forms, Cards, Tables               │ │  │
│  │  │ State: Redux/Context for user & token state            │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ▼                                       │
│                        AXIOS HTTP CALLS                              │
│                              ▼                                       │
│                     ┌─────────────────┐                             │
│                     │  MetaMask Wallet│                             │
│                     │  (Web3 Provider)│                             │
│                     └─────────────────┘                             │
└─────────────────────────────────────────────────────────────────────┘
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │         Express Backend Server                       │
        │  (Node.js + MongoDB + JWT Auth)                    │
        │  ┌───────────────────────────────────────────────┐ │
        │  │  API Routes:                                  │ │
        │  │  • POST /auth/register                        │ │
        │  │  • POST /auth/login                           │ │
        │  │  • POST /auth/nonce (Web3 wallet login)       │ │
        │  │  • GET /users/:id (user profile)              │ │
        │  │  • GET /tokens/balance (blockchain query)     │ │
        │  │  • POST /transactions/mint (create request)   │ │
        │  │  • POST /transactions/burn (redemption)       │ │
        │  │  • GET /transactions/history                  │ │
        │  │  • GET /admin/users (admin only)              │ │
        │  │  • GET /admin/vault (admin only)              │ │
        │  │  • POST /admin/approve (redemption approval)  │ │
        │  └───────────────────────────────────────────────┘ │
        │  ┌───────────────────────────────────────────────┐ │
        │  │  Core Services:                               │ │
        │  │  • Auth Service (JWT tokens)                  │ │
        │  │  • Web3 Service (Ethers.js)                   │ │
        │  │  • Email Service (notifications)              │ │
        │  │  • Transaction Service                        │ │
        │  └───────────────────────────────────────────────┘ │
        │  ┌───────────────────────────────────────────────┐ │
        │  │  Middleware:                                  │ │
        │  │  • Authentication (JWT verify)                │ │
        │  │  • Authorization (role check)                 │ │
        │  │  • Error handling                             │ │
        │  │  • Request logging                            │ │
        │  └───────────────────────────────────────────────┘ │
        └─────────────────────────────────────────────────────┘
                    ▼                              ▼
        ┌─────────────────────┐      ┌──────────────────────────┐
        │   MongoDB Database   │      │  Blockchain (Sepolia)    │
        │  (User, Transactions)│     │  ┌────────────────────┐  │
        │                     │      │  │  GoldToken.sol     │  │
        │  Collections:       │      │  │  (ERC20)           │  │
        │  • users            │      │  │                    │  │
        │  • transactions     │      │  │  Functions:        │  │
        │  • redemptions      │      │  │  • mint()          │  │
        │  • admin_settings   │      │  │  • burn()          │  │
        │                     │      │  │  • balanceOf()     │  │
        │                     │      │  │  • transfer()      │  │
        │                     │      │  │  • approve()       │  │
        │                     │      │  └────────────────────┘  │
        └─────────────────────┘      │                          │
                                     │  Connected via:          │
                                     │  • Hardhat (local dev)   │
                                     │  • Web3.js/Ethers.js     │
                                     │  • Contract ABI          │
                                     │  • Admin Wallet (Private │
                                     │    Key on Backend)       │
                                     └──────────────────────────┘
```

---

## 📁 2. FOLDER STRUCTURE

```
gold-token-app/
│
├── frontend/                           # React application
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Main user dashboard
│   │   │   ├── Mint.jsx               # Mint tokens page
│   │   │   ├── Burn.jsx               # Burn tokens page
│   │   │   ├── History.jsx            # Transaction history
│   │   │   ├── Admin.jsx              # Admin panel
│   │   │   ├── Login.jsx              # Login/Register
│   │   │   └── NotFound.jsx
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx         # Navigation & wallet connect
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── Forms/
│   │   │   │   ├── MintForm.jsx
│   │   │   │   ├── BurnForm.jsx
│   │   │   │   └── LoginForm.jsx
│   │   │   ├── Modals/
│   │   │   │   ├── ConfirmModal.jsx
│   │   │   │   ├── TxStatusModal.jsx
│   │   │   │   └── ConnectWalletModal.jsx
│   │   │   ├── Cards/
│   │   │   │   ├── BalanceCard.jsx
│   │   │   │   ├── QuickActionCard.jsx
│   │   │   │   └── StatsCard.jsx
│   │   │   └── Tables/
│   │   │       ├── TransactionTable.jsx
│   │   │       └── UsersTable.jsx (admin)
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance & base config
│   │   │   ├── authService.js         # Auth API calls
│   │   │   ├── tokenService.js        # Token balance & blockchain
│   │   │   ├── transactionService.js  # Transaction API calls
│   │   │   ├── web3Service.js         # MetaMask & Web3 interaction
│   │   │   └── adminService.js        # Admin API calls
│   │   ├── hooks/
│   │   │   ├── useAuth.js             # Authentication hook
│   │   │   ├── useWeb3.js             # Web3 & MetaMask hook
│   │   │   ├── useBalance.js          # Token balance hook
│   │   │   └── useTransactions.js     # Transactions hook
│   │   ├── store/
│   │   │   ├── authSlice.js           # Redux: auth state
│   │   │   ├── userSlice.js           # Redux: user state
│   │   │   ├── tokenSlice.js          # Redux: token state
│   │   │   ├── web3Slice.js           # Redux: web3 state
│   │   │   └── store.js               # Redux store config
│   │   ├── utils/
│   │   │   ├── constants.js           # App constants
│   │   │   ├── validation.js          # Form validation
│   │   │   ├── formatters.js          # Data formatters
│   │   │   └── helpers.js             # Helper functions
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── theme.js               # Ant Design theme
│   │   ├── App.jsx
│   │   ├── Router.jsx                 # React Router config
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── backend/                            # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js            # MongoDB connection
│   │   │   ├── web3.js                # Ethers.js setup
│   │   │   ├── jwt.js                 # JWT config
│   │   │   └── env.js                 # Environment validation
│   │   ├── models/
│   │   │   ├── User.js                # User schema
│   │   │   ├── Transaction.js         # Transaction schema
│   │   │   ├── Redemption.js          # Redemption request schema
│   │   │   └── AdminSetting.js        # Admin config schema
│   │   ├── routes/
│   │   │   ├── auth.js                # /api/auth routes
│   │   │   ├── users.js               # /api/users routes
│   │   │   ├── tokens.js              # /api/tokens routes
│   │   │   ├── transactions.js        # /api/transactions routes
│   │   │   └── admin.js               # /api/admin routes
│   │   ├── controllers/
│   │   │   ├── authController.js      # Auth logic
│   │   │   ├── userController.js      # User logic
│   │   │   ├── tokenController.js     # Token/blockchain logic
│   │   │   ├── transactionController.js
│   │   │   └── adminController.js
│   │   ├── services/
│   │   │   ├── authService.js         # JWT, hashing
│   │   │   ├── web3Service.js         # Blockchain interaction
│   │   │   ├── emailService.js        # Email notifications
│   │   │   ├── transactionService.js  # Business logic
│   │   │   └── adminService.js
│   │   ├── middleware/
│   │   │   ├── auth.js                # JWT verification
│   │   │   ├── authorization.js       # Role-based access
│   │   │   ├── errorHandler.js        # Global error handling
│   │   │   ├── requestLogger.js       # Request logging
│   │   │   └── validation.js          # Request validation
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   └── app.js                     # Express app setup
│   ├── server.js                      # Entry point
│   ├── .env.example
│   └── package.json
│
├── GOLD_TToekn/                        # Blockchain (EXISTING - DON'T MODIFY)
│   ├── contracts/
│   │   └── GoldToken.sol
│   ├── hardhat.config.js
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── GoldToken.test.js
│   ├── artifacts/
│   ├── deployments/
│   └── package.json
│
├── docs/                               # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DATABASE_SCHEMA.md
│   ├── SMART_CONTRACT_INTEGRATION.md
│   └── TROUBLESHOOTING.md
│
├── scripts/                            # Utility scripts
│   ├── setup.sh
│   └── deploy.sh
│
├── docker-compose.yml                  # Local development setup
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

---

## 🎨 3. FRONTEND ARCHITECTURE

### State Management Pattern

```
┌──────────────────────────────────────────────────────────────┐
│                    Redux Store                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  authSlice   │  │  userSlice   │  │   tokenSlice     │   │
│  ├──────────────┤  ├──────────────┤  ├──────────────────┤   │
│  │ token        │  │ profile      │  │ balance          │   │
│  │ isAuth       │  │ email        │  │ totalSupply      │   │
│  │ user role    │  │ createdAt    │  │ lastUpdated      │   │
│  │ permissions  │  │ walletAddress│  │ allowance        │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  web3Slice   │  │ transactSlice │                         │
│  ├──────────────┤  ├──────────────┤                         │
│  │ account      │  │ history      │                         │
│  │ networkId    │  │ pending      │                         │
│  │ isConnected  │  │ status       │                         │
│  │ chainId      │  │ error        │                         │
│  └──────────────┘  └──────────────┘                         │
└──────────────────────────────────────────────────────────────┘
       ▲         ▲         ▲         ▲         ▲
       │         │         │         │         │
  Dispatched by components using hooks & thunks
```

### Component Architecture

```
App.jsx
├── Router.jsx
│   ├── ProtectedRoute
│   │   ├── Dashboard
│   │   │   ├── Header (wallet connect button)
│   │   │   ├── BalanceCard (useBalance hook)
│   │   │   ├── QuickActionCards
│   │   │   └── RecentTransactions
│   │   ├── Mint
│   │   │   ├── MintForm
│   │   │   │   └── ConfirmModal
│   │   │   └── TxStatusModal
│   │   ├── Burn
│   │   ├── History
│   │   └── Admin Panel (role-based)
│   │       ├── UsersList
│   │       ├── VaultStats
│   │       └── RedemptionRequests
│   ├── Login
│   ├── Register
│   └── NotFound

Shared Hooks across components:
├── useAuth() → auth state & logout
├── useWeb3() → wallet connect, account switching
├── useBalance() → fetch token balance
├── useTransactions() → fetch tx history
└── useMint/useBurn() → transaction operations
```

### API Integration Pattern

```
services/
├── api.js (Axios instance)
│   ├── baseURL: process.env.REACT_APP_API_URL
│   ├── timeout: 10000
│   ├── interceptors:
│   │   ├── Request: Add JWT token to headers
│   │   └── Response: Handle 401, 403 errors
│   
├── authService.js
│   ├── register(email, password)
│   ├── login(email, password)
│   ├── getNonce(walletAddress)  ← Web3 login
│   ├── verifySignature(walletAddress, sig)
│   ├── logout()
│   └── refreshToken()
│
├── web3Service.js
│   ├── connectMetaMask()
│   ├── getAccount()
│   ├── switchNetwork(chainId)
│   ├── signMessage(message)
│   └── watchAccountChanges()
│
├── tokenService.js
│   ├── getBalance(address)
│   ├── getTotalSupply()
│   ├── getAllowance(owner, spender)
│   ├── queryBalance(walletAddress) ← Via backend
│   └── getTokenInfo()
│
├── transactionService.js
│   ├── requestMint(amount)
│   ├── requestBurn(amount)
│   ├── getHistory(page, limit)
│   ├── getTransactionStatus(txId)
│   └── cancelRequest(txId)
│
└── adminService.js
    ├── getUsers(page, limit)
    ├── getVaultBalance()
    ├── getRedemptionRequests()
    ├── approveRedemption(requestId)
    └── rejectRedemption(requestId)
```

---

## 🔧 4. BACKEND ARCHITECTURE

### Request/Response Flow

```
HTTP Request
    ▼
Express Middleware Chain:
├── Logger Middleware (log all requests)
├── Body Parser (parse JSON/form)
├── CORS (allow frontend domain)
├── Auth Middleware (verify JWT if needed)
├── Authorization Middleware (check roles)
└── Validation Middleware (validate input)
    ▼
Route Handler
├── Extract validated data
├── Call Service Layer
│   ├── Auth Service (JWT, passwords)
│   ├── Web3 Service (blockchain calls)
│   ├── Transaction Service (business logic)
│   ├── Email Service (notifications)
│   └── Database queries via Models
├── Return response
    ▼
Error Handler Middleware
├── Catch errors
├── Format error response
├── Log errors
└── Send to client
    ▼
HTTP Response (200/400/500)
```

### Service Layer Pattern

```
web3Service.js
├── Initialize Ethers Provider
├── Connect to blockchain (Sepolia)
├── Load contract ABI
├── Create contract instance
├── Methods:
│   ├── mint(toAddress, amount)
│   │   └── Call contract.mint() via admin wallet
│   ├── burn(fromAddress, amount)
│   │   └── Call contract.burn() via user signature
│   ├── getBalance(address)
│   │   └── Read: contract.balanceOf(address)
│   ├── getTotalSupply()
│   │   └── Read: contract.totalSupply()
│   └── waitForTx(txHash)
│       └── Poll until confirmed
│
transactionService.js
├── Request Mint
│   ├── Create transaction record in DB
│   ├── State: "PENDING_ADMIN_APPROVAL"
│   ├── Call web3Service to mint on blockchain
│   └── Update state when complete
├── Request Burn
│   ├── Request from user (via frontend signature)
│   ├── Save redemption request
│   ├── State: "PENDING_APPROVAL"
│   ├── Admin approves
│   └── Call web3Service to burn
└── Get History
    └── Query transactions by user_id

authService.js
├── generateJWT(userId, role)
├── verifyJWT(token)
├── hashPassword(password)
├── comparePassword(password, hash)
├── generateNonce() ← for Web3 login
└── verifySignature(address, message, sig)

emailService.js
├── sendTransactionNotification(user, tx)
├── sendApprovalNotification(user)
├── sendRejectionNotification(user, reason)
└── sendWelcomeEmail(user)
```

### Database Models (MongoDB with Mongoose)

```javascript
// User.js
{
  _id: ObjectId
  email: String (unique)
  password: String (hashed)
  walletAddress: String (unique)
  role: String (enum: ["user", "admin"])
  profile: {
    firstName: String,
    lastName: String,
    phone: String
  }
  preferences: {
    notificationsEnabled: Boolean,
    emailFrequency: String
  }
  status: String (enum: ["active", "inactive", "suspended"])
  createdAt: Date
  updatedAt: Date
  lastLogin: Date
}

// Transaction.js
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  type: String (enum: ["MINT", "BURN"])
  amount: Number (in Wei)
  status: String (enum: ["PENDING", "CONFIRMED", "FAILED"])
  transactionHash: String (blockchain tx hash)
  blockNumber: Number
  gasUsed: Number
  direction: String (enum: ["IN", "OUT"])
  metadata: {
    reason: String,
    notes: String
  }
  createdAt: Date
  completedAt: Date
}

// Redemption.js (burn requests waiting for approval)
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  amount: Number (in Wei)
  status: String (enum: ["PENDING", "APPROVED", "REJECTED"])
  reason: String
  approvedBy: ObjectId (ref: User)
  approvalDate: Date
  rejectionReason: String
  createdAt: Date
}

// AdminSetting.js
{
  _id: ObjectId
  key: String (unique)
  value: Mixed
  description: String
  updatedBy: ObjectId (ref: User)
  updatedAt: Date
  
  // Examples:
  // { key: "MIN_MINT_AMOUNT", value: 100 }
  // { key: "MAX_MINT_AMOUNT", value: 1000000 }
  // { key: "MAINTENANCE_MODE", value: false }
  // { key: "VAULT_ADDRESS", value: "0x..." }
}
```

---

## 🔗 5. BLOCKCHAIN INTEGRATION FLOW

### Mint Token Flow

```
FRONTEND                              BACKEND                      BLOCKCHAIN
┌──────────────────┐                                             ┌─────────────┐
│ User clicks "Mint"                                             │ GoldToken   │
│ Enters: 100 tokens                                             │ Smart       │
│ Clicks confirm                                                 │ Contract    │
└──────────────────┘                                             └─────────────┘
    │
    ├─> API: POST /api/transactions/mint
    │   { amount: 100, walletAddress: "0x..." }
    │
    │                                 ▼
    │                         ┌──────────────────────┐
    │                         │ transactionController│
    │                         └──────────────────────┘
    │                                 │
    │                                 ├─> Validate amount
    │                                 ├─> Check user balance
    │                                 ├─> Create TX record
    │                                 │   (status: PENDING)
    │                                 │
    │                                 ├─> Call web3Service.mint(
    │                                 │     walletAddress,
    │                                 │     100 tokens
    │                                 │   )
    │                                 │
    │                                 ▼
    │                         ┌──────────────────────┐
    │                         │  web3Service (backend)
    │                         │  ┌────────────────┐  │
    │                         │  │ Using admin    │  │
    │                         │  │ private key    │  │
    │                         │  └────────────────┘  │
    │                         └──────────────────────┘
    │                                 │
    │                                 ├─> Connect to contract
    │                                 ├─> Build transaction:
    │                                 │   contract.mint(
    │                                 │     toAddress,
    │                                 │     ethers.parseUnits(
    │                                 │       "100",
    │                                 │       "18"
    │                                 │     )
    │                                 │   )
    │                                 │
    │                                 ├─> Send transaction
    │                                 │   (signed by admin wallet)
    │                                 │
    │                                 ▼
    │                              GET HASH
    │                         ┌──────────────────┐
    │                         │   Sepolia Network│
    │                         │                  │
    │                         │ Tx Processing... │
    │                         │ (confirmations)  │
    │                         └──────────────────┘
    │                                 │
    │                                 ├─> wait(tx.wait())
    │                                 ├─> Update TX status: CONFIRMED
    │                                 ├─> Save blockNumber
    │                                 │
    │                                 ├─> Update user balance in DB
    │                                 ├─> Send notification email
    │                                 │
    │                                 └─> Return response
    │
    │<────────────────────────────────
    │
    └─> { success: true,
           txHash: "0x...",
           amount: "100",
           status: "CONFIRMED"
         }

Frontend:
├─> Show success modal with TX hash
├─> Link to block explorer (Sepolia)
├─> Refresh balance display
└─> Log transaction in history
```

### Burn Token Flow

```
FRONTEND                    BACKEND                     BLOCKCHAIN
┌──────────────────┐
│ User clicks "Burn"
│ Enters: 50 tokens
│ Clicks confirm
└──────────────────┘
    │
    ├─> API: POST /api/transactions/burn
    │   { amount: 50, walletAddress: "0x..." }
    │
    │                 ┌──────────────────────────┐
    │                 │ transactionController    │
    │                 │                          │
    │                 ├─> Validate amount
    │                 ├─> Check user has tokens
    │                 ├─> Create Redemption 
    │                 │   record (PENDING)
    │                 │
    │                 └─> Return:
    │                    { status: "PENDING_APPROVAL",
    │                      message: "Admin will review" }
    │
    │<──────────────────────
    │
    └─> Show message:
        "Redemption request submitted
         Admin approval required"

ADMIN PANEL:
┌──────────────────────────┐
│ Admin sees pending burn  │
│ request: 50 tokens       │
│ Clicks "Approve"         │
└──────────────────────────┘
    │
    ├─> API: POST /api/admin/approve-redemption
    │   { redemptionId: "..." }
    │
    │                 ┌──────────────────────────┐
    │                 │ adminController          │
    │                 │                          │
    │                 ├─> Verify admin role
    │                 ├─> Check redemption
    │                 ├─> Call web3Service.burn(
    │                 │     userAddress,
    │                 │     50 tokens
    │                 │   )
    │                 │
    │                 ▼
    │              (Backend burns
    │               tokens on blockchain
    │               using admin wallet)
    │
    │                 ├─> Update redemption
    │                 │   status: APPROVED
    │                 ├─> Update transaction
    │                 │   status: CONFIRMED
    │                 ├─> Send email to user
    │                 │
    │                 └─> Return success
    │
    │<──────────────────────
    │
    └─> Admin sees: "Approved"
```

### MetaMask Integration Flow

```
FRONTEND                              BACKEND
┌────────────────────┐
│ User clicks        │
│ "Connect Wallet"   │
└────────────────────┘
    │
    ├─> web3Service.connectMetaMask()
    │   ├─> Check MetaMask installed
    │   ├─> Request account access
    │   │   (User approves in MetaMask)
    │   ├─> Get account: 0xUserAddress
    │   ├─> Check network (must be Sepolia)
    │   └─> If wrong network, switch it
    │
    ├─> API: POST /api/auth/nonce
    │   { walletAddress: "0xUserAddress" }
    │
    │                   ┌────────────────────┐
    │                   │ authController     │
    │                   │                    │
    │                   ├─> Check if user
    │                   │   exists
    │                   ├─> If not, create
    │                   │   new user
    │                   ├─> Generate nonce
    │                   │   (random string)
    │                   ├─> Save nonce with
    │                   │   expiry
    │                   │
    │                   └─> Return nonce
    │
    │<──────────────────────
    │
    ├─> Show message:
    │   "Please sign this message
    │    in MetaMask to login"
    │
    ├─> web3Service.signMessage(nonce)
    │   ├─> MetaMask popup
    │   ├─> User clicks "Sign"
    │   └─> Get signature: "0xSig..."
    │
    ├─> API: POST /api/auth/verify-signature
    │   { 
    │     walletAddress: "0x...",
    │     nonce: "123abc",
    │     signature: "0xSig..."
    │   }
    │
    │                   ┌────────────────────┐
    │                   │ authService        │
    │                   │                    │
    │                   ├─> Recover address
    │                   │   from signature
    │                   │   & nonce
    │                   ├─> Compare with
    │                   │   provided address
    │                   ├─> If match:
    │                   │   ├─> Generate JWT
    │                   │   ├─> Save in DB
    │                   │   └─> Return JWT
    │                   │
    │                   └─> If no match:
    │                       Return error
    │
    │<──────────────────────
    │
    ├─> Store JWT in localStorage
    ├─> Update Redux (isAuth: true)
    ├─> Redirect to Dashboard
    └─> All future requests include JWT
```

---

## 💾 6. MONGODB COLLECTIONS

```javascript
// db.users
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@" },
        password: { bsonType: "string" }, // hashed bcrypt
        walletAddress: { bsonType: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        role: { enum: ["user", "admin"] },
        profile: {
          bsonType: "object",
          properties: {
            firstName: { bsonType: "string" },
            lastName: { bsonType: "string" },
            phone: { bsonType: "string" }
          }
        },
        preferences: {
          bsonType: "object",
          properties: {
            notificationsEnabled: { bsonType: "bool" },
            emailFrequency: { enum: ["instant", "daily", "weekly"] }
          }
        },
        status: { enum: ["active", "inactive", "suspended"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        lastLogin: { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ walletAddress: 1 }, { sparse: true, unique: true });
db.users.createIndex({ createdAt: -1 });

// db.transactions
db.createCollection("transactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "amount", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        type: { enum: ["MINT", "BURN"] },
        amount: { bsonType: "long" }, // stored in Wei
        status: { enum: ["PENDING", "CONFIRMED", "FAILED", "CANCELLED"] },
        transactionHash: { bsonType: "string" },
        blockNumber: { bsonType: "int" },
        gasUsed: { bsonType: "long" },
        direction: { enum: ["IN", "OUT"] },
        metadata: {
          bsonType: "object",
          properties: {
            reason: { bsonType: "string" },
            notes: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" },
        completedAt: { bsonType: "date" }
      }
    }
  }
});

db.transactions.createIndex({ userId: 1, createdAt: -1 });
db.transactions.createIndex({ transactionHash: 1 }, { sparse: true });
db.transactions.createIndex({ status: 1 });

// db.redemptions
db.createCollection("redemptions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "amount", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        amount: { bsonType: "long" },
        status: { enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"] },
        reason: { bsonType: "string" },
        approvedBy: { bsonType: "objectId" },
        approvalDate: { bsonType: "date" },
        rejectionReason: { bsonType: "string" },
        transactionHash: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.redemptions.createIndex({ userId: 1, status: 1 });
db.redemptions.createIndex({ status: 1, createdAt: -1 });

// db.admin_settings
db.createCollection("admin_settings");
db.admin_settings.createIndex({ key: 1 }, { unique: true });

// Example documents:
db.admin_settings.insertMany([
  { key: "VAULT_ADDRESS", value: "0xVaultAddress", description: "Vault wallet address" },
  { key: "MIN_MINT", value: 100, description: "Minimum tokens to mint" },
  { key: "MAX_MINT", value: 1000000, description: "Maximum tokens to mint" },
  { key: "MIN_BURN", value: 1, description: "Minimum tokens to burn" },
  { key: "MAINTENANCE_MODE", value: false, description: "Pause all operations" },
  { key: "BURN_FEE_PERCENT", value: 0, description: "Fee percentage on burns" }
]);
```

---

## 📡 7. API ENDPOINTS

### Authentication Endpoints

```
POST /api/auth/register
├─ Body: { email, password }
├─ Response: { token, user }
└─ Error: 400 (invalid), 409 (exists)

POST /api/auth/login
├─ Body: { email, password }
├─ Response: { token, user }
└─ Error: 401 (invalid)

POST /api/auth/nonce
├─ Body: { walletAddress }
├─ Response: { nonce }
└─ Purpose: Web3 login first step

POST /api/auth/verify-signature
├─ Body: { walletAddress, nonce, signature }
├─ Response: { token, user }
└─ Purpose: Web3 login second step (verify sig)

POST /api/auth/logout
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { message: "Logged out" }
└─ Auth: Required

GET /api/auth/refresh
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { token }
└─ Auth: Required
```

### User Endpoints

```
GET /api/users/profile
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { _id, email, walletAddress, role, ... }
└─ Auth: Required

PUT /api/users/profile
├─ Headers: Authorization: "Bearer TOKEN"
├─ Body: { firstName, lastName, phone, preferences }
├─ Response: { updatedUser }
└─ Auth: Required

GET /api/users/:id
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { user }
└─ Auth: Required, Admin only for other users
```

### Token Endpoints

```
GET /api/tokens/balance
├─ Headers: Authorization: "Bearer TOKEN"
├─ Query: ?walletAddress=0x...
├─ Response: { 
│     balance: "1000000000000000000", // Wei
│     balanceFormatted: "1.0", // Human readable
│     decimals: 18
│   }
└─ Auth: Required

GET /api/tokens/info
├─ Response: {
│     name: "Gold Token",
│     symbol: "GLD",
│     totalSupply: "...",
│     decimals: 18,
│     contractAddress: "0x..."
│   }
└─ Auth: Not required (public)

GET /api/tokens/vault-balance
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { balance, formatted }
└─ Auth: Required, Admin only
```

### Transaction Endpoints

```
POST /api/transactions/mint
├─ Headers: Authorization: "Bearer TOKEN"
├─ Body: { amount, walletAddress }
├─ Response: {
│     _id: "...",
│     status: "PENDING",
│     amount: "100",
│     transactionHash: null
│   }
└─ Auth: Required

POST /api/transactions/burn
├─ Headers: Authorization: "Bearer TOKEN"
├─ Body: { amount, reason, signature }
├─ Response: {
│     _id: "...",
│     status: "PENDING_APPROVAL",
│     amount: "50"
│   }
└─ Auth: Required
├─ Note: Creates redemption request

GET /api/transactions/history
├─ Headers: Authorization: "Bearer TOKEN"
├─ Query: ?page=1&limit=20&type=MINT
├─ Response: {
│     data: [ { _id, type, amount, status, createdAt, ... } ],
│     total: 150,
│     page: 1,
│     pages: 8
│   }
└─ Auth: Required

GET /api/transactions/:id
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { transaction details }
└─ Auth: Required

POST /api/transactions/:id/cancel
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { message: "Cancelled" }
└─ Auth: Required, only owner
├─ Condition: Status must be PENDING
```

### Admin Endpoints

```
GET /api/admin/users
├─ Headers: Authorization: "Bearer TOKEN"
├─ Query: ?page=1&limit=20&role=user&status=active
├─ Response: { data: [ users ], total, page, pages }
└─ Auth: Required, Admin only

GET /api/admin/vault
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: {
│     balance: "...",
│     formatted: "...",
│     transactions: { in: 0, out: 0 },
│     lastUpdated: "2024-01-01T00:00:00Z"
│   }
└─ Auth: Required, Admin only

GET /api/admin/redemptions
├─ Headers: Authorization: "Bearer TOKEN"
├─ Query: ?status=PENDING
├─ Response: { data: [ redemptions ], total }
└─ Auth: Required, Admin only

POST /api/admin/redemptions/:id/approve
├─ Headers: Authorization: "Bearer TOKEN"
├─ Response: { message: "Approved", transactionHash: "0x..." }
└─ Auth: Required, Admin only
├─ Action: Burns tokens on blockchain

POST /api/admin/redemptions/:id/reject
├─ Headers: Authorization: "Bearer TOKEN"
├─ Body: { reason }
├─ Response: { message: "Rejected" }
└─ Auth: Required, Admin only

PUT /api/admin/settings/:key
├─ Headers: Authorization: "Bearer TOKEN"
├─ Body: { value }
├─ Response: { setting }
└─ Auth: Required, Admin only
```

---

## 🔐 8. AUTHENTICATION FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│  TWO LOGIN OPTIONS                                      │
└─────────────────────────────────────────────────────────┘

OPTION 1: Email/Password Login (Traditional)
┌─────────────────────────────────────────┐
│ Frontend Login Form                      │
├─────────────────────────────────────────┤
│ 1. User enters email & password         │
│ 2. POST /api/auth/login                 │
└─────────────────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ Backend: authController.login()          │
├─────────────────────────────────────────┤
│ 1. Find user by email                   │
│ 2. Compare password (bcrypt)            │
│ 3. If match: generate JWT               │
│ 4. Return JWT + user data               │
│ 5. If no match: return 401              │
└─────────────────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ Frontend: Store JWT                      │
├─────────────────────────────────────────┤
│ 1. localStorage.setItem("token", jwt)   │
│ 2. Redux: setAuth(token, user)          │
│ 3. Redirect to /dashboard               │
└─────────────────────────────────────────┘


OPTION 2: MetaMask/Web3 Login
┌─────────────────────────────────────────┐
│ Frontend: Connect MetaMask               │
├─────────────────────────────────────────┤
│ 1. Click "Connect Wallet"               │
│ 2. web3Service.connectMetaMask()        │
│    ├─> MetaMask popup                   │
│    ├─> User approves                    │
│    └─> Get walletAddress                │
│ 3. Verify network is Sepolia            │
└─────────────────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ Step 1: Request Nonce                    │
│ POST /api/auth/nonce                    │
├─────────────────────────────────────────┤
│ Request: { walletAddress }              │
│ Response: { nonce }                     │
│                                         │
│ Backend: authController.getNonce()      │
│ ├─> Check if user exists                │
│ ├─> If not: create new user             │
│ ├─> Generate random nonce               │
│ ├─> Save: { walletAddress, nonce,      │
│ │          expiresAt: now + 5min }     │
│ └─> Return nonce to frontend            │
└─────────────────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ Step 2: Sign Message                     │
│ Frontend: web3Service.signMessage()     │
├─────────────────────────────────────────┤
│ 1. Show MetaMask popup                  │
│    "Sign message to verify ownership"   │
│ 2. Message: "Login nonce: {nonce}"      │
│ 3. User signs (proves wallet ownership) │
│ 4. Get signature: 0xSig...              │
└─────────────────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ Step 3: Verify Signature                │
│ POST /api/auth/verify-signature         │
├─────────────────────────────────────────┤
│ Request: {                              │
│   walletAddress,                        │
│   nonce,                                │
│   signature                             │
│ }                                       │
│                                         │
│ Backend: authService.verifySignature()  │
│ ├─> Recover address from signature      │
│ ├─> Compare with provided wallet       │
│ ├─> Check nonce validity                │
│ ├─> If all match:                       │
│ │   ├─> Generate JWT                    │
│ │   ├─> Mark nonce as used              │
│ │   └─> Return JWT                      │
│ └─> If fail: return 401                │
└─────────────────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ Frontend: Store JWT & Redirect           │
├─────────────────────────────────────────┤
│ 1. localStorage.setItem("token", jwt)   │
│ 2. Connect wallet in Redux              │
│ 3. Set isConnected = true               │
│ 4. Redirect to /dashboard               │
└─────────────────────────────────────────┘


JWT Token Usage (All Authenticated Requests)
┌─────────────────────────────────────────┐
│ Every API Request                        │
├─────────────────────────────────────────┤
│ Headers: {                              │
│   Authorization: "Bearer eyJhbGc..."   │
│ }                                       │
│                                         │
│ Backend: auth middleware                │
│ ├─> Extract token                       │
│ ├─> Verify signature                    │
│ ├─> Check expiration                    │
│ ├─> If valid: proceed                   │
│ └─> If invalid: return 401              │
└─────────────────────────────────────────┘
```

---

## 🪙 9. MINT TOKEN FLOW (DETAILED)

```
┌────────────────────────────────────────────────────────────┐
│ MINT FLOW: User requests tokens                             │
└────────────────────────────────────────────────────────────┘

STEP 1: User Initiates Mint Request
┌─────────────────────────────────────────┐
│ Frontend: MintForm.jsx                   │
├─────────────────────────────────────────┤
│ 1. User enters amount (e.g., 100)       │
│ 2. Clicks "Request Mint"                │
│ 3. Form validation:                     │
│    ├─ Amount > 0?                       │
│    ├─ Amount >= MIN_MINT_AMOUNT?        │
│    ├─ Amount <= MAX_MINT_AMOUNT?        │
│    └─ User connected to wallet?         │
│ 4. POST /api/transactions/mint          │
│    {                                    │
│      amount: "100",                     │
│      walletAddress: "0xUser..."         │
│    }                                    │
└─────────────────────────────────────────┘
    ▼
STEP 2: Backend Validates & Creates Record
┌─────────────────────────────────────────┐
│ Backend: transactionController.mint()   │
├─────────────────────────────────────────┤
│ 1. Verify JWT token (user authenticated)│
│ 2. Validate amount:                     │
│    ├─ Number.isInteger?                 │
│    ├─ >= MIN_MINT?                      │
│    └─ <= MAX_MINT?                      │
│ 3. Check wallet address format          │
│ 4. Query user from DB                   │
│ 5. Check maintenance mode disabled      │
│ 6. Create Transaction record:           │
│    {                                    │
│      userId: ObjectId,                  │
│      type: "MINT",                      │
│      amount: 100000000000000000000,     │
│      status: "PENDING",                 │
│      walletAddress: "0xUser...",        │
│      createdAt: now,                    │
│      direction: "IN"                    │
│    }                                    │
│ 7. Save to DB                           │
│ 8. Return txId                          │
└─────────────────────────────────────────┘
    ▼
STEP 3: Call Smart Contract
┌─────────────────────────────────────────┐
│ Backend: web3Service.mint()              │
├─────────────────────────────────────────┤
│ 1. Load contract with admin wallet      │
│    ├─ Private key: process.env.ADMIN_pk│
│    ├─ ABI: from GoldToken.json          │
│    └─ Address: process.env.CONTRACT_ADDR
│ 2. Build mint transaction:              │
│    contract.mint(                       │
│      toAddress,                         │
│      ethers.parseUnits("100", 18)       │
│    )                                    │
│ 3. Estimate gas                         │
│ 4. Set gas price (from network)         │
│ 5. Send transaction (signed by admin)   │
│ 6. Wait for tx to be sent                │
│ 7. Get txHash: "0xAbc123..."            │
│ 8. Save txHash to DB                    │
│ 9. Update status to "CONFIRMED_PENDING" │
└─────────────────────────────────────────┘
    ▼
STEP 4: Wait for Blockchain Confirmation
┌─────────────────────────────────────────┐
│ Backend: web3Service.waitForTx()        │
├─────────────────────────────────────────┤
│ 1. Call tx.wait(1)                      │
│    (wait for 1 block confirmation)      │
│ 2. Poll network every 5 seconds         │
│    until receipt.status === 1           │
│ 3. Get receipt:                         │
│    {                                    │
│      blockNumber: 12345,                │
│      transactionHash: "0xAbc...",       │
│      gasUsed: 50000,                    │
│      status: 1 (success)                │
│    }                                    │
│ 4. If status === 0:                     │
│    ├─ Transaction failed                │
│    ├─ Update DB status: "FAILED"        │
│    └─ Send error email                  │
│ 5. If status === 1:                     │
│    ├─ Success!                          │
│    ├─ Update DB:                        │
│    │  status: "CONFIRMED"               │
│    │  blockNumber: 12345                │
│    │  gasUsed: 50000                    │
│    ├─ Send success email                │
│    └─ Return to controller              │
└─────────────────────────────────────────┘
    ▼
STEP 5: Return Response to Frontend
┌─────────────────────────────────────────┐
│ Backend Response                         │
├─────────────────────────────────────────┤
│ {                                       │
│   success: true,                        │
│   transaction: {                        │
│     _id: "...",                         │
│     txHash: "0xAbc123...",              │
│     amount: "100",                      │
│     status: "CONFIRMED",                │
│     blockNumber: 12345,                 │
│     blockExplorer: "https://          │
│       sepolia.etherscan.io/tx/0xAbc..." │
│   }                                     │
│ }                                       │
└─────────────────────────────────────────┘
    ▼
STEP 6: Frontend Shows Success
┌─────────────────────────────────────────┐
│ Frontend: SuccessModal.jsx               │
├─────────────────────────────────────────┤
│ 1. Show success icon ✓                  │
│ 2. Display:                             │
│    "Minted 100 tokens!"                 │
│ 3. Show transaction hash (clickable)    │
│ 4. Link to block explorer               │
│ 5. Refresh balance display              │
│ 6. Add transaction to history table     │
│ 7. Auto-close modal after 5 seconds     │
│ 8. User sees +100 balance               │
└─────────────────────────────────────────┘

STEP 7: Background: Send Notifications
┌─────────────────────────────────────────┐
│ Backend: emailService                    │
├─────────────────────────────────────────┤
│ 1. Send email to user                   │
│    Subject: "100 Gold Tokens Minted"    │
│    Body:                                │
│    ├─ "Your mint request was approved"  │
│    ├─ "Amount: 100 GLD"                 │
│    ├─ "Transaction: 0xAbc123..."        │
│    ├─ "Status: Confirmed"               │
│    └─ "Block: 12345"                    │
│ 2. Log to audit trail                   │
│ 3. Update user's lastMint timestamp     │
└─────────────────────────────────────────┘

ERROR HANDLING EXAMPLES:
┌─────────────────────────────────────────┐
│ If wallet address invalid:              │
│ └─ 400: "Invalid wallet address"        │
│                                         │
│ If amount > MAX_MINT:                   │
│ └─ 400: "Amount exceeds maximum"        │
│                                         │
│ If maintenance mode on:                 │
│ └─ 503: "Service temporarily disabled"  │
│                                         │
│ If transaction fails on blockchain:     │
│ └─ 500: "Blockchain error: [reason]"    │
│                                         │
│ If admin wallet has insufficient ETH:   │
│ └─ 500: "Insufficient gas balance"      │
└─────────────────────────────────────────┘
```

---

## 🔥 10. BURN TOKEN FLOW (DETAILED)

```
┌────────────────────────────────────────────────────────────┐
│ BURN FLOW: User requests redemption                         │
└────────────────────────────────────────────────────────────┘

TWO-STEP PROCESS:
1. User submits burn request
2. Admin approves/rejects redemption
3. If approved: tokens burned on blockchain

STEP 1: User Submits Burn Request
┌─────────────────────────────────────────┐
│ Frontend: BurnForm.jsx                   │
├─────────────────────────────────────────┤
│ 1. User enters amount (e.g., 50)        │
│ 2. User enters reason (optional)        │
│ 3. Form validation:                     │
│    ├─ Amount > 0?                       │
│    ├─ Amount <= user balance?           │
│    ├─ Amount >= MIN_BURN?               │
│    └─ Reason not too long?              │
│ 4. POST /api/transactions/burn          │
│    {                                    │
│      amount: "50",                      │
│      reason: "Withdrawing funds",       │
│      signature: "0xSig..." (optional)   │
│    }                                    │
└─────────────────────────────────────────┘
    ▼
STEP 2: Backend Creates Redemption Request
┌─────────────────────────────────────────┐
│ Backend: transactionController.burn()   │
├─────────────────────────────────────────┤
│ 1. Verify JWT (user authenticated)      │
│ 2. Validate amount:                     │
│    ├─ >= MIN_BURN?                      │
│    ├─ <= user balance?                  │
│    └─ Type is integer?                  │
│ 3. Query user from DB                   │
│ 4. Create Redemption record:            │
│    {                                    │
│      userId: ObjectId,                  │
│      amount: 50000000000000000000,      │
│      status: "PENDING",                 │
│      reason: "Withdrawing funds",       │
│      createdAt: now                     │
│    }                                    │
│ 5. Save to DB                           │
│ 6. Send notification to admins          │
│ 7. Return response                      │
└─────────────────────────────────────────┘
    ▼
STEP 3: Frontend Shows Pending Status
┌─────────────────────────────────────────┐
│ Frontend: PendingModal.jsx               │
├─────────────────────────────────────────┤
│ 1. Show pending icon ⏳                 │
│ 2. Display message:                     │
│    "Redemption request submitted"       │
│    "Admin will review your request"     │
│    "You'll receive email when approved" │
│ 3. Show transaction ID                  │
│ 4. User can close modal                 │
│ 5. Add to history table (PENDING status)│
└─────────────────────────────────────────┘


ADMIN APPROVAL PROCESS
┌────────────────────────────────────────────────────────────┐

STEP 4: Admin Reviews Pending Requests
┌─────────────────────────────────────────┐
│ Admin Panel: RedemptionRequests.jsx      │
├─────────────────────────────────────────┤
│ Shows table:                            │
│ ┌──────────────────────────────────┐   │
│ │ User | Amount | Reason | Date | A │   │
│ ├──────────────────────────────────┤   │
│ │ user@... | 50 GLD | Withdraw | ... │   │
│ │ [Approve] [Reject]               │   │
│ └──────────────────────────────────┘   │
│                                         │
│ Admin clicks "Approve"                  │
└─────────────────────────────────────────┘
    ▼
STEP 5: Backend Burns Tokens
┌─────────────────────────────────────────┐
│ Backend: adminController.approveRedem() │
├─────────────────────────────────────────┤
│ 1. Verify admin role                    │
│ 2. Find Redemption record               │
│ 3. Verify status is PENDING             │
│ 4. Call web3Service.burn()              │
│    ├─ Load contract with admin wallet   │
│    ├─ Build burn transaction:           │
│    │  contract.burn(                    │
│    │    userAddress,                    │
│    │    50 tokens in Wei                │
│    │  )                                 │
│    ├─ Send transaction                  │
│    ├─ Get txHash                        │
│    └─ Wait for confirmation             │
│ 5. Update Redemption record:            │
│    {                                    │
│      status: "APPROVED",                │
│      approvedBy: adminUserId,           │
│      approvalDate: now,                 │
│      transactionHash: "0x..."           │
│    }                                    │
│ 6. Create Transaction record (BURN)     │
│ 7. Send success email to user           │
│ 8. Return response                      │
└─────────────────────────────────────────┘
    ▼
STEP 6: User Receives Confirmation
┌─────────────────────────────────────────┐
│ User Email: Redemption Approved         │
├─────────────────────────────────────────┤
│ Subject: "Redemption Approved"          │
│ Body:                                   │
│ ├─ "Your redemption has been approved" │
│ ├─ "Amount: 50 Gold Tokens"             │
│ ├─ "Tokens burned from blockchain"     │
│ ├─ "Transaction: 0x..."                │
│ ├─ "Status: Completed"                 │
│ └─ "View in dashboard"                 │
│                                         │
│ Frontend auto-refreshes:                │
│ ├─ Redemption now shows APPROVED       │
│ ├─ Balance decreased by 50              │
│ └─ Transaction added to history         │
└─────────────────────────────────────────┘

REJECTION FLOW:
┌─────────────────────────────────────────┐
│ Admin clicks "Reject"                   │
├─────────────────────────────────────────┤
│ Shows modal: Enter rejection reason     │
│ POST /api/admin/redemptions/:id/reject  │
│ {                                       │
│   reason: "Insufficient verification"  │
│ }                                       │
│                                         │
│ Backend:                                │
│ ├─ Update status: "REJECTED"            │
│ ├─ Save rejection reason                │
│ ├─ Send email to user                   │
│ └─ Tokens NOT burned                    │
│                                         │
│ User receives email:                    │
│ "Redemption Rejected"                   │
│ "Reason: Insufficient verification"    │
│ "Please contact support"                │
└─────────────────────────────────────────┘

ERROR HANDLING:
┌─────────────────────────────────────────┐
│ If user balance < amount:               │
│ └─ 400: "Insufficient balance"          │
│                                         │
│ If amount > MAX_BURN:                   │
│ └─ 400: "Amount exceeds maximum"        │
│                                         │
│ If already pending:                     │
│ └─ 409: "Redemption already pending"    │
│                                         │
│ If blockchain error during burn:        │
│ └─ 500: "Failed to burn tokens"         │
│    (admin notified, can retry)          │
└─────────────────────────────────────────┘
```

---

## 🦊 11. METAMASK INTEGRATION FLOW

```
┌────────────────────────────────────────────────────────────┐
│ METAMASK INTEGRATION DETAILS                                │
└────────────────────────────────────────────────────────────┘

INITIALIZATION
┌─────────────────────────────────────────┐
│ Frontend: App.jsx useEffect()            │
├─────────────────────────────────────────┤
│ 1. Check if MetaMask installed          │
│    if (!window.ethereum) {              │
│      showInstallMetaMaskButton()         │
│      return                             │
│    }                                    │
│ 2. Check if already connected           │
│    const accounts = await              │
│      ethereum.request({                 │
│        method: 'eth_accounts'           │
│      })                                 │
│ 3. If accounts exist:                   │
│    ├─ Set as connected                  │
│    ├─ Fetch token balance               │
│    ├─ Verify correct network            │
│    └─ Load Redux state                  │
│ 4. Setup event listeners:               │
│    ├─ accountsChanged                   │
│    ├─ chainChanged                      │
│    └─ disconnect                        │
└─────────────────────────────────────────┘

CONNECT WALLET BUTTON
┌─────────────────────────────────────────┐
│ Frontend: Header.jsx                     │
├─────────────────────────────────────────┤
│ Button "Connect Wallet"                 │
│ onClick:                                │
│ 1. Call web3Service.connectMetaMask()   │
│    try {                                │
│      const accounts = await             │
│        ethereum.request({               │
│          method: 'eth_requestAccounts'  │
│        })                               │
│    } catch (error) {                    │
│      if (error.code === 4001)           │
│        showMessage("User rejected")     │
│      else                               │
│        showMessage(error.message)       │
│    }                                    │
│                                         │
│ 2. Account returned: 0xUser...          │
│ 3. Check network:                       │
│    const chainId = await ethereum       │
│      .request({                         │
│        method: 'eth_chainId'            │
│      })                                 │
│    if (chainId !== SEPOLIA_CHAIN_ID)    │
│      switchToSepolia()                  │
│                                         │
│ 4. Store account in Redux               │
│ 5. Proceed to login flow                │
└─────────────────────────────────────────┘

NETWORK SWITCHING
┌─────────────────────────────────────────┐
│ web3Service.switchNetwork()              │
├─────────────────────────────────────────┤
│ 1. Check current chain:                 │
│    const chainId = await ethereum       │
│      .request({                         │
│        method: 'eth_chainId'            │
│      })                                 │
│ 2. If wrong network:                    │
│    try {                                │
│      await ethereum.request({           │
│        method: 'wallet_switchEthereumChain',
│        params: [{                       │
│          chainId: "0xaa36a7" // Sepolia │
│        }]                               │
│      })                                 │
│    } catch (error) {                    │
│      if (error.code === 4902)           │
│        addSepolia() // network not added│
│    }                                    │
└─────────────────────────────────────────┘

SIGN MESSAGE (FOR LOGIN)
┌─────────────────────────────────────────┐
│ web3Service.signMessage(nonce)          │
├─────────────────────────────────────────┤
│ 1. Create message:                      │
│    message = `Sign to verify wallet     │
│               ownership\nNonce:${nonce}`│
│                                         │
│ 2. Show MetaMask dialog:                │
│    const signature = await ethereum     │
│      .request({                         │
│        method: 'personal_sign',         │
│        params: [                        │
│          '0x' + Buffer.from(message)    │
│            .toString('hex'),            │
│          walletAddress                  │
│        ]                                │
│      })                                 │
│                                         │
│ 3. Return signature: "0xSig123..."      │
│ 4. Send to backend for verification     │
└─────────────────────────────────────────┘

SEND TRANSACTION (FOR APPROVAL)
┌─────────────────────────────────────────┐
│ web3Service.sendTransaction()           │
│ (Future feature)                        │
├─────────────────────────────────────────┤
│ For future approval workflows:          │
│ const txHash = await ethereum           │
│   .request({                            │
│     method: 'eth_sendTransaction',      │
│     params: [{                          │
│       from: userAddress,                │
│       to: contractAddress,              │
│       value: '0x0',                     │
│       data: encodedFunctionCall         │
│     }]                                  │
│   })                                    │
│                                         │
│ User approves in MetaMask               │
│ Returns txHash                          │
│ Wait for confirmation on frontend       │
└─────────────────────────────────────────┘

EVENT LISTENERS
┌─────────────────────────────────────────┐
│ Setup in useEffect:                     │
├─────────────────────────────────────────┤
│ // Account change                       │
│ ethereum.on('accountsChanged', (accs) =>│
│ {                                       │
│   if (accs.length === 0) {              │
│     handleDisconnect()                  │
│   } else if (accs[0] !== currentAccount)│
│   {                                     │
│     logout()                            │
│     showMessage("Account changed")      │
│   }                                     │
│ })                                      │
│                                         │
│ // Chain/Network change                 │
│ ethereum.on('chainChanged', (chainId) =>│
│ {                                       │
│   if (chainId !== SEPOLIA_ID) {         │
│     showError("Please switch to Sepolia")
│   }                                     │
│   window.location.reload()              │
│ })                                      │
│                                         │
│ // Disconnect                           │
│ ethereum.on('disconnect', () => {       │
│   handleDisconnect()                    │
│   showMessage("Wallet disconnected")    │
│ })                                      │
└─────────────────────────────────────────┘

HELPER FUNCTIONS
┌─────────────────────────────────────────┐
│ web3Service utilities:                  │
├─────────────────────────────────────────┤
│ formatAddress(addr) {                   │
│   return addr.slice(0,6) + '...' +      │
│     addr.slice(-4)                      │
│ } // 0xUser...3abc                      │
│                                         │
│ isValidAddress(addr) {                  │
│   return /^0x[a-fA-F0-9]{40}$/.test(addr)
│ }                                       │
│                                         │
│ toWei(amount, decimals=18) {            │
│   return ethers.parseUnits(             │
│     amount.toString(),                  │
│     decimals                            │
│   )                                     │
│ }                                       │
│                                         │
│ fromWei(amount, decimals=18) {          │
│   return ethers.formatUnits(            │
│     amount,                             │
│     decimals                            │
│   )                                     │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## 📦 12. RECOMMENDED PACKAGES

### Frontend Dependencies

```json
{
  "dependencies": {
    // UI Framework
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ant-design": "^5.10.0",
    
    // Routing
    "react-router-dom": "^6.18.0",
    
    // HTTP Client
    "axios": "^1.6.0",
    
    // State Management
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    
    // Web3
    "ethers": "^6.8.0",
    
    // Forms & Validation
    "react-hook-form": "^7.48.0",
    "yup": "^1.3.0",
    
    // Date handling
    "dayjs": "^1.11.10",
    
    // Notifications
    "react-toastify": "^9.1.3",
    
    // Utils
    "lodash": "^4.17.21",
    "classnames": "^2.3.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.1.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

### Backend Dependencies

```json
{
  "dependencies": {
    // Core
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    
    // Database
    "mongoose": "^8.0.0",
    
    // Authentication
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.3",
    
    // Web3 & Blockchain
    "ethers": "^6.8.0",
    
    // Validation
    "joi": "^17.11.0",
    
    // Email
    "nodemailer": "^6.9.7",
    
    // Security
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "xss-clean": "^0.1.1",
    
    // Logging
    "morgan": "^1.10.0",
    "winston": "^3.11.0",
    
    // Utils
    "axios": "^1.6.0",
    "uuid": "^9.0.1",
    "moment": "^2.29.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Development Tools

```json
{
  "devDependencies": {
    // Testing
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.5",
    
    // API Documentation
    "swagger-ui-express": "^4.6.3",
    "swagger-jsdoc": "^6.2.8",
    
    // Environment
    "cross-env": "^7.0.3"
  }
}
```

---

## 🚀 13. DEPLOYMENT ARCHITECTURE

### Development Environment

```
┌─────────────────────────────────────────┐
│ Developer Machine                        │
├─────────────────────────────────────────┤
│ docker-compose up                       │
│                                         │
│ Services:                               │
│ ├─ Frontend: localhost:3000             │
│ ├─ Backend: localhost:5000              │
│ ├─ MongoDB: localhost:27017             │
│ └─ Hardhat: localhost:8545              │
│                                         │
│ Smart Contract: Local Hardhat chain     │
│ Network: http://127.0.0.1:8545         │
└─────────────────────────────────────────┘
```

### Staging Environment

```
┌───────────────────────────────────────────┐
│ Staging Server (VPS / AWS / Digital Ocean) │
├───────────────────────────────────────────┤
│ Frontend:                                 │
│ ├─ React build: /var/www/frontend        │
│ ├─ Nginx reverse proxy: port 80, 443     │
│ └─ SSL certificate (Let's Encrypt)       │
│                                          │
│ Backend:                                 │
│ ├─ Node.js server: port 5000             │
│ ├─ PM2 process manager                   │
│ ├─ .env variables (staging)              │
│ └─ Logs: /var/log/backend/               │
│                                          │
│ Database:                                │
│ ├─ MongoDB (local or Atlas)              │
│ └─ Backups: daily automated              │
│                                          │
│ Blockchain:                              │
│ ├─ Network: Sepolia testnet              │
│ ├─ Admin wallet: Private key in .env     │
│ └─ Contract: Already deployed            │
│                                          │
│ Monitoring:                              │
│ ├─ Uptime monitoring                     │
│ ├─ Error tracking (Sentry)               │
│ └─ Logs (ELK stack or CloudWatch)        │
└───────────────────────────────────────────┘
```

### Production Environment

```
┌────────────────────────────────────────────┐
│ Production Architecture                     │
├────────────────────────────────────────────┤
│                                            │
│ Frontend (CDN + Static Hosting):           │
│ ├─ Vercel / Netlify                       │
│ │  ├─ Automatic deployments from GitHub   │
│ │  ├─ Global CDN distribution             │
│ │  ├─ Automatic SSL certificates          │
│ │  └─ Infinitely scalable                 │
│ └─ OR: AWS S3 + CloudFront                │
│                                            │
│ Backend (Scalable Server):                 │
│ ├─ Heroku / AWS EC2 / DigitalOcean /      │
│ │  Railway                                │
│ ├─ Auto-scaling based on load             │
│ ├─ Load balancer (if multiple instances)  │
│ ├─ PM2 or systemd for process management  │
│ ├─ Environment variables in secrets mgmt  │
│ └─ CI/CD pipeline (GitHub Actions)        │
│                                            │
│ Database:                                 │
│ ├─ MongoDB Atlas (Cloud)                  │
│ │  ├─ Automated backups                   │
│ │  ├─ Point-in-time recovery              │
│ │  ├─ Multi-region replication            │
│ │  └─ Built-in monitoring                 │
│ └─ Backups (daily, stored in S3)          │
│                                            │
│ Blockchain:                                │
│ ├─ Network: Sepolia testnet (staging)     │
│ │  OR Ethereum mainnet (production)       │
│ ├─ Admin wallet: Secure key management    │
│ │  (AWS Secrets Manager / HashiCorp Vault)│
│ ├─ RPC provider:                          │
│ │  ├─ Alchemy                             │
│ │  ├─ Infura                              │
│ │  └─ Ethers provider with fallback       │
│ └─ Contract: Already deployed & verified  │
│                                            │
│ Security & Monitoring:                    │
│ ├─ SSL/TLS encryption everywhere          │
│ ├─ DDoS protection (Cloudflare)           │
│ ├─ Rate limiting on API endpoints         │
│ ├─ Error tracking (Sentry)                │
│ ├─ Performance monitoring (DataDog)       │
│ ├─ Log aggregation (Datadog / Splunk)     │
│ ├─ Security scanning (Snyk)               │
│ └─ Uptime monitoring (PagerDuty)          │
│                                            │
│ CI/CD Pipeline (GitHub Actions):          │
│ ├─ On push to main:                       │
│ │  ├─ Run tests                           │
│ │  ├─ Lint code                           │
│ │  ├─ Build frontend                      │
│ │  ├─ Run security checks                 │
│ │  ├─ Deploy to staging                   │
│ │  └─ Run smoke tests                     │
│ ├─ On release tag:                        │
│ │  ├─ Deploy to production                │
│ │  ├─ Update contract if needed           │
│ │  └─ Notify team                         │
│ └─ Rollback capability if needed          │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔧 14. ENVIRONMENT VARIABLES

### Frontend (.env)

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000

# Web3 Configuration
REACT_APP_NETWORK_NAME=Sepolia
REACT_APP_CHAIN_ID=0xaa36a7
REACT_APP_CONTRACT_ADDRESS=0x1234567890...

# Public Blockchain Data (no secrets)
REACT_APP_ETHERSCAN_API_KEY=YOUR_PUBLIC_KEY
REACT_APP_BLOCK_EXPLORER_URL=https://sepolia.etherscan.io

# App Configuration
REACT_APP_APP_NAME=Gold Token
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/gold-token
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gold-token

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Web3 & Blockchain
CHAIN_ID=11155111  # Sepolia
RPC_URL=http://127.0.0.1:8545  # Local or Alchemy/Infura
CONTRACT_ADDRESS=0x1234567890...
ADMIN_WALLET_ADDRESS=0xAdminAddress
ADMIN_PRIVATE_KEY=0xPrivateKeyHex  # KEEP SECURE!
WEB3_PROVIDER=http://localhost:8545

# Email (NodeMailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@goldtoken.com
SMTP_PASS=app-specific-password
EMAIL_FROM=Gold Token <noreply@goldtoken.com>

# Security
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=10
SESSION_SECRET=your-session-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Sentry (Error Tracking) - Optional
SENTRY_DSN=https://key@sentry.io/123456

# Admin Settings
MIN_MINT_AMOUNT=1
MAX_MINT_AMOUNT=1000000
MIN_BURN_AMOUNT=1
MAINTENANCE_MODE=false
```

### Docker Compose (.env for compose)

```bash
# Frontend
FRONTEND_PORT=3000
REACT_APP_API_URL=http://backend:5000/api

# Backend
BACKEND_PORT=5000
DATABASE_URL=mongodb://mongo:27017/gold-token

# MongoDB
MONGO_INITDB_DATABASE=gold-token

# Ethereum
HARDHAT_NETWORK=localhost
HARDHAT_ACCOUNTS=0x1234...  # Test account
```

---

## ✅ 15. BEST PRACTICES

### Frontend Best Practices

```javascript
// 1. COMPONENT STRUCTURE
// ✓ Keep components small and focused
// ✓ One responsibility per component
// ✓ Use custom hooks for shared logic

// BAD
const UserDashboard = () => {
  // 500 lines of code
};

// GOOD
const UserDashboard = () => {
  return (
    <Layout>
      <BalanceCard />
      <QuickActions />
      <TransactionHistory />
    </Layout>
  );
};

// 2. STATE MANAGEMENT
// ✓ Use Redux for global state
// ✓ Use local useState for component state
// ✓ Use custom hooks for shared state logic

// BAD: Prop drilling
<Parent prop1={x} prop2={y} prop3={z}>
  <Child prop1={x} prop2={y} prop3={z}>
    <GrandChild prop1={x} prop2={y} prop3={z} />
  </Child>
</Parent>

// GOOD: Redux
const grandchildValue = useSelector(state => state.grandchildData);

// 3. API CALLS
// ✓ Centralize in services
// ✓ Use Axios interceptors for auth
// ✓ Handle errors gracefully

// BAD
const UserProfile = () => {
  useEffect(() => {
    fetch('/api/users/profile')
      .then(r => r.json())
      .then(d => setUser(d))
  }, []);
};

// GOOD
const UserProfile = () => {
  const { data: user } = useQuery('user', userService.getProfile);
};

// 4. FORM HANDLING
// ✓ Use React Hook Form
// ✓ Validate on submit
// ✓ Show field-level errors

const MintForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("amount")}
        error={errors.amount?.message}
      />
    </form>
  );
};

// 5. ERROR HANDLING
// ✓ Show user-friendly messages
// ✓ Log errors for debugging
// ✓ Handle network errors

try {
  await transactionService.mint(amount);
} catch (error) {
  if (error.response?.status === 400) {
    message.error(error.response.data.message);
  } else if (error.response?.status === 401) {
    redirect('/login');
  } else {
    logger.error('Mint error', error);
    message.error('An unexpected error occurred');
  }
}

// 6. PERFORMANCE
// ✓ Use React.memo for expensive components
// ✓ Lazy load routes
// ✓ Debounce API calls

const MemoizedCard = React.memo(BalanceCard);

const Dashboard = lazy(() => import('./Dashboard'));

const handleSearch = debounce((query) => {
  api.search(query);
}, 300);

// 7. TESTING
// ✓ Test user interactions
// ✓ Mock external services
// ✓ Test error scenarios

vi.mock('../services/userService', () => ({
  getUserProfile: vi.fn().mockResolvedValue({
    name: 'John',
    balance: 100
  })
}));

test('displays user balance', async () => {
  render(<Dashboard />);
  await waitFor(() => {
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});

// 8. SECURITY
// ✓ Never log sensitive data
// ✓ Keep private keys out of frontend
// ✓ Validate user input
// ✓ Use HTTPS only

// BAD
console.log('Private key:', privateKey);

// GOOD
// Private keys never leave backend
```

### Backend Best Practices

```javascript
// 1. ROUTE ORGANIZATION
// ✓ Keep routes simple
// ✓ Validate input immediately
// ✓ Return consistent responses

router.post('/mint', authenticate, validate(mintSchema), async (req, res) => {
  try {
    const result = await transactionService.mint(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. ERROR HANDLING
// ✓ Use custom error classes
// ✓ Global error handler middleware
// ✓ Log all errors

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

app.use((err, req, res, next) => {
  logger.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    statusCode
  });
});

// 3. DATABASE QUERIES
// ✓ Use indexes for frequently queried fields
// ✓ Select only needed fields
// ✓ Use pagination

// BAD
const users = await User.find({});

// GOOD
const users = await User.find()
  .select('name email')
  .limit(20)
  .skip(page * 20)
  .lean();

// 4. SECURITY
// ✓ Validate all inputs
// ✓ Never log sensitive data
// ✓ Use environment variables
// ✓ Implement rate limiting

app.use(helmet()); // Security headers
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// 5. ASYNC OPERATIONS
// ✓ Use try-catch
// ✓ Handle rejections
// ✓ Set timeouts

router.post('/mint', async (req, res) => {
  try {
    const result = await Promise.race([
      web3Service.mint(...),
      timeout(30000) // 30 second timeout
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. TRANSACTION HANDLING
// ✓ Use atomic operations
// ✓ Implement rollback logic
// ✓ Log transaction state changes

const session = await mongoose.startSession();
try {
  await session.withTransaction(async () => {
    await User.updateOne({ _id }, { balance: newBalance }, { session });
    await Transaction.create([{ ... }], { session });
  });
} catch (error) {
  // Automatically rolled back
} finally {
  await session.endSession();
}

// 7. LOGGING
// ✓ Log at appropriate levels
// ✓ Include context
// ✓ Never log passwords or keys

logger.info('User logged in', { userId, email, timestamp });
logger.error('Mint failed', { error: error.message, userId, amount });

// 8. WEB3 INTERACTION
// ✓ Handle network failures
// ✓ Verify transaction receipts
// ✓ Use admin wallet carefully

const tx = await contract.mint(address, amount);
const receipt = await tx.wait(1);

if (receipt.status !== 1) {
  throw new Error('Transaction failed on blockchain');
}
```

### General Best Practices

```
SECURITY
├─ Never commit .env files
├─ Use strong JWT secrets
├─ Hash passwords (bcrypt)
├─ Validate all user inputs
├─ Use HTTPS everywhere
├─ Implement CORS properly
├─ Rate limit API endpoints
├─ Log security events
└─ Regular security audits

CODE QUALITY
├─ Use ESLint & Prettier
├─ Write unit tests
├─ Test edge cases
├─ Use TypeScript (recommended)
├─ Write meaningful comments
├─ Keep functions small
├─ DRY principle (Don't Repeat Yourself)
└─ SOLID principles

DATABASE
├─ Create indexes for queries
├─ Use transactions for multi-step operations
├─ Regular backups
├─ Monitor query performance
├─ Use connection pooling
├─ Archive old data
└─ Test recovery procedures

BLOCKCHAIN/WEB3
├─ Always verify transaction receipts
├─ Use admin wallet securely
├─ Test on testnet first
├─ Monitor gas prices
├─ Handle network failures gracefully
├─ Keep audit logs
└─ Never expose private keys

DOCUMENTATION
├─ API documentation (Swagger)
├─ README for setup
├─ Architecture diagrams
├─ Database schema
├─ Environment variable list
├─ Deployment guide
└─ Troubleshooting guide

MONITORING & MAINTENANCE
├─ Monitor uptime
├─ Track error rates
├─ Monitor database size
├─ Check disk space
├─ Update dependencies
├─ Regular backups
├─ Performance monitoring
└─ Security patching
```

---

## 📋 SUMMARY CHECKLIST

### Development Setup
- [ ] Fork/clone repository
- [ ] Install Node.js 18+
- [ ] Install MongoDB locally or use MongoDB Atlas
- [ ] Create `.env` file for both frontend and backend
- [ ] Install dependencies: `npm install` in both folders
- [ ] Run local Hardhat: `npx hardhat node`
- [ ] Deploy contract locally
- [ ] Start backend: `npm run dev`
- [ ] Start frontend: `npm run dev`

### Before Deployment
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Build frontend: `npm run build`
- [ ] Check all environment variables
- [ ] Test with testnet contract
- [ ] Review security checklist
- [ ] Backup database
- [ ] Setup monitoring

### After Deployment
- [ ] Verify frontend loads
- [ ] Test login flow (email & MetaMask)
- [ ] Test mint functionality
- [ ] Test burn functionality
- [ ] Verify email notifications
- [ ] Check error handling
- [ ] Monitor server logs
- [ ] Test on different devices/browsers

---

This is a comprehensive, beginner-friendly architecture that will scale smoothly as your application grows. Keep it simple, well-documented, and focus on core functionality first.
