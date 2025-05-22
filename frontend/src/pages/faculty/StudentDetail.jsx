import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  School as SchoolIcon,
  EmojiEvents as AchievementsIcon,
  CardMembership as CertificationsIcon,
  Assessment as AssessmentIcon,
  Psychology as CounselingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { facultyApi } from '../../services/faculty-api';
import { formatNumber, compareValue } from '../../utils/formatters';
import { green } from '@mui/material/colors';

const StudentDetail = () => {
  const { regNo } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogData, setDialogData] = useState({});
  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    fetchStudentDetails();
  }, [regNo]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Make direct API request to the database endpoint
      const response = await fetch(`http://localhost:5000/api/students/${regNo}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map any necessary fields
      const mappedStudent = {
        ...data,
        registration_no: data.registration_number || data.registration_no,
        semester: data.current_semester || data.semester,
        cgpa: data.cgpa,
        previous_cgpa: data.previous_cgpa,
        total_credits: data.total_credits,
        completed_credits: data.completed_credits,
        status: data.status,
        grades: data.grades || [],
        achievements: data.achievements || [],
        certifications: data.certifications || [],
        attendance: data.attendance || [
          // Default attendance data if none exists
          { date: '2023-11-01', attendance_percentage: 95.0 },
          { date: '2023-10-01', attendance_percentage: 94.0 },
          { date: '2023-09-01', attendance_percentage: 93.0 }
        ],
        counselingNotes: data.counselingNotes || []
      };
      
      setStudent(mappedStudent);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Failed to load student details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type, data = {}) => {
    setDialogType(type);
    // Make a copy of the data to avoid direct mutation
    setDialogData({...data});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogData({});
  };

  const handleSaveDialog = async () => {
    try {
      switch (dialogType) {
        case 'achievement':
          if (dialogData.id) {
            // Update existing achievement
            const response = await fetch(`http://localhost:5000/api/students/${regNo}/achievements/${dialogData.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: dialogData.title,
                description: dialogData.description,
                achievement_date: dialogData.achievement_date,
                category: dialogData.category,
                scope: dialogData.scope
              }),
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Refresh student data to show the updated achievement
            await fetchStudentDetails();
          } else {
            // Add new achievement
            const response = await fetch(`http://localhost:5000/api/students/${regNo}/achievements`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: dialogData.title,
                description: dialogData.description,
                achievement_date: dialogData.achievement_date,
                category: dialogData.category,
                scope: dialogData.scope
              }),
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Refresh student data to show the new achievement
            await fetchStudentDetails();
          }
          break;
        case 'certification':
          if (dialogData.id) {
            // Update existing certification (not implemented yet)
            console.log('Updating certification:', dialogData);
          } else {
            // Add new certification
            const response = await fetch(`http://localhost:5000/api/students/${regNo}/certifications`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: dialogData.title,
                description: dialogData.description,
                issuing_organization: dialogData.issuing_organization,
                issue_date: dialogData.issue_date,
                expiry_date: dialogData.expiry_date,
                credential_id: dialogData.credential_id,
                certificate_url: dialogData.certificate_url
              }),
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Refresh student data to show the new certification
            await fetchStudentDetails();
          }
          break;
        case 'counseling':
          if (dialogData.id) {
            // Update existing counseling note (not implemented yet)
            console.log('Updating counseling note:', dialogData);
          } else {
            // Add new counseling note (not implemented yet)
            console.log('Adding counseling note:', dialogData);
          }
          break;
        default:
          break;
      }
      
      // Close dialog (data is already refreshed for achievements)
      if (dialogType !== 'achievement') {
        // For other types, refresh data
        fetchStudentDetails();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      switch (type) {
        case 'achievement':
          // Delete achievement using fetch API
          const response = await fetch(`http://localhost:5000/api/students/${regNo}/achievements/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          break;
        case 'certification':
          // Not implemented yet
          console.log('Deleting certification:', id);
          break;
        case 'counseling':
          // Not implemented yet
          console.log('Deleting counseling note:', id);
          break;
        default:
          break;
      }
      
      // Refresh data
      fetchStudentDetails();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDialogData({
      ...dialogData,
      [name]: value
    });
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

  // Prepare chart data - always use all grades regardless of filter
  const preparePerformanceData = () => {
    if (!student) return null;
    
    // Use sgpaData from API if available
    if (student.sgpaData && student.sgpaData.length > 0) {
      const labels = student.sgpaData.map(item => `Semester ${item.semester}`);
      const data = student.sgpaData.map(item => item.sgpa);
      
      return {
        labels,
        datasets: [
          {
            label: 'SGPA',
            data,
            borderColor: '#4568dc',
            backgroundColor: 'rgba(69, 104, 220, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      };
    }
    
    // Fallback to calculating from grades
    if (!student.grades || student.grades.length === 0) return null;
    
    // Always use all grades for the chart, regardless of selected semester
    const allGrades = student.grades;
    
    // Group grades by semester
    const semesterData = {};
    allGrades.forEach(grade => {
      const semester = grade.course_semester || grade.semester || 'Unknown';
      if (!semesterData[semester]) {
        semesterData[semester] = [];
      }
      const gradePoint = grade.grade_points || grade.grade_point || 0;
      semesterData[semester].push(gradePoint);
    });
    
    // Calculate average grade point for each semester
    const labels = [];
    const data = [];
    
    Object.keys(semesterData).sort().forEach(semester => {
      labels.push(`Semester ${semester}`);
      const avg = semesterData[semester].reduce((sum, val) => sum + val, 0) / semesterData[semester].length;
      data.push(avg.toFixed(2));
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'SGPA',
          data,
          borderColor: '#4568dc',
          backgroundColor: 'rgba(69, 104, 220, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
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

  if (!student) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Student not found</Alert>
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
          Student Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive information about the student
        </Typography>
      </Box>

      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}
                >
                  {student.name ? student.name.charAt(0) : 'S'}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {student.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {student.registration_no}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Branch
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {student.branch}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Semester
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {student.semester}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {student.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {student.phone}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Academic Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        CGPA
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={
                        parseFloat(student.cgpa) >= 8.5 ? 'success.main' :
                        parseFloat(student.cgpa) >= 7.0 ? 'primary.main' :
                        parseFloat(student.cgpa) >= 5.0 ? 'warning.main' : 'error.main'
                      }>
                        {student.cgpa ? parseFloat(student.cgpa).toFixed(2) : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip 
                        label={
                          parseFloat(student.cgpa) >= 8.5 ? 'Excellent' :
                          parseFloat(student.cgpa) >= 7.0 ? 'Good' :
                          parseFloat(student.cgpa) >= 5.0 ? 'Average' : 'At Risk'
                        } 
                        color={
                          parseFloat(student.cgpa) >= 8.5 ? 'success' :
                          parseFloat(student.cgpa) >= 7.0 ? 'primary' :
                          parseFloat(student.cgpa) >= 5.0 ? 'warning' : 'error'
                        }
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Credits
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.total_credits || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Completed Credits
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.completed_credits || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Achievements
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.achievements?.length || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Certifications
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.certifications?.length || 0}
                      </Typography>
                    </Grid>

                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="student details tabs">
              <Tab icon={<SchoolIcon />} iconPosition="start" label="Grades" />
              <Tab icon={<AchievementsIcon />} iconPosition="start" label="Achievements" />
              <Tab icon={<CertificationsIcon />} iconPosition="start" label="Certifications" />
              <Tab icon={<AssessmentIcon />} iconPosition="start" label="Attendance" />
              <Tab icon={<CounselingIcon />} iconPosition="start" label="Counseling Notes" />
            </Tabs>
          </Box>
          
          {/* Grades Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Academic Performance</Typography>
              
              {student.grades && student.grades.length > 0 ? (
                <>
                  <Box sx={{ height: 300, mb: 4 }}>
                    <Line 
                      data={preparePerformanceData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: false,
                            min: 0,
                            max: 10,
                            ticks: {
                              stepSize: 2
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Semester Filter - Moved below the chart */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Filter by Semester</InputLabel>
                      <Select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        label="Filter by Semester"
                      >
                        <MenuItem value="all">All Semesters</MenuItem>
                        {Array.from(new Set(student.grades?.map(grade => grade.course_semester).filter(Boolean) || []))
                          .sort((a, b) => a - b)
                          .map(sem => (
                            <MenuItem key={sem} value={sem}>{sem} Semester</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Subject</TableCell>
                          <TableCell>Semester</TableCell>
                          <TableCell>Grade</TableCell>
                          <TableCell>Grade Point</TableCell>
                          <TableCell>Credits</TableCell>
                          <TableCell align="center">Excellence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {student.grades
                          .filter(grade => selectedSemester === 'all' || grade.course_semester === parseInt(selectedSemester))
                          .map((grade, index) => (
                          <TableRow key={index}>
                            <TableCell>{grade.course_name || grade.subject || grade.course_code || 'N/A'}</TableCell>
                            <TableCell>{grade.course_semester || 'N/A'}</TableCell>
                            <TableCell>{grade.grade || 'N/A'}</TableCell>
                            <TableCell>{(grade.grade_points || grade.grade_point) ? (grade.grade_points || grade.grade_point).toFixed(2) : 'N/A'}</TableCell>
                            <TableCell>{grade.credits !== undefined && grade.credits !== null ? grade.credits : 
                                       (grade.credits_obtained !== undefined && grade.credits_obtained !== null ? grade.credits_obtained : 'N/A')}</TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={
                                  (grade.grade_points || grade.grade_point) >= 9.0 ? 'Excellent' :
                                  (grade.grade_points || grade.grade_point) >= 8.0 ? 'Very Good' :
                                  (grade.grade_points || grade.grade_point) >= 7.0 ? 'Good' :
                                  (grade.grade_points || grade.grade_point) >= 6.0 ? 'Average' : 'Needs Improvement'
                                }
                                color={
                                  (grade.grade_points || grade.grade_point) >= 9.0 ? 'success' :
                                  (grade.grade_points || grade.grade_point) >= 8.0 ? 'primary' :
                                  (grade.grade_points || grade.grade_point) >= 7.0 ? 'info' :
                                  (grade.grade_points || grade.grade_point) >= 6.0 ? 'warning' : 'error'
                                }
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Alert severity="info">No grades available</Alert>
              )}
            </Box>
          )}
          
          {/* Achievements Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Achievements</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('achievement')}
                >
                  Add Achievement
                </Button>
              </Box>
              
              {student.achievements && student.achievements.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Scope</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {student.achievements.map((achievement) => (
                        <TableRow key={achievement.id}>
                          <TableCell>{achievement.title}</TableCell>
                          <TableCell>
                            <Chip 
                              label={achievement.category || 'General'} 
                              size="small"
                              color={
                                achievement.category === 'Academic' ? 'primary' :
                                achievement.category === 'Sports' ? 'success' :
                                achievement.category === 'Cultural' ? 'secondary' : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={achievement.scope || 'Inside the College'} 
                              size="small"
                              color={achievement.scope === 'Outside the College' ? 'info' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            {achievement.achievement_date || 'N/A'}
                          </TableCell>
                          <TableCell>{achievement.description}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenDialog('achievement', achievement)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete('achievement', achievement.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No achievements available</Alert>
              )}
            </Box>
          )}
          
          {/* Certifications Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Certifications</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('certification')}
                >
                  Add Certification
                </Button>
              </Box>
              
              {student.certifications && student.certifications.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Issuing Organization</TableCell>
                        <TableCell>Issue Date</TableCell>
                        <TableCell>Expiry Date</TableCell>
                        <TableCell>Credential ID</TableCell>
                        <TableCell>Verification</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {student.certifications.map((certification) => (
                        <TableRow key={certification.id}>
                          <TableCell>{certification.title}</TableCell>
                          <TableCell>{certification.issuing_organization}</TableCell>
                          <TableCell>
                            {new Date(certification.issue_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {certification.expiry_date ? 
                              new Date(certification.expiry_date).toLocaleDateString() : 
                              'No Expiry'
                            }
                          </TableCell>
                          <TableCell>{certification.credential_id}</TableCell>
                          <TableCell>
                            <Chip 
                              label={certification.verified ? "Verified" : "Not Verified"}
                              color={certification.verified ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenDialog('certification', certification)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete('certification', certification.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No certifications available</Alert>
              )}
            </Box>
          )}
          
          {/* Attendance Tab */}
          {tabValue === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Attendance Records</Typography>
              
              {student.attendance && student.attendance.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Attendance Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {student.attendance.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '60%', mr: 1 }}>
                                <Box
                                  sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    position: 'relative',
                                    overflow: 'hidden'
                                  }}
                                >
                                  <Box
                                    sx={{
                                      height: '100%',
                                      width: `${record.attendance_percentage}%`,
                                      bgcolor: 
                                        record.attendance_percentage >= 75 ? 'success.main' :
                                        record.attendance_percentage >= 60 ? 'warning.main' : 'error.main',
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Typography variant="body2">
                                {record.attendance_percentage}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No attendance records available</Alert>
              )}
            </Box>
          )}
          
          {/* Counseling Notes Tab */}
          {tabValue === 4 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Counseling Notes</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('counseling')}
                >
                  Add Note
                </Button>
              </Box>
              
              {student.counselingNotes && student.counselingNotes.length > 0 ? (
                <List>
                  {student.counselingNotes.map((note) => (
                    <Paper key={note.id} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {new Date(note.counseling_date).toLocaleDateString()}
                        </Typography>
                        <Box>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog('counseling', note)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete('counseling', note.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        By: {note.faculty_name}
                      </Typography>
                      <Typography variant="body1">
                        {note.note}
                      </Typography>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Alert severity="info">No counseling notes available</Alert>
              )}
            </Box>
          )}
        </Paper>
      </motion.div>

      {/* Dialog for adding/editing items */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'achievement' && (dialogData.id ? 'Edit Achievement' : 'Add Achievement')}
          {dialogType === 'certification' && (dialogData.id ? 'Edit Certification' : 'Add Certification')}
          {dialogType === 'counseling' && (dialogData.id ? 'Edit Counseling Note' : 'Add Counseling Note')}
        </DialogTitle>
        <DialogContent>
          {/* Achievement Form */}
          {dialogType === 'achievement' && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Title"
                  fullWidth
                  value={dialogData.title || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="category"
                  label="Category"
                  fullWidth
                  select
                  value={dialogData.category || 'General'}
                  onChange={handleInputChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="General">General</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="scope"
                  label="Scope"
                  fullWidth
                  select
                  value={dialogData.scope || 'Inside the College'}
                  onChange={handleInputChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Inside the College">Inside the College</option>
                  <option value="Outside the College">Outside the College</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="achievement_date"
                  label="Achievement Date (DD/MM/YYYY)"
                  fullWidth
                  value={dialogData.achievement_date || ''}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={dialogData.description || ''}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          )}
          
          {/* Certification Form */}
          {dialogType === 'certification' && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="title"
                  label="Title"
                  fullWidth
                  value={dialogData.title || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="issuing_organization"
                  label="Issuing Organization"
                  fullWidth
                  value={dialogData.issuing_organization || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="issue_date"
                  label="Issue Date (DD/MM/YYYY)"
                  fullWidth
                  value={dialogData.issue_date || ''}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="expiry_date"
                  label="Expiry Date (DD/MM/YYYY)"
                  fullWidth
                  value={dialogData.expiry_date || ''}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="credential_id"
                  label="Credential ID"
                  fullWidth
                  value={dialogData.credential_id || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="certificate_url"
                  label="Certificate URL"
                  fullWidth
                  value={dialogData.certificate_url || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={dialogData.description || ''}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          )}
          
          {/* Counseling Note Form */}
          {dialogType === 'counseling' && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="counselingDate"
                  label="Date"
                  type="date"
                  fullWidth
                  value={dialogData.counselingDate || new Date().toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="note"
                  label="Note"
                  fullWidth
                  multiline
                  rows={6}
                  value={dialogData.note || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveDialog} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default StudentDetail;