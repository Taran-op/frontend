import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  getAllUsers: () => api.get('/admin/users'),
};

// Admin API
export const adminAPI = {
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

// API Management
export const apisAPI = {
  getAll: () => api.get('/apis'),
  getOne: (id) => api.get(`/apis/${id}`),
  create: (data) => api.post('/apis', data),
  update: (id, data) => api.put(`/apis/${id}`, data),
  delete: (id) => api.delete(`/apis/${id}`),
  createKey: (apiId, data) => api.post(`/apis/${apiId}/keys`, data),
  revokeKey: (apiId, keyId) => api.put(`/apis/${apiId}/keys/${keyId}/revoke`),
  rotateKey: (apiId, keyId) => api.post(`/apis/${apiId}/keys/${keyId}/rotate`),
};

// Usage & Billing
export const usageAPI = {
  getLogs: (apiId, params) => api.get(`/usage/${apiId}/logs`, { params }),
  getStats: (apiId, params) => api.get(`/usage/${apiId}/stats`, { params }),
  getBilling: (apiId, params) => api.get(`/usage/${apiId}/billing`, { params }),
};

export default api;