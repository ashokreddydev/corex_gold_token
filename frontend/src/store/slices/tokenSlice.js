import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  totalSupply: 0,
  decimals: 18,
  loading: false,
  error: null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
      state.error = null;
    },
    setTokenInfo: (state, action) => {
      state.totalSupply = action.payload.totalSupply;
      state.decimals = action.payload.decimals;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setBalance, setTokenInfo, setLoading, setError } =
  tokenSlice.actions;
export default tokenSlice.reducer;
