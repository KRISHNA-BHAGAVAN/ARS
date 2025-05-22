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
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { api } from '../../services/api_enhanced';

const InstitutionOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [institutionData, setInstitutionData] = useState({
    name: '',
    established: '',
    location: '',
    accreditation: '',
    totalStudents: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    avgCGPA: 0,
    passRate: 0,
    achievements: 0,
    certifications: 0,
    researchPapers: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [yearlyPerformance, setYearlyPerformance] = useState([]);
  const [achievementData, setAchievementData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock institution data
        const mockInstitutionData = {
          name: 'Automated Reporting System Institute of Technology',
          established: '1985',
          location: 'Hyderabad, India',
          accreditation: 'NAAC A++',
          totalStudents: 5240,
          totalFaculty: 245,
          totalDepartments: 8,
          avgCGPA: 7.6,
          passRate: 92,
          achievements: 425,
          certifications: 780,
          researchPapers: 156
        };
        
        // Mock department data
        const mockDepartmentData = [
          { id: 1, name: 'Computer Science', code: 'CSE', students: 1245, faculty: 68, avgCGPA: 7.9, passRate: 94, hod: 'Dr. Rajesh Kumar' },
          { id: 2, name: 'Electronics & Communication', code: 'ECE', students: 980, faculty: 52, avgCGPA: 7.5, passRate: 91, hod: 'Dr. Priya Sharma' },
          { id: 3, name: 'Mechanical Engineering', code: 'MECH', students: 850, faculty: 45, avgCGPA: 7.3, passRate: 89, hod: 'Dr. Suresh Patel' },
          { id: 4, name: 'Civil Engineering', code: 'CIVIL', students: 720, faculty: 38, avgCGPA: 7.4, passRate: 90, hod: 'Dr. Anita Desai' },
          { id: 5, name: 'Electrical Engineering', code: 'EEE', students: 680, faculty: 36, avgCGPA: 7.6, passRate: 92, hod: 'Dr. Vikram Singh' },
          { id: 6, name: 'Information Technology', code: 'IT', students: 420, faculty: 22, avgCGPA: 7.8, passRate: 93, hod: 'Dr. Neha Gupta' },
          { id: 7, name: 'Artificial Intelligence & ML', code: 'AIML', students: 245, faculty: 15, avgCGPA: 8.1, passRate: 95, hod: 'Dr. Amit Verma' },
          { id: 8, name: 'Data Science', code: 'DS', students: 100, faculty: 8, avgCGPA: 8.2, passRate: 96, hod: 'Dr. Sanjay Mehta' }
        ];
        
        // Mock yearly performance data
        const mockYearlyPerformance = [
          { year: '2019', avgCGPA: 7.2, passRate: 88, placements: 82, researchPapers: 95 },
          { year: '2020', avgCGPA: 7.3, passRate: 89, placements: 80, researchPapers: 105 },
          { year: '2021', avgCGPA: 7.4, passRate: 90, placements: 85, researchPapers: 120 },
          { year: '2022', avgCGPA: 7.5, passRate: 91, placements: 88, researchPapers: 135 },
          { year: '2023', avgCGPA: 7.6, passRate: 92, placements: 90, researchPapers: 156 }
        ];
        
        // Mock achievement data
        const mockAchievementData = [
          { type: 'academic', count: 185, percentage: 43.5 },
          { type: 'technical', count: 120, percentage: 28.2 },
          { type: 'sports', count: 75, percentage: 17.6 },
          { type: 'cultural', count: 45, percentage: 10.7 }
        ];
        
        setInstitutionData(mockInstitutionData);
        setDepartmentData(mockDepartmentData);
        setYearlyPerformance(mockYearlyPerformance);
        setAchievementData(mockAchievementData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load institution data. Please try again later.");
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
          Institution Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive view of {institutionData.name}
        </Typography>
      </Box>

      {/* Institution Info */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {institutionData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Established in {institutionData.established} • {institutionData.location}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Accreditation:</strong> {institutionData.accreditation}
                </Typography>
                <Typography variant="body1">
                  A premier institution focused on excellence in education, research, and innovation.
                  Our mission is to empower students with knowledge and skills to excel in their careers
                  and contribute to society.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  icon={<PeopleIcon />} 
                  label={`${institutionData.totalStudents} Students`} 
                  color="primary" 
                />
                <Chip 
                  icon={<SchoolIcon />} 
                  label={`${institutionData.totalFaculty} Faculty`} 
                  color="secondary" 
                />
                <Chip 
                  icon={<BusinessIcon />} 
                  label={`${institutionData.totalDepartments} Departments`} 
                  color="info" 
                />
                <Chip 
                  icon={<BarChartIcon />} 
                  label={`${institutionData.avgCGPA} Avg. CGPA`} 
                  color="success" 
                />
                <Chip 
                  icon={<TrendingUpIcon />} 
                  label={`${institutionData.passRate}% Pass Rate`} 
                  color="warning" 
                />
                <Chip 
                  icon={<EmojiEventsIcon />} 
                  label={`${institutionData.achievements} Achievements`} 
                  color="default" 
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Institution Stats */}
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
                      {institutionData.totalStudents}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +240
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
                      Research Papers
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {institutionData.researchPapers}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +21
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last year
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
                    <AccountBalanceIcon sx={{ color: '#b06ab3' }} fontSize="large" />
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
                      Certifications
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {institutionData.certifications}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +95
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this year
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
                    <SchoolIcon color="success" fontSize="large" />
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
                      Achievements
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {institutionData.achievements}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +65
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this year
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255, 152, 0, 0.1)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <EmojiEventsIcon sx={{ color: '#ff9800' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Institution Details Tabs */}
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
            <Tab label="Departments" />
            <Tab label="Yearly Performance" />
            <Tab label="Achievements" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {/* Departments Tab */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Department Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of all departments in the institution
                </Typography>
                
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>HoD</TableCell>
                        <TableCell align="center">Students</TableCell>
                        <TableCell align="center">Faculty</TableCell>
                        <TableCell align="center">Avg. CGPA</TableCell>
                        <TableCell align="center">Pass Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departmentData.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell component="th" scope="row">
                            {dept.name}
                          </TableCell>
                          <TableCell>{dept.code}</TableCell>
                          <TableCell>{dept.hod}</TableCell>
                          <TableCell align="center">{dept.students}</TableCell>
                          <TableCell align="center">{dept.faculty}</TableCell>
                          <TableCell align="center">{dept.avgCGPA}</TableCell>
                          <TableCell align="center">{dept.passRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    View Department Details
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* Yearly Performance Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Yearly Performance Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of institution performance over the years
                </Typography>
                
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell align="center">Average CGPA</TableCell>
                        <TableCell align="center">Pass Rate</TableCell>
                        <TableCell align="center">Placement %</TableCell>
                        <TableCell align="center">Research Papers</TableCell>
                        <TableCell align="center">Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {yearlyPerformance.map((year) => (
                        <TableRow key={year.year}>
                          <TableCell component="th" scope="row">
                            {year.year}
                          </TableCell>
                          <TableCell align="center">{year.avgCGPA}</TableCell>
                          <TableCell align="center">{year.passRate}%</TableCell>
                          <TableCell align="center">{year.placements}%</TableCell>
                          <TableCell align="center">{year.researchPapers}</TableCell>
                          <TableCell align="center">
                            <TrendingUpIcon color="success" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    Generate Trend Report
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* Achievements Tab */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Achievement Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of student achievements across different categories
                </Typography>
                
                <Grid container spacing={3}>
                  {achievementData.map((achievement) => (
                    <Grid item xs={12} sm={6} md={3} key={achievement.type}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {achievement.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.percentage}% of total
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
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
                <BusinessIcon />
                <Typography>Manage Departments</Typography>
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
                <Typography>Performance Report</Typography>
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
                <Typography>Academic Calendar</Typography>
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
                <AccountBalanceIcon />
                <Typography>Strategic Plan</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default InstitutionOverview;