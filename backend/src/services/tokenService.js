import Transaction from '../models/Transaction.js';
import BurnRequest from '../models/BurnRequest.js';
import { mintTokens, burnTokens } from './web3Service.js';

export const createTransaction = async (userId, type, amount, details) => {
  const transaction = new Transaction({
    userId,
    type,
    amount,
    ...details,
    status: 'pending',
  });

  await transaction.save();
  return transaction;
};

export const updateTransactionStatus = async (txHash, status) => {
  return Transaction.findOneAndUpdate(
    { txHash },
    { status },
    { new: true },
  );
};

export const getUserTransactions = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments({ userId });

  return {
    transactions,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const createBurnRequest = async (userId, amount, reason) => {
  const burnRequest = new BurnRequest({
    userId,
    amount,
    reason,
    status: 'pending',
  });

  await burnRequest.save();
  return burnRequest;
};

export const approveBurnRequest = async (burnRequestId, adminId) => {
  const burnRequest = await BurnRequest.findById(burnRequestId);

  if (!burnRequest) {
    throw new Error('Burn request not found');
  }

  try {
    // Execute burn on blockchain
    const { txHash, blockNumber } = await burnTokens(burnRequest.amount);

    burnRequest.status = 'completed';
    burnRequest.approvedBy = adminId;
    burnRequest.txHash = txHash;
    await burnRequest.save();

    // Update corresponding transaction record
    await Transaction.findOneAndUpdate(
      { userId: burnRequest.userId, type: 'burn', amount: burnRequest.amount, status: 'pending' },
      {
        status: 'confirmed',
        txHash,
        blockNumber,
      },
      { sort: { createdAt: -1 } }, // Get the most recent one
    );

    return burnRequest;
  } catch (error) {
    throw new Error(`Failed to approve burn request: ${error.message}`);
  }
};

export const rejectBurnRequest = async (burnRequestId, reason) => {
  const burnRequest = await BurnRequest.findByIdAndUpdate(
    burnRequestId,
    {
      status: 'rejected',
      rejectionReason: reason,
    },
    { new: true },
  );

  return burnRequest;
};

export const getPendingBurnRequests = async () => {
  return BurnRequest.find()
    .populate('userId', 'email fullName')
    .sort({ createdAt: -1 });
};

export const getUserBurnRequests = async (userId) => {
  return BurnRequest.find({ userId })
    .sort({ createdAt: -1 });
};
