import { useState } from 'react';
import { tokenService } from '../services/tokenService';

export const useMint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mint = async (amount) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tokenService.mint(amount);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Mint failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { mint, loading, error, success, reset };
};
