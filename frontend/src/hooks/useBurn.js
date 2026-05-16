import { useState } from 'react';
import { tokenService } from '../services/tokenService';

export const useBurn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const burn = async (amount, reason) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tokenService.burn(amount, reason);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Burn failed';
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

  return { burn, loading, error, success, reset };
};
