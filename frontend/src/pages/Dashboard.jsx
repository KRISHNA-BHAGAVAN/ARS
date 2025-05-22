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
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import CollegeLogo from '../components/CollegeLogo';
import PerformanceChart from '../components/charts/PerformanceChart';
import BranchDistributionChart from '../components/charts/BranchDistributionChart';
import RecentReportsTable from '../components/RecentReportsTable';
import NotificationsList from '../components/NotificationsList';
import { api } from '../services/api_enhanced';

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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgCGPA: 0,
    reportsGenerated: 0,
    atRiskStudents: 0,
    branchCount: 0
  });
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: [
      {
        label: "Average SGPA",
        data: [],
        borderColor: "#4568dc",
        backgroundColor: "rgba(69, 104, 220, 0.2)",
        fill: true
      },
      {
        label: "Pass Percentage",
        data: [],
        borderColor: "#b06ab3",
        backgroundColor: "rgba(176, 106, 179, 0.2)",
        fill: true
      }
    ]
  });
  const [branchDistribution, setBranchDistribution] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  });
  const [recentReports, setRecentReports] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [statsData, performanceData, branchData, reportsData, notificationsData] = await Promise.all([
          api.getDashboardStats().catch(err => {
            console.error("Error fetching stats:", err);
            return {
              totalStudents: 0,
              avgCGPA: 0,
              reportsGenerated: 0,
              atRiskStudents: 0,
              branchCount: 0,
              branches: []
            };
          }),
          api.getPerformanceData().catch(err => {
            console.error("Error fetching performance data:", err);
            return {
              labels: [],
              datasets: [
                {
                  label: "Average SGPA",
                  data: [],
                  borderColor: "#4568dc",
                  backgroundColor: "rgba(69, 104, 220, 0.2)",
                  fill: true
                },
                {
                  label: "Pass Percentage",
                  data: [],
                  borderColor: "#b06ab3",
                  backgroundColor: "rgba(176, 106, 179, 0.2)",
                  fill: true
                }
              ]
            };
          }),
          api.getBranchDistribution().catch(err => {
            console.error("Error fetching branch distribution:", err);
            return {
              labels: [],
              datasets: [{
                data: [],
                backgroundColor: []
              }]
            };
          }),
          api.getRecentReports().catch(err => {
            console.error("Error fetching recent reports:", err);
            return [];
          }),
          api.getNotifications().catch(err => {
            console.error("Error fetching notifications:", err);
            return [];
          })
        ]);
        
        setStats(statsData);
        setPerformanceData(performanceData);
        setBranchDistribution(branchData);
        setRecentReports(reportsData);
        setNotifications(notificationsData);
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
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CollegeLogo size="small" showName={false} />
          <Typography variant="h4" component="h1" sx={{ ml: 2, fontWeight: 'bold' }}>
            Dashboard
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AssessmentIcon />}
          sx={{
            background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
            boxShadow: '0 3px 5px 2px rgba(69, 104, 220, .3)',
          }}
        >
          Generate New Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                        +4.6%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last semester
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

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Average CGPA
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.avgCGPA}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +0.3
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last semester
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
            </StatsCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Reports Generated
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {stats.reportsGenerated}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +12%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this month
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
                    <AssessmentIcon color="success" fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </StatsCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                        -8%
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
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <ChartContainer sx={{ height: 350 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Performance Trends
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                <PerformanceChart data={performanceData} />
              </Box>
            </ChartContainer>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <ChartContainer sx={{ height: 350 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Branch Distribution
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                <BranchDistributionChart data={branchDistribution} />
              </Box>
            </ChartContainer>
          </motion.div>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Reports */}
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <ChartContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Recent Reports
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <RecentReportsTable reports={recentReports} />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="primary">View All Reports</Button>
              </Box>
            </ChartContainer>
          </motion.div>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <ChartContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Notifications
                </Typography>
                <Tooltip title="Mark all as read">
                  <IconButton size="small">
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <NotificationsList notifications={notifications} />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="primary">View All</Button>
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
                    <AssessmentIcon />
                    <Typography>Academic Reports</Typography>
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
                    <PeopleIcon />
                    <Typography>Student Directory</Typography>
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
                    <TrendingUpIcon />
                    <Typography>Performance Analytics</Typography>
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

export default Dashboard;