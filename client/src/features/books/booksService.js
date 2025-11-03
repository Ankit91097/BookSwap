import apiClient from '../../app/axios';

// Get all books (excluding user's own books)
const getAllBooks = async () => {
  const response = await apiClient.get('/api/books');
  return response.data.data || response.data; // Handle both formats
};

// Get user's own books
const getMyBooks = async () => {
  const response = await apiClient.get('/api/books/my-books');
  return response.data.data; // Return the actual array, not the wrapper object
};

// Get single book by ID
const getBookById = async (bookId) => {
  const response = await apiClient.get(`/api/books/${bookId}`);
  return response.data.data || response.data; // Handle both formats
};

// Create new book with FormData
const createBook = async (bookData) => {
  const response = await apiClient.post('/api/books', bookData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data || response.data; // Handle both formats
};

// Update book with FormData
const updateBook = async (bookId, bookData) => {
  const response = await apiClient.put(`/api/books/${bookId}`, bookData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data || response.data; // Handle both formats
};

// Delete book
const deleteBook = async (bookId) => {
  const response = await apiClient.delete(`/api/books/${bookId}`);
  return response.data.data || response.data; // Handle both formats
};

const booksService = {
  getAllBooks,
  getMyBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};

export default booksService;
