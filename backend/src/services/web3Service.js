import { ethers } from 'ethers';
import config from '../config/config.js';

let provider;
let signer;

const initializeWeb3 = () => {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(config.web3.sepoliaRpc);
    signer = new ethers.Wallet(config.web3.adminPrivateKey, provider);
  }
};

export const getTokenBalance = async (userAddress) => {
  initializeWeb3();

  try {
    const contract = new ethers.Contract(
      config.web3.tokenAddress,
      config.web3.tokenAbi,
      provider,
    );

    const balance = await contract.balanceOf(userAddress);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Failed to get token balance');
  }
};

export const mintTokens = async (userAddress, amount) => {
  initializeWeb3();

  try {
    const contract = new ethers.Contract(
      config.web3.tokenAddress,
      config.web3.tokenAbi,
      signer,
    );

    const tx = await contract.mint(userAddress, ethers.parseUnits(String(amount), 18));
    const receipt = await tx.wait();

    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw new Error('Failed to mint tokens');
  }
};

export const burnTokens = async (amount) => {
  initializeWeb3();

  try {
    const contract = new ethers.Contract(
      config.web3.tokenAddress,
      config.web3.tokenAbi,
      signer,
    );

    const tx = await contract.burn(ethers.parseUnits(String(amount), 18));
    const receipt = await tx.wait();

    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Error burning tokens:', error);
    throw new Error('Failed to burn tokens');
  }
};

export const getVaultBalance = async () => {
  initializeWeb3();

  try {
    const signerAddress = await signer.getAddress();
    const balance = await provider.getBalance(signerAddress);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting vault balance:', error);
    throw new Error('Failed to get vault balance');
  }
};
