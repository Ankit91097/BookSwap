import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyBooks, deleteBook } from './booksSlice';
import Spinner from '../../components/Spinner';

const MyBooks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myBooks, isLoading, isError, message } = useSelector(
    (state) => state.books
  );



  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(getMyBooks());
  }, [dispatch]);

  const handleEdit = (bookId) => {
    navigate(`/books/edit/${bookId}`);
  };

  const handleDeleteClick = (bookId) => {
    setDeleteConfirm(bookId);
  };

  const handleDeleteConfirm = (bookId) => {
    dispatch(deleteBook(bookId));
    setDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleViewRequests = (bookId) => {
    navigate(`/my-books/${bookId}/requests`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Books</h1>
        <button
          type="button"
          onClick={() => navigate('/books/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Book
        </button>
      </div>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {!Array.isArray(myBooks) || myBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            You haven't listed any books yet.
          </p>
          <button
            type="button"
            onClick={() => navigate('/books/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBooks.map((book, index) => (
            <div
              key={book._id || `book-${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="text-xs font-medium text-gray-500 uppercase mb-4">
                  Condition: {book.condition}
                </p>

                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(book._id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(book._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>

                {deleteConfirm === book._id && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-2">
                    <p className="text-sm text-gray-700 mb-2">
                      Are you sure? This will delete all requests for this book.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteConfirm(book._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteCancel}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleViewRequests(book._id)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-sm"
                >
                  View Requests
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
