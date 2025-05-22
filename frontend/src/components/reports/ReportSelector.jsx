import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import CategoryIcon from '@mui/icons-material/Category';

const ReportSelector = ({ onReportSelect }) => {
  const [reportType, setReportType] = useState('');
  const [semester, setSemester] = useState('');
  const [regNo, setRegNo] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  const handleSubmit = () => {
    onReportSelect({
      reportType,
      regNo,
      semester,
      academicYear
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Generate Academic Report
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="semester-performance">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssessmentIcon sx={{ mr: 1 }} />
                    Semester Performance Report
                  </Box>
                </MenuItem>
                <MenuItem value="cumulative-performance">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1 }} />
                    Cumulative Performance Report
                  </Box>
                </MenuItem>
                <MenuItem value="subject-analysis">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon sx={{ mr: 1 }} />
                    Subject-specific Analysis
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Registration Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              margin="normal"
            />
          </Grid>
          
          {reportType === 'semester-performance' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Semester"
                  type="number"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Academic Year (e.g., 2023-24)"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  margin="normal"
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              disabled={!reportType || !regNo || (reportType === 'semester-performance' && (!semester || !academicYear))}
              fullWidth
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReportSelector;