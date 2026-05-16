# Deployment Checklist & Guide

## Pre-Deployment Validation

### Local Testing ✓
- [ ] Run `npm install` successfully
- [ ] Run `npm run compile` with no errors
- [ ] Run `npm test` - all 80+ tests pass
- [ ] All tests complete within 30 seconds
- [ ] No compiler warnings in solidity code

### Code Review ✓
- [ ] Review `contracts/GoldToken.sol`
- [ ] Verify all access controls are correct
- [ ] Check event logging is comprehensive
- [ ] Verify input validation on all functions
- [ ] Confirm no hardcoded addresses

### Configuration ✓
- [ ] `hardhat.config.js` properly configured
- [ ] `.env` file created from `.env.example`
- [ ] All required environment variables set:
  - [ ] `SEPOLIA_RPC_URL` (for testnet)
  - [ ] `MAINNET_RPC_URL` (for mainnet)
  - [ ] `PRIVATE_KEY` (without 0x prefix)
  - [ ] `ETHERSCAN_API_KEY` (for verification)

### Security Review ✓
- [ ] Private key is never committed to git
- [ ] `.gitignore` includes `.env`
- [ ] No sensitive data in version control
- [ ] Verify only vault manager can mint
- [ ] Verify owner controls pause/unpause
- [ ] Verify burn reduces supply correctly

## Step 1: Deploy to Local Node

### Initial Setup
```bash
# Terminal 1: Start Hardhat node
npm run node
# Output: Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Deploy Locally
```bash
# Terminal 2: Run deployment script
npm run deploy:local

# Expected output:
# 🚀 Starting GoldToken deployment...
# 📍 Deploying contract from account: 0x...
# 💰 Account balance: 10000.0 ETH
# ⏳ Deploying GoldToken contract...
# ✅ GoldToken deployed successfully!
# 📍 Contract Address: 0x...
```

### Verify Local Deployment ✓
- [ ] Contract deployed successfully
- [ ] Contract address displayed
- [ ] All token properties correct (name, symbol, decimals)
- [ ] Total supply starts at 0
- [ ] Vault manager is correct
- [ ] Owner is correct
- [ ] Deployment info saved to `deployments/` folder

### Test Local Interaction
```bash
npx hardhat console --network localhost

# In console:
const GoldToken = await ethers.getContractFactory("GoldToken");
const goldToken = GoldToken.attach("0x..."); // Use address from deployment

// Get contract state
await goldToken.totalSupply(); // Should be 0
await goldToken.name(); // Should be "Gold Backed Token"
await goldToken.vaultManager(); // Should match vault manager

.exit
```

## Step 2: Deploy to Sepolia Testnet

### Prerequisites ✓
- [ ] Have Sepolia ETH (get from faucet)
- [ ] `SEPOLIA_RPC_URL` configured
- [ ] `PRIVATE_KEY` configured
- [ ] Private key has testnet ETH

### Get Testnet ETH
```
Options:
1. Alchemy Faucet: https://www.alchemy.com/faucets/ethereum
2. QuickNode Faucet: https://faucet.quicknode.com/ethereum/sepolia
3. Sepolia Faucet: https://sepoliafaucet.com/
```

### Deploy to Sepolia
```bash
npm run deploy:sepolia

# Expected output:
# 🚀 Starting GoldToken deployment...
# 📍 Deploying contract from account: 0x...
# 💰 Account balance: 0.5 ETH
# ⏳ Deploying GoldToken contract...
# ✅ GoldToken deployed successfully!
# 📍 Contract Address: 0x...
# 🌐 Network: sepolia (Chain ID: 11155111)
```

### Save Deployment Info ✓
- [ ] Copy contract address from output
- [ ] Save to `SEPOLIA_CONTRACT_ADDRESS` in notes
- [ ] Record deployment timestamp
- [ ] Note vault manager address
- [ ] Note owner address
- [ ] Deployment JSON saved in `deployments/` folder

### Verify on Etherscan

```bash
# Wait 1-2 minutes for block confirmation

npx hardhat verify --network sepolia 0x... <VAULT_MANAGER_ADDRESS> <OWNER_ADDRESS>

# Example:
npx hardhat verify --network sepolia 0xabcd1234... 0x5678efgh... 0x1234ijkl...

# Expected output:
# ✓ Contract verified
# URL: https://sepolia.etherscan.io/address/0x...
```

### Test on Sepolia (via Etherscan)
1. Go to Etherscan (https://sepolia.etherscan.io/)
2. Search for your contract address
3. Click "Contract" tab
4. Click "Read Contract" to verify state
5. Call `name()`, `symbol()`, `decimals()` to verify

## Step 3: Deploy to Mainnet (Production)

### Final Pre-Deployment Checklist ✓
- [ ] Thoroughly tested on localhost
- [ ] Thoroughly tested on Sepolia testnet
- [ ] Contract verified on Sepolia Etherscan
- [ ] Security audit completed (recommended)
- [ ] All environment variables correct
- [ ] Private key has sufficient mainnet ETH
- [ ] Have backup of deployment addresses
- [ ] Have tested all functions on testnet
- [ ] Understand gas costs
- [ ] Have created deployment record

### Mainnet Configuration ✓
- [ ] `MAINNET_RPC_URL` set correctly
- [ ] `PRIVATE_KEY` set for mainnet account
- [ ] `ETHERSCAN_API_KEY` valid
- [ ] Account has adequate ETH for gas

### Deploy to Mainnet
```bash
# CAREFUL: This is production!
npm run deploy:mainnet

# Expected output:
# 🚀 Starting GoldToken deployment...
# 📍 Deploying contract from account: 0x...
# 💰 Account balance: X ETH
# ⏳ Deploying GoldToken contract...
# ✅ GoldToken deployed successfully!
# 📍 Contract Address: 0x...
# 🌐 Network: mainnet (Chain ID: 1)
```

### Record Mainnet Deployment
- [ ] Save contract address
- [ ] Create deployment record file
- [ ] Record exact deployment time
- [ ] Note gas used and gas price
- [ ] Document vault manager address
- [ ] Document owner address
- [ ] Back up deployment JSON

### Verify on Mainnet
```bash
# Wait for Etherscan to index (5-10 minutes)

npx hardhat verify --network mainnet 0x... <VAULT_MANAGER> <OWNER>

# Check on Etherscan:
# https://etherscan.io/address/0x...
```

## Post-Deployment Operations

### Functional Verification
```javascript
// In Hardhat console or script
const goldToken = await ethers.getContractAt("GoldToken", contractAddress);

// Verify state
console.log("Name:", await goldToken.name());
console.log("Symbol:", await goldToken.symbol());
console.log("Decimals:", await goldToken.decimals());
console.log("Total Supply:", await goldToken.totalSupply());
console.log("Vault Manager:", await goldToken.vaultManager());
console.log("Owner:", await goldToken.owner());
console.log("Is Paused:", await goldToken.isPaused());
```

### First Transaction (Optional)
```javascript
// Vault manager mints 1000 tokens to test
const vaultManager = new ethers.Wallet(PRIVATE_KEY, provider);
const tx = await goldToken.connect(vaultManager).mint(
  recipientAddress,
  ethers.parseUnits("1000", 18)
);
await tx.wait();
console.log("Transaction:", tx.hash);
```

### Monitor Contract
- [ ] Watch Etherscan for transactions
- [ ] Monitor event logs
- [ ] Set up alerts for pauses
- [ ] Track total supply changes

## Documentation & Handoff

### Create Deployment Record
```json
{
  "network": "ethereum",
  "contractAddress": "0x...",
  "deploymentDate": "2024-01-01T12:00:00Z",
  "deployer": "0x...",
  "owner": "0x...",
  "vaultManager": "0x...",
  "txHash": "0x...",
  "etherscanUrl": "https://etherscan.io/address/0x...",
  "verifiedAt": "https://etherscan.io/address/0x...#code"
}
```

### Update Team Documentation
- [ ] Document contract address
- [ ] Document vault manager role
- [ ] Document owner responsibilities
- [ ] Document emergency pause procedures
- [ ] Share Etherscan link
- [ ] Provide usage instructions to team

## Emergency Procedures

### If Something Goes Wrong

**Contract Paused by Mistake**
```javascript
// Owner can unpause
const tx = await goldToken.connect(owner).unpause();
await tx.wait();
```

**Wrong Vault Manager Set**
```javascript
// Owner can update
const tx = await goldToken.connect(owner).updateVaultManager(correctAddress);
await tx.wait();
```

**Need to Review Events**
```
1. Go to Etherscan contract page
2. Click "Events" tab
3. Review all TokenMinted, TokenBurned, VaultManagerUpdated events
```

## Success Checklist

- [ ] Contract deployed successfully
- [ ] Verified on Etherscan
- [ ] All functions tested
- [ ] Documentation created
- [ ] Team briefed
- [ ] Monitoring set up
- [ ] Emergency procedures documented
- [ ] Backup records created

## Useful Resources

**Mainnet**:
- Etherscan: https://etherscan.io
- Dashboard: https://explorer.ethereum.org/

**Sepolia Testnet**:
- Etherscan: https://sepolia.etherscan.io
- Alchemy: https://www.alchemy.com/

**Faucets**:
- Alchemy Faucet: https://www.alchemy.com/faucets/ethereum
- QuickNode: https://faucet.quicknode.com/

**Tools**:
- Hardhat: https://hardhat.org/
- OpenZeppelin: https://docs.openzeppelin.com/contracts/

---

**Good luck with your deployment! 🚀**
