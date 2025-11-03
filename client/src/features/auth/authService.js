import apiClient from '../../app/axios';

// Signup user
const signup = async (userData) => {
  const response = await apiClient.post('/api/auth/signup', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await apiClient.post('/api/auth/login', userData);
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await apiClient.post('/api/auth/logout');
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;
