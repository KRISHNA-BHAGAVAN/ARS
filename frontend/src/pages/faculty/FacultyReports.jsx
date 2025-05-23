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

import { api } from '../../services/api_enhanced'; // Assuming this is your facultyApi or similar
import facultyApi from '../../services/faculty-api'; // Explicitly import facultyApi

const FacultyReports = () => {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null); // Renamed error to avoid conflict with API error
  const [reportError, setReportError] = useState(null); // Specific error for report generation
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reportType, setReportType] = useState('individual'); // This seems to be for the *type* of data (e.g. performance, attendance) not the file format.
  const [selectedFormat, setSelectedFormat] = useState('pdf'); // 'pdf' or 'excel' - Replaces original reportFormat
  const [pdfOptionType, setPdfOptionType] = useState('individual'); // 'individual' or 'combined'
  const [templateStyle, setTemplateStyle] = useState('classic'); // Kept for PDF styling
  const [includeCharts, setIncludeCharts] = useState(true); // Kept for PDF styling

  const allExcelColumnsOptions = [
    { key: 'name', label: 'Name' },
    { key: 'reg_no', label: 'Registration Number' },
    { key: 'branch', label: 'Branch' },
    { key: 'current_semester', label: 'Current Semester' },
    { key: 'cgpa', label: 'Overall CGPA' },
    { key: 'semester1_sgpa', label: 'Semester 1 SGPA' },
    { key: 'semester1_credits_obtained', label: 'Semester 1 Credits Obtained' },
    { key: 'semester2_sgpa', label: 'Semester 2 SGPA' },
    { key: 'semester2_credits_obtained', label: 'Semester 2 Credits Obtained' },
    { key: 'semester3_sgpa', label: 'Semester 3 SGPA' },
    { key: 'semester3_credits_obtained', label: 'Semester 3 Credits Obtained' },
    { key: 'semester4_sgpa', label: 'Semester 4 SGPA' },
    { key: 'semester4_credits_obtained', label: 'Semester 4 Credits Obtained' },
    { key: 'semester5_sgpa', label: 'Semester 5 SGPA' },
    { key: 'semester5_credits_obtained', label: 'Semester 5 Credits Obtained' },
    // Add more semesters as needed
  ];

  const [selectedExcelColumns, setSelectedExcelColumns] = useState(['reg_no', 'name', 'cgpa']); // Array of column keys

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
    setSelectedFormat(event.target.value);
    // Reset options when format changes
    if (event.target.value === 'pdf') {
      // setSelectedExcelColumns(['reg_no', 'name', 'cgpa']); // Optionally reset excel columns
    } else {
      // setPdfOptionType('individual'); // Optionally reset pdf options
    }
  };

  const handlePdfOptionTypeChange = (event) => {
    setPdfOptionType(event.target.value);
  };

  const handleTemplateStyleChange = (event) => {
    setTemplateStyle(event.target.value);
  };

  const handleIncludeChartsChange = (event) => {
    setIncludeCharts(event.target.checked);
  };

  const handleColumnSelection = (event) => {
    const value = event.target.value;
    setSelectedExcelColumns(typeof value === 'string' ? value.split(',') : value);
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    setReportError(null); // Clear previous report errors

    // Construct reportData (using 'reportType' as the 'type' for the report category and 'Report Name' field for 'name')
    // For 'name', we'll use the 'reportType' state as a placeholder, or a more specific name if available.
    // The 'reportType' state in the UI seems to map to 'Individual Student Report', 'Batch Report', etc.
    // This can be used as the report's 'type' for backend categorization/logging.
    // The actual report name could be a combination or a fixed string for now.
    let dynamicReportName = "Student Report"; // Default
    if(reportType) {
        dynamicReportName = reportType.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ` (${selectedFormat.toUpperCase()})`;
    }


    const reportData = {
      name: dynamicReportName, // Using the existing 'reportType' state for the report's conceptual name/title
      type: reportType, // This is the category of report (e.g., 'individual', 'batch')
      format: selectedFormat,
      student_ids: selectedStudents, // Assuming selectedStudents contains IDs/regNos
      parameters: { // General parameters, can include things not specific to PDF/Excel
        templateStyle: selectedFormat === 'pdf' ? templateStyle : undefined,
        includeCharts: selectedFormat === 'pdf' ? includeCharts : undefined,
      }
    };

    if (selectedFormat === 'pdf') {
      reportData.pdf_options = { type: pdfOptionType };
    } else if (selectedFormat === 'excel') {
      reportData.excel_options = { columns: selectedExcelColumns };
    }

    try {
      const response = await facultyApi.generateFacultyReport(reportData);

      if (response.data && response.status === 200) {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        let filename = `${dynamicReportName.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}`;
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
          if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }
        
        // Fallback extension if not in extracted filename
        if (selectedFormat === 'pdf' && !filename.endsWith('.pdf') && !filename.endsWith('.zip')) {
            filename += (pdfOptionType === 'individual' && selectedStudents.length > 1) ? '.zip' : '.pdf';
        } else if (selectedFormat === 'excel' && !filename.endsWith('.xlsx')) {
            filename += '.xlsx';
        }


        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        // Optionally, show a success message
        // setSuccessAlert('Report generated and download started!'); // Requires state for success alert
      } else {
        // Handle non-200 success statuses or empty data if necessary
        setReportError('Failed to generate report: Invalid response from server.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setReportError(`Error: ${error.response.data.error}. Details: ${error.response.data.details || 'No additional details.'}`);
      } else if (error.response && error.response.data && error.response.data.message) { // For text/plain errors from blob parsing
         setReportError(`Error: ${error.response.data.message}`);
      }
      else if (error.message) {
        setReportError(error.message);
      } else {
        setReportError('An unknown error occurred while generating the report.');
      }
    } finally {
      setGeneratingReport(false);
    }
  };

  const handlePreviewReport = () => {
    // Preview logic might need adjustment based on new options
    if (selectedFormat === 'pdf' && selectedStudents.length === 1) {
      // const url = api.previewIndividualReport( // This api call is mock and might need update
      //   selectedStudents[0], 
      //   includeCharts, 
      // );
      alert(`Simulating PDF preview for ${selectedStudents[0]}`);
      // window.open(url, '_blank');
    }
  };

  const handleDeleteReport = (id) => {
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

  if (fetchError) { // Changed from error to fetchError
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{fetchError}</Alert>
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
          {/* Report Error Alert */}
          {reportError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setReportError(null)}>
              {reportError}
            </Alert>
          )}

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
                            <InputLabel>Report Category/Title</InputLabel> {/* Changed Label */}
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
                              value={selectedFormat} // Updated state variable
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
                            <InputLabel>Select Students</InputLabel> {/* Assuming this exists and works */}
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
                        
                        {/* PDF Options: Conditional Display */}
                        {selectedFormat === 'pdf' && (
                          <>
                            {selectedStudents.length > 1 && (
                              <Grid item xs={12}>
                                <FormControl component="fieldset" margin="normal">
                                  <FormLabel component="legend">PDF Output Type</FormLabel>
                                  <RadioGroup
                                    row
                                    name="pdfOptionType"
                                    value={pdfOptionType}
                                    onChange={handlePdfOptionTypeChange}
                                  >
                                    <FormControlLabel value="individual" control={<Radio />} label="Individual PDFs (ZIP)" />
                                    <FormControlLabel value="combined" control={<Radio />} label="Combined PDF" />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            )}
                            {/* Existing PDF styling options can remain here */}
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
                        
                        {/* Excel Column Selection: Conditional Display */}
                        {selectedFormat === 'excel' && (
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Select Excel Columns</InputLabel>
                              <Select
                                multiple
                                value={selectedExcelColumns} // Updated state variable
                                onChange={handleColumnSelection}
                                label="Select Excel Columns"
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                      const column = allExcelColumnsOptions.find(c => c.key === value);
                                      return <Chip key={value} label={column ? column.label : value} size="small" />;
                                    })}
                                  </Box>
                                )}
                              >
                                {allExcelColumnsOptions.map((column) => (
                                  <MenuItem key={column.key} value={column.key}>
                                    <Checkbox checked={selectedExcelColumns.indexOf(column.key) > -1} />
                                    <ListItemText primary={column.label} />
                                  </MenuItem>
                                ))}
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
                        ) : selectedFormat === 'pdf' ? ( // Updated conditional
                          <Box sx={{ textAlign: 'center' }}>
                            <PictureAsPdfIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              PDF Report Preview
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {selectedStudents.length} student(s) selected
                            </Typography>
                            {selectedStudents.length > 1 && (
                               <Typography variant="body2" color="text.secondary">
                                PDF Type: {pdfOptionType === 'individual' ? 'Individual (ZIP)' : 'Combined PDF'}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              Template: {templateStyle.charAt(0).toUpperCase() + templateStyle.slice(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Charts: {includeCharts ? 'Included' : 'Not included'}
                            </Typography>
                          </Box>
                        ) : ( // Excel preview
                          <Box sx={{ textAlign: 'center' }}>
                            <TableChartIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              Excel Report Preview
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {selectedStudents.length} student(s) selected
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedExcelColumns.length} columns selected: {selectedExcelColumns.map(key => allExcelColumnsOptions.find(c => c.key === key)?.label || key).join(', ')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}> {/* Changed to flex-end for single button */}
                      {/* Preview button logic might need to be re-evaluated or simplified for this stage */}
                      {/* {selectedFormat === 'pdf' && selectedStudents.length === 1 && (
                        <Button 
                          variant="outlined" 
                          startIcon={<VisibilityIcon />}
                          onClick={handlePreviewReport}
                          sx={{ mr: 1 }} 
                        >
                          Preview Individual PDF
                        </Button>
                      )} */}
                      
                      <Button 
                        variant="contained" 
                        startIcon={<DownloadIcon />}
                        onClick={handleGenerateReport}
                        disabled={selectedStudents.length === 0 || generatingReport}
                        // sx={{ ml: 'auto' }} // Removed as preview button is commented out
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