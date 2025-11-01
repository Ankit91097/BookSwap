const Book = require('../models/Book');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/uploadImage');

/**
 * @desc    Get all books excluding those owned by authenticated user
 * @route   GET /api/books
 * @access  Private
 */
const getAllBooks = async (req, res) => {
  try {
    // Fetch all books excluding those owned by the authenticated user
    const books = await Book.find({ owner: { $ne: req.user._id } })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all books owned by authenticated user
 * @route   GET /api/books/my-books
 * @access  Private
 */
const getMyBooks = async (req, res) => {
  try {
    // Fetch all books owned by the authenticated user
    const books = await Book.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your books',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 * @access  Private
 */
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: error.message,
    });
  }
};

/**
 * @desc    Create new book
 * @route   POST /api/books
 * @access  Private
 */
const createBook = async (req, res) => {
  try {
    const { title, author, condition } = req.body;

    // Validate required fields
    if (!title || !author || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, and condition',
      });
    }

    // Check if image file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a book image',
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    // Create book document
    const book = await Book.create({
      title,
      author,
      condition,
      imageUrl: uploadResult.url,
      imagePublicId: uploadResult.publicId,
      owner: req.user._id,
    });

    // Populate owner information
    await book.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message,
    });
  }
};

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Private
 */
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Verify authenticated user is the book owner
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book',
      });
    }

    const { title, author, condition } = req.body;

    // Update fields if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (condition) book.condition = condition;

    // If new image is provided, delete old image and upload new one
    if (req.file) {
      // Delete old image from Cloudinary
      await deleteFromCloudinary(book.imagePublicId);

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      book.imageUrl = uploadResult.url;
      book.imagePublicId = uploadResult.publicId;
    }

    // Save updated book
    await book.save();

    // Populate owner information
    await book.populate('owner', 'name email');

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Private
 */
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Verify authenticated user is the book owner
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book',
      });
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(book.imagePublicId);

    // Delete all associated requests
    const Request = require('../models/Request');
    await Request.deleteMany({ book: book._id });

    // Delete book document
    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {},
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message,
    });
  }
};

module.exports = {
  getAllBooks,
  getMyBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
