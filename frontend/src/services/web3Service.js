import { ethers } from 'ethers';

const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '11155111');
const SEPOLIA_RPC = import.meta.env.VITE_SEPOLIA_RPC_URL;

export const web3Service = {
  // Get provider
  getProvider: () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return new ethers.JsonRpcProvider(SEPOLIA_RPC);
  },

  // Get signer
  getSigner: async () => {
    const provider = web3Service.getProvider();
    return provider.getSigner();
  },

  // Connect MetaMask
  connectMetaMask: async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check network
      const chainIdHex = await window.ethereum.request({
        method: 'eth_chainId',
      });
      const currentChainId = parseInt(chainIdHex);

      if (currentChainId !== CHAIN_ID) {
        // Switch network
        await web3Service.switchNetwork();
      }

      return accounts[0];
    } catch (error) {
      throw new Error(`Failed to connect MetaMask: ${error.message}`);
    }
  },

  // Switch network
  switchNetwork: async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Network not added
        throw new Error('Please add Sepolia network to MetaMask');
      }
      throw error;
    }
  },

  // Get wallet address
  getWalletAddress: async () => {
    const signer = await web3Service.getSigner();
    return signer.getAddress();
  },

  // Sign message
  signMessage: async (message) => {
    const signer = await web3Service.getSigner();
    return signer.signMessage(message);
  },

  // Get balance
  getBalance: async (address) => {
    const provider = web3Service.getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  },

  // Get contract instance
  getContract: (abi) => {
    const provider = web3Service.getProvider();
    const contractAddress = import.meta.env.VITE_GOLD_TOKEN_ADDRESS;
    return new ethers.Contract(contractAddress, abi, provider);
  },

  // Get contract with signer
  getContractWithSigner: async (abi) => {
    const signer = await web3Service.getSigner();
    const contractAddress = import.meta.env.VITE_GOLD_TOKEN_ADDRESS;
    return new ethers.Contract(contractAddress, abi, signer);
  },
};
