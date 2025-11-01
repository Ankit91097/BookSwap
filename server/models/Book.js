const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['new', 'like-new', 'good', 'fair', 'poor'],
        message: 'Condition must be one of: new, like-new, good, fair, poor',
      },
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index on owner for faster queries when fetching user's books
bookSchema.index({ owner: 1 });

// Index on createdAt (descending) for sorting books by newest first
bookSchema.index({ createdAt: -1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
