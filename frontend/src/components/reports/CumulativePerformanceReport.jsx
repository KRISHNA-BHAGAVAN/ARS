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
  Alert,
  LinearProgress
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

const CumulativePerformanceReport = ({ data }) => {
  if (!data) return null;
  
  const {
    student,
    cgpa,
    sgpaBySemseter,
    creditAccumulation,
    backlogsBySemester,
    totalPendingBacklogs,
    projectedGraduation,
    visualData,
    creditData
  } = data;
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'SGPA & CGPA Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  };
  
  const creditChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Credit Accumulation'
      }
    }
  };
  
  // Calculate total credits required for graduation (assuming 160 for B.Tech)
  const totalCreditsRequired = 160;
  const currentCredits = Object.values(creditAccumulation).length > 0 
    ? Object.values(creditAccumulation)[Object.values(creditAccumulation).length - 1].cumulative_credits 
    : 0;
  const creditProgress = (currentCredits / totalCreditsRequired) * 100;
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Cumulative Performance Report
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
                <strong>CGPA:</strong> {cgpa}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Total Credits Earned:</strong> {currentCredits} / {totalCreditsRequired}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Pending Backlogs:</strong> {totalPendingBacklogs}
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Credit Completion Progress:
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={creditProgress} 
              sx={{ height: 10, borderRadius: 5 }} 
            />
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
              {Math.round(creditProgress)}% Complete
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Semester-wise Performance
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Semester</TableCell>
                  <TableCell>SGPA</TableCell>
                  <TableCell>Credits Earned</TableCell>
                  <TableCell>Cumulative Credits</TableCell>
                  <TableCell>Backlogs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(sgpaBySemseter).sort((a, b) => a - b).map((sem) => (
                  <TableRow key={sem}>
                    <TableCell>{sem}</TableCell>
                    <TableCell>{sgpaBySemseter[sem]}</TableCell>
                    <TableCell>{creditAccumulation[sem]?.semester_credits || 0}</TableCell>
                    <TableCell>{creditAccumulation[sem]?.cumulative_credits || 0}</TableCell>
                    <TableCell>{backlogsBySemester[sem]?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {totalPendingBacklogs > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom color="error">
                Pending Backlogs
              </Typography>
              
              <Grid container spacing={2}>
                {Object.entries(backlogsBySemester).map(([sem, backlogs]) => 
                  backlogs.map((backlog) => (
                    <Grid item xs={12} md={6} key={`${sem}-${backlog.course_code}`}>
                      <Alert severity="warning">
                        <Typography variant="subtitle2">
                          <strong>Semester {sem}:</strong> {backlog.course_name} ({backlog.course_code}) - {backlog.credits} credits
                        </Typography>
                      </Alert>
                    </Grid>
                  ))
                )}
              </Grid>
            </Box>
          )}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Graduation Projection
            </Typography>
            
            <Alert severity={projectedGraduation.backlogDelaySemesters > 0 ? "warning" : "success"}>
              <Typography variant="body1">
                <strong>Normal Completion:</strong> Semester {projectedGraduation.normalCompletionSemester}
              </Typography>
              {projectedGraduation.backlogDelaySemesters > 0 && (
                <Typography variant="body1">
                  <strong>Delay Due to Backlogs:</strong> {projectedGraduation.backlogDelaySemesters} semesters
                </Typography>
              )}
              <Typography variant="body1">
                <strong>Projected Graduation:</strong> Semester {projectedGraduation.projectedCompletionSemester}
              </Typography>
            </Alert>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                SGPA & CGPA Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={visualData} options={chartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Credit Accumulation
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={creditData} options={creditChartOptions} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CumulativePerformanceReport;