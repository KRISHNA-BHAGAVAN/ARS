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
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SemesterPerformanceReport = ({ data }) => {
  if (!data) return null;
  
  const {
    student,
    semester,
    academicYear,
    records,
    sgpa,
    failedSubjects,
    recommendations,
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
        text: 'Subject Performance Comparison'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Semester Performance Report
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Student:</strong> {student.name} ({student.registered_no})
              </Typography>
              <Typography variant="subtitle1">
                <strong>Branch:</strong> {student.branch}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Semester:</strong> {semester}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Academic Year:</strong> {academicYear}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                <strong>SGPA:</strong> {sgpa}
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Subject-wise Performance
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Grade Points</TableCell>
                  <TableCell>Class Avg</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.course_code}>
                    <TableCell>{record.course_code}</TableCell>
                    <TableCell>{record.course_name}</TableCell>
                    <TableCell>{record.credits}</TableCell>
                    <TableCell>{record.grade}</TableCell>
                    <TableCell>{record.grade_points}</TableCell>
                    <TableCell>{record.class_avg_grade_points.toFixed(2)}</TableCell>
                    <TableCell>
                      {record.result === 'PASS' ? (
                        <Chip 
                          icon={<CheckCircleIcon />} 
                          label="Pass" 
                          color="success" 
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          icon={<CancelIcon />} 
                          label="Fail" 
                          color="error" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {failedSubjects.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom color="error">
                Failed Subjects
              </Typography>
              
              <Grid container spacing={2}>
                {failedSubjects.map((subject) => (
                  <Grid item xs={12} md={6} key={subject.course_code}>
                    <Alert severity="error">
                      <Typography variant="subtitle2">
                        {subject.course_name} ({subject.course_code})
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {recommendations.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              
              {recommendations.map((rec, index) => (
                <Alert severity="info" key={index} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">
                    <strong>{rec.course_name}:</strong> {rec.recommendation}
                  </Typography>
                </Alert>
              ))}
            </Box>
          )}
          
          <Typography variant="h6" gutterBottom>
            Performance Visualization
          </Typography>
          
          <Box sx={{ height: 400 }}>
            <Bar data={visualData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SemesterPerformanceReport;