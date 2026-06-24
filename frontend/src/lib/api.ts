import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('foodbridge_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('foodbridge_token');
      localStorage.removeItem('foodbridge_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data: any) => API.post('/auth/register', data),
  login: (data: any) => API.post('/auth/login', data),
  verifyOtp: (data: any) => API.post('/auth/verify-otp', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data: any) => API.put('/auth/update-profile', data),
};

// Donations
export const donationAPI = {
  create: (data: FormData) => API.post('/donations', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: any) => API.get('/donations', { params }),
  getById: (id: string) => API.get(`/donations/${id}`),
  updateStatus: (id: string, data: any) => API.put(`/donations/${id}/status`, data),
  delete: (id: string) => API.delete(`/donations/${id}`),
};

// NGO
export const ngoAPI = {
  getDashboard: () => API.get('/ngos/dashboard'),
  getNearbyDonations: (params?: any) => API.get('/ngos/nearby-donations', { params }),
  assignVolunteer: (data: any) => API.post('/ngos/assign-volunteer', data),
  getInventory: () => API.get('/ngos/inventory'),
  addInventory: (data: any) => API.post('/ngos/inventory', data),
  getImpactReport: () => API.get('/ngos/impact-report'),
};

// Volunteers
export const volunteerAPI = {
  getDashboard: () => API.get('/volunteers/dashboard'),
  updatePickup: (id: string, data: FormData) => API.put(`/volunteers/pickup/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getHistory: () => API.get('/volunteers/history'),
  getLeaderboard: () => API.get('/volunteers/leaderboard'),
};

// Admin
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getAllUsers: (params?: any) => API.get('/admin/users', { params }),
  toggleStatus: (id: string) => API.put(`/admin/users/${id}/toggle-status`),
  verifyNgo: (id: string) => API.put(`/admin/ngos/${id}/verify`),
  getAllDonations: (params?: any) => API.get('/admin/donations', { params }),
};

// Notifications
export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markAllRead: () => API.put('/notifications/mark-read'),
  markRead: (id: string) => API.put(`/notifications/${id}/read`),
};

// Analytics
export const analyticsAPI = {
  getPlatform: () => API.get('/analytics/platform'),
};

// Users
export const usersAPI = {
  getVolunteers: () => API.get('/users/volunteers'),
  getById: (id: string) => API.get(`/users/${id}`),
};

export default API;
