import axios from 'axios';

const api = axios.create({
  baseURL: 'https://project-team-finder-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle responses or errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
