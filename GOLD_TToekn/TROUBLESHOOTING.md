# Troubleshooting Guide

## Common Issues & Solutions

### 1. Compilation Errors

#### Error: "Cannot find module '@openzeppelin/contracts'"
**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
npm run compile
```

#### Error: "Compiler version mismatch"
**Cause**: Solidity version in contract doesn't match config

**Solution**: 
Check `hardhat.config.js` - ensure version is 0.8.20:
```javascript
solidity: {
  version: "0.8.20",
  // ...
}
```

#### Error: "Library file not found"
**Cause**: OpenZeppelin contracts not properly installed

**Solution**:
```bash
npm install @openzeppelin/contracts@5.0.0
npm run compile
```

### 2. Test Failures

#### Error: "Test timed out"
**Cause**: Async operations not completing

**Solution**:
```bash
# Run tests with longer timeout
npm test -- --timeout 30000
```

#### Error: "Cannot find module 'hardhat'"
**Cause**: Node modules not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

#### Error: "Provided address is not a valid Address"
**Cause**: Invalid address format in tests

**Solution**: Ensure addresses are checksummed:
```javascript
const address = ethers.getAddress("0xabc..."); // Validates and checksums
```

#### Error: "Mismatch in number of arguments"
**Cause**: Constructor parameters wrong number

**Solution**: Check deploy.js - needs 2 args (vaultManager, owner):
```javascript
const goldToken = await GoldToken.deploy(VAULT_MANAGER, INITIAL_OWNER);
```

### 3. Deployment Issues

#### Error: "InsufficientBalance"
**Cause**: Account doesn't have enough ETH for gas

**Solution**:
```bash
# Check balance
npx hardhat accounts --network sepolia

# Get more testnet ETH from faucet
# https://www.alchemy.com/faucets/ethereum
```

#### Error: "Network error: Could not connect to RPC"
**Cause**: RPC URL is invalid or down

**Solution**:
1. Check `.env` for correct RPC URL
2. Try alternative RPC provider:
   ```env
   SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
   MAINNET_RPC_URL=https://rpc.ankr.com/eth
   ```

#### Error: "Private key is invalid"
**Cause**: Private key format wrong

**Solution**: 
- Remove "0x" prefix from PRIVATE_KEY in `.env`
- Ensure it's 64 hex characters
- Never start with 0x in .env

#### Error: "Deployment reverted"
**Cause**: Constructor validation failed

**Solution**: Check vault manager and owner addresses:
```bash
# Ensure addresses are valid
0x5FbDB2315678afccb333F8032caEb4A801f3f403  # Valid
0x000...                                      # Invalid (zero address)
```

### 4. Runtime Errors

#### Error: "Only vault manager can call this function"
**Cause**: Calling mint from wrong address

**Solution**: Ensure you're using vault manager signer:
```javascript
// Wrong
await goldToken.connect(user).mint(address, amount);

// Correct
await goldToken.connect(vaultManager).mint(address, amount);
```

#### Error: "Insufficient balance to burn"
**Cause**: Trying to burn more than balance

**Solution**: Check balance first:
```javascript
const balance = await goldToken.balanceOf(userAddress);
console.log(ethers.formatUnits(balance, 18)); // View in readable format

// Only burn what you have
await goldToken.burn(balance); // Burn all
```

#### Error: "Contract is paused"
**Cause**: Owner paused the contract

**Solution**: Owner can unpause:
```javascript
await goldToken.connect(owner).unpause();
```

#### Error: "Transfer to zero address"
**Cause**: Attempting invalid transfer

**Solution**:
```javascript
// Wrong
await goldToken.transfer(ethers.ZeroAddress, amount);

// Correct
await goldToken.transfer(validAddress, amount);
```

### 5. Local Node Issues

#### Error: "Port 8545 already in use"
**Cause**: Another process using the port

**Solution**:
```bash
# Kill process on port 8545
# macOS/Linux:
lsof -ti:8545 | xargs kill -9

# Windows:
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Then restart
npm run node
```

#### Error: "Cannot connect to local node"
**Cause**: Node not running or crashed

**Solution**:
```bash
# Terminal 1
npm run node

# Wait for message: "Started HTTP and WebSocket JSON-RPC server..."

# Terminal 2 (in different terminal)
npm run deploy:local
```

#### Error: "ChainID mismatch"
**Cause**: Wrong network in hardhat.config

**Solution**: Verify localhost config in `hardhat.config.js`:
```javascript
localhost: {
  url: "http://127.0.0.1:8545",
  chainId: 31337,
},
```

### 6. Gas & Transaction Issues

#### Error: "Out of gas"
**Cause**: Gas limit too low

**Solution**: Increase gas limit:
```javascript
const tx = await goldToken.mint(address, amount, {
  gasLimit: 1000000,
});
```

#### Error: "Nonce too low" or "Nonce too high"
**Cause**: Transaction ordering issue

**Solution**: Reset account nonce:
```bash
# Restart local node
npm run node

# Or for testnet, wait for pending tx to confirm
```

#### Error: "Transaction reverted for unknown reason"
**Cause**: Contract logic failed

**Solution**: Enable detailed error reporting:
```javascript
try {
  const tx = await goldToken.mint(address, amount);
  await tx.wait();
} catch (error) {
  console.error("Full error:", error);
  console.error("Data:", error.data);
}
```

### 7. Verification Issues

#### Error: "Contract source code does not match bytecode"
**Cause**: Code was modified after deployment

**Solution**: 
1. Use exact deployed code
2. Don't modify contract between deployment and verification
3. Verify immediately after deployment

#### Error: "Unable to locate Contract code at address"
**Cause**: Contract address is invalid or contract not deployed

**Solution**:
1. Verify contract address is correct
2. Wait 1-2 minutes for Etherscan to index
3. Check correct network on Etherscan

#### Error: "Contract constructor arguments do not match"
**Cause**: Wrong constructor arguments in verification

**Solution**: Get exact arguments from deployment:
```bash
# From deploy.js output:
# Vault Manager: 0x...
# Owner: 0x...

# Use exact addresses:
npx hardhat verify --network sepolia 0xContractAddress 0xVaultManagerAddress 0xOwnerAddress
```

### 8. Etherscan Verification Issues

#### "Waiting for verification..."
**Cause**: Normal - verification can take several minutes

**Solution**: Wait 5-10 minutes, then refresh Etherscan

#### Error: "Unable to generate contract bytecode and ABI"
**Cause**: Solidity version mismatch

**Solution**:
1. Go to Etherscan
2. Manually select Solidity compiler version: 0.8.20
3. Upload source code directly

### 9. Account & Key Issues

#### Error: "No account with index 0"
**Cause**: No accounts configured in hardhat.config

**Solution**: Check `hardhat.config.js`:
```javascript
networks: {
  sepolia: {
    url: SEPOLIA_RPC_URL,
    accounts: [PRIVATE_KEY], // Must have this
  }
}
```

#### Error: "Invalid private key"
**Cause**: Private key format wrong

**Solution**: 
- Private key should be 64 hex characters
- Without "0x" prefix in .env file
- Not exposed in git

```
# Wrong
PRIVATE_KEY=0x1234567890abcdef...

# Correct
PRIVATE_KEY=1234567890abcdef...
```

### 10. Environment & Path Issues

#### Error: "Cannot find command 'npx'"
**Cause**: npm not in PATH

**Solution**: 
```bash
# Install Node.js (includes npm)
# https://nodejs.org/

# Or add npm to PATH (macOS/Linux):
export PATH=$PATH:/usr/local/bin
```

#### Error: "Cannot find file .env"
**Cause**: File not created

**Solution**:
```bash
cp .env.example .env
# Then edit .env with your values
```

## Debugging Tips

### Enable Verbose Logging
```bash
# Run tests with logging
npm test 2>&1 | tee test-output.log

# Deploy with logging
npm run deploy:sepolia 2>&1 | tee deploy-output.log
```

### Debug Transactions
```javascript
const tx = await goldToken.mint(address, amount);
console.log("Transaction hash:", tx.hash);
console.log("From:", tx.from);
console.log("To:", tx.to);
console.log("Gas used:", tx.gasLimit);

const receipt = await tx.wait();
console.log("Status:", receipt.status); // 1 = success, 0 = failed
console.log("Gas used:", receipt.gasUsed);
```

### Check Contract State
```bash
npx hardhat console --network localhost
> const gold = await ethers.getContractAt("GoldToken", "0x...");
> await gold.totalSupply()
> await gold.vaultManager()
> await gold.owner()
> await gold.isPaused()
> .exit
```

### Inspect Events
```bash
# On Etherscan, go to contract page → Events tab
# Or programmatically:
const filter = goldToken.filters.TokenMinted();
const events = await goldToken.queryFilter(filter);
console.log(events);
```

## Getting More Help

### Documentation
- [Hardhat Docs](https://hardhat.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Docs](https://docs.ethers.org/)

### Forums & Support
- [Hardhat Discord](https://discord.gg/hardhat)
- [OpenZeppelin Forum](https://forum.openzeppelin.com/)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)

### Local Testing
Always test thoroughly on localhost before testnet, and on testnet before mainnet!

## Quick Reference

| Issue | Check |
|-------|-------|
| Tests fail | `npm run compile` first |
| Deploy fails | Check `.env` and RPC URL |
| Gas errors | Increase `gasLimit` |
| Port taken | Kill process on 8545 |
| Paused contract | Owner needs to `unpause()` |
| Wrong caller | Use correct signer address |
| Zero address error | Validate address format |

---

**Still stuck? Review the test file (test/GoldToken.test.js) for working examples of every function!**
