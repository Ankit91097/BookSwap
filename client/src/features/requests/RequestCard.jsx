import { useDispatch } from 'react-redux';
import { acceptRequest, declineRequest } from './requestsSlice';

const RequestCard = ({ request, showActions = false }) => {
  const dispatch = useDispatch();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccept = () => {
    dispatch(acceptRequest(request._id));
  };

  const handleDecline = () => {
    dispatch(declineRequest(request._id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {request.book?.title || 'Book Title'}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            by {request.book?.author || 'Unknown Author'}
          </p>
          {showActions ? (
            <p className="text-sm text-gray-500">
              Requested by: {request.requester?.name || 'Unknown'}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Owner: {request.owner?.name || 'Unknown'}
            </p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadgeClass(
            request.status
          )}`}
        >
          {request.status}
        </span>
      </div>

      {showActions && request.status === 'pending' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
