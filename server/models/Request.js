const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book is required'],
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['pending', 'accepted', 'declined'],
        message: 'Status must be one of: pending, accepted, declined',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index on (book, requester) to prevent duplicate requests
requestSchema.index({ book: 1, requester: 1 }, { unique: true });

// Index on requester for faster queries when fetching user's sent requests
requestSchema.index({ requester: 1 });

// Index on owner for faster queries when fetching received requests
requestSchema.index({ owner: 1 });

// Index on book for faster queries when fetching requests for a specific book
requestSchema.index({ book: 1 });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
