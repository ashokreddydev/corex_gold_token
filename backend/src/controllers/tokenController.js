import * as tokenService from '../services/tokenService.js';
import * as web3Service from '../services/web3Service.js';
import User from '../models/User.js';

export const getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // If wallet not connected, return 0 balance instead of error
    if (!user.walletAddress) {
      return res.json({ balance: 0 });
    }

    const balance = await web3Service.getTokenBalance(user.walletAddress);
    res.json({ balance });
  } catch (error) {
    next(error);
  }
};

export const getTokenInfo = async (req, res, next) => {
  try {
    // For now, return mock data
    res.json({
      name: 'Gold Token',
      symbol: 'GOLD',
      decimals: 18,
      totalSupply: '1000000',
    });
  } catch (error) {
    next(error);
  }
};

export const mint = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user.walletAddress) {
      return res.status(400).json({ 
        error: 'Wallet not connected. Please login with MetaMask first to mint tokens.' 
      });
    }

    // Create transaction record
    const transaction = await tokenService.createTransaction(
      req.user.userId,
      'mint',
      amount,
      { from: 'admin', to: user.walletAddress },
    );

    // Mint tokens
    const { txHash, blockNumber } = await web3Service.mintTokens(
      user.walletAddress,
      amount,
    );

    transaction.txHash = txHash;
    transaction.blockNumber = blockNumber;
    transaction.status = 'confirmed';
    await transaction.save();

    res.json({
      message: 'Tokens minted successfully',
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const burn = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;

    // Create transaction record for burn (pending approval)
    const transaction = await tokenService.createTransaction(
      req.user.userId,
      'burn',
      amount,
      { reason },
    );

    // Create burn request
    const burnRequest = await tokenService.createBurnRequest(
      req.user.userId,
      amount,
      reason,
    );

    res.status(201).json({
      message: 'Burn request created',
      burnRequest,
      transactionId: transaction._id,
    });
  } catch (error) {
    next(error);
  }
};

export const getVaultBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user.walletAddress) {
      return res.status(400).json({ 
        error: 'Wallet not connected. Please login with MetaMask first.' 
      });
    }

    const balance = await web3Service.getVaultBalance();
    res.json({ balance });
  } catch (error) {
    next(error);
  }
};

export const getTransactionHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const history = await tokenService.getUserTransactions(
      req.user.userId,
      parseInt(page),
      parseInt(limit),
    );

    res.json(history);
  } catch (error) {
    next(error);
  }
};

export const getUserBurnRequests = async (req, res, next) => {
  try {
    const burnRequests = await tokenService.getUserBurnRequests(req.user.userId);
    res.json(burnRequests);
  } catch (error) {
    next(error);
  }
};

export const getBurnRequests = async (req, res, next) => {
  try {
    const burnRequests = await tokenService.getPendingBurnRequests();
    res.json(burnRequests);
  } catch (error) {
    next(error);
  }
};
