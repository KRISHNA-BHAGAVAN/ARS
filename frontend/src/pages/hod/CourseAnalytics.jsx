import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';

import { api } from '../../services/api_enhanced';

const CourseAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseStats, setCourseStats] = useState({
    totalCourses: 0,
    avgPassRate: 0,
    highDifficultyCourses: 0,
    lowPerformanceCourses: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock course data
        const mockCourses = [
          { 
            id: 1, 
            code: 'AIML301', 
            name: 'Machine Learning', 
            semester: 3, 
            credits: 4,
            faculty: 'Dr. Rajesh Sharma',
            avgGrade: 8.1, 
            passRate: 94, 
            difficulty: 'Medium',
            enrolledStudents: 45,
            topGrade: 'A+',
            failCount: 3,
            description: 'Introduction to machine learning algorithms and their applications.'
          },
          { 
            id: 2, 
            code: 'AIML302', 
            name: 'Deep Learning', 
            semester: 3, 
            credits: 4,
            faculty: 'Dr. Priya Patel',
            avgGrade: 7.5, 
            passRate: 88, 
            difficulty: 'High',
            enrolledStudents: 45,
            topGrade: 'A',
            failCount: 5,
            description: 'Advanced neural network architectures and deep learning techniques.'
          },
          { 
            id: 3, 
            code: 'AIML303', 
            name: 'Computer Vision', 
            semester: 3, 
            credits: 3,
            faculty: 'Dr. Amit Gupta',
            avgGrade: 7.8, 
            passRate: 90, 
            difficulty: 'High',
            enrolledStudents: 45,
            topGrade: 'A',
            failCount: 4,
            description: 'Image processing and computer vision algorithms and applications.'
          },
          { 
            id: 4, 
            code: 'AIML304', 
            name: 'Natural Language Processing', 
            semester: 3, 
            credits: 3,
            faculty: 'Dr. Neha Singh',
            avgGrade: 7.2, 
            passRate: 85, 
            difficulty: 'High',
            enrolledStudents: 45,
            topGrade: 'A',
            failCount: 7,
            description: 'Processing and understanding human language with AI techniques.'
          },
          { 
            id: 5, 
            code: 'AIML401', 
            name: 'Data Mining', 
            semester: 4, 
            credits: 4,
            faculty: 'Dr. Vikram Kumar',
            avgGrade: 8.3, 
            passRate: 96, 
            difficulty: 'Medium',
            enrolledStudents: 42,
            topGrade: 'A+',
            failCount: 2,
            description: 'Techniques for discovering patterns in large data sets.'
          },
          { 
            id: 6, 
            code: 'AIML402', 
            name: 'Big Data Analytics', 
            semester: 4, 
            credits: 4,
            faculty: 'Dr. Rajesh Sharma',
            avgGrade: 7.9, 
            passRate: 92, 
            difficulty: 'Medium',
            enrolledStudents: 42,
            topGrade: 'A',
            failCount: 3,
            description: 'Processing and analyzing large-scale data sets.'
          },
          { 
            id: 7, 
            code: 'AIML403', 
            name: 'Reinforcement Learning', 
            semester: 4, 
            credits: 3,
            faculty: 'Dr. Priya Patel',
            avgGrade: 7.0, 
            passRate: 82, 
            difficulty: 'Very High',
            enrolledStudents: 42,
            topGrade: 'A',
            failCount: 8,
            description: 'Learning through interaction with an environment to maximize rewards.'
          },
          { 
            id: 8, 
            code: 'AIML404', 
            name: 'AI Ethics', 
            semester: 4, 
            credits: 2,
            faculty: 'Dr. Neha Singh',
            avgGrade: 8.5, 
            passRate: 98, 
            difficulty: 'Low',
            enrolledStudents: 42,
            topGrade: 'A+',
            failCount: 1,
            description: 'Ethical considerations in artificial intelligence applications.'
          },
        ];
        
        // Calculate course statistics
        const totalCourses = mockCourses.length;
        const avgPassRate = Math.round(mockCourses.reduce((sum, course) => sum + course.passRate, 0) / totalCourses);
        const highDifficultyCourses = mockCourses.filter(course => 
          course.difficulty === 'High' || course.difficulty === 'Very High'
        ).length;
        const lowPerformanceCourses = mockCourses.filter(course => course.passRate < 85).length;
        
        setCourses(mockCourses);
        setCourseStats({
          totalCourses,
          avgPassRate,
          highDifficultyCourses,
          lowPerformanceCourses
        });
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSemesterFilterChange = (event) => {
    setSemesterFilter(event.target.value);
  };

  const handleDifficultyFilterChange = (event) => {
    setDifficultyFilter(event.target.value);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSemesterFilter('');
    setDifficultyFilter('');
  };

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = semesterFilter ? course.semester === parseInt(semesterFilter) : true;
    const matchesDifficulty = difficultyFilter ? course.difficulty === difficultyFilter : true;
    
    return matchesSearch && matchesSemester && matchesDifficulty;
  });

  // Get difficulty chip color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low': return 'success';
      case 'Medium': return 'primary';
      case 'High': return 'warning';
      case 'Very High': return 'error';
      default: return 'default';
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
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
          Course Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze course performance and identify areas for improvement
        </Typography>
      </Box>

      {/* Course Stats */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Courses
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {courseStats.totalCourses}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Current semester
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
                    <SchoolIcon color="primary" fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Average Pass Rate
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {courseStats.avgPassRate}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +2%
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
                    <CheckCircleIcon color="success" fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      High Difficulty Courses
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {courseStats.highDifficultyCourses}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="warning.main">
                        Requires attention
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
                    <WarningIcon sx={{ color: '#ff9800' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Low Performance Courses
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {courseStats.lowPerformanceCourses}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingDownIcon color="error" fontSize="small" />
                      <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                        Intervention needed
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
                    <BarChartIcon sx={{ color: '#f44336' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Course Filters */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by course code, name, or faculty"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={semesterFilter}
                    onChange={handleSemesterFilterChange}
                    label="Semester"
                  >
                    <MenuItem value="">All</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficultyFilter}
                    onChange={handleDifficultyFilterChange}
                    label="Difficulty"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Very High">Very High</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  variant="outlined" 
                  startIcon={<FilterListIcon />}
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Course List and Details */}
      <Grid container spacing={3}>
        {/* Course List */}
        <Grid item xs={12} md={selectedCourse ? 6 : 12}>
          <motion.div variants={itemVariants}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div">
                  Course List
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredCourses.length} courses found
                </Typography>
              </Box>
              
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="course table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="center">Semester</TableCell>
                      <TableCell align="center">Pass Rate</TableCell>
                      <TableCell align="center">Difficulty</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow
                        key={course.id}
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                          backgroundColor: selectedCourse?.id === course.id ? 'rgba(69, 104, 220, 0.08)' : 'inherit',
                          '&:hover': {
                            backgroundColor: 'rgba(69, 104, 220, 0.05)',
                          },
                        }}
                        onClick={() => handleCourseSelect(course)}
                      >
                        <TableCell component="th" scope="row">
                          {course.code}
                        </TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell align="center">{course.semester}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`${course.passRate}%`} 
                            color={course.passRate >= 90 ? 'success' : course.passRate >= 80 ? 'primary' : 'warning'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={course.difficulty} 
                            color={getDifficultyColor(course.difficulty)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCourseSelect(course);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredCourses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          No courses found matching the criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Course Details */}
        {selectedCourse && (
          <Grid item xs={12} md={6}>
            <motion.div 
              variants={itemVariants}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedCourse.code}: {selectedCourse.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCourse.description}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Faculty
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.faculty}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Semester
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.semester}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Credits
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.credits}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Enrolled Students
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.enrolledStudents}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Grade
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.avgGrade}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Top Grade
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.topGrade}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Pass Rate
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.passRate}%
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Failed Students
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedCourse.failCount}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Difficulty Level
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={selectedCourse.difficulty} 
                        color={getDifficultyColor(selectedCourse.difficulty)} 
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined">
                    View Student Performance
                  </Button>
                  
                  <Button variant="contained" color="primary">
                    Generate Course Report
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
};

export default CourseAnalytics;