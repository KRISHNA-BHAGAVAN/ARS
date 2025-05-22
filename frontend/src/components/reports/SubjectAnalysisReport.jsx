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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SubjectAnalysisReport = ({ data }) => {
  if (!data) return null;
  
  const {
    student,
    subjectTypeAnalysis,
    courseTypeAnalysis,
    departmentAnalysis,
    strengthsAndWeaknesses,
    visualData
  } = data;
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  };
  
  // Create radar chart data for strengths and weaknesses
  const strengthsData = {
    labels: strengthsAndWeaknesses.strengths.map(s => s.course_name),
    datasets: [
      {
        label: 'Strengths',
        data: strengthsAndWeaknesses.strengths.map(s => s.grade_points),
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: '#4caf50',
        pointBackgroundColor: '#4caf50',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4caf50'
      }
    ]
  };
  
  const weaknessesData = {
    labels: strengthsAndWeaknesses.weaknesses.map(w => w.course_name),
    datasets: [
      {
        label: 'Weaknesses',
        data: strengthsAndWeaknesses.weaknesses.map(w => w.grade_points),
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderColor: '#f44336',
        pointBackgroundColor: '#f44336',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f44336'
      }
    ]
  };
  
  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2
        }
      }
    }
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Subject Analysis Report
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
                <strong>Current Semester:</strong> {student.curr_semester}
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Core vs Elective Performance
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject Type</TableCell>
                      <TableCell>Average Grade Points</TableCell>
                      <TableCell>Pass Percentage</TableCell>
                      <TableCell>Credits Earned</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Core</TableCell>
                      <TableCell>{subjectTypeAnalysis.core.metrics.average_grade_points}</TableCell>
                      <TableCell>{subjectTypeAnalysis.core.metrics.pass_percentage}%</TableCell>
                      <TableCell>{subjectTypeAnalysis.core.metrics.credits_obtained} / {subjectTypeAnalysis.core.metrics.total_credits}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Elective</TableCell>
                      <TableCell>{subjectTypeAnalysis.elective.metrics.average_grade_points}</TableCell>
                      <TableCell>{subjectTypeAnalysis.elective.metrics.pass_percentage}%</TableCell>
                      <TableCell>{subjectTypeAnalysis.elective.metrics.credits_obtained} / {subjectTypeAnalysis.elective.metrics.total_credits}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ height: 300, mb: 3 }}>
                <Bar data={visualData.subjectTypeData} options={chartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Theory vs Lab Performance
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Type</TableCell>
                      <TableCell>Average Grade Points</TableCell>
                      <TableCell>Pass Percentage</TableCell>
                      <TableCell>Credits Earned</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Theory</TableCell>
                      <TableCell>{courseTypeAnalysis.theory.metrics.average_grade_points}</TableCell>
                      <TableCell>{courseTypeAnalysis.theory.metrics.pass_percentage}%</TableCell>
                      <TableCell>{courseTypeAnalysis.theory.metrics.credits_obtained} / {courseTypeAnalysis.theory.metrics.total_credits}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lab</TableCell>
                      <TableCell>{courseTypeAnalysis.lab.metrics.average_grade_points}</TableCell>
                      <TableCell>{courseTypeAnalysis.lab.metrics.pass_percentage}%</TableCell>
                      <TableCell>{courseTypeAnalysis.lab.metrics.credits_obtained} / {courseTypeAnalysis.lab.metrics.total_credits}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ height: 300, mb: 3 }}>
                <Bar data={visualData.courseTypeData} options={chartOptions} />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Department-wise Performance
          </Typography>
          
          <Box sx={{ height: 300, mb: 3 }}>
            <Bar data={visualData.departmentData} options={chartOptions} />
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="success.main">
                Strengths
              </Typography>
              
              {strengthsAndWeaknesses.strengths.length > 0 ? (
                <>
                  <List>
                    {strengthsAndWeaknesses.strengths.map((strength) => (
                      <ListItem key={strength.course_code}>
                        <ListItemText
                          primary={`${strength.course_name} (${strength.grade_points})`}
                          secondary={`${strength.subject_type} ${strength.course_type} - ${strength.department}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  {strengthsAndWeaknesses.strengths.length >= 3 && (
                    <Box sx={{ height: 300 }}>
                      <Radar data={strengthsData} options={radarOptions} />
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No significant strengths identified.
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="error.main">
                Areas for Improvement
              </Typography>
              
              {strengthsAndWeaknesses.weaknesses.length > 0 ? (
                <>
                  <List>
                    {strengthsAndWeaknesses.weaknesses.map((weakness) => (
                      <ListItem key={weakness.course_code}>
                        <ListItemText
                          primary={`${weakness.course_name} (${weakness.grade_points})`}
                          secondary={`${weakness.subject_type} ${weakness.course_type} - ${weakness.department}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  {strengthsAndWeaknesses.weaknesses.length >= 3 && (
                    <Box sx={{ height: 300 }}>
                      <Radar data={weaknessesData} options={radarOptions} />
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No significant weaknesses identified.
                </Typography>
              )}
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Recommendations
          </Typography>
          
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            {strengthsAndWeaknesses.weaknesses.length > 0 ? (
              <Typography variant="body1">
                Based on your performance analysis, consider focusing on improving your understanding in 
                {strengthsAndWeaknesses.weaknesses.map(w => ` ${w.course_name}`).join(',')}. 
                Your strengths lie in 
                {strengthsAndWeaknesses.strengths.length > 0 
                  ? strengthsAndWeaknesses.strengths.map(s => ` ${s.course_name}`).join(',') 
                  : ' various subjects'}. 
                Consider leveraging these strengths while working on your weaker areas.
              </Typography>
            ) : (
              <Typography variant="body1">
                Your performance is balanced across different subject types and departments. 
                Continue with your current study approach while focusing on maintaining consistency.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubjectAnalysisReport;