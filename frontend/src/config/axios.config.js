import axios from 'axios';

// Set the default base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8080';

// Add a response interceptor to handle errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axios; 