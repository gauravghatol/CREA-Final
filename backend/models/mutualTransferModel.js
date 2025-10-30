const mongoose = require('mongoose');

const mutualTransferSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contactName: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    post: { type: String, required: true, trim: true },
    currentLocation: { type: String, required: true, trim: true, index: true },
    desiredLocation: { type: String, required: true, trim: true, index: true },
    availabilityDate: { type: Date },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

mutualTransferSchema.index({ post: 1, isActive: 1 });

const MutualTransfer = mongoose.model('MutualTransfer', mutualTransferSchema);
module.exports = MutualTransfer;
