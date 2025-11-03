import axios from "axios";
// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Token is automatically sent via cookies due to withCredentials: true
    // No need to manually add Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Clear any auth-related cookies by making a logout request or redirect
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
