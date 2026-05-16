# Gold Backed Token (GBT) - Quick Start Guide

## 🚀 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Compile contract
npm run compile

# 3. Run tests
npm test

# 4. Start local node and deploy
npm run node          # Terminal 1
npm run deploy:local  # Terminal 2
```

## 📖 What You Just Set Up

✅ Production-ready ERC-20 smart contract  
✅ 80+ comprehensive test cases  
✅ Local Hardhat node for development  
✅ Deployment scripts for Sepolia & Mainnet  
✅ Full event logging and security checks  

## 🎯 Key Features at a Glance

| Feature | Details |
|---------|---------|
| **Minting** | Only vault manager can mint tokens |
| **Burning** | Users can burn to redeem physical gold |
| **Safety** | Pausable emergency stop mechanism |
| **Admin** | Owner controls vault manager & pause |
| **Events** | Complete audit trail of all actions |

## 💻 Common Commands

```bash
# Development
npm run compile        # Compile smart contracts
npm run node          # Start local Hardhat node
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode

# Deployment
npm run deploy:local      # Deploy to local node
npm run deploy:sepolia    # Deploy to Sepolia testnet
npm run deploy:mainnet    # Deploy to Ethereum mainnet

# Verification
npx hardhat verify --network sepolia <ADDRESS> <ARGS>
```

## 🧪 Testing

```bash
# Run all tests (80+ cases)
npm test

# Expected output:
# GoldToken Contract
#   Deployment
#     ✓ Should have correct name
#     ✓ Should have correct symbol
#     ✓ Should have correct decimals
#     ... (77 more tests)
```

## 🔧 Configuration

### Deploy to Testnet

1. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

2. Add your configuration:
```env
SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key
```

3. Deploy:
```bash
npm run deploy:sepolia
```

## 📝 Contract Interactions

### Via Hardhat Console

```bash
npx hardhat console --network localhost

# Then in console:
const GoldToken = await ethers.getContractFactory("GoldToken");
const goldToken = GoldToken.attach("0x...");

// Mint tokens
await goldToken.mint(userAddress, ethers.parseUnits("100", 18));

// Check balance
const balance = await goldToken.balanceOf(userAddress);
console.log(ethers.formatUnits(balance, 18));

// Burn tokens
await goldToken.burn(ethers.parseUnits("50", 18));
```

### Via JavaScript/Web3.js

```javascript
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);

// Mint
const tx = await contract.mint(
  userAddress,
  ethers.parseUnits("100", 18)
);
await tx.wait();

// Check balance
const balance = await contract.balanceOf(userAddress);

// Transfer
const tx = await contract.transfer(
  recipientAddress,
  ethers.parseUnits("50", 18)
);
await tx.wait();
```

## 📊 Contract State

After deployment, you have:

```
Owner: 0x... (controls pause/unpause & vault manager)
Vault Manager: 0x... (can mint tokens)
Initial Supply: 0 tokens
Status: Not paused
```

## 🔐 Security Checklist

Before mainnet deployment:

- [ ] Private key stored securely (never in .env!)
- [ ] Contract audited by 3rd party
- [ ] Test minting with vault manager
- [ ] Test burning functionality
- [ ] Test pause/unpause
- [ ] Verify events emit correctly
- [ ] Check gas optimization
- [ ] Review access control

## 📚 Smart Contract Functions

**Mint** (Vault Manager only)
```solidity
mint(address to, uint256 amount)
batchMint(address[] recipients, uint256[] amounts)
```

**Burn** (Anyone with balance)
```solidity
burn(uint256 amount)
burnFrom(address account, uint256 amount)
```

**Admin** (Owner only)
```solidity
updateVaultManager(address newManager)
pause()
unpause()
```

**View** (Anyone)
```solidity
balanceOf(address account) → uint256
totalSupply() → uint256
allowance(address owner, address spender) → uint256
vaultManager() → address
isPaused() → bool
```

## 🐛 Debugging

### Tests fail?
```bash
# Clear cache and rebuild
rm -rf artifacts cache
npm run compile
npm test
```

### Deployment issues?
```bash
# Check network connection
npx hardhat verify --network sepolia <ADDRESS>

# Check gas
npx hardhat run scripts/deploy.js --network localhost
```

### Local node won't connect?
```bash
# Kill existing process
lsof -ti:8545 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8545   # Windows

# Restart
npm run node
```

## 📞 Need Help?

1. **Read test files**: `test/GoldToken.test.js` - Shows all usage patterns
2. **Check docs**: README.md for detailed API reference
3. **Hardhat docs**: https://hardhat.org/
4. **OpenZeppelin**: https://docs.openzeppelin.com/contracts/

## 🎓 Learning Resources

This project demonstrates:
- ✅ ERC-20 token standard
- ✅ Access control patterns
- ✅ Pausable functionality
- ✅ Event logging
- ✅ Test-driven development
- ✅ Security best practices
- ✅ Hardhat workflow

## 🚀 Next Steps

1. **Understand the contract**: Read `contracts/GoldToken.sol`
2. **Review tests**: See `test/GoldToken.test.js`
3. **Deploy locally**: Run `npm run deploy:local`
4. **Interact with contract**: Use Hardhat console
5. **Deploy to testnet**: Add .env and run `npm run deploy:sepolia`
6. **Audit & deploy mainnet**: After thorough testing

---

**Happy building! 🎉**
