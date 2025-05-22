// API service for making requests to the backend

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Student data
  fetchStudents: (branch = '', semester = '') => {
    const params = new URLSearchParams();
    if (branch) params.append('branch', branch);
    if (semester) params.append('semester', semester);
    
    return fetch(`${API_BASE_URL}/students?${params.toString()}`)
      .then(response => response.json());
  },
  
  // PDF Reports
  downloadIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
    const params = new URLSearchParams();
    params.append('includeCharts', includeCharts);
    params.append('templateStyle', templateStyle);
    
    return `${API_BASE_URL}/reports/individual/${regNo}?${params.toString()}`;
  },
  
  previewIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
    const params = new URLSearchParams();
    params.append('includeCharts', includeCharts);
    params.append('templateStyle', templateStyle);
    
    return `${API_BASE_URL}/reports/preview/${regNo}?${params.toString()}`;
  },
  
  downloadBulkReport: ({ selected, reportType, pdfType = 'individual', includeCharts = false, templateStyle = 'classic', selected_columns = [] }) => {
    const params = new URLSearchParams();
    params.append('students', selected.join(','));
    
    if (reportType === 'pdf') {
      params.append('includeCharts', includeCharts);
      params.append('templateStyle', templateStyle);
      return `${API_BASE_URL}/reports/pdf/${pdfType}?${params.toString()}`;
    } else if (reportType === 'excel') {
      if (selected_columns.length > 0) {
        params.append('columns', selected_columns.join(','));
      }
      return `${API_BASE_URL}/reports/excel?${params.toString()}`;
    }
    
    return '';
  },
  
  // Dashboard data
  getDashboardStats: () => {
    return fetch(`${API_BASE_URL}/dashboard/stats`)
      .then(response => response.json());
  },
  
  getPerformanceData: () => {
    return fetch(`${API_BASE_URL}/dashboard/performance`)
      .then(response => response.json());
  },
  
  getBranchDistribution: () => {
    return fetch(`${API_BASE_URL}/dashboard/branch-distribution`)
      .then(response => response.json());
  },
  
  getRecentReports: () => {
    return fetch(`${API_BASE_URL}/dashboard/recent-reports`)
      .then(response => response.json());
  },
  
  getNotifications: () => {
    return fetch(`${API_BASE_URL}/dashboard/notifications`)
      .then(response => response.json());
  },
  
  // Academic Reports
  getSemesterPerformance: (regNo, semester, academicYear) => {
    const params = new URLSearchParams();
    params.append('semester', semester);
    params.append('academic_year', academicYear);
    
    return fetch(`${API_BASE_URL}/reports/semester-performance/${regNo}?${params.toString()}`)
      .then(response => response.json());
  },
  
  getCumulativePerformance: (regNo) => {
    return fetch(`${API_BASE_URL}/reports/cumulative-performance/${regNo}`)
      .then(response => response.json());
  },
  
  getSubjectAnalysis: (regNo) => {
    return fetch(`${API_BASE_URL}/reports/subject-analysis/${regNo}`)
      .then(response => response.json());
  },
  
  // Progress Tracking Reports
  getCurriculumTracker: (regNo) => {
    return fetch(`${API_BASE_URL}/reports/curriculum-tracker/${regNo}`)
      .then(response => response.json());
  },
  
  getBacklogManagement: (regNo) => {
    return fetch(`${API_BASE_URL}/reports/backlog-management/${regNo}`)
      .then(response => response.json());
  },
  
  getInternshipTracking: (regNo) => {
    return fetch(`${API_BASE_URL}/reports/internship-tracking/${regNo}`)
      .then(response => response.json());
  }
};