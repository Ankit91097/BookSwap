const Request = require('../models/Request');
const Book = require('../models/Book');

/**
 * @desc    Get all requests where authenticated user is the requester
 * @route   GET /api/requests/my-requests
 * @access  Private
 */
const getMyRequests = async (req, res) => {
  try {
    // Fetch all requests where authenticated user is the requester
    const requests = await Request.find({ requester: req.user._id })
      .populate('book', 'title author condition imageUrl')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all requests where authenticated user is the owner
 * @route   GET /api/requests/received
 * @access  Private
 */
const getReceivedRequests = async (req, res) => {
  try {
    // Fetch all requests where authenticated user is the owner
    const requests = await Request.find({ owner: req.user._id })
      .populate('book', 'title author condition imageUrl')
      .populate('requester', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch received requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all requests for a specific book
 * @route   GET /api/requests/book/:bookId
 * @access  Private
 */
const getBookRequests = async (req, res) => {
  try {
    // Fetch the book to verify ownership
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Verify authenticated user owns the book
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view requests for this book',
      });
    }

    // Fetch all requests for the specific book
    const requests = await Request.find({ book: req.params.bookId })
      .populate('requester', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
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
      message: 'Failed to fetch book requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new book request
 * @route   POST /api/requests
 * @access  Private
 */
const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Validate book ID is provided
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Book ID is required',
      });
    }

    // Validate book exists
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Verify requester is not the book owner
    if (book.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request your own book',
      });
    }

    // Create request document with "pending" status
    const request = await Request.create({
      book: bookId,
      requester: req.user._id,
      owner: book.owner,
      status: 'pending',
    });

    // Populate book and owner information
    await request.populate('book', 'title author condition imageUrl');
    await request.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    // Handle duplicate request error (compound unique index on book + requester)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested this book',
      });
    }

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
      message: 'Failed to create request',
      error: error.message,
    });
  }
};

/**
 * @desc    Accept a book request
 * @route   PUT /api/requests/:id/accept
 * @access  Private
 */
const acceptRequest = async (req, res) => {
  try {
    // Fetch request by ID
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify authenticated user is the book owner
    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request',
      });
    }

    // Update request status to "accepted"
    request.status = 'accepted';
    await request.save();

    // Populate book and requester information
    await request.populate('book', 'title author condition imageUrl');
    await request.populate('requester', 'name email');

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to accept request',
      error: error.message,
    });
  }
};

/**
 * @desc    Decline a book request
 * @route   PUT /api/requests/:id/decline
 * @access  Private
 */
const declineRequest = async (req, res) => {
  try {
    // Fetch request by ID
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify authenticated user is the book owner
    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to decline this request',
      });
    }

    // Update request status to "declined"
    request.status = 'declined';
    await request.save();

    // Populate book and requester information
    await request.populate('book', 'title author condition imageUrl');
    await request.populate('requester', 'name email');

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to decline request',
      error: error.message,
    });
  }
};

module.exports = {
  getMyRequests,
  getReceivedRequests,
  getBookRequests,
  createRequest,
  acceptRequest,
  declineRequest,
};
