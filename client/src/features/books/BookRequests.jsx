import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, reset } from './booksSlice';
import { getBookRequests, acceptRequest, declineRequest } from '../requests/requestsSlice';
import Spinner from '../../components/Spinner';

const BookRequests = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentBook, isLoading: bookLoading, isError: bookError, message: bookMessage } = useSelector(
    (state) => state.books
  );
  const { bookRequests, isLoading: requestsLoading, isError: requestsError, message: requestsMessage } = useSelector(
    (state) => state.requests
  );


  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getBookById(id));
    dispatch(getBookRequests(id));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);



  const handleAcceptRequest = (requestId) => {
    if (window.confirm('Accept this request?')) {
      dispatch(acceptRequest(requestId));
    }
  };

  const handleDeclineRequest = (requestId) => {
    if (window.confirm('Decline this request?')) {
      dispatch(declineRequest(requestId));
    }
  };

  if (bookLoading || requestsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (bookError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {bookMessage}
        </div>
        <button
          onClick={() => navigate('/my-books')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to My Books
        </button>
      </div>
    );
  }

  if (!currentBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 mb-4">Book not found.</p>
        <button
          onClick={() => navigate('/my-books')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to My Books
        </button>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/my-books')}
          className="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          ← Back to My Books
        </button>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={currentBook.imageUrl}
                alt={currentBook.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {currentBook.title}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                by {currentBook.author}
              </p>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full uppercase">
                  {currentBook.condition}
                </span>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Owner:</span> {currentBook.owner?.name || 'You'}
              </p>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Requests for this book ({Array.isArray(bookRequests) ? bookRequests.length : 0})
          </h2>

          {requestsError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {requestsMessage}
            </div>
          )}

          {requestsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading requests...</p>
            </div>
          ) : !Array.isArray(bookRequests) || bookRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No requests received yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                When someone requests this book, their request will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-4">
              {bookRequests.map((request) => (
                <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {request.requester?.name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.requester?.email || 'No email provided'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-700">
                      <span className="font-medium">Message:</span>
                    </p>
                    <p className="text-gray-600 italic mt-1">
                      "{request.message || 'No message was included with this request'}"
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-3">
                    Requested on {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                  </p>

                  {request.status === 'pending' && (
                    <div className="flex gap-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded"
                      >
                        Decline Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookRequests;