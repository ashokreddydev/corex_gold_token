// Deployment script for Gold Backed Token
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting GoldToken deployment...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deploying contract from account: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

  // Contract parameters
  const VAULT_MANAGER = deployer.address; // In production, use a different address
  const INITIAL_OWNER = deployer.address;

  console.log("📝 Deployment Parameters:");
  console.log(`   - Token Name: Gold Backed Token`);
  console.log(`   - Symbol: GBT`);
  console.log(`   - Initial Vault Manager: ${VAULT_MANAGER}`);
  console.log(`   - Initial Owner: ${INITIAL_OWNER}`);
  console.log(`   - Decimals: 18\n`);

  // Deploy GoldToken
  console.log("⏳ Deploying GoldToken contract...");
  const GoldToken = await ethers.getContractFactory("GoldToken");
  
  try {
    const goldToken = await GoldToken.deploy(VAULT_MANAGER, INITIAL_OWNER);
    await goldToken.waitForDeployment();
    
    const contractAddress = await goldToken.getAddress();
    console.log(`✅ GoldToken deployed successfully!\n`);
    console.log(`📍 Contract Address: ${contractAddress}`);
    
    // Print network info
    const network = await ethers.provider.getNetwork();
    console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})\n`);

    // Verify deployment
    console.log("🔍 Verifying deployment...");
    const symbol = await goldToken.symbol();
    const name = await goldToken.name();
    const decimals = await goldToken.decimals();
    const totalSupply = await goldToken.totalSupply();
    const currentVaultManager = await goldToken.vaultManager();

    console.log(`   ✓ Name: ${name}`);
    console.log(`   ✓ Symbol: ${symbol}`);
    console.log(`   ✓ Decimals: ${decimals}`);
    console.log(`   ✓ Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
    console.log(`   ✓ Vault Manager: ${currentVaultManager}`);
    console.log(`   ✓ Owner: ${await goldToken.owner()}\n`);

    // Save deployment info
    const deploymentInfo = {
      network: network.name,
      chainId: Number(network.chainId),
      contractAddress: contractAddress,
      deployerAddress: deployer.address,
      vaultManager: VAULT_MANAGER,
      owner: INITIAL_OWNER,
      timestamp: new Date().toISOString(),
      name: name,
      symbol: symbol,
      decimals: Number(decimals),
    };

    console.log("📋 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Save to file
    const fs = require("fs");
    const path = require("path");
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const fileName = `${network.name}-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(deploymentsDir, fileName),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`\n✨ Deployment info saved to: deployments/${fileName}`);

    return contractAddress;
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
