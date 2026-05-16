require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.drpc.org";
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "https://drpc.org/public/ethereum";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

console.log("🔐 Environment Variables:");
console.log("   - SEPOLIA_RPC_URL:", SEPOLIA_RPC_URL);
console.log("   - MAINNET_RPC_URL:", MAINNET_RPC_URL);
console.log("   - PRIVATE_KEY:", PRIVATE_KEY ? "********" : "Not set");
console.log("   - ETHERSCAN_API_KEY:", ETHERSCAN_API_KEY ? "********" : "Not set");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
