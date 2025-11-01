import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBooks } from './booksSlice';
import { getMyRequests } from '../requests/requestsSlice';
import BookCard from './BookCard';
import Spinner from '../../components/Spinner';

const BookList = () => {
  const dispatch = useDispatch();
  const { books, isLoading, isError, message } = useSelector(
    (state) => state.books
  );
  const { myRequests } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(getMyRequests());
  }, [dispatch]);

  // Create a set of book IDs that the user has already requested
  const requestedBookIds = new Set(
    Array.isArray(myRequests) 
      ? myRequests.map(request => request.book?._id || request.book).filter(Boolean)
      : []
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Available Books
      </h1>
      {!Array.isArray(books) || books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No books available at the moment. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book._id} 
              book={book} 
              hasRequested={requestedBookIds.has(book._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
