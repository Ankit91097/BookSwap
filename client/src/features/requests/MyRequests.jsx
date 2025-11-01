import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyRequests, reset } from './requestsSlice';
import RequestCard from './RequestCard';
import Spinner from '../../components/Spinner';

const MyRequests = () => {
  const dispatch = useDispatch();
  const { myRequests, isLoading, isError, message } = useSelector(
    (state) => state.requests
  );

  useEffect(() => {
    dispatch(getMyRequests());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Requests</h1>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {!Array.isArray(myRequests) || myRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">
            You haven't made any book requests yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Browse available books and request ones you're interested in!
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {myRequests.map((request) => (
            <RequestCard key={request._id} request={request} showActions={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
