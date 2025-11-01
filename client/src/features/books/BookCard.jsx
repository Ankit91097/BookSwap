import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, hasRequested = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/books/${book._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 relative ${
        hasRequested ? 'ring-2 ring-blue-300' : ''
      }`}
    >
      {hasRequested && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Requested
          </span>
        </div>
      )}
      <img
        src={book.imageUrl}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 truncate">by {book.author}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500 uppercase">
            {book.condition}
          </span>
          <span className="text-xs text-gray-500">
            Owner: {book.owner?.name || 'Unknown'}
          </span>
        </div>
        {hasRequested && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-blue-600 font-medium">
              ✓ Request sent - Check "My Requests" for status
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
