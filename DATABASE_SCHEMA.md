# Database Schema Reference

## MongoDB Collections Structure

### 1. Users Collection

```javascript
db.createCollection("users");

// Sample Document
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "user@example.com",
  password: "$2b$10$hashed_password_bcrypt", // Never plain text
  walletAddress: "0x1234567890123456789012345678901234567890",
  role: "user", // enum: ["user", "admin"]
  profile: {
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567890"
  },
  preferences: {
    notificationsEnabled: true,
    emailFrequency: "daily" // instant, daily, weekly
  },
  status: "active", // enum: [active, inactive, suspended]
  kyc: {
    verified: false,
    verificationDate: null,
    documentType: null
  },
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z"),
  lastLogin: ISODate("2024-01-15T10:30:00Z"),
  totalMinted: 1000,
  totalBurned: 500
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ walletAddress: 1 }, { unique: true, sparse: true });
db.users.createIndex({ status: 1 });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ role: 1 });

// Queries
db.users.findOne({ email: "user@example.com" });
db.users.find({ role: "admin" });
db.users.countDocuments({ status: "active" });
```

### 2. Transactions Collection

```javascript
db.createCollection("transactions");

// Sample Document
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // ref to users
  type: "MINT", // enum: [MINT, BURN]
  amount: "1000000000000000000", // 1 token in Wei
  amountFormatted: "1.0", // Human readable (18 decimals)
  status: "CONFIRMED", // enum: [PENDING, CONFIRMED, FAILED, CANCELLED]
  direction: "IN", // enum: [IN, OUT]
  transactionHash: "0xabc123def456...",
  blockNumber: 5234567,
  gasUsed: "50000",
  gasCost: "0.001", // ETH
  from: "0x1234567890123456789012345678901234567890",
  to: "0xadmin123456789012345678901234567890123456",
  contractAddress: "0x1234567890123456789012345678901234567890",
  metadata: {
    reason: "User requested mint",
    notes: "Approved by admin",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0..."
  },
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  completedAt: ISODate("2024-01-15T10:05:00Z"),
  updatedAt: ISODate("2024-01-15T10:05:00Z")
}

// Indexes
db.transactions.createIndex({ userId: 1, createdAt: -1 });
db.transactions.createIndex({ transactionHash: 1 }, { sparse: true });
db.transactions.createIndex({ status: 1 });
db.transactions.createIndex({ type: 1 });
db.transactions.createIndex({ blockNumber: 1 }, { sparse: true });
db.transactions.createIndex({ createdAt: -1 });

// Queries
db.transactions.find({ userId: ObjectId("..."), type: "MINT" });
db.transactions.countDocuments({ status: "CONFIRMED", type: "MINT" });
db.transactions.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: { _id: "$type", total: { $sum: "$amount" } } }
]);
```

### 3. Redemptions Collection (Burn Requests)

```javascript
db.createCollection("redemptions");

// Sample Document
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  amount: "500000000000000000", // 0.5 token in Wei
  amountFormatted: "0.5",
  status: "PENDING", // enum: [PENDING, APPROVED, REJECTED, COMPLETED]
  reason: "Withdrawing funds for personal use",
  approvedBy: null, // ObjectId after approval
  approvalDate: null,
  rejectionReason: null,
  transactionHash: null, // Set after burning
  transactionId: null, // Reference to transaction after burning
  requestDate: ISODate("2024-01-15T10:00:00Z"),
  approvalDeadline: ISODate("2024-01-17T10:00:00Z"),
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z"),
  completedAt: null
}

// Indexes
db.redemptions.createIndex({ userId: 1, status: 1 });
db.redemptions.createIndex({ status: 1, createdAt: -1 });
db.redemptions.createIndex({ approvalDeadline: 1 });
db.redemptions.createIndex({ createdAt: -1 });

// Queries
db.redemptions.find({ status: "PENDING" });
db.redemptions.find({ userId: ObjectId("..."), status: "APPROVED" });
```

### 4. Admin Settings Collection

```javascript
db.createCollection("admin_settings");

// Sample Documents
[
  {
    _id: ObjectId("507f1f77bcf86cd799439014"),
    key: "VAULT_ADDRESS",
    value: "0x1234567890123456789012345678901234567890",
    description: "Main vault wallet address",
    type: "address",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  },
  {
    key: "MIN_MINT_AMOUNT",
    value: 100,
    description: "Minimum tokens per mint request",
    type: "number",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  },
  {
    key: "MAX_MINT_AMOUNT",
    value: 1000000,
    description: "Maximum tokens per mint request",
    type: "number",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  },
  {
    key: "MIN_BURN_AMOUNT",
    value: 1,
    description: "Minimum tokens for burn",
    type: "number",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  },
  {
    key: "MAX_BURN_AMOUNT",
    value: 100000,
    description: "Maximum tokens per burn",
    type: "number",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  },
  {
    key: "MAINTENANCE_MODE",
    value: false,
    description: "Pause all user operations",
    type: "boolean",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  },
  {
    key: "BURN_FEE_PERCENT",
    value: 0,
    description: "Fee percentage charged on burns (0-10)",
    type: "number",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  },
  {
    key: "REDEMPTION_APPROVAL_DAYS",
    value: 2,
    description: "Days to approve/reject redemption requests",
    type: "number",
    updatedBy: ObjectId("..."),
    updatedAt: ISODate("2024-01-01T00:00:00Z")
  }
]

// Indexes
db.admin_settings.createIndex({ key: 1 }, { unique: true });

// Queries
db.admin_settings.findOne({ key: "MIN_MINT_AMOUNT" });
db.admin_settings.findOne({ key: "MAINTENANCE_MODE" });
```

### 5. Audit Logs Collection (Optional but Recommended)

```javascript
db.createCollection("audit_logs");

// Sample Document
{
  _id: ObjectId("507f1f77bcf86cd799439015"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  action: "MINT_REQUEST_CREATED",
  entity: "Transaction",
  entityId: ObjectId("507f1f77bcf86cd799439012"),
  changes: {
    before: null,
    after: { amount: 1000, status: "PENDING" }
  },
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  statusCode: 201,
  timestamp: ISODate("2024-01-15T10:00:00Z")
}

// Actions: MINT_REQUEST_CREATED, MINT_APPROVED, BURN_REQUEST_CREATED, 
//          BURN_APPROVED, USER_LOGIN, ADMIN_LOGIN, SETTINGS_CHANGED, etc.

// Indexes
db.audit_logs.createIndex({ userId: 1, timestamp: -1 });
db.audit_logs.createIndex({ action: 1, timestamp: -1 });
db.audit_logs.createIndex({ timestamp: -1 });

// TTL Index - Auto-delete logs after 90 days
db.audit_logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 });
```

### 6. API Keys Collection (For Admin Dashboard Access)

```javascript
db.createCollection("api_keys");

{
  _id: ObjectId("507f1f77bcf86cd799439016"),
  name: "Mobile App API Key",
  key: "sk_live_abc123def456...", // hashed
  userId: ObjectId("507f1f77bcf86cd799439011"),
  permissions: ["read:balance", "write:mint", "write:burn"],
  rateLimit: 1000, // requests per hour
  lastUsed: ISODate("2024-01-15T10:00:00Z"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  expiresAt: null, // null = never expires
  isActive: true
}

// Indexes
db.api_keys.createIndex({ key: 1 }, { unique: true });
db.api_keys.createIndex({ userId: 1 });
```

---

## Data Relationships

```
Users (1) ──────→ (Many) Transactions
  ├─ One user can have many transactions
  └─ Used for: Transaction history, balance calculation

Users (1) ──────→ (Many) Redemptions
  ├─ One user can request many redemptions
  └─ Used for: Redemption requests

Transactions ──→ Redemptions (Optional Join)
  ├─ After admin approves redemption
  └─ Creates corresponding burn transaction

Users (Admin) ──→ Redemptions (Approval)
  ├─ Admin approves/rejects
  └─ Sets: approvedBy, approvalDate, rejectionReason
```

---

## MongoDB Setup Instructions

### Local Development

```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod

# OR with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Connect via MongoDB Compass
# URL: mongodb://localhost:27017
```

### MongoDB Atlas (Cloud)

```bash
# Create account at https://www.mongodb.com/cloud/atlas

# Create cluster
# Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/database

# In .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gold-token?retryWrites=true&w=majority

# Whitelist IP addresses in Atlas
```

### Initial Data Setup

```javascript
// seed.js - Run once to initialize admin settings

const mongoose = require('mongoose');
const AdminSetting = require('./models/AdminSetting');

mongoose.connect(process.env.MONGODB_URI);

const defaultSettings = [
  { key: 'MIN_MINT_AMOUNT', value: 100 },
  { key: 'MAX_MINT_AMOUNT', value: 1000000 },
  { key: 'MIN_BURN_AMOUNT', value: 1 },
  { key: 'MAINTENANCE_MODE', value: false },
  { key: 'VAULT_ADDRESS', value: '0x...' },
];

await AdminSetting.insertMany(defaultSettings);
console.log('Admin settings initialized');
```

---

## Query Examples

### User Queries

```javascript
// Get user with balance info
const user = await User.aggregate([
  { $match: { _id: userId } },
  {
    $lookup: {
      from: "transactions",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
        { $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ],
      as: "stats"
    }
  }
]);

// Get user transaction history
const history = await Transaction.find({ userId })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();

// Get pending redemptions
const pending = await Redemption.find({ status: "PENDING" })
  .populate('userId', 'email walletAddress')
  .sort({ createdAt: 1 })
  .limit(50);
```

### Analytics Queries

```javascript
// Total minted and burned
db.transactions.aggregate([
  { $match: { status: "CONFIRMED" } },
  { $group: {
      _id: "$type",
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  }
]);

// Daily transaction volume
db.transactions.aggregate([
  { $match: { status: "CONFIRMED" } },
  { $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      count: { $sum: 1 },
      volume: { $sum: "$amount" }
    }
  },
  { $sort: { _id: -1 } }
]);

// Top minters
db.transactions.aggregate([
  { $match: { status: "CONFIRMED", type: "MINT" } },
  { $group: {
      _id: "$userId",
      totalMinted: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { totalMinted: -1 } },
  { $limit: 10 },
  { $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  }
]);

// Pending redemptions
db.redemptions.countDocuments({ status: "PENDING" });

// Failed transactions (potential issues)
db.transactions.find({ status: "FAILED" }).limit(20);
```

---

## Backup Strategy

```bash
# MongoDB Atlas Automated Backups
# - Enabled by default
# - Daily snapshots retained for 7 days
# - Monthly snapshots retained for 12 months

# Manual Backup (Local)
mongodump --uri "mongodb://localhost:27017/gold-token" \
          --out ./backups/$(date +%Y%m%d)

# Restore from Backup
mongorestore --uri "mongodb://localhost:27017/gold-token" \
             ./backups/20240115

# Scheduled Backup (cron job)
# 0 2 * * * mongodump --uri "mongodb://localhost:27017/gold-token" \
#                      --out /backups/gold-token-$(date +\%Y\%m\%d)
```

---

## Monitoring & Health Checks

```javascript
// Backend: Database health check endpoint

router.get('/health/db', async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const status = await admin.ping();
    
    const stats = {
      database: mongoose.connection.name,
      connected: mongoose.connection.readyState === 1,
      collections: (await mongoose.connection.db.listCollections().toArray()).length,
      timestamp: new Date()
    };
    
    res.json({ healthy: true, ...stats });
  } catch (error) {
    res.status(500).json({ healthy: false, error: error.message });
  }
});

// Monitor Collection Sizes
db.printCollectionStats();

// Monitor Index Usage
db.users.aggregate([
  { $indexStats: {} }
]);
```

