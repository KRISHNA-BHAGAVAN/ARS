import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid
} from '@mui/material';
import CurriculumTrackerReport from '../components/reports/CurriculumTrackerReport';
import BacklogManagementReport from '../components/reports/BacklogManagementReport';
import InternshipTrackingReport from '../components/reports/InternshipTrackingReport';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const ProgressTrackingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [regNo, setRegNo] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Get report type based on tab
  const getReportType = () => {
    switch (tabValue) {
      case 0:
        return 'curriculum-tracker';
      case 1:
        return 'backlog-management';
      case 2:
        return 'internship-tracking';
      default:
        return 'curriculum-tracker';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setReportData(null);
    setError(null);
  };

  const handleGenerateReport = async () => {
    if (!regNo.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a registration number',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);
    
    try {
      const reportType = getReportType();
      const url = `${API_BASE_URL}/reports/${reportType}/${regNo.trim()}`;
      
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
    
    const reportType = getReportType();
    
    switch (reportType) {
      case 'curriculum-tracker':
        return <CurriculumTrackerReport data={reportData} />;
      case 'backlog-management':
        return <BacklogManagementReport data={reportData} />;
      case 'internship-tracking':
        return <InternshipTrackingReport data={reportData} />;
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
          Progress Tracking Reports
        </Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Curriculum Tracker" />
          <Tab label="Backlog Management" />
          <Tab label="Internship & Project Tracking" />
        </Tabs>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {tabValue === 0 && "Curriculum Completion Tracker"}
            {tabValue === 1 && "Backlog Management Report"}
            {tabValue === 2 && "Internship & Project Tracking"}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tabValue === 0 && "Track your progress through the curriculum, including credits completed and requirements fulfilled."}
            {tabValue === 1 && "Manage your academic backlogs, track pending exams, and get recommendations for clearing them."}
            {tabValue === 2 && "Monitor your internships and projects, track credits earned, and view skill development metrics."}
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Registration Number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="Enter student registration number"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGenerateReport}
                disabled={loading || !regNo.trim()}
                fullWidth
                sx={{ height: '56px' }}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
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

export default ProgressTrackingPage;