import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const InternshipTrackingReport = ({ data }) => {
  const [tabValue, setTabValue] = React.useState(0);
  
  if (!data) return null;
  
  const {
    student,
    internships,
    projects,
    byStatus,
    metrics,
    visualData
  } = data;
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Status Distribution'
      }
    }
  };
  
  const skillChartOptions = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Skill Development'
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'planned':
        return 'primary';
      case 'ongoing':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'planned':
        return '🔍';
      case 'ongoing':
        return '🚀';
      case 'completed':
        return '✅';
      default:
        return '❓';
    }
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Internship & Project Tracking Report
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Student:</strong> {student.name} ({student.registered_no})
              </Typography>
              <Typography variant="subtitle1">
                <strong>Branch:</strong> {student.branch}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Current Semester:</strong> {student.curr_semester}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary">
                Summary
              </Typography>
              <Typography variant="body1">
                <strong>Total Items:</strong> {metrics.totalItems}
              </Typography>
              <Typography variant="body1">
                <strong>Total Credits:</strong> {metrics.totalCredits}
              </Typography>
              <Typography variant="body1">
                <strong>Completed Credits:</strong> {metrics.completedCredits}
              </Typography>
              <Typography variant="body1">
                <strong>Average Grade Points:</strong> {metrics.averageGradePoints}
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Status Distribution
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Doughnut data={visualData.statusDistribution} options={statusChartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Skill Development
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Radar data={visualData.skillDevelopment} options={skillChartOptions} />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="All" />
            <Tab label="Internships" />
            <Tab label="Projects" />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                All Internships & Projects
              </Typography>
              
              {metrics.totalItems > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Organization</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...internships, ...projects].map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Chip 
                              label={item.type.charAt(0).toUpperCase() + item.type.slice(1)} 
                              color={item.type === 'internship' ? 'primary' : 'secondary'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.organization}</TableCell>
                          <TableCell>
                            {formatDate(item.start_date)} - {formatDate(item.end_date)}
                          </TableCell>
                          <TableCell>{item.credits}</TableCell>
                          <TableCell>{item.grade || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${getStatusIcon(item.status)} ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`} 
                              color={getStatusColor(item.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No internships or projects found.
                </Alert>
              )}
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Internships
              </Typography>
              
              {internships.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Organization</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {internships.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.organization}</TableCell>
                          <TableCell>
                            {formatDate(item.start_date)} - {formatDate(item.end_date)}
                          </TableCell>
                          <TableCell>{item.credits}</TableCell>
                          <TableCell>{item.grade || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${getStatusIcon(item.status)} ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`} 
                              color={getStatusColor(item.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No internships found.
                </Alert>
              )}
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Projects
              </Typography>
              
              {projects.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Organization</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projects.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.organization}</TableCell>
                          <TableCell>
                            {formatDate(item.start_date)} - {formatDate(item.end_date)}
                          </TableCell>
                          <TableCell>{item.credits}</TableCell>
                          <TableCell>{item.grade || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${getStatusIcon(item.status)} ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`} 
                              color={getStatusColor(item.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No projects found.
                </Alert>
              )}
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Status Breakdown
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Planned
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {byStatus.planned.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items scheduled for future
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ bgcolor: '#fff8e1', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Ongoing
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {byStatus.ongoing.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items currently in progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    Completed
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {byStatus.completed.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items successfully completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InternshipTrackingReport;