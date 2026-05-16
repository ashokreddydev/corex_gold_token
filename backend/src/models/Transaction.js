import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['mint', 'burn', 'transfer', 'receive'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    from: String,
    to: String,
    txHash: String,
    blockNumber: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
    reason: String,
    description: String,
  },
  { timestamps: true },
);

// Create indexes
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ txHash: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.model('Transaction', transactionSchema);
