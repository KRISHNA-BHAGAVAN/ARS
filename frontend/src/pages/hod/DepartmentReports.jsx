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

import { api } from '../../services/api_enhanced';

const DepartmentReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('department_performance');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [templateStyle, setTemplateStyle] = useState('classic');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [timeRange, setTimeRange] = useState('current_semester');
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock courses data
        const mockCourses = [
          { id: 1, code: 'AIML301', name: 'Machine Learning', semester: 3 },
          { id: 2, code: 'AIML302', name: 'Deep Learning', semester: 3 },
          { id: 3, code: 'AIML303', name: 'Computer Vision', semester: 3 },
          { id: 4, code: 'AIML304', name: 'Natural Language Processing', semester: 3 },
          { id: 5, code: 'AIML401', name: 'Data Mining', semester: 4 },
          { id: 6, code: 'AIML402', name: 'Big Data Analytics', semester: 4 },
          { id: 7, code: 'AIML403', name: 'Reinforcement Learning', semester: 4 },
          { id: 8, code: 'AIML404', name: 'AI Ethics', semester: 4 },
        ];
        
        // Mock recent reports
        const mockRecentReports = [
          { 
            id: 1, 
            name: 'Department Performance Report', 
            type: 'PDF', 
            date: '2024-05-10', 
            size: '2.5 MB',
            path: '/reports/department_performance_20240510.pdf'
          },
          { 
            id: 2, 
            name: 'Course Analysis Report', 
            type: 'Excel', 
            date: '2024-05-08', 
            size: '3.8 MB',
            path: '/reports/course_analysis_20240508.xlsx'
          },
          { 
            id: 3, 
            name: 'Faculty Performance Report', 
            type: 'PDF', 
            date: '2024-05-05', 
            size: '1.9 MB',
            path: '/reports/faculty_performance_20240505.pdf'
          },
          { 
            id: 4, 
            name: 'Student Achievement Report', 
            type: 'PDF', 
            date: '2024-05-03', 
            size: '2.2 MB',
            path: '/reports/student_achievement_20240503.pdf'
          },
          { 
            id: 5, 
            name: 'Semester Comparison Report', 
            type: 'Excel', 
            date: '2024-05-01', 
            size: '4.5 MB',
            path: '/reports/semester_comparison_20240501.xlsx'
          },
        ];
        
        // Mock scheduled reports
        const mockScheduledReports = [
          { 
            id: 1, 
            name: 'Weekly Department Performance', 
            schedule: 'Weekly (Monday)', 
            type: 'PDF', 
            recipients: 'HoD, Principal',
            next_run: '2024-05-15'
          },
          { 
            id: 2, 
            name: 'Monthly Course Analysis', 
            schedule: 'Monthly (1st)', 
            type: 'Excel', 
            recipients: 'HoD, Faculty',
            next_run: '2024-06-01'
          },
          { 
            id: 3, 
            name: 'Semester End Report', 
            schedule: 'Once (End of Semester)', 
            type: 'PDF', 
            recipients: 'HoD, Principal, Faculty',
            next_run: '2024-06-30'
          },
        ];
        
        setCourses(mockCourses);
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

  const handleSemesterSelection = (event) => {
    const value = event.target.value;
    setSelectedSemesters(value);
  };

  const handleCourseSelection = (event) => {
    const value = event.target.value;
    setSelectedCourses(value);
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
          Department Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and manage department-level reports
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
                              <MenuItem value="department_performance">Department Performance Report</MenuItem>
                              <MenuItem value="course_analysis">Course Analysis Report</MenuItem>
                              <MenuItem value="faculty_performance">Faculty Performance Report</MenuItem>
                              <MenuItem value="student_achievement">Student Achievement Report</MenuItem>
                              <MenuItem value="semester_comparison">Semester Comparison Report</MenuItem>
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
                              <MenuItem value="current_semester">Current Semester</MenuItem>
                              <MenuItem value="previous_semester">Previous Semester</MenuItem>
                              <MenuItem value="academic_year">Academic Year</MenuItem>
                              <MenuItem value="custom">Custom Range</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        {timeRange === 'custom' && (
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Select Semesters</InputLabel>
                              <Select
                                multiple
                                value={selectedSemesters}
                                onChange={handleSemesterSelection}
                                label="Select Semesters"
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip key={value} label={`Semester ${value}`} size="small" />
                                    ))}
                                  </Box>
                                )}
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                                  <MenuItem key={semester} value={semester}>
                                    Semester {semester}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}
                        
                        {reportType === 'course_analysis' && (
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Select Courses</InputLabel>
                              <Select
                                multiple
                                value={selectedCourses}
                                onChange={handleCourseSelection}
                                label="Select Courses"
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip 
                                        key={value} 
                                        label={courses.find(c => c.id === value)?.code || value} 
                                        size="small" 
                                      />
                                    ))}
                                  </Box>
                                )}
                              >
                                {courses.map((course) => (
                                  <MenuItem key={course.id} value={course.id}>
                                    {course.code} - {course.name}
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
                        disabled={generatingReport || (reportType === 'course_analysis' && selectedCourses.length === 0) || (timeRange === 'custom' && selectedSemesters.length === 0)}
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
                  Access and manage your recently generated department reports
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
            <Grid item xs={6} sm={3}>
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
                <Typography>Department Overview</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3}>
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
                <Typography>Faculty Performance</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3}>
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
                <SchoolIcon />
                <Typography>Course Analysis</Typography>
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={3}>
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
                <Typography>Semester Comparison</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default DepartmentReports;