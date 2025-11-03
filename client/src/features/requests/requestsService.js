import apiClient from '../../app/axios';

// Get my requests (requests sent by user)
const getMyRequests = async () => {
  const response = await apiClient.get('/api/requests/my-requests');
  return response.data.data || response.data;
};

// Get received requests (requests for user's books)
const getReceivedRequests = async () => {
  const response = await apiClient.get('/api/requests/received');
  return response.data.data || response.data;
};

// Get requests for a specific book
const getBookRequests = async (bookId) => {
  const response = await apiClient.get(`/api/requests/book/${bookId}`);
  return response.data.data || response.data;
};

// Create a new book request
const createRequest = async (requestData) => {
  const response = await apiClient.post('/api/requests', requestData);
  return response.data.data || response.data;
};

// Accept a request
const acceptRequest = async (requestId) => {
  const response = await apiClient.put(`/api/requests/${requestId}/accept`);
  return response.data.data || response.data;
};

// Decline a request
const declineRequest = async (requestId) => {
  const response = await apiClient.put(`/api/requests/${requestId}/decline`);
  return response.data.data || response.data;
};

const requestsService = {
  getMyRequests,
  getReceivedRequests,
  getBookRequests,
  createRequest,
  acceptRequest,
  declineRequest,
};

export default requestsService;
