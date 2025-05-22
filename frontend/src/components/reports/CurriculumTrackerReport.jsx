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
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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

const CurriculumTrackerReport = ({ data }) => {
  if (!data) return null;
  
  const {
    student,
    requirementsBySemester,
    completionStats,
    categoryStats,
    semesterStats,
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
        text: 'Semester-wise Completion'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Completion Percentage'
        }
      }
    }
  };
  
  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Category-wise Completion'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Completion Percentage'
        }
      }
    }
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Curriculum Completion Tracker
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
                Overall Completion: {completionStats.creditCompletionPercentage}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={completionStats.creditCompletionPercentage} 
                sx={{ height: 10, borderRadius: 5, mb: 1 }} 
              />
              <Typography variant="body2" color="text.secondary">
                {completionStats.completedCredits} of {completionStats.totalRequiredCredits} credits completed
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">
                  Mandatory Courses: {completionStats.mandatoryCompletionPercentage}% complete
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={completionStats.mandatoryCompletionPercentage} 
                  sx={{ height: 6, borderRadius: 5, mb: 1 }} 
                  color="secondary"
                />
                <Typography variant="body2" color="text.secondary">
                  {completionStats.completedMandatoryCourses} of {completionStats.totalMandatoryCourses} mandatory courses completed
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Semester-wise Completion
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Bar data={visualData.semesterCompletion} options={chartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Category-wise Completion
              </Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                <Bar data={visualData.categoryCompletion} options={categoryChartOptions} />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Curriculum Requirements by Semester
          </Typography>
          
          {Object.keys(requirementsBySemester).sort((a, b) => a - b).map(semester => (
            <Accordion key={semester} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`semester-${semester}-content`}
                id={`semester-${semester}-header`}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Semester {semester}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={semesterStats[semester]?.completion_percentage || 0} 
                      sx={{ width: 100, height: 8, borderRadius: 5, mr: 2 }} 
                    />
                    <Typography variant="body2">
                      {semesterStats[semester]?.completion_percentage || 0}% Complete
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requirementsBySemester[semester].map((req) => (
                        <TableRow key={req.course_code}>
                          <TableCell>{req.course_code}</TableCell>
                          <TableCell>{req.course_name}</TableCell>
                          <TableCell>{req.required_credits}</TableCell>
                          <TableCell>
                            <Chip 
                              label={req.category} 
                              size="small"
                              color={req.category === 'Core' ? 'primary' : 'secondary'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {req.completed ? (
                              <Chip 
                                icon={<CheckCircleIcon />} 
                                label="Completed" 
                                color="success" 
                                size="small" 
                              />
                            ) : (
                              <Chip 
                                icon={<PendingIcon />} 
                                label="Pending" 
                                color="default" 
                                size="small" 
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Category-wise Requirements
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Total Courses</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>Total Credits</TableCell>
                  <TableCell>Completed Credits</TableCell>
                  <TableCell>Completion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(categoryStats).map(([category, stats]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell>{stats.total_courses}</TableCell>
                    <TableCell>{stats.completed_courses}</TableCell>
                    <TableCell>{stats.total_credits}</TableCell>
                    <TableCell>{stats.completed_credits}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={stats.completion_percentage} 
                          sx={{ width: 100, height: 8, borderRadius: 5, mr: 2 }} 
                        />
                        <Typography variant="body2">
                          {stats.completion_percentage}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CurriculumTrackerReport;