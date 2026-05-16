import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { web3Service } from '../services/web3Service';
import { userService } from '../services/userService';
import { setUser } from '../store/slices/authSlice';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Check if wallet is connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });

          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const address = await web3Service.connectMetaMask();
      setAccount(address);
      setIsConnected(true);
      message.success('MetaMask connected successfully!');

      // Update wallet address on backend and Redux
      try {
        const response = await userService.updateWalletAddress(address);
        // Update Redux state with updated user info including wallet address
        dispatch(setUser(response.user));
        message.success('Wallet address linked to your account!');
      } catch (backendErr) {
        const errorMsg = backendErr.response?.data?.message || backendErr.message || 'Failed to link wallet';
        console.error('Error updating wallet on backend:', backendErr);
        message.error(errorMsg);
        setError(errorMsg);
        // Disconnect wallet if backend linking fails
        setAccount(null);
        setIsConnected(false);
        throw new Error(errorMsg);
      }

      return address;
    } catch (err) {
      const errorMsg = err.message || 'Failed to connect wallet';
      setError(errorMsg);
      if (!err.message?.includes('linked')) {
        message.error(errorMsg);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setError(null);
  };

  return {
    account,
    isConnected,
    error,
    isLoading,
    connect,
    disconnect,
  };
};
