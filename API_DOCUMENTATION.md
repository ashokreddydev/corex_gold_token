# REST API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 1. AUTH ENDPOINTS

### 1.1 Register (Email/Password)

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

RESPONSE 201
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "user",
      "walletAddress": null,
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
}

ERROR 400 - Email already exists
{
  "success": false,
  "error": "Email already registered"
}

ERROR 400 - Validation failed
{
  "success": false,
  "errors": [
    { "field": "password", "message": "Password too weak" }
  ]
}
```

### 1.2 Login (Email/Password)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

RESPONSE 200
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "user"
    }
  }
}

ERROR 401 - Invalid credentials
{
  "success": false,
  "error": "Invalid email or password"
}
```

### 1.3 Get Nonce for Web3 Login

```http
POST /api/auth/nonce
Content-Type: application/json

{
  "walletAddress": "0x1234567890123456789012345678901234567890"
}

RESPONSE 200
{
  "success": true,
  "data": {
    "nonce": "abc123def456",
    "expiresIn": 300,
    "message": "Please sign this message to verify wallet ownership"
  }
}

ERROR 400 - Invalid address
{
  "success": false,
  "error": "Invalid wallet address format"
}
```

### 1.4 Verify Signature (Web3 Login)

```http
POST /api/auth/verify-signature
Content-Type: application/json

{
  "walletAddress": "0x1234567890123456789012345678901234567890",
  "nonce": "abc123def456",
  "signature": "0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
}

RESPONSE 200
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "walletAddress": "0x1234567890123456789012345678901234567890",
      "role": "user"
    },
    "isNewUser": true
  }
}

ERROR 401 - Invalid signature
{
  "success": false,
  "error": "Signature verification failed"
}

ERROR 400 - Nonce expired
{
  "success": false,
  "error": "Nonce has expired or is invalid"
}
```

### 1.5 Logout

```http
POST /api/auth/logout
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "message": "Successfully logged out"
}
```

### 1.6 Refresh Token

```http
POST /api/auth/refresh
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

ERROR 401 - Token expired
{
  "success": false,
  "error": "Token expired, please login again"
}
```

---

## 2. USER ENDPOINTS

### 2.1 Get Profile

```http
GET /api/users/profile
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "role": "user",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890"
    },
    "preferences": {
      "notificationsEnabled": true,
      "emailFrequency": "daily"
    },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2024-01-15T10:30:00Z",
    "totalMinted": 1000,
    "totalBurned": 500
  }
}

ERROR 401 - Not authenticated
{
  "success": false,
  "error": "Authentication required"
}
```

### 2.2 Update Profile

```http
PUT /api/users/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "firstName": "Jonathan",
  "lastName": "Smith",
  "phone": "+9876543210",
  "preferences": {
    "notificationsEnabled": false,
    "emailFrequency": "weekly"
  }
}

RESPONSE 200
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "profile": {
      "firstName": "Jonathan",
      "lastName": "Smith",
      "phone": "+9876543210"
    },
    "preferences": {
      "notificationsEnabled": false,
      "emailFrequency": "weekly"
    },
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}

ERROR 400 - Validation error
{
  "success": false,
  "errors": [
    { "field": "phone", "message": "Invalid phone format" }
  ]
}
```

### 2.3 Get User by ID (Admin)

```http
GET /api/users/:id
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "profile": { ... },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

ERROR 403 - Not admin
{
  "success": false,
  "error": "Admin access required"
}
```

---

## 3. TOKEN ENDPOINTS

### 3.1 Get User Balance

```http
GET /api/tokens/balance?walletAddress=0x1234567890123456789012345678901234567890
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "address": "0x1234567890123456789012345678901234567890",
    "balanceWei": "1000000000000000000",
    "balance": "1.0",
    "decimals": 18,
    "symbol": "GLD",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}

ERROR 400 - Invalid address
{
  "success": false,
  "error": "Invalid wallet address format"
}
```

### 3.2 Get Token Info

```http
GET /api/tokens/info

RESPONSE 200
{
  "success": true,
  "data": {
    "name": "Gold Token",
    "symbol": "GLD",
    "decimals": 18,
    "totalSupply": "1000000000000000000000000",
    "totalSupplyFormatted": "1000000.0",
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "owner": "0x9876543210987654321098765432109876543210",
    "network": "Sepolia",
    "chainId": 11155111,
    "blockExplorer": "https://sepolia.etherscan.io/token/0x..."
  }
}
```

### 3.3 Get Vault Balance (Admin)

```http
GET /api/tokens/vault-balance
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "vaultAddress": "0x1234567890123456789012345678901234567890",
    "balanceWei": "500000000000000000000000",
    "balance": "500000.0",
    "decimals": 18,
    "transactions": {
      "minted": "1000000.0",
      "burned": "500000.0",
      "currentBalance": "500000.0"
    },
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}

ERROR 403 - Not admin
{
  "success": false,
  "error": "Admin access required"
}
```

---

## 4. TRANSACTION ENDPOINTS

### 4.1 Request Mint

```http
POST /api/transactions/mint
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "amount": 100,
  "walletAddress": "0x1234567890123456789012345678901234567890"
}

RESPONSE 201
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "type": "MINT",
    "amount": "100000000000000000000",
    "amountFormatted": "100.0",
    "status": "PENDING",
    "direction": "IN",
    "transactionHash": null,
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}

ERROR 400 - Invalid amount
{
  "success": false,
  "error": "Amount must be between 100 and 1000000"
}

ERROR 400 - Invalid wallet
{
  "success": false,
  "error": "Invalid wallet address"
}

ERROR 503 - Maintenance
{
  "success": false,
  "error": "Service temporarily unavailable for maintenance"
}
```

### 4.2 Request Burn

```http
POST /api/transactions/burn
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "amount": 50,
  "reason": "Withdrawing funds",
  "signature": "0x..." // Optional
}

RESPONSE 201
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "type": "BURN",
    "amount": "50000000000000000000",
    "amountFormatted": "50.0",
    "status": "PENDING_APPROVAL",
    "reason": "Withdrawing funds",
    "requestDate": "2024-01-15T10:00:00Z",
    "approvalDeadline": "2024-01-17T10:00:00Z",
    "message": "Redemption request submitted. Admin will review shortly."
  }
}

ERROR 400 - Insufficient balance
{
  "success": false,
  "error": "Insufficient balance. You have 30 tokens, requested 50"
}

ERROR 409 - Duplicate
{
  "success": false,
  "error": "You have a pending redemption request. Please wait for approval."
}
```

### 4.3 Get Transaction History

```http
GET /api/transactions/history?page=1&limit=20&type=MINT&status=CONFIRMED
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "type": "MINT",
        "amount": "100000000000000000000",
        "amountFormatted": "100.0",
        "status": "CONFIRMED",
        "direction": "IN",
        "transactionHash": "0xabc123def456...",
        "blockNumber": 5234567,
        "createdAt": "2024-01-15T10:00:00Z",
        "completedAt": "2024-01-15T10:05:00Z",
        "blockExplorer": "https://sepolia.etherscan.io/tx/0xabc123..."
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "type": "BURN",
        "amount": "50000000000000000000",
        "amountFormatted": "50.0",
        "status": "PENDING_APPROVAL",
        "direction": "OUT",
        "reason": "Withdrawing funds",
        "createdAt": "2024-01-14T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}

ERROR 400 - Invalid page
{
  "success": false,
  "error": "Page must be a positive integer"
}
```

### 4.4 Get Transaction by ID

```http
GET /api/transactions/:id
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "type": "MINT",
    "amount": "100000000000000000000",
    "amountFormatted": "100.0",
    "status": "CONFIRMED",
    "direction": "IN",
    "transactionHash": "0xabc123def456...",
    "blockNumber": 5234567,
    "gasUsed": "50000",
    "gasCost": "0.001",
    "from": "0x1234567890123456789012345678901234567890",
    "to": "0xadmin123456789012345678901234567890123456",
    "createdAt": "2024-01-15T10:00:00Z",
    "completedAt": "2024-01-15T10:05:00Z",
    "blockExplorer": "https://sepolia.etherscan.io/tx/0xabc123..."
  }
}

ERROR 404 - Not found
{
  "success": false,
  "error": "Transaction not found"
}

ERROR 403 - Not owner
{
  "success": false,
  "error": "You can only view your own transactions"
}
```

### 4.5 Cancel Pending Transaction

```http
POST /api/transactions/:id/cancel
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "CANCELLED",
    "cancelledAt": "2024-01-15T10:30:00Z",
    "message": "Transaction cancelled successfully"
  }
}

ERROR 400 - Cannot cancel
{
  "success": false,
  "error": "Cannot cancel confirmed transactions"
}

ERROR 404 - Not found
{
  "success": false,
  "error": "Transaction not found"
}
```

---

## 5. ADMIN ENDPOINTS

### 5.1 List Users (Admin)

```http
GET /api/admin/users?page=1&limit=20&role=user&status=active&search=john
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "email": "user@example.com",
        "walletAddress": "0x1234567890123456789012345678901234567890",
        "role": "user",
        "status": "active",
        "totalMinted": 1000,
        "totalBurned": 500,
        "createdAt": "2024-01-01T00:00:00Z",
        "lastLogin": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}

ERROR 403 - Not admin
{
  "success": false,
  "error": "Admin access required"
}
```

### 5.2 Get Vault Balance (Admin)

```http
GET /api/admin/vault
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "vaultAddress": "0x1234567890123456789012345678901234567890",
    "balance": "500000.0",
    "balanceWei": "500000000000000000000000",
    "transactions": {
      "totalMinted": "1000000.0",
      "totalBurned": "500000.0",
      "inProgress": 5
    },
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### 5.3 List Pending Redemptions (Admin)

```http
GET /api/admin/redemptions?status=PENDING&page=1&limit=20
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "redemptions": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "user": {
          "_id": "507f1f77bcf86cd799439011",
          "email": "user@example.com",
          "walletAddress": "0x1234567890123456789012345678901234567890"
        },
        "amount": "50000000000000000000",
        "amountFormatted": "50.0",
        "status": "PENDING",
        "reason": "Withdrawing funds",
        "requestDate": "2024-01-15T10:00:00Z",
        "approvalDeadline": "2024-01-17T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "pages": 1
    }
  }
}
```

### 5.4 Approve Redemption (Admin)

```http
POST /api/admin/redemptions/:id/approve
Authorization: Bearer TOKEN

RESPONSE 200
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "APPROVED",
    "approvedBy": "507f1f77bcf86cd799439099",
    "approvalDate": "2024-01-15T10:30:00Z",
    "transactionHash": "0xabc123def456...",
    "message": "Redemption approved. Tokens burned on blockchain.",
    "blockExplorer": "https://sepolia.etherscan.io/tx/0xabc123..."
  }
}

ERROR 400 - Invalid status
{
  "success": false,
  "error": "Can only approve PENDING redemptions"
}

ERROR 500 - Blockchain error
{
  "success": false,
  "error": "Failed to burn tokens on blockchain"
}
```

### 5.5 Reject Redemption (Admin)

```http
POST /api/admin/redemptions/:id/reject
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "reason": "Insufficient verification documents"
}

RESPONSE 200
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "REJECTED",
    "rejectionReason": "Insufficient verification documents",
    "rejectedAt": "2024-01-15T10:30:00Z",
    "message": "Redemption rejected. User has been notified."
  }
}

ERROR 400 - Missing reason
{
  "success": false,
  "error": "Rejection reason is required"
}
```

### 5.6 Update Settings (Admin)

```http
PUT /api/admin/settings/:key
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "value": 500
}

RESPONSE 200
{
  "success": true,
  "data": {
    "key": "MAX_MINT_AMOUNT",
    "value": 500,
    "description": "Maximum tokens per mint request",
    "updatedBy": "507f1f77bcf86cd799439099",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}

ERROR 400 - Invalid setting
{
  "success": false,
  "error": "Setting 'INVALID_KEY' not found"
}

ERROR 400 - Invalid value
{
  "success": false,
  "error": "Value must be a positive number"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or parameters |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists or operation conflicts |
| 500 | Server Error - Internal server error |
| 503 | Service Unavailable - Server temporarily down |

---

## Rate Limiting

All endpoints are rate limited to prevent abuse:

```
Rate Limit: 100 requests per 15 minutes per IP address

Response Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705318200

When exceeded (429):
{
  "success": false,
  "error": "Too many requests, please try again later",
  "retryAfter": 300
}
```

---

## Pagination

List endpoints support pagination:

```
GET /api/transactions/history?page=1&limit=20

Query Parameters:
- page: Current page (default: 1)
- limit: Items per page (default: 20, max: 100)

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123!"}'

# Get profile
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Request mint
curl -X POST http://localhost:5000/api/transactions/mint \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"walletAddress":"0x..."}'
```

### Using Postman

1. Import collection: `postman_collection.json`
2. Set environment variable: `{{api_url}}` and `{{token}}`
3. Run collection with different test scenarios

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Import from `thunder_collection.json`
3. Create environment with `token` variable
4. Run requests

