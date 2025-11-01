import axios from 'axios';

// Set base URL to backend API
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Enable credentials (withCredentials: true) for cookie handling
axios.defaults.withCredentials = true;

export default axios;
