import { useState, useEffect } from 'react';
import { tokenService } from '../services/tokenService';

export const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tokenService.getBalance();
      // axios interceptor already returns response.data, so just access balance directly
      setBalance(response.balance || 0);
    } catch (err) {
      console.error('Balance fetch error:', err);
      // Don't show error if wallet is not connected - just show 0
      setBalance(0);
      if (err?.response?.status !== 400) {
        setError(err.message || 'Failed to fetch balance');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { balance, loading, error, refetch: fetchBalance };
};
