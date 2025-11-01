import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getBookById, reset } from './booksSlice';
import { createRequest, getBookRequests, acceptRequest, declineRequest, getMyRequests } from '../requests/requestsSlice';
import Spinner from '../../components/Spinner';

const BookDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [requestMessage, setRequestMessage] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const { currentBook, isLoading, isError, message } = useSelector(
    (state) => state.books
  );
  const { user } = useSelector((state) => state.auth);
  const { bookRequests, myRequests, isLoading: requestLoading, isSuccess: requestSuccess, isError: requestError, message: requestErrorMessage } = useSelector(
    (state) => state.requests
  );

  useEffect(() => {
    dispatch(getBookById(id));
    dispatch(getMyRequests()); // Load user's requests to check if already requested
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  const isOwner = user && currentBook && user._id === currentBook.owner?._id;
  
  // Check if user has already requested this book
  const hasAlreadyRequested = Array.isArray(myRequests) && myRequests.some(
    request => (request.book?._id || request.book) === id
  );

  // Load book requests if user is the owner
  useEffect(() => {
    if (isOwner && currentBook) {
      dispatch(getBookRequests(id));
    }
  }, [dispatch, id, isOwner, currentBook]);

  const handleRequestBook = () => {
    if (!requestMessage.trim()) {
      alert('Please enter a message for your request');
      return;
    }
    
    setIsRequesting(true);
    dispatch(createRequest({
      bookId: id,
      message: requestMessage
    }));
  };

  // Handle request success
  useEffect(() => {
    if (requestSuccess && isRequesting) {
      setStatusMessage('Request sent successfully!');
      setRequestMessage('');
      setIsRequesting(false);
      // Clear success message after 3 seconds
      setTimeout(() => setStatusMessage(''), 3000);
    }
    if (requestError && isRequesting) {
      // Show user-friendly message for duplicate requests
      if (requestErrorMessage.includes('already requested')) {
        setStatusMessage('You have already sent a request for this book.');
      } else {
        setStatusMessage(`Error: ${requestErrorMessage}`);
      }
      setIsRequesting(false);
      // Clear error message after 5 seconds
      setTimeout(() => setStatusMessage(''), 5000);
    }
  }, [requestSuccess, requestError, requestErrorMessage, isRequesting]);

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

  if (!currentBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <img
              src={currentBook.imageUrl}
              alt={currentBook.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {currentBook.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">
              by {currentBook.author}
            </p>
            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full uppercase">
                {currentBook.condition}
              </span>
            </div>
            <div className="mb-4 sm:mb-6 space-y-2">
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold">Owner:</span>{' '}
                {currentBook.owner?.name || 'Unknown'}
              </p>
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold">Email:</span>{' '}
                {currentBook.owner?.email || 'N/A'}
              </p>
            </div>

            {!isOwner && (
              <div className="mb-4 sm:mb-6">
                {statusMessage && (
                  <div className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                    statusMessage.includes('successfully') 
                      ? 'bg-green-100 border border-green-400 text-green-700'
                      : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                  }`}>
                    {statusMessage}
                  </div>
                )}
                
                {hasAlreadyRequested ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
                    <div className="mb-3">
                      <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
                      You Already Requested This Book
                    </h3>
                    <p className="text-sm sm:text-base text-blue-600 mb-3 sm:mb-4">
                      Your request has been sent to the book owner. Check "My Requests" to see the status.
                    </p>
                    <button
                      onClick={() => window.location.href = '/my-requests'}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded text-sm sm:text-base"
                    >
                      View My Requests
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 sm:mb-4">
                      <label htmlFor="requestMessage" className="block text-sm font-medium text-gray-700 mb-2">
                        Message to book owner:
                      </label>
                      <textarea
                        id="requestMessage"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Why would you like to borrow this book?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        rows="3"
                        required
                      />
                    </div>
                    <button
                      onClick={handleRequestBook}
                      disabled={requestLoading || isRequesting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base"
                    >
                      {requestLoading || isRequesting ? 'Sending Request...' : 'Request This Book'}
                    </button>
                  </>
                )}
              </div>
            )}

            {isOwner && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  Requests for this book ({Array.isArray(bookRequests) ? bookRequests.length : 0})
                </h3>
                {requestLoading ? (
                  <p className="text-gray-600 text-sm sm:text-base">Loading requests...</p>
                ) : !Array.isArray(bookRequests) || bookRequests.length === 0 ? (
                  <p className="text-gray-600 text-sm">No requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {bookRequests.map((request) => (
                      <div key={request._id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm sm:text-base">
                              {request.requester?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {request.requester?.email || 'No email'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full self-start ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3">
                          "{request.message || 'No message was included with this request'}"
                        </p>
                        <p className="text-xs text-gray-500 mb-2 sm:mb-3">
                          Requested on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm rounded flex-1 sm:flex-none"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDeclineRequest(request._id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm rounded flex-1 sm:flex-none"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
