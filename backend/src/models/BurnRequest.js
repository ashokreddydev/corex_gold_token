import mongoose from 'mongoose';

const burnRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    txHash: String,
    rejectionReason: String,
  },
  { timestamps: true },
);

burnRequestSchema.index({ userId: 1, status: 1 });
burnRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('BurnRequest', burnRequestSchema);
