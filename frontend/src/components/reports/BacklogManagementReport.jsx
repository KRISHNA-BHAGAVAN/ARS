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
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import PendingIcon from '@mui/icons-material/Pending';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BacklogManagementReport = ({ data }) => {
  if (!data) return null;
  
  const {
    student,
    backlogsByStatus,
    totalBacklogs,
    pendingBacklogs,
    clearedBacklogs,
    graduationImpact,
    studyPlan,
    visualData
  } = data;
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Backlog Status Distribution'
      }
    }
  };
  
  const attemptChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attempt Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Courses'
        }
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
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Backlog Management Report
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
                Backlog Summary
              </Typography>
              <Typography variant="body1">
                <strong>Total Backlogs:</strong> {totalBacklogs}
              </Typography>
              <Typography variant="body1">
                <strong>Pending Backlogs:</strong> {pendingBacklogs}
              </Typography>
              <Typography variant="body1">
                <strong>Cleared Backlogs:</strong> {clearedBacklogs}
              </Typography>
            </Grid>
          </Grid>
          
          <Alert 
            severity={graduationImpact.backlogDelaySemesters > 0 ? "warning" : "success"}
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle1">
              Graduation Impact
            </Typography>
            <Typography variant="body2">
              Normal graduation expected after semester {graduationImpact.normalGraduationSemester}.
              {graduationImpact.backlogDelaySemesters > 0 ? (
                ` Due to backlogs, graduation may be delayed by ${graduationImpact.backlogDelaySemesters} semester(s) to semester ${graduationImpact.projectedGraduationSemester}.`
              ) : (
                " You are on track to graduate on time."
              )}
            </Typography>
          </Alert>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Backlog Status Distribution
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Doughnut data={visualData.statusDistribution} options={chartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Attempt Distribution
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Bar data={visualData.attemptDistribution} options={attemptChartOptions} />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Pending Backlogs
          </Typography>
          
          {backlogsByStatus.pending.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Credits</TableCell>
                    <TableCell>Semester Failed</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Next Attempt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {backlogsByStatus.pending.map((backlog) => (
                    <TableRow key={backlog.id}>
                      <TableCell>{backlog.course_code}</TableCell>
                      <TableCell>{backlog.course_name}</TableCell>
                      <TableCell>{backlog.credits}</TableCell>
                      <TableCell>{backlog.semester_failed}</TableCell>
                      <TableCell>
                        <Chip 
                          label={backlog.attempts} 
                          color={backlog.attempts > 1 ? "warning" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(backlog.next_attempt_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="success" sx={{ mb: 3 }}>
              No pending backlogs.
            </Alert>
          )}
          
          <Typography variant="h6" gutterBottom>
            Registered Backlogs
          </Typography>
          
          {backlogsByStatus.registered.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Credits</TableCell>
                    <TableCell>Semester Failed</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Next Attempt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {backlogsByStatus.registered.map((backlog) => (
                    <TableRow key={backlog.id}>
                      <TableCell>{backlog.course_code}</TableCell>
                      <TableCell>{backlog.course_name}</TableCell>
                      <TableCell>{backlog.credits}</TableCell>
                      <TableCell>{backlog.semester_failed}</TableCell>
                      <TableCell>
                        <Chip 
                          label={backlog.attempts} 
                          color={backlog.attempts > 1 ? "warning" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(backlog.next_attempt_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              No registered backlogs.
            </Alert>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Recommended Study Plan
          </Typography>
          
          {studyPlan.length > 0 ? (
            <List>
              {studyPlan.map((plan, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {plan.priority === 'High' ? (
                      <PriorityHighIcon color="error" />
                    ) : (
                      <EventIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${plan.course_code} - ${plan.course_name}`}
                    secondary={`${plan.recommendation} Priority: ${plan.priority}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No study plan recommendations available.
            </Alert>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Cleared Backlogs
          </Typography>
          
          {backlogsByStatus.cleared.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Credits</TableCell>
                    <TableCell>Semester Failed</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {backlogsByStatus.cleared.map((backlog) => (
                    <TableRow key={backlog.id}>
                      <TableCell>{backlog.course_code}</TableCell>
                      <TableCell>{backlog.course_name}</TableCell>
                      <TableCell>{backlog.credits}</TableCell>
                      <TableCell>{backlog.semester_failed}</TableCell>
                      <TableCell>{backlog.attempts}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={<AssignmentTurnedInIcon />} 
                          label="Cleared" 
                          color="success" 
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
              No cleared backlogs.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BacklogManagementReport;