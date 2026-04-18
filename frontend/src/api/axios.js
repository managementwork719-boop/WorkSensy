import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});

// Request interceptor is still useful for other custom headers, 
// but JWT is now handled automatically by the browser via cookies.
API.interceptors.request.use((config) => {
  return config;
});

export default API;
