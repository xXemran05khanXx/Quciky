import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me')
};

// Files API
export const filesAPI = {
  upload: (formData) => {
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getFileInfo: (shortUrl) => api.get(`/files/${shortUrl}`),
  downloadFile: (shortUrl, pin = null) => {
    return axios({
      url: `${API_URL}/files/download/${shortUrl}`,
      method: 'POST',
      responseType: 'blob',
      data: { pin },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  getFiles: () => api.get('/users/files'),
  getAnalytics: () => api.get('/users/analytics'),
  upgrade: () => api.post('/users/upgrade')
};

export default api;
