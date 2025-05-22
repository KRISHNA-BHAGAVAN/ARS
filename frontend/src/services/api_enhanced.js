// Enhanced API service for frontend with authentication and new features
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        
        // If error is 401 and not already retrying
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // No refresh token, redirect to login
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
                
                const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`
                    }
                });
                
                // Save new access token
                const { access_token } = response.data;
                localStorage.setItem('access_token', access_token);
                
                // Retry original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export const api = {
    // Auth endpoints
    login: async (username, password) => {
        // For demo purposes, we'll simulate a login response
        // In a real app, this would call the backend API
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check credentials (demo only)
        if (username === 'faculty' && password === 'faculty123') {
            return {
                tokens: {
                    access_token: 'faculty_demo_token',
                    refresh_token: 'faculty_refresh_token'
                },
                user: {
                    id: 1,
                    username: 'faculty',
                    name: 'Faculty User',
                    role: 'faculty',
                    department: 'AIML'
                }
            };
        } else if (username === 'hod' && password === 'hod123') {
            return {
                tokens: {
                    access_token: 'hod_demo_token',
                    refresh_token: 'hod_refresh_token'
                },
                user: {
                    id: 2,
                    username: 'hod',
                    name: 'HoD User',
                    role: 'hod',
                    department: 'AIML'
                }
            };
        } else if (username === 'principal' && password === 'principal123') {
            return {
                tokens: {
                    access_token: 'principal_demo_token',
                    refresh_token: 'principal_refresh_token'
                },
                user: {
                    id: 3,
                    username: 'principal',
                    name: 'Principal User',
                    role: 'principal'
                }
            };
        } else if (username === 'admin' && password === 'admin123') {
            // Default admin user
            return {
                tokens: {
                    access_token: 'admin_demo_token',
                    refresh_token: 'admin_refresh_token'
                },
                user: {
                    id: 4,
                    username: 'admin',
                    name: 'Admin User',
                    role: 'admin'
                }
            };
        }
        
        // Invalid credentials
        throw {
            response: {
                data: {
                    error: 'Invalid username or password'
                }
            }
        };
    },
    
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },
    
    getProfile: async () => {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },
    
    // User management endpoints
    getUsers: async () => {
        const response = await apiClient.get('/users');
        return response.data;
    },
    
    getUser: async (userId) => {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },
    
    createUser: async (userData) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },
    
    updateUser: async (userId, userData) => {
        const response = await apiClient.put(`/users/${userId}`, userData);
        return response.data;
    },
    
    activateUser: async (userId) => {
        const response = await apiClient.put(`/users/${userId}/activate`);
        return response.data;
    },
    
    deactivateUser: async (userId) => {
        const response = await apiClient.put(`/users/${userId}/deactivate`);
        return response.data;
    },
    
    // Student endpoints
    fetchStudents: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.branch) params.append('branch', filters.branch);
        if (filters.semester) params.append('semester', filters.semester);
        
        const response = await apiClient.get(`/students?${params.toString()}`);
        return response.data;
    },
    
    getStudent: async (regNo) => {
        const response = await apiClient.get(`/students/${regNo}`);
        return response.data;
    },
    
    // Achievement endpoints
    getAchievements: async (studentId = null, verifiedOnly = false) => {
        const params = new URLSearchParams();
        if (studentId) params.append('student_id', studentId);
        if (verifiedOnly) params.append('verified_only', 'true');
        
        const response = await apiClient.get(`/achievements?${params.toString()}`);
        return response.data;
    },
    
    getAchievement: async (achievementId) => {
        const response = await apiClient.get(`/achievements/${achievementId}`);
        return response.data;
    },
    
    createAchievement: async (achievementData) => {
        const response = await apiClient.post('/achievements', achievementData);
        return response.data;
    },
    
    updateAchievement: async (achievementId, achievementData) => {
        const response = await apiClient.put(`/achievements/${achievementId}`, achievementData);
        return response.data;
    },
    
    verifyAchievement: async (achievementId) => {
        const response = await apiClient.put(`/achievements/${achievementId}/verify`);
        return response.data;
    },
    
    deleteAchievement: async (achievementId) => {
        const response = await apiClient.delete(`/achievements/${achievementId}`);
        return response.data;
    },
    
    getAchievementStats: async () => {
        const response = await apiClient.get('/achievements/stats');
        return response.data;
    },
    
    // Certification endpoints
    getCertifications: async (studentId = null, verifiedOnly = false) => {
        const params = new URLSearchParams();
        if (studentId) params.append('student_id', studentId);
        if (verifiedOnly) params.append('verified_only', 'true');
        
        const response = await apiClient.get(`/certifications?${params.toString()}`);
        return response.data;
    },
    
    getCertification: async (certificationId) => {
        const response = await apiClient.get(`/certifications/${certificationId}`);
        return response.data;
    },
    
    createCertification: async (certificationData) => {
        const response = await apiClient.post('/certifications', certificationData);
        return response.data;
    },
    
    updateCertification: async (certificationId, certificationData) => {
        const response = await apiClient.put(`/certifications/${certificationId}`, certificationData);
        return response.data;
    },
    
    verifyCertification: async (certificationId) => {
        const response = await apiClient.put(`/certifications/${certificationId}/verify`);
        return response.data;
    },
    
    deleteCertification: async (certificationId) => {
        const response = await apiClient.delete(`/certifications/${certificationId}`);
        return response.data;
    },
    
    getCertificationStats: async () => {
        const response = await apiClient.get('/certifications/stats');
        return response.data;
    },
    
    // Report endpoints
    downloadIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
        return `${API_URL}/reports/individual/${regNo}?includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
    },
    
    downloadBulkReport: (params) => {
        const { selected, reportType, pdfType, selected_columns, includeCharts = false, templateStyle = 'classic' } = params;
        
        if (reportType === 'pdf') {
            return `${API_URL}/reports/pdf/${pdfType}?students=${selected.join(',')}&includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
        } else if (reportType === 'excel') {
            return `${API_URL}/reports/excel?students=${selected.join(',')}&columns=${selected_columns.join(',')}`;
        }
        
        return '';
    },
    
    previewIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
        return `${API_URL}/reports/preview/${regNo}?includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
    },
    
    // Dashboard endpoints
    getDashboardStats: async () => {
        const response = await apiClient.get('/dashboard/stats');
        return response.data;
    },
    
    getPerformanceData: async () => {
        const response = await apiClient.get('/dashboard/performance');
        return response.data;
    },
    
    getBranchDistribution: async () => {
        const response = await apiClient.get('/dashboard/branch-distribution');
        return response.data;
    },
    
    getRecentReports: async () => {
        const response = await apiClient.get('/dashboard/recent-reports');
        return response.data;
    },
    
    getNotifications: async () => {
        const response = await apiClient.get('/dashboard/notifications');
        return response.data;
    }
};

export default api;