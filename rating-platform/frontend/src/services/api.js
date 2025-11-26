import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');
export const updatePassword = (data) => api.put('/auth/password', data);


export const getDashboardStats = () => api.get('/users/dashboard/stats');
export const createUser = (data) => api.post('/users', data);
export const getAllUsers = (params) => api.get('/users', { params });
export const getUserDetails = (id) => api.get(`/users/${id}`);


export const createStore = (data) => api.post('/stores', data);
export const getAllStores = (params) => api.get('/stores', { params });
export const getStoreDashboard = () => api.get('/stores/dashboard');


export const submitRating = (data) => api.post('/ratings', data);
export const getUserRating = (storeId) => api.get(`/ratings/store/${storeId}`);

export default api;