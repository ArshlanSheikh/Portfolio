import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send and receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token from localStorage fallback if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors cleanly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data || {
      success: false,
      message: error.message || 'Network error occurred',
      data: null,
      error: error.message,
    };

    // If 401 unauthenticated, clear local token
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_admin_token');
    }

    return Promise.reject(errorResponse);
  }
);

export default apiClient;
