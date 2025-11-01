const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadImage');
const {
  getAllBooks,
  getMyBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

// All routes are protected (require authentication)

// GET /api/books - Get all books excluding user's own books
router.get('/', protect, getAllBooks);

// GET /api/books/my-books - Get user's own books
router.get('/my-books', protect, getMyBooks);

// GET /api/books/:id - Get single book by ID
router.get('/:id', protect, getBookById);

// POST /api/books - Create new book (with image upload)
router.post('/', protect, upload.single('image'), createBook);

// PUT /api/books/:id - Update book (with optional image upload)
router.put('/:id', protect, upload.single('image'), updateBook);

// DELETE /api/books/:id - Delete book
router.delete('/:id', protect, deleteBook);

module.exports = router;
