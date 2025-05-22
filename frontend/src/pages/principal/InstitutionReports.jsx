import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { api } from '../../services/api_enhanced';

const InstitutionReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('institution_performance');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [templateStyle, setTemplateStyle] = useState('classic');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [timeRange, setTimeRange] = useState('current_year');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock departments data
        const mockDepartments = [
          { id: 1, name: 'Computer Science', code: 'CSE' },
          { id: 2, name: 'Electronics & Communication', code: 'ECE' },
          { id: 3, name: 'Mechanical Engineering', code: 'MECH' },
          { id: 4, name: 'Civil Engineering', code: 'CIVIL' },
          { id: 5, name: 'Electrical Engineering', code: 'EEE' },
          { id: 6, name: 'Information Technology', code: 'IT' },
          { id: 7, name: 'Artificial Intelligence & ML', code: 'AIML' },
          { id: 8, name: 'Data Science', code: 'DS' }
        ];
        
        // Mock recent reports
        const mockRecentReports = [
          { 
            id: 1, 
            name: 'Institution Performance Report', 
            type: 'PDF', 
            date: '2024-05-10', 
            size: '3.5 MB',
            path: '/reports/institution_performance_20240510.pdf'
          },
          { 
            id: 2, 
            name: 'Department Comparison Report', 
            type: 'Excel', 
            date: '2024-05-08', 
            size: '4.2 MB',
            path: '/reports/department_comparison_20240508.xlsx'
          },
          { 
            id: 3, 
            name: 'Faculty Performance Report', 
            type: 'PDF', 
            date: '2024-05-05', 
            size: '2.8 MB',
            path: '/reports/faculty_performance_20240505.pdf'
          },
          { 
            id: 4, 
            name: 'Student Achievement Report', 
            type: 'PDF', 
            date: '2024-05-03', 
            size: '3.1 MB',
            path: '/reports/student_achievement_20240503.pdf'
          },
          { 
            id: 5, 
            name: 'Annual Academic Report', 
            type: 'Excel', 
            date: '2024-05-01', 
            size: '5.5 MB',
            path: '/reports/annual_academic_20240501.xlsx'
          },
        ];
        
        // Mock scheduled reports
        const mockScheduledReports = [
          { 
            id: 1, 
            name: 'Monthly Institution Performance', 
            schedule: 'Monthly (1st)', 
            type: 'PDF', 
            recipients: 'Principal, HoDs, Management',
            next_run: '2024-06-01'
          },
          { 
            id: 2, 
            name: 'Quarterly Department Analysis', 
            schedule: 'Quarterly', 
            type: 'Excel', 
            recipients: 'Principal, HoDs',
            next_run: '2024-07-01'
          },
          { 
            id: 3, 
            name: 'Annual Academic Report', 
            schedule: 'Yearly (April)', 
            type: 'PDF', 
            recipients: 'Principal, Management, HoDs, Faculty',
            next_run: '2025-04-01'
          },
        ];
        
        setDepartments(mockDepartments);
        setRecentReports(mockRecentReports);
        setScheduledReports(mockScheduledReports);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleReportFormatChange = (event) => {
    setReportFormat(event.target.value);
  };

  const handleTemplateStyleChange = (event) => {
    setTemplateStyle(event.target.value);
  };

  const handleIncludeChartsChange = (event) => {
    setIncludeCharts(event.target.checked);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleDepartmentSelection = (event) => {
    const value = event.target.value;
    setSelectedDepartments(value);
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false);
      
      // In a real implementation, this would redirect to the report URL
      alert('Report generated successfully!');
    }, 2000);
  };

  const handleDeleteReport = (id) => {
    // In a real implementation, this would call the API
    setRecentReports(prev => prev.filter(report => report.id !== id));
  };

  const handleDeleteScheduledReport = (id) => {
    // In a real implementation, this would call the API
    setScheduledReports(prev => prev.filter(report => report.id !== id));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Institution Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and manage institution-level reports
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Generate Report" />
          <Tab label="Recent Reports" />
          <Tab label="Scheduled Reports" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Generate Report Tab */}
          {tabValue === 0 && (
            <motion.div variants={itemVariants}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Report Configuration
                      </Typography>
                      
                      <Divider sx={{ mb: 3 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Report Type</InputLabel>
                            <Select
                              value={reportType}
                              onChange={handleReportTypeChange}
                              label="Report Type"
                            >
                              <MenuItem value="institution_performance">Institution Performance Report</MenuItem>
                              <MenuItem value="department_comparison">Department Comparison Report</MenuItem>
                              <MenuItem value="faculty_performance">Faculty Performance Report</MenuItem>
                              <MenuItem value="student_achievement">Student Achievement Report</MenuItem>
                              <MenuItem value="annual_academic">Annual Academic Report</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Report Format</InputLabel>
                            <Select
                              value={reportFormat}
                              onChange={handleReportFormatChange}
                              label="Report Format"
                            >
                              <MenuItem value="pdf">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <PictureAsPdfIcon sx={{ mr: 1, color: 'error.main' }} />
                                  PDF Document
                                </Box>
                              </MenuItem>
                              <MenuItem value="excel">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <TableChartIcon sx={{ mr: 1, color: 'success.main' }} />
                                  Excel Spreadsheet
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Time Range</InputLabel>
                            <Select
                              value={timeRange}
                              onChange={handleTimeRangeChange}
                              label="Time Range"
                            >
                              <MenuItem value="current_year">Current Academic Year</MenuItem>
                              <MenuItem value="previous_year">Previous Academic Year</MenuItem>
                              <MenuItem value="last_5_years">Last 5 Years</MenuItem>
                              <MenuItem value="custom">Custom Range</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        {reportType === 'department_comparison' && (
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Select Departments</InputLabel>
                              <Select
                                multiple
                                value={selectedDepartments}
                                onChange={handleDepartmentSelection}
                                label="Select Departments"
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip 
                                        key={value} 
                                        label={departments.find(d => d.id === value)?.code || value} 
                                        size="small" 
                                      />
                                    ))}
                                  </Box>
                                )}
                              >
                                {departments.map((department) => (
                                  <MenuItem key={department.id} value={department.id}>
                                    {department.name} ({department.code})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}
                        
                        {reportFormat === 'pdf' && (
                          <>
                            <Grid item xs={12}>
                              <FormControl fullWidth margin="normal">
                                <InputLabel>Template Style</InputLabel>
                                <Select
                                  value={templateStyle}
                                  onChange={handleTemplateStyleChange}
                                  label="Template Style"
                                >
                                  <MenuItem value="classic">Classic</MenuItem>
                                  <MenuItem value="modern">Modern</MenuItem>
                                  <MenuItem value="minimal">Minimal</MenuItem>
                                  <MenuItem value="corporate">Corporate</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={includeCharts}
                                    onChange={handleIncludeChartsChange}
                                    color="primary"
                                  />
                                }
                                label="Include Charts and Visualizations"
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Report Preview
                      </Typography>
                      
                      <Divider sx={{ mb: 3 }} />
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '300px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        p: 3
                      }}>
                        {reportFormat === 'pdf' ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <PictureAsPdfIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              {reportType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Time Range: {timeRange.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Template: {templateStyle.charAt(0).toUpperCase() + templateStyle.slice(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Charts: {includeCharts ? 'Included' : 'Not included'}
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <TableChartIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              Excel Export
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {reportType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Time Range: {timeRange.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained" 
                        startIcon={<DownloadIcon />}
                        onClick={handleGenerateReport}
                        disabled={generatingReport || (reportType === 'department_comparison' && selectedDepartments.length === 0)}
                      >
                        {generatingReport ? (
                          <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Generating...
                          </>
                        ) : (
                          'Generate Report'
                        )}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
          
          {/* Recent Reports Tab */}
          {tabValue === 1 && (
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recently Generated Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access and manage your recently generated institution reports
                </Typography>
              </Box>
              
              <List>
                {recentReports.map((report) => (
                  <ListItem
                    key={report.id}
                    sx={{
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.01)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      {report.type === 'PDF' ? (
                        <PictureAsPdfIcon sx={{ color: 'error.main' }} />
                      ) : (
                        <TableChartIcon sx={{ color: 'success.main' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={report.name}
                      secondary={`${report.date} • ${report.size}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="download" sx={{ mr: 1 }}>
                        <DownloadIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReport(report.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                
                {recentReports.length === 0 && (
                  <Alert severity="info">No recent reports found</Alert>
                )}
              </List>
            </motion.div>
          )}
          
          {/* Scheduled Reports Tab */}
          {tabValue === 2 && (
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Scheduled Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your scheduled report generation
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                  }}
                >
                  Schedule New Report
                </Button>
              </Box>
              
              <List>
                {scheduledReports.map((report) => (
                  <ListItem
                    key={report.id}
                    sx={{
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.01)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={report.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {report.schedule}
                          </Typography>
                          {` — ${report.type} • Recipients: ${report.recipients}`}
                          <br />
                          <Typography component="span" variant="body2">
                            Next run: {report.next_run}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteScheduledReport(report.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                
                {scheduledReports.length === 0 && (
                  <Alert severity="info">No scheduled reports found</Alert>
                )}
              </List>
            </motion.div>
          )}
        </Box>
      </Paper>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Quick Reports</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3} md={2}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <AccountBalanceIcon />
                <Typography>Institution Overview</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <BusinessIcon />
                <Typography>Department Analysis</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <GroupIcon />
                <Typography>Faculty Report</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <PeopleIcon />
                <Typography>Student Report</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <BarChartIcon />
                <Typography>Performance Trends</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <EmojiEventsIcon />
                <Typography>Achievement Report</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default InstitutionReports;