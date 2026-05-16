# Deployment Guide

This guide covers deploying the Gold Token Full-Stack Application to production.

---

## TABLE OF CONTENTS

1. Pre-Deployment Checklist
2. Environment Setup
3. Database Deployment (MongoDB Atlas)
4. Smart Contract Deployment (Sepolia)
5. Backend Deployment (Heroku/AWS/Railway)
6. Frontend Deployment (Vercel/Netlify)
7. Domain & SSL Setup
8. Post-Deployment Verification
9. Monitoring & Maintenance
10. Rollback Procedures

---

## 1. PRE-DEPLOYMENT CHECKLIST

### Code Quality
- [ ] All tests passing: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] No security vulnerabilities: `npm audit`
- [ ] Code reviewed and approved
- [ ] Git branch clean, all changes committed
- [ ] Version bumped in package.json
- [ ] Changelog updated

### Configuration
- [ ] All environment variables documented
- [ ] No hardcoded secrets in code
- [ ] API endpoints updated for production URLs
- [ ] Frontend build succeeds: `npm run build`
- [ ] Environment files (.env.production) created
- [ ] Database migrations prepared
- [ ] Database backups scheduled

### Security
- [ ] SSL certificates prepared
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Admin passwords changed from defaults
- [ ] Database access restricted to IP ranges
- [ ] Private keys secured (not in repo)
- [ ] Security headers configured

### Blockchain
- [ ] Contract deployed to Sepolia testnet
- [ ] Contract verified on Etherscan
- [ ] Admin wallet funded with testnet ETH
- [ ] Contract address and ABI documented
- [ ] RPC provider configured (Alchemy/Infura)

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Network access whitelist configured
- [ ] Backup automation enabled
- [ ] Monitoring alerts configured
- [ ] Initial admin user created
- [ ] Initial settings seeded

### Testing
- [ ] Manual testing on staging complete
- [ ] Cross-browser testing done
- [ ] Mobile responsive testing done
- [ ] API endpoints tested with production URLs
- [ ] MetaMask connection tested
- [ ] Email notifications tested
- [ ] Error scenarios tested

---

## 2. ENVIRONMENT SETUP

### Production Environment Variables

#### Backend (.env.production)

```bash
# Server
PORT=5000
NODE_ENV=production
BACKEND_URL=https://api.goldtoken.com

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://produser:SecurePass123@cluster.mongodb.net/gold-token?retryWrites=true&w=majority

# JWT
JWT_SECRET=generate_very_long_random_string_here_minimum_32_chars_use_crypto.randomBytes
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Web3 & Blockchain
CHAIN_ID=11155111  # Sepolia testnet
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# OR
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
CONTRACT_ADDRESS=0x... # Deployed contract address
ADMIN_WALLET_ADDRESS=0x... # Admin wallet
ADMIN_PRIVATE_KEY=0x... # Keep in secrets manager, never in .env

# Email (SendGrid recommended for production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@goldtoken.com

# Security
CORS_ORIGIN=https://goldtoken.com,https://www.goldtoken.com
BCRYPT_ROUNDS=12
SESSION_SECRET=generate_another_random_string_minimum_32_chars

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_DIR=/var/log/gold-token

# Error Tracking (Sentry)
SENTRY_DSN=https://xxxxx@sentry.io/123456

# Admin Settings
MIN_MINT_AMOUNT=100
MAX_MINT_AMOUNT=1000000
MIN_BURN_AMOUNT=1
MAINTENANCE_MODE=false
```

#### Frontend (.env.production)

```bash
# API Configuration
REACT_APP_API_URL=https://api.goldtoken.com/api
REACT_APP_API_TIMEOUT=10000

# Web3 Configuration
REACT_APP_NETWORK_NAME=Sepolia
REACT_APP_CHAIN_ID=0xaa36a7
REACT_APP_CONTRACT_ADDRESS=0x...

# Public Blockchain Data
REACT_APP_ETHERSCAN_API_KEY=YOUR_PUBLIC_KEY
REACT_APP_BLOCK_EXPLORER_URL=https://sepolia.etherscan.io

# App Configuration
REACT_APP_APP_NAME=Gold Token
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

---

## 3. DATABASE DEPLOYMENT (MONGODB ATLAS)

### Step 1: Create MongoDB Atlas Account

1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create organization and project

### Step 2: Create Cluster

```
1. Click "Create" to build a new cluster
2. Select:
   - Cloud Provider: AWS (or preferred)
   - Region: Choose closest to users
   - Cluster Tier: M10 shared (for small/medium apps)
3. Click "Create Cluster"
4. Wait for deployment (5-10 minutes)
```

### Step 3: Configure Network Access

```
1. Go to "Network Access"
2. Click "Add IP Address"
3. Options:
   - Add specific IPs (backend server IPs)
   - Add CIDR block (more flexible)
   - Add 0.0.0.0/0 (LESS SECURE - not recommended for production)
4. Click "Confirm"
```

### Step 4: Create Database User

```
1. Go to "Database Access"
2. Click "Add New Database User"
3. Enter username and password (save securely)
4. Select "Built-in Role: Atlas admin" (or custom role)
5. Click "Add User"
```

### Step 5: Get Connection String

```
1. Click "Databases"
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy connection string:
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
5. Add to .env.production
```

### Step 6: Initialize Database

```bash
# SSH into backend server
ssh user@backend-server.com

# Run database initialization script
node scripts/initializeDatabase.js

# Or manually run:
# - Create admin user
# - Seed admin settings
# - Create indexes
```

### Step 7: Enable Backups

```
1. In Atlas Dashboard
2. Go to "Backup"
3. Enable "Automatic Backup"
4. Set backup frequency (daily recommended)
5. Set retention period (30 days minimum)
```

### Step 8: Monitor Database

```
1. Go to "Monitoring"
2. Check CPU, memory, disk usage
3. Set up alerts for:
   - CPU > 80%
   - Memory > 90%
   - Disk usage > 95%
```

---

## 4. SMART CONTRACT DEPLOYMENT (SEPOLIA)

The smart contract is already in `GOLD_TToekn/` folder and has been deployed. If you need to redeploy:

### Update to Sepolia Testnet

```bash
# In GOLD_TToekn/ folder

# 1. Update hardhat.config.js
// networks: {
//   sepolia: {
//     url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
//     accounts: [ADMIN_PRIVATE_KEY]
//   }
// }

# 2. Deploy
npx hardhat run scripts/deploy.js --network sepolia

# Output:
# GoldToken deployed to: 0x123456...
```

### Verify Contract on Etherscan

```bash
# 1. Get your Etherscan API key
# 2. In .env: ETHERSCAN_API_KEY=your_key

# 3. Verify
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Access: https://sepolia.etherscan.io/address/0x...
```

### Record Contract Details

```
Contract Address: 0x...
Admin Wallet: 0x...
Network: Sepolia (11155111)
Etherscan Link: https://sepolia.etherscan.io/address/0x...
ABI Location: GOLD_TToekn/artifacts/contracts/GoldToken.sol/GoldToken.json
```

---

## 5. BACKEND DEPLOYMENT

### Option A: Heroku

#### Step 1: Setup Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create gold-token-api
# OR if app name taken:
heroku create gold-token-api-prod
```

#### Step 2: Add Environment Variables

```bash
# Add each variable
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret
heroku config:set ADMIN_PRIVATE_KEY=0x...
heroku config:set NODE_ENV=production
# ... add all variables

# Verify
heroku config
```

#### Step 3: Deploy

```bash
# Add Heroku remote if not auto-created
heroku git:remote -a gold-token-api

# Deploy from git
git push heroku main
# OR specific branch:
git push heroku develop:main

# Check logs
heroku logs --tail
```

#### Step 4: Run Migrations

```bash
# SSH into Heroku app
heroku run bash -a gold-token-api

# Initialize database
node scripts/initializeDatabase.js

# Exit
exit
```

#### Step 5: Monitor

```bash
# Check app health
heroku ps

# View logs
heroku logs --tail

# Restart if needed
heroku restart -a gold-token-api
```

---

### Option B: AWS EC2

#### Step 1: Launch EC2 Instance

```
1. AWS Console → EC2 → Launch Instance
2. Choose: Ubuntu 22.04 LTS
3. Instance type: t3.small (for small/medium apps)
4. Configure security group:
   - Inbound: SSH (22), HTTP (80), HTTPS (443)
5. Create/select key pair
6. Review and Launch
7. Save public IP
```

#### Step 2: SSH into Instance

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt update && sudo apt upgrade -y
```

#### Step 3: Install Dependencies

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 (process manager)
sudo npm install -g pm2

# Nginx (reverse proxy)
sudo apt install -y nginx

# MongoDB (if local) - or use Atlas instead
# sudo apt install -y mongodb

# Git
sudo apt install -y git
```

#### Step 4: Clone and Setup

```bash
# Clone repo
git clone https://github.com/yourusername/gold-token.git
cd gold-token/backend

# Install dependencies
npm install

# Create .env.production
nano .env.production
# Paste production environment variables
# Save: Ctrl+O, Enter, Ctrl+X

# Start with PM2
pm2 start server.js --name "gold-token-api"
pm2 save  # Save startup config
pm2 startup  # Auto-start on reboot
```

#### Step 5: Configure Nginx

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/gold-token

# Add:
server {
    listen 80;
    server_name api.goldtoken.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/gold-token /etc/nginx/sites-enabled/

# Test nginx
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

#### Step 6: Setup SSL Certificate

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d api.goldtoken.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### Step 7: Monitor & Logs

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs gold-token-api

# List processes
pm2 list
```

---

### Option C: Railway.app

#### Step 1: Connect GitHub

1. Visit https://railway.app
2. Sign up with GitHub
3. Authorize Railway
4. Create new project from GitHub repo

#### Step 2: Configure Variables

1. Click "Add service" → "Configure variables"
2. Add all environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - ADMIN_PRIVATE_KEY
   - etc.

#### Step 3: Deploy

```bash
# Push to GitHub
git push origin main

# Railway auto-deploys
# Monitor in Railway dashboard
```

#### Step 4: Get URL

- Railway provides: https://gold-token-api-prod.up.railway.app
- Update frontend REACT_APP_API_URL to this URL

---

## 6. FRONTEND DEPLOYMENT

### Option A: Vercel

#### Step 1: Connect GitHub

1. Visit https://vercel.com
2. Sign up with GitHub
3. Import repository

#### Step 2: Configure

```
1. Select "frontend" folder
2. Add environment variables:
   - REACT_APP_API_URL
   - REACT_APP_CONTRACT_ADDRESS
   - REACT_APP_CHAIN_ID
3. Click "Deploy"
```

#### Step 3: Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Add domain: goldtoken.com
3. Update DNS records as shown
4. SSL auto-configured

---

### Option B: Netlify

#### Step 1: Connect GitHub

1. Visit https://netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Select repository

#### Step 2: Configure

```
Build command: npm run build
Publish directory: build
```

#### Step 3: Set Environment Variables

1. Site settings → Build & deploy → Environment
2. Add variables (same as frontend .env)

#### Step 4: Deploy

1. Netlify auto-deploys on git push
2. View build logs in dashboard

---

### Option C: AWS S3 + CloudFront

#### Step 1: Create S3 Bucket

```bash
aws s3 mb s3://goldtoken-frontend --region us-east-1
```

#### Step 2: Build and Upload

```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://goldtoken-frontend --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket goldtoken-frontend --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::goldtoken-frontend/*"
  }]
}'
```

#### Step 3: Create CloudFront Distribution

1. CloudFront → Create Distribution
2. Origin domain: goldtoken-frontend.s3.amazonaws.com
3. Enable HTTPS
4. Add domain alias: goldtoken.com
5. Create distribution

#### Step 4: Route 53 (DNS)

1. Route 53 → Create hosted zone
2. Add CNAME record pointing to CloudFront
3. Update domain registrar nameservers

---

## 7. DOMAIN & SSL SETUP

### Domain Registration

1. Register at Namecheap, GoDaddy, etc.
2. Point nameservers to your host provider
3. Add DNS records:

```
A Record:      goldtoken.com    → Your IP or CDN
CNAME Record:  www              → goldtoken.com
CNAME Record:  api              → Backend URL
TXT Record:    SPF, DKIM for email
MX Record:     For email service
```

### SSL Certificate

#### Auto (Recommended)

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d goldtoken.com -d www.goldtoken.com

# Auto-renew
sudo certbot renew --dry-run
```

#### Manual

```bash
# Generate key
openssl genrsa -out private.key 2048

# Generate CSR
openssl req -new -key private.key -out goldtoken.csr

# Purchase SSL from CA
# Get certificate file

# Install on server
# Configure nginx/apache to use certificate
```

---

## 8. POST-DEPLOYMENT VERIFICATION

### Frontend Checks

```bash
# ✓ Homepage loads
curl https://goldtoken.com

# ✓ API calls work
curl https://goldtoken.com/api/tokens/info

# ✓ MetaMask connection works
# Manual test in browser

# ✓ Forms submit
# Manual test login form

# ✓ Mobile responsive
# Test on mobile device

# ✓ Performance
# Run Lighthouse audit
```

### Backend Checks

```bash
# ✓ Health endpoint
curl https://api.goldtoken.com/health

# ✓ Database connection
curl https://api.goldtoken.com/health/db

# ✓ Token endpoint
curl https://api.goldtoken.com/api/tokens/info

# ✓ Auth flows
# Test registration, login, Web3 login

# ✓ Transactions
# Test mint and burn flows

# ✓ Error handling
# Trigger error scenarios
```

### Database Checks

```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/gold-token"

# Check collections
show collections

# Count documents
db.users.countDocuments()
db.transactions.countDocuments()

# Verify indexes
db.users.getIndexes()
```

### Blockchain Checks

```bash
# Check contract on Sepolia
# https://sepolia.etherscan.io/address/0x...

# ✓ Contract shows on Etherscan
# ✓ Admin wallet has testnet ETH
# ✓ Contract functions callable
```

### Security Checks

```bash
# ✓ HTTPS enforced
curl -I https://goldtoken.com  # Should redirect http → https

# ✓ Security headers
curl -I https://api.goldtoken.com
# Check: X-Frame-Options, X-Content-Type-Options, etc.

# ✓ CORS configured
# Test cross-origin requests

# ✓ Rate limiting works
# Rapid requests should be throttled

# ✓ No secrets exposed
grep -r "SECRET\|PASSWORD\|KEY" . --exclude-dir=node_modules
```

---

## 9. MONITORING & MAINTENANCE

### Application Monitoring

```bash
# Uptime monitoring (Uptimerobot.com)
- Create monitors for:
  - https://goldtoken.com
  - https://api.goldtoken.com/health
  - Alert if down > 5 minutes

# Performance monitoring (DataDog / New Relic)
- Track response times
- Monitor error rates
- Track user behavior

# Error tracking (Sentry)
- Automatic error reporting
- Stack traces and context
- Alert on new errors
```

### Database Maintenance

```bash
# Weekly
- Check MongoDB storage usage
- Review slow queries
- Verify backups running

# Monthly
- Analyze query performance
- Optimize indexes if needed
- Archive old transactions
- Test backup restore

# Quarterly
- Full security audit
- Database optimization
- Update statistics
```

### Security Maintenance

```bash
# Weekly
- Check for security advisories
- Review access logs
- Monitor for suspicious activity

# Monthly
- Update dependencies: npm audit fix
- Review security groups/firewall rules
- Rotate non-sensitive credentials

# Quarterly
- Full security audit
- Penetration testing
- Review access controls
```

### Blockchain Maintenance

```bash
# Monitor gas prices
- Check current Sepolia gas prices
- Ensure admin wallet has sufficient ETH

# Monitor transactions
- Check pending transactions
- Verify confirmations
- Check for failed transactions

# Contract health
- Monitor events
- Verify balances
- Check authorization status
```

---

## 10. ROLLBACK PROCEDURES

### If Frontend Deployment Fails

#### Vercel

```bash
# View deployments
# Click on previous successful deployment
# Click "Promote to Production"
```

#### Netlify

```bash
# Site settings → Deploys
# Find previous successful deployment
# Right-click → "Publish deploy"
```

---

### If Backend Deployment Fails

#### Heroku

```bash
# View releases
heroku releases

# Rollback to previous version
heroku rollback v42

# Verify
heroku logs --tail
```

#### EC2/AWS

```bash
# If using git
git revert HEAD
git push origin main

# If using PM2
pm2 delete gold-token-api
pm2 start server.js --name "gold-token-api" --env .env.production.backup
```

---

### If Database is Corrupted

#### MongoDB Atlas

```bash
# Use automated backup
1. Atlas Dashboard → Backup
2. Find backup point before corruption
3. Restore to cluster
4. Verify data

# Manual restore
mongorestore --uri "mongodb+srv://..." backup_directory/
```

---

### Emergency Maintenance Mode

```bash
# Quickly disable all user operations
heroku config:set MAINTENANCE_MODE=true

# Frontend shows: "Under maintenance, please try again later"

# Fix backend issues

# Re-enable
heroku config:set MAINTENANCE_MODE=false
```

---

## DEPLOYMENT CHECKLIST SUMMARY

Before Deployment:
- [ ] All tests passing
- [ ] Code review approved
- [ ] Environment variables configured
- [ ] Database backups scheduled
- [ ] SSL certificates ready
- [ ] Admin credentials created
- [ ] Monitoring setup

During Deployment:
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Database initialized
- [ ] Contract deployed/verified
- [ ] DNS updated

After Deployment:
- [ ] All endpoints tested
- [ ] Authentication tested
- [ ] Transactions tested
- [ ] Performance verified
- [ ] Security checks passed
- [ ] Monitoring active
- [ ] Team notified

---

## USEFUL COMMANDS

```bash
# View logs (Heroku)
heroku logs --tail -a gold-token-api

# SSH into EC2
ssh -i key.pem ubuntu@YOUR_IP

# Check process status (PM2)
pm2 status
pm2 restart all

# View MongoDB
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/database"

# Deploy frontend to Vercel
vercel --prod

# Check SSL certificate expiry
openssl s_client -connect api.goldtoken.com:443 -date

# Monitor Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## GETTING HELP

- **Heroku Issues**: https://status.heroku.com
- **MongoDB Issues**: https://status.mongodb.com
- **Vercel/Netlify Issues**: Check their status pages
- **Etherscan**: https://sepolia.etherscan.io (check network status)

