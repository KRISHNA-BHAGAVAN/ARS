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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import NotificationsIcon from '@mui/icons-material/Notifications';
// Components
import DashboardMenu from '../../components/DashboardMenu';
// Charts
import { Line, Bar, Doughnut } from 'react-chartjs-2';
// Import pre-configured Chart.js instance
import ChartJS from '../../utils/chartConfig';
// Import faculty API
import { facultyApi } from '../../services/faculty-api';

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const FacultyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      avgCGPA: 0,
      achievements: 0,
      certifications: 0,
      atRiskStudents: 0,
      attendanceRate: 0
    },
    recentActivities: [],
    studentPerformance: {
      labels: [],
      datasets: []
    },
    attendanceData: {
      labels: [],
      datasets: []
    },
    subjectDistribution: {
      labels: [],
      datasets: []
    },
    topStudents: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get dashboard data from API
        const data = await facultyApi.getDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        
        // Fallback to mock data if API call fails
        setDashboardData({
          stats: {
            totalStudents: 120,
            avgCGPA: 3.8,
            achievements: 45,
            certifications: 32,
            atRiskStudents: 8,
            attendanceRate: 92
          },
          recentActivities: [
            { id: 1, type: 'achievement', student: 'Anusuri Bharathi', title: 'Won coding competition', date: '2024-05-15' },
            { id: 2, type: 'certification', student: 'Akella Venkata', title: 'AWS Certified Developer', date: '2024-05-10' },
            { id: 3, type: 'grade', student: 'Ari Naresh', title: 'Scored 9.5 in Machine Learning', date: '2024-05-05' },
            { id: 4, type: 'attendance', student: 'Arugollu Lalu Prasad', title: 'Perfect attendance for May', date: '2024-05-01' }
          ],
          studentPerformance: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
              {
                label: 'Average CGPA',
                data: [7.2, 7.4, 7.6, 7.7, 7.8],
                borderColor: '#4568dc',
                backgroundColor: 'rgba(69, 104, 220, 0.1)',
                fill: true,
                tension: 0.4
              }
            ]
          },
          attendanceData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
              {
                label: 'Attendance Rate (%)',
                data: [88, 90, 89, 91, 92],
                backgroundColor: '#4caf50',
                borderColor: '#388e3c',
                borderWidth: 1
              }
            ]
          },
          subjectDistribution: {
            labels: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'],
            datasets: [
              {
                data: [30, 45, 25, 15, 5],
                backgroundColor: ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'],
                borderWidth: 0
              }
            ]
          },
          topStudents: [
            { id: 1, name: 'Anusuri Bharathi', regNo: '22A91A6102', cgpa: 9.8, achievements: 5 },
            { id: 2, name: 'Akella Venkata', regNo: '22A91A6101', cgpa: 9.6, achievements: 4 },
            { id: 3, name: 'Ari Naresh', regNo: '22A91A6103', cgpa: 9.5, achievements: 3 },
            { id: 4, name: 'Arugollu Lalu Prasad', regNo: '22A91A6104', cgpa: 9.4, achievements: 3 },
            { id: 5, name: 'Ayushi Singh', regNo: '22A91A6105', cgpa: 9.3, achievements: 2 }
          ]
        });
        setError("Using offline data. Connection to server failed.");
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Render dashboard content
  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Faculty Dashboard
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AssessmentIcon />}
            onClick={() => window.location.href = '/faculty/reports'}
          >
            Generate Report
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <StatsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Students
                      </Typography>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        <PeopleIcon />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                      {dashboardData.stats.totalStudents}
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <StatsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Average CGPA
                      </Typography>
                      <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
                        <SchoolIcon />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                      {dashboardData.stats.avgCGPA}
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <StatsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Achievements
                      </Typography>
                      <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                        <EmojiEventsIcon />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                      {dashboardData.stats.achievements}
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <StatsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Certifications
                      </Typography>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                        <CardMembershipIcon />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                      {dashboardData.stats.certifications}
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              


            </Grid>
            
            {/* Dashboard Menu */}
            <DashboardMenu />
            
            {/* Charts and Tables */}
            <Grid container spacing={3}>
              {/* Student Performance Chart */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Student Performance Trend</Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <Line 
                      data={dashboardData.studentPerformance}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: false,
                            min: 5,
                            max: 10
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              
              {/* Recent Activities */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Recent Activities</Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {dashboardData.recentActivities.map((activity) => (
                      <ListItem key={activity.id} alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 
                            activity.type === 'achievement' ? 'success.main' : 
                            activity.type === 'certification' ? 'secondary.main' : 
                            activity.type === 'grade' ? 'info.main' : 'warning.main' 
                          }}>
                            {activity.type === 'achievement' ? <EmojiEventsIcon /> : 
                             activity.type === 'certification' ? <CardMembershipIcon /> : 
                             activity.type === 'grade' ? <SchoolIcon /> : <AssessmentIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {activity.student}
                              </Typography>
                              {` — ${new Date(activity.date).toLocaleDateString()}`}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              

              
              {/* Top Students */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Top Performing Students</Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Reg. No</TableCell>
                          <TableCell align="right">CGPA</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.topStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.regNo}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={student.cgpa} 
                                size="small" 
                                color={
                                  student.cgpa >= 9.0 ? 'success' : 
                                  student.cgpa >= 8.0 ? 'primary' : 
                                  'default'
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </motion.div>
    </Box>
  );
};

export default FacultyDashboard;