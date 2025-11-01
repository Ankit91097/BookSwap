const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMyRequests,
  getReceivedRequests,
  getBookRequests,
  createRequest,
  acceptRequest,
  declineRequest,
} = require('../controllers/requestController');

// All routes are protected (require authentication)

// GET /api/requests/my-requests - Get all requests sent by authenticated user
router.get('/my-requests', protect, getMyRequests);

// GET /api/requests/received - Get all requests received for authenticated user's books
router.get('/received', protect, getReceivedRequests);

// GET /api/requests/book/:bookId - Get all requests for a specific book
router.get('/book/:bookId', protect, getBookRequests);

// POST /api/requests - Create a new book request
router.post('/', protect, createRequest);

// PUT /api/requests/:id/accept - Accept a book request
router.put('/:id/accept', protect, acceptRequest);

// PUT /api/requests/:id/decline - Decline a book request
router.put('/:id/decline', protect, declineRequest);

module.exports = router;
