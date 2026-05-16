# Backend Setup Instructions

## Installation

```bash
cd backend
npm install
```

## Development

```bash
# Create .env file with local configuration
cp .env.example .env

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3000`

## Production

```bash
# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new account
- `POST /api/auth/web3-login` - Login with Web3/MetaMask
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tokens
- `GET /api/tokens/balance` - Get user balance
- `GET /api/tokens/info` - Get token info
- `POST /api/tokens/mint` - Mint tokens
- `POST /api/tokens/burn` - Request burn
- `GET /api/tokens/history` - Get transaction history
- `GET /api/tokens/vault-balance` - Get vault balance

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update settings

### Admin
- `GET /api/admin/burn-requests` - Get pending burn requests
- `POST /api/admin/burn-requests/:id/approve` - Approve burn
- `POST /api/admin/burn-requests/:id/reject` - Reject burn
- `GET /api/admin/users` - Get all users

## Folder Structure

- `src/config/` - Configuration files
- `src/models/` - MongoDB Mongoose models
- `src/routes/` - API routes
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/middleware/` - Express middleware
- `src/utils/` - Utility functions

## Key Technologies

- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Ethers.js
- Nodemailer
- Helmet (Security)

## Environment Variables

See `.env.example` for all required environment variables.

## Database Models

- User - User accounts
- Transaction - Token transactions
- BurnRequest - Burn requests with admin approval
- AuditLog - Activity logs (auto-deleted after 90 days)

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- Admin role-based access control
