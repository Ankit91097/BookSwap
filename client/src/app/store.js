import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import booksReducer from '../features/books/booksSlice';
import requestsReducer from '../features/requests/requestsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    requests: requestsReducer,
  },
});
