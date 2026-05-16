import { useState, useEffect } from 'react';
import { tokenService } from '../services/tokenService';

export const useTransactionHistory = (page = 1, limit = 10) => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await tokenService.getTransactionHistory(page, limit);
      setTransactions(response.transactions);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, limit]);

  return { transactions, total, loading, error, refetch: fetchHistory };
};
