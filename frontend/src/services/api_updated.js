// API service for frontend
const API_URL = 'http://localhost:5000/api';

export const api = {
    // Fetch all students
    fetchStudents: async () => {
        const response = await fetch(`${API_URL}/students`);
        return response.json();
    },

    // Download individual student report
    downloadIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
        return `${API_URL}/reports/individual/${regNo}?includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
    },

    // Download bulk reports (PDF or Excel)
    downloadBulkReport: (params) => {
        const { selected, reportType, pdfType, selected_columns, includeCharts = false, templateStyle = 'classic' } = params;
        
        if (reportType === 'pdf') {
            return `${API_URL}/reports/pdf/${pdfType}?students=${selected.join(',')}&includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
        } else if (reportType === 'excel') {
            return `${API_URL}/reports/excel?students=${selected.join(',')}&columns=${selected_columns.join(',')}`;
        }
        
        return '';
    },

    // Preview individual student report
    previewIndividualReport: (regNo, includeCharts = false, templateStyle = 'classic') => {
        return `${API_URL}/reports/preview/${regNo}?includeCharts=${includeCharts}&templateStyle=${templateStyle}`;
    }
};