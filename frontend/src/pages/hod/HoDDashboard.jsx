import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';

import { api } from '../../services/api_enhanced';

// Styled components
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const HoDDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    avgCGPA: 0,
    atRiskStudents: 0,
    passPercentage: 0,
    achievements: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [facultyPerformance, setFacultyPerformance] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalStudents: 245,
          totalFaculty: 12,
          avgCGPA: 7.6,
          atRiskStudents: 18,
          passPercentage: 92,
          achievements: 78
        });
        
        setRecentActivities([
          { id: 1, type: 'faculty', name: 'Dr. Sharma', action: 'Added 5 new achievements', time: '2 hours ago' },
          { id: 2, type: 'report', action: 'Department performance report generated', time: 'Yesterday' },
          { id: 3, type: 'student', name: 'Anusuri Bharathi', action: 'Won national coding competition', time: '2 days ago' },
          { id: 4, type: 'course', name: 'Machine Learning', action: 'Course completion rate improved by 8%', time: '3 days ago' }
        ]);
        
        setFacultyPerformance([
          { id: 1, name: 'Dr. Sharma', students: 45, avgStudentCGPA: 8.2, achievements: 23, status: 'Excellent' },
          { id: 2, name: 'Prof. Patel', students: 38, avgStudentCGPA: 7.8, achievements: 18, status: 'Good' },
          { id: 3, name: 'Dr. Gupta', students: 42, avgStudentCGPA: 7.5, achievements: 15, status: 'Good' },
          { id: 4, name: 'Prof. Singh', students: 40, avgStudentCGPA: 6.9, achievements: 12, status: 'Average' },
          { id: 5, name: 'Dr. Kumar', students: 35, avgStudentCGPA: 7.1, achievements: 10, status: 'Good' }
        ]);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)' 
      }}>
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
          Department Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's an overview of your department's performance.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Students
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.totalStudents}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +15
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this semester
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
            </StatsCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Faculty Members
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.totalFaculty}
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
                    <GroupIcon sx={{ color: '#b06ab3' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </StatsCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Department Avg. CGPA
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.avgCGPA}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +0.2
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last semester
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
            </StatsCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      At-Risk Students
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.atRiskStudents}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingDownIcon color="error" fontSize="small" />
                      <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                        -5
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last semester
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(244, 67, 54, 0.1)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <WarningIcon color="error" fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </StatsCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Pass Percentage
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.passPercentage}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +3%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last semester
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
                    <BarChartIcon sx={{ color: '#2196f3' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </StatsCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Achievements
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.achievements}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +12
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this semester
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
                    <BusinessIcon sx={{ color: '#ff9800' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </StatsCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Faculty Performance */}
        <Grid item xs={12} md={7}>
          <motion.div variants={itemVariants}>
            <ChartContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Faculty Performance
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Faculty Name</TableCell>
                      <TableCell align="center">Students</TableCell>
                      <TableCell align="center">Avg. CGPA</TableCell>
                      <TableCell align="center">Achievements</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facultyPerformance.map((faculty) => (
                      <TableRow key={faculty.id}>
                        <TableCell component="th" scope="row">
                          {faculty.name}
                        </TableCell>
                        <TableCell align="center">{faculty.students}</TableCell>
                        <TableCell align="center">{faculty.avgStudentCGPA}</TableCell>
                        <TableCell align="center">{faculty.achievements}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={faculty.status} 
                            color={
                              faculty.status === 'Excellent' ? 'success' :
                              faculty.status === 'Good' ? 'primary' :
                              faculty.status === 'Average' ? 'warning' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="primary">View All Faculty</Button>
              </Box>
            </ChartContainer>
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={5}>
          <motion.div variants={itemVariants}>
            <ChartContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Recent Activity
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {recentActivities.map((activity) => (
                  <ListItem
                    key={activity.id}
                    alignItems="flex-start"
                    sx={{ px: 0, py: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: 
                          activity.type === 'faculty' ? 'primary.light' : 
                          activity.type === 'student' ? 'success.light' : 
                          activity.type === 'report' ? 'info.light' : 
                          'warning.light'
                      }}>
                        {activity.type === 'faculty' && <GroupIcon />}
                        {activity.type === 'student' && <PeopleIcon />}
                        {activity.type === 'report' && <AssessmentIcon />}
                        {activity.type === 'course' && <SchoolIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          {activity.name && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {activity.name}
                            </Typography>
                          )}
                          {activity.name && " - "}
                          {activity.action}
                        </>
                      }
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="primary">View All Activities</Button>
              </Box>
            </ChartContainer>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
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
                    <GroupIcon />
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
                    <AssessmentIcon />
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
                    <WarningIcon />
                    <Typography>At-Risk Students</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default HoDDashboard;