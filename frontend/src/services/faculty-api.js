// Faculty API service for frontend
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });
        
        // Store new tokens
        localStorage.setItem('access_token', response.data.access_token);
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (err) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export const facultyApi = {
  // Dashboard data
  getDashboardData: async () => {
    try {
      const response = await apiClient.get('/faculty/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching faculty dashboard data:', error);
      throw error;
    }
  },
  
  // Student management
  getStudents: async (filters = {}) => {
    try {
      const response = await apiClient.get('/students', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  
  getStudentDetails: async (regNo) => {
    try {
      const response = await apiClient.get(`/students/${regNo}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${regNo} details:`, error);
      throw error;
    }
  },
  
  // Achievements management
  getAchievements: async (filters = {}) => {
    try {
      const response = await apiClient.get('/achievements', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },
  
  addAchievement: async (regNo, achievementData) => {
    try {
      const response = await apiClient.post(`/students/${regNo}/achievements`, achievementData);
      return response.data;
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  },
  
  updateAchievement: async (regNo, achievementId, achievementData) => {
    try {
      const response = await apiClient.put(`/students/${regNo}/achievements/${achievementId}`, achievementData);
      return response.data;
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  },
  
  deleteAchievement: async (regNo, achievementId) => {
    try {
      const response = await apiClient.delete(`/students/${regNo}/achievements/${achievementId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  },
  
  // Certifications management
  getCertifications: async (filters = {}) => {
    try {
      const response = await apiClient.get('/certifications', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      throw error;
    }
  },
  
  // Reports
  generateReport: async (reportType, params) => {
    try {
      const response = await apiClient.get(`/reports/${reportType}`, { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
  
  getRecentReports: async () => {
    try {
      const response = await apiClient.get('/reports/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent reports:', error);
      throw error;
    }
  }
};

export default facultyApi;