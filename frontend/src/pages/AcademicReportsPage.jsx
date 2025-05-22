import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import ReportSelector from '../components/reports/ReportSelector';
import SemesterPerformanceReport from '../components/reports/SemesterPerformanceReport';
import CumulativePerformanceReport from '../components/reports/CumulativePerformanceReport';
import SubjectAnalysisReport from '../components/reports/SubjectAnalysisReport';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const AcademicReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleReportSelect = async (params) => {
    setLoading(true);
    setError(null);
    setReportData(null);
    setReportType(params.reportType);
    
    try {
      let url = '';
      
      switch (params.reportType) {
        case 'semester-performance':
          url = `${API_BASE_URL}/reports/semester-performance/${params.regNo}?semester=${params.semester}&academic_year=${params.academicYear}`;
          break;
        case 'cumulative-performance':
          url = `${API_BASE_URL}/reports/cumulative-performance/${params.regNo}`;
          break;
        case 'subject-analysis':
          url = `${API_BASE_URL}/reports/subject-analysis/${params.regNo}`;
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      const response = await axios.get(url);
      setReportData(response.data);
      
      setSnackbar({
        open: true,
        message: 'Report generated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err.response?.data?.error || 'Failed to generate report');
      
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to generate report',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderReport = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }
    
    if (!reportData) {
      return null;
    }
    
    switch (reportType) {
      case 'semester-performance':
        return <SemesterPerformanceReport data={reportData} />;
      case 'cumulative-performance':
        return <CumulativePerformanceReport data={reportData} />;
      case 'subject-analysis':
        return <SubjectAnalysisReport data={reportData} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Academic Reports
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <ReportSelector onReportSelect={handleReportSelect} />
        </Paper>
        
        {renderReport()}
      </motion.div>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AcademicReportsPage;