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

import { api } from '../../services/api_enhanced';

const FacultyReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reportType, setReportType] = useState('individual');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [templateStyle, setTemplateStyle] = useState('classic');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([
    'registered_no', 'name', 'branch', 'curr_semester', 'sgpa'
  ]);
  const [recentReports, setRecentReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock students data
        const mockStudents = [
          { id: 1, name: 'Akella Venkata', regNo: '22A91A6101', branch: 'AIML', semester: 6 },
          { id: 2, name: 'Anusuri Bharathi', regNo: '22A91A6102', branch: 'AIML', semester: 6 },
          { id: 3, name: 'Ari Naresh', regNo: '22A91A6103', branch: 'AIML', semester: 6 },
          { id: 4, name: 'Arugollu Lalu Prasad', regNo: '22A91A6104', branch: 'AIML', semester: 6 },
          { id: 5, name: 'Ayushi Singh', regNo: '22A91A6105', branch: 'AIML', semester: 6 },
        ];
        
        // Mock recent reports
        const mockRecentReports = [
          { 
            id: 1, 
            name: 'Semester Performance Report', 
            type: 'PDF', 
            students: ['Akella Venkata'], 
            date: '2024-05-10', 
            size: '1.2 MB',
            path: '/reports/semester_performance_22A91A6101.pdf'
          },
          { 
            id: 2, 
            name: 'Batch Analysis', 
            type: 'Excel', 
            students: ['Multiple Students'], 
            date: '2024-05-08', 
            size: '3.5 MB',
            path: '/reports/batch_analysis_20240508.xlsx'
          },
          { 
            id: 3, 
            name: 'Subject Analysis Report', 
            type: 'PDF', 
            students: ['Anusuri Bharathi'], 
            date: '2024-05-05', 
            size: '0.9 MB',
            path: '/reports/subject_analysis_22A91A6102.pdf'
          },
          { 
            id: 4, 
            name: 'Cumulative Performance', 
            type: 'PDF', 
            students: ['Ari Naresh'], 
            date: '2024-05-03', 
            size: '1.1 MB',
            path: '/reports/cumulative_22A91A6103.pdf'
          },
          { 
            id: 5, 
            name: 'Student Details Export', 
            type: 'Excel', 
            students: ['All Students'], 
            date: '2024-05-01', 
            size: '4.2 MB',
            path: '/reports/student_details_20240501.xlsx'
          },
        ];
        
        // Mock scheduled reports
        const mockScheduledReports = [
          { 
            id: 1, 
            name: 'Weekly Performance Summary', 
            schedule: 'Weekly (Monday)', 
            type: 'PDF', 
            recipients: 'Faculty, HoD',
            next_run: '2024-05-15'
          },
          { 
            id: 2, 
            name: 'Monthly Attendance Report', 
            schedule: 'Monthly (1st)', 
            type: 'Excel', 
            recipients: 'Faculty',
            next_run: '2024-06-01'
          },
          { 
            id: 3, 
            name: 'Semester End Report', 
            schedule: 'Once (End of Semester)', 
            type: 'PDF', 
            recipients: 'Faculty, HoD, Principal',
            next_run: '2024-06-30'
          },
        ];
        
        setStudents(mockStudents);
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

  const handleStudentSelection = (event) => {
    const value = event.target.value;
    setSelectedStudents(value);
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

  const handleColumnSelection = (event) => {
    const value = event.target.value;
    setSelectedColumns(value);
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false);
      
      // In a real implementation, this would redirect to the report URL
      if (reportFormat === 'pdf') {
        const url = api.downloadIndividualReport(
          selectedStudents[0], 
          includeCharts, 
          templateStyle
        );
        window.open(url, '_blank');
      } else {
        const url = api.downloadBulkReport({
          selected: selectedStudents,
          reportType: 'excel',
          selected_columns: selectedColumns
        });
        window.open(url, '_blank');
      }
    }, 2000);
  };

  const handlePreviewReport = () => {
    if (reportFormat === 'pdf' && selectedStudents.length === 1) {
      const url = api.previewIndividualReport(
        selectedStudents[0], 
        includeCharts, 
        templateStyle
      );
      window.open(url, '_blank');
    }
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
          Reports Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and manage student reports
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
                              <MenuItem value="individual">Individual Student Report</MenuItem>
                              <MenuItem value="batch">Batch Report</MenuItem>
                              <MenuItem value="semester">Semester Performance Report</MenuItem>
                              <MenuItem value="subject">Subject Analysis Report</MenuItem>
                              <MenuItem value="cumulative">Cumulative Performance Report</MenuItem>
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
                            <InputLabel>Select Students</InputLabel>
                            <Select
                              multiple
                              value={selectedStudents}
                              onChange={handleStudentSelection}
                              label="Select Students"
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip 
                                      key={value} 
                                      label={students.find(s => s.regNo === value)?.name || value} 
                                      size="small" 
                                    />
                                  ))}
                                </Box>
                              )}
                            >
                              {students.map((student) => (
                                <MenuItem key={student.id} value={student.regNo}>
                                  {student.name} ({student.regNo})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        
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
                                label="Include Performance Charts"
                              />
                            </Grid>
                          </>
                        )}
                        
                        {reportFormat === 'excel' && (
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Select Columns</InputLabel>
                              <Select
                                multiple
                                value={selectedColumns}
                                onChange={handleColumnSelection}
                                label="Select Columns"
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip key={value} label={value} size="small" />
                                    ))}
                                  </Box>
                                )}
                              >
                                <MenuItem value="registered_no">Registration Number</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="branch">Branch</MenuItem>
                                <MenuItem value="curr_semester">Current Semester</MenuItem>
                                <MenuItem value="sgpa">SGPA</MenuItem>
                                <MenuItem value="cgpa">CGPA</MenuItem>
                                <MenuItem value="attendance">Attendance</MenuItem>
                                <MenuItem value="backlog_count">Backlog Count</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
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
                        {selectedStudents.length === 0 ? (
                          <Typography variant="body1" color="text.secondary" align="center">
                            Select at least one student to generate a report
                          </Typography>
                        ) : reportFormat === 'pdf' ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <PictureAsPdfIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {selectedStudents.length} student(s) selected
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
                              {selectedStudents.length} student(s) selected
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedColumns.length} columns selected
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                      {reportFormat === 'pdf' && selectedStudents.length === 1 && (
                        <Button 
                          variant="outlined" 
                          startIcon={<VisibilityIcon />}
                          onClick={handlePreviewReport}
                        >
                          Preview
                        </Button>
                      )}
                      
                      <Button 
                        variant="contained" 
                        startIcon={<DownloadIcon />}
                        onClick={handleGenerateReport}
                        disabled={selectedStudents.length === 0 || generatingReport}
                        sx={{ ml: 'auto' }}
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
                  Access and manage your recently generated reports
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
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {report.students.join(', ')}
                          </Typography>
                          {` — ${report.date} • ${report.size}`}
                        </>
                      }
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
    </motion.div>
  );
};

export default FacultyReports;