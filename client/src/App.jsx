import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import BookList from './features/books/BookList';
import BookDetails from './features/books/BookDetails';
import BookForm from './features/books/BookForm';
import MyBooks from './features/books/MyBooks';
import BookRequests from './features/books/BookRequests';
import MyRequests from './features/requests/MyRequests';
import ReceivedRequests from './features/requests/ReceivedRequests';

function App() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only restore auth state on initial app mount if user is not already loaded
    if (!user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/books"
              element={
                <PrivateRoute>
                  <BookList />
                </PrivateRoute>
              }
            />
            <Route
              path="/books/new"
              element={
                <PrivateRoute>
                  <BookForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/books/edit/:id"
              element={
                <PrivateRoute>
                  <BookForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/books/:id"
              element={
                <PrivateRoute>
                  <BookDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-books"
              element={
                <PrivateRoute>
                  <MyBooks />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-books/:id/requests"
              element={
                <PrivateRoute>
                  <BookRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-requests"
              element={
                <PrivateRoute>
                  <MyRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="/received-requests"
              element={
                <PrivateRoute>
                  <ReceivedRequests />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
