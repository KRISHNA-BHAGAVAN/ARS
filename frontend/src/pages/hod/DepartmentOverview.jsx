import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { api } from '../../services/api_enhanced';

const DepartmentOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [departmentData, setDepartmentData] = useState({
    name: '',
    code: '',
    students: 0,
    faculty: 0,
    avgCGPA: 0,
    passRate: 0,
    achievements: 0,
    certifications: 0,
    atRiskStudents: 0
  });
  const [semesterPerformance, setSemesterPerformance] = useState([]);
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [studentDistribution, setStudentDistribution] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock department data
        const mockDepartmentData = {
          name: 'Artificial Intelligence & Machine Learning',
          code: 'AIML',
          students: 245,
          faculty: 12,
          avgCGPA: 7.6,
          passRate: 92,
          achievements: 78,
          certifications: 65,
          atRiskStudents: 18
        };
        
        // Mock semester performance data
        const mockSemesterPerformance = [
          { semester: 1, avgSGPA: 8.2, passRate: 95, atRiskCount: 3, topPerformer: 'Anusuri Bharathi' },
          { semester: 2, avgSGPA: 7.9, passRate: 93, atRiskCount: 5, topPerformer: 'Akella Venkata' },
          { semester: 3, avgSGPA: 7.7, passRate: 91, atRiskCount: 7, topPerformer: 'Bandi Niharika Devi' },
          { semester: 4, avgSGPA: 7.5, passRate: 90, atRiskCount: 8, topPerformer: 'Anusuri Bharathi' },
          { semester: 5, avgSGPA: 7.4, passRate: 89, atRiskCount: 10, topPerformer: 'Battu Vijaya Chandra' },
          { semester: 6, avgSGPA: 7.6, passRate: 92, atRiskCount: 8, topPerformer: 'Anusuri Bharathi' }
        ];
        
        // Mock course performance data
        const mockCoursePerformance = [
          { code: 'AIML301', name: 'Machine Learning', avgGrade: 8.1, passRate: 94, difficulty: 'Medium' },
          { code: 'AIML302', name: 'Deep Learning', avgGrade: 7.5, passRate: 88, difficulty: 'High' },
          { code: 'AIML303', name: 'Computer Vision', avgGrade: 7.8, passRate: 90, difficulty: 'High' },
          { code: 'AIML304', name: 'Natural Language Processing', avgGrade: 7.2, passRate: 85, difficulty: 'High' },
          { code: 'AIML305', name: 'Data Mining', avgGrade: 8.3, passRate: 96, difficulty: 'Medium' },
          { code: 'AIML306', name: 'Big Data Analytics', avgGrade: 7.9, passRate: 92, difficulty: 'Medium' },
          { code: 'AIML307', name: 'Reinforcement Learning', avgGrade: 7.0, passRate: 82, difficulty: 'Very High' },
          { code: 'AIML308', name: 'AI Ethics', avgGrade: 8.5, passRate: 98, difficulty: 'Low' }
        ];
        
        // Mock student distribution data
        const mockStudentDistribution = [
          { semester: 1, count: 50, maleCount: 30, femaleCount: 20 },
          { semester: 2, count: 48, maleCount: 28, femaleCount: 20 },
          { semester: 3, count: 45, maleCount: 26, femaleCount: 19 },
          { semester: 4, count: 42, maleCount: 24, femaleCount: 18 },
          { semester: 5, count: 40, maleCount: 23, femaleCount: 17 },
          { semester: 6, count: 38, maleCount: 22, femaleCount: 16 },
          { semester: 7, count: 35, maleCount: 20, femaleCount: 15 },
          { semester: 8, count: 32, maleCount: 18, femaleCount: 14 }
        ];
        
        setDepartmentData(mockDepartmentData);
        setSemesterPerformance(mockSemesterPerformance);
        setCoursePerformance(mockCoursePerformance);
        setStudentDistribution(mockStudentDistribution);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load department data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          Department Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive view of {departmentData.name} ({departmentData.code}) department
        </Typography>
      </Box>

      {/* Department Stats */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Students
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentData.students}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +15
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this year
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(69, 104, 220, 0.1)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PeopleIcon color="primary" fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Faculty Members
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentData.faculty}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +2
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this year
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(176, 106, 179, 0.1)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SchoolIcon sx={{ color: '#b06ab3' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Average CGPA
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentData.avgCGPA}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +0.2
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last year
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BarChartIcon color="success" fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Pass Rate
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentData.passRate}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +3%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last year
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(33, 150, 243, 0.1)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUpIcon sx={{ color: '#2196f3' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Department Details Tabs */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Semester Performance" />
            <Tab label="Course Analysis" />
            <Tab label="Student Distribution" />
            <Tab label="Achievements & Certifications" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {/* Semester Performance Tab */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Semester-wise Performance Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of student performance across different semesters
                </Typography>
                
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Semester</TableCell>
                        <TableCell align="center">Average SGPA</TableCell>
                        <TableCell align="center">Pass Rate</TableCell>
                        <TableCell align="center">At-Risk Students</TableCell>
                        <TableCell>Top Performer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {semesterPerformance.map((semester) => (
                        <TableRow key={semester.semester}>
                          <TableCell component="th" scope="row">
                            Semester {semester.semester}
                          </TableCell>
                          <TableCell align="center">{semester.avgSGPA}</TableCell>
                          <TableCell align="center">{semester.passRate}%</TableCell>
                          <TableCell align="center">{semester.atRiskCount}</TableCell>
                          <TableCell>{semester.topPerformer}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    Generate Detailed Report
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* Course Analysis Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Course Performance Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of student performance across different courses
                </Typography>
                
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell align="center">Average Grade</TableCell>
                        <TableCell align="center">Pass Rate</TableCell>
                        <TableCell align="center">Difficulty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coursePerformance.map((course) => (
                        <TableRow key={course.code}>
                          <TableCell component="th" scope="row">
                            {course.code}
                          </TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell align="center">{course.avgGrade}</TableCell>
                          <TableCell align="center">{course.passRate}%</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={course.difficulty} 
                              color={
                                course.difficulty === 'Low' ? 'success' :
                                course.difficulty === 'Medium' ? 'primary' :
                                course.difficulty === 'High' ? 'warning' :
                                'error'
                              } 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    Generate Course Report
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* Student Distribution Tab */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Student Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Distribution of students across semesters and gender
                </Typography>
                
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Semester</TableCell>
                        <TableCell align="center">Total Students</TableCell>
                        <TableCell align="center">Male</TableCell>
                        <TableCell align="center">Female</TableCell>
                        <TableCell align="center">Gender Ratio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentDistribution.map((semester) => (
                        <TableRow key={semester.semester}>
                          <TableCell component="th" scope="row">
                            Semester {semester.semester}
                          </TableCell>
                          <TableCell align="center">{semester.count}</TableCell>
                          <TableCell align="center">{semester.maleCount}</TableCell>
                          <TableCell align="center">{semester.femaleCount}</TableCell>
                          <TableCell align="center">
                            {semester.maleCount}:{semester.femaleCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    Generate Demographics Report
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* Achievements & Certifications Tab */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Achievements & Certifications
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of student achievements and certifications
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            Achievements
                          </Typography>
                          <EmojiEventsIcon color="primary" />
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Achievements
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {departmentData.achievements}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            <strong>Academic:</strong> 32
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Technical:</strong> 25
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Sports:</strong> 12
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Cultural:</strong> 9
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            Certifications
                          </Typography>
                          <SchoolIcon color="secondary" />
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Certifications
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {departmentData.certifications}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            <strong>Technical:</strong> 38
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Professional:</strong> 15
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Language:</strong> 8
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Soft Skills:</strong> 4
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    View All Achievements
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
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
                <PeopleIcon />
                <Typography>Manage Faculty</Typography>
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
                <Typography>Course Analytics</Typography>
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
                <Typography>Generate Report</Typography>
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
                <EmojiEventsIcon />
                <Typography>Achievements</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default DepartmentOverview;