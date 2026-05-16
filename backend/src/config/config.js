import dotenv from 'dotenv';

dotenv.config();

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gold-token',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_key',
    expiresIn: process.env.JWT_EXPIRE || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  web3: {
    adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
    sepoliaRpc: process.env.SEPOLIA_RPC_URL,
    tokenAddress: process.env.GOLD_TOKEN_ADDRESS,
    tokenAbi: JSON.parse(process.env.GOLD_TOKEN_ABI || '{}'),
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};
