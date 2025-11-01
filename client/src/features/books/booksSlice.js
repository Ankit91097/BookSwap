import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import booksService from './booksService';

const initialState = {
  books: [],
  myBooks: [],
  currentBook: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all books
export const getAllBooks = createAsyncThunk(
  'books/getAllBooks',
  async (_, thunkAPI) => {
    try {
      return await booksService.getAllBooks();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my books
export const getMyBooks = createAsyncThunk(
  'books/getMyBooks',
  async (_, thunkAPI) => {
    try {
      return await booksService.getMyBooks();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get book by ID
export const getBookById = createAsyncThunk(
  'books/getBookById',
  async (bookId, thunkAPI) => {
    try {
      return await booksService.getBookById(bookId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create book
export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData, thunkAPI) => {
    try {
      return await booksService.createBook(bookData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update book
export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, bookData }, thunkAPI) => {
    try {
      return await booksService.updateBook(bookId, bookData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete book
export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (bookId, thunkAPI) => {
    try {
      return await booksService.deleteBook(bookId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all books
      .addCase(getAllBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload;
      })
      .addCase(getAllBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my books
      .addCase(getMyBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myBooks = action.payload;
      })
      .addCase(getMyBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get book by ID
      .addCase(getBookById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentBook = action.payload;
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create book
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (Array.isArray(state.myBooks)) {
          state.myBooks.push(action.payload);
        } else {
          state.myBooks = [action.payload];
        }
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update book
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (Array.isArray(state.myBooks)) {
          state.myBooks = state.myBooks.map((book) =>
            book._id === action.payload._id ? action.payload : book
          );
        } else {
          state.myBooks = [action.payload];
        }
        if (state.currentBook && state.currentBook._id === action.payload._id) {
          state.currentBook = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete book
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (Array.isArray(state.myBooks)) {
          state.myBooks = state.myBooks.filter(
            (book) => book._id !== action.payload._id
          );
        } else {
          state.myBooks = [];
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = booksSlice.actions;
export default booksSlice.reducer;
