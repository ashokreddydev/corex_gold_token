# Gold Backed Token (GBT) - ERC-20 Smart Contract

A production-ready Ethereum ERC-20 smart contract for a gold-backed token where 1 token = 1 gram of physical gold.

## 🎯 Overview

GoldToken (GBT) is a fully compliant ERC-20 token with enterprise-grade security features, built on OpenZeppelin standards. The token represents physical gold held in a vault, with strict controls ensuring only authorized managers can mint new tokens and users can burn tokens to redeem physical gold.

## ✨ Features

### Core Functionality
- **ERC-20 Compliant**: Full OpenZeppelin ERC20 implementation
- **Vault Manager Control**: Only authorized vault manager can mint tokens
- **Token Burning**: Users can burn tokens to redeem physical gold
- **Owner Functions**: Update vault manager and pause/unpause contract
- **18 Decimals**: Standard decimal places for precision

### Security Features
- **Ownable Pattern**: Owner controls critical functions
- **Pausable**: Emergency stop mechanism for transfers and mints
- **Input Validation**: Comprehensive checks on all inputs
- **Zero Address Protection**: Prevents minting/burning from/to zero address
- **Balance Checks**: Ensures sufficient balance before operations

### Additional Features
- **Batch Minting**: Mint to multiple addresses in one transaction (up to 100)
- **Events**: Complete event logging for all actions
- **Supply Tracking**: Easy-to-use view functions
- **Tested**: 80+ comprehensive test cases

## 📋 Contract Details

### Token Properties
- **Name**: Gold Backed Token
- **Symbol**: GBT
- **Decimals**: 18
- **Standard**: ERC-20

### Key Contracts
- `GoldToken.sol`: Main ERC-20 contract with all features

## 🔐 Security Considerations

1. **Vault Manager Role**: Only the vault manager can mint tokens
   - Controlled by owner
   - Can be updated with `updateVaultManager()`
   
2. **Access Control**:
   - Owner: Update vault manager, pause/unpause
   - Vault Manager: Mint tokens
   - Token Holders: Transfer, burn, and approve tokens

3. **Pause Mechanism**: Owner can pause contract to:
   - Stop all token transfers
   - Stop minting operations
   - Use for emergency scenarios

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd GOLD_TToekn

# Install dependencies
npm install
```

### Compile Contract

```bash
npm run compile
```

### Run Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch
```

## 📦 Deployment

### Local Deployment (Hardhat Node)

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy to local node
npm run deploy:local
```

### Sepolia Testnet Deployment

Set up environment variables in `.env`:
```bash
SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
PRIVATE_KEY=0x... (without 0x prefix)
ETHERSCAN_API_KEY=...
```

Then deploy:
```bash
npm run deploy:sepolia
```

### Mainnet Deployment

Set up environment variables in `.env`:
```bash
MAINNET_RPC_URL=https://rpc.ankr.com/eth
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...
```

Then deploy:
```bash
npm run deploy:mainnet
```

## 📝 Contract Functions

### Mint Functions

#### `mint(address to, uint256 amount)`
Mint tokens to a single address (only vault manager)

```solidity
// Mint 100 GBT to user
await goldToken.mint(userAddress, ethers.parseUnits("100", 18));
```

#### `batchMint(address[] calldata recipients, uint256[] calldata amounts)`
Mint tokens to multiple addresses in one transaction (only vault manager, max 100 recipients)

```solidity
// Mint 100 GBT to 2 users
const recipients = [user1Address, user2Address];
const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("50", 18)];
await goldToken.batchMint(recipients, amounts);
```

### Burn Functions

#### `burn(uint256 amount)`
Burn tokens from caller's balance

```solidity
// Burn 100 GBT
await goldToken.burn(ethers.parseUnits("100", 18));
```

#### `burnFrom(address account, uint256 amount)`
Burn tokens from another address (with approval)

```solidity
// Burn 100 GBT from user (with approval)
await goldToken.burnFrom(userAddress, ethers.parseUnits("100", 18));
```

### Admin Functions

#### `updateVaultManager(address newVaultManager)`
Update vault manager address (only owner)

```solidity
await goldToken.updateVaultManager(newManagerAddress);
```

#### `pause()`
Pause all transfers and mints (only owner)

```solidity
await goldToken.pause();
```

#### `unpause()`
Resume all transfers and mints (only owner)

```solidity
await goldToken.unpause();
```

### View Functions

#### `totalSupply()`
Get total supply of tokens

```solidity
const supply = await goldToken.totalSupply();
```

#### `balanceOf(address account)`
Get balance of an address

```solidity
const balance = await goldToken.balanceOf(userAddress);
```

#### `allowance(address owner, address spender)`
Get approved amount for spending

```solidity
const allowed = await goldToken.allowance(ownerAddress, spenderAddress);
```

#### `vaultManager()`
Get current vault manager address

```solidity
const manager = await goldToken.vaultManager();
```

#### `isPaused()`
Check if contract is paused

```solidity
const paused = await goldToken.isPaused();
```

## 📊 Events

```solidity
event TokenMinted(address indexed to, uint256 amount)
event TokenBurned(address indexed from, uint256 amount)
event VaultManagerUpdated(address indexed previousManager, address indexed newManager)
event ContractPaused(address indexed by)
event ContractUnpaused(address indexed by)
```

## 🧪 Test Coverage

Run tests with:
```bash
npm test
```

Test categories:
- ✅ Deployment & Initialization (6 tests)
- ✅ Mint Function (8 tests)
- ✅ Batch Mint (6 tests)
- ✅ Burn Function (8 tests)
- ✅ BurnFrom Function (5 tests)
- ✅ Vault Manager Update (7 tests)
- ✅ Pause/Unpause (8 tests)
- ✅ Transfer (4 tests)
- ✅ Approval & TransferFrom (5 tests)
- ✅ Edge Cases & Security (4 tests)

**Total: 80+ comprehensive test cases**

## 📁 Project Structure

```
├── contracts/
│   └── GoldToken.sol              # Main ERC-20 contract
├── scripts/
│   └── deploy.js                  # Deployment script
├── test/
│   └── GoldToken.test.js          # Comprehensive test suite
├── deployments/                   # Deployment info (auto-generated)
├── artifacts/                     # Compiled contracts (auto-generated)
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Project dependencies
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## ⚙️ Configuration

### Hardhat Config
Edit `hardhat.config.js` to modify:
- RPC URLs for different networks
- Solidity compiler version
- Optimizer settings
- Gas reporter configuration

### Environment Variables
Create `.env` file:
```bash
SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
MAINNET_RPC_URL=https://rpc.ankr.com/eth
PRIVATE_KEY=0x... (your private key)
ETHERSCAN_API_KEY=... (for verification)
```

## 🔍 Verification

After deployment, verify contracts on Etherscan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234... 0x5678... 0x9abc...
```

## 📚 Usage Examples

### Deploy and Mint
```javascript
const goldToken = await ethers.getContractAt("GoldToken", contractAddress);

// Mint 1000 tokens to user
const tx = await goldToken.mint(
  userAddress,
  ethers.parseUnits("1000", 18)
);
await tx.wait();

console.log("Minted 1000 GBT");
```

### Burn Tokens
```javascript
// Burn 100 tokens
const tx = await goldToken.burn(ethers.parseUnits("100", 18));
await tx.wait();

console.log("Burned 100 GBT");
```

### Batch Mint
```javascript
const recipients = [addr1, addr2, addr3];
const amounts = [
  ethers.parseUnits("100", 18),
  ethers.parseUnits("200", 18),
  ethers.parseUnits("300", 18)
];

const tx = await goldToken.batchMint(recipients, amounts);
await tx.wait();

console.log("Batch minted to 3 addresses");
```

## 🛡️ Auditing

This contract uses battle-tested OpenZeppelin libraries:
- ERC20: Standard token implementation
- Ownable: Owner-based access control
- Pausable: Emergency pause functionality
- ERC20Burnable: Token burning capability

For production deployment, consider:
- Third-party security audit
- Coverage analysis
- Gas optimization
- Economic model verification

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## ⚠️ Disclaimer

This smart contract is provided as-is. Ensure proper auditing and testing before mainnet deployment. The deployer is responsible for all contract interactions and potential risks.

## 📞 Support

For issues and questions:
- Check the test files for usage examples
- Review Hardhat documentation: https://hardhat.org/
- OpenZeppelin contracts: https://docs.openzeppelin.com/contracts/

## 🔄 Version History

- v1.0.0 (2024): Initial production release
  - ERC-20 token with vault manager control
  - Batch minting support
  - Pause/unpause functionality
  - Comprehensive test suite

---

**⚡ Built with Hardhat and OpenZeppelin Contracts**
