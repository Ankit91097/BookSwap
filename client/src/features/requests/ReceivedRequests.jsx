import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReceivedRequests, acceptRequest, declineRequest, reset } from './requestsSlice';
import Spinner from '../../components/Spinner';

const ReceivedRequests = () => {
  const dispatch = useDispatch();
  const { receivedRequests, isLoading, isError, message } = useSelector(
    (state) => state.requests
  );

  useEffect(() => {
    dispatch(getReceivedRequests());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Received Requests</h1>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {!Array.isArray(receivedRequests) || receivedRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">
            No requests received yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            When someone requests your books, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {receivedRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={request.book?.imageUrl}
                      alt={request.book?.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.book?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {request.book?.author}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium text-gray-800">
                      Requested by: {request.requester?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.requester?.email || 'No email'}
                    </p>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Message:</span> "{request.message}"
                  </p>
                  <p className="text-xs text-gray-500">
                    Requested on {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
              
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
  );
};

export default ReceivedRequests;