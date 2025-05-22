import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { api } from '../../services/api_enhanced';

const FacultyOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [faculty, setFaculty] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [facultyStats, setFacultyStats] = useState({
    totalFaculty: 0,
    professors: 0,
    associateProfessors: 0,
    assistantProfessors: 0,
    avgExperience: 0,
    researchPapers: 0,
    achievements: 0
  });
  const [departments, setDepartments] = useState([]);
  const [departmentWiseFaculty, setDepartmentWiseFaculty] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock departments data
        const mockDepartments = [
          { id: 1, name: 'Computer Science', code: 'CSE' },
          { id: 2, name: 'Electronics & Communication', code: 'ECE' },
          { id: 3, name: 'Mechanical Engineering', code: 'MECH' },
          { id: 4, name: 'Civil Engineering', code: 'CIVIL' },
          { id: 5, name: 'Electrical Engineering', code: 'EEE' },
          { id: 6, name: 'Information Technology', code: 'IT' },
          { id: 7, name: 'Artificial Intelligence & ML', code: 'AIML' },
          { id: 8, name: 'Data Science', code: 'DS' }
        ];
        
        // Mock faculty data
        const mockFaculty = [
          { 
            id: 1, 
            name: 'Dr. Rajesh Kumar', 
            department: 'CSE', 
            designation: 'Professor', 
            experience: 15,
            qualification: 'Ph.D. in Computer Science',
            specialization: 'Artificial Intelligence',
            email: 'rajesh.kumar@example.com',
            phone: '9876543210',
            joining_date: '2008-06-15',
            research_papers: 25,
            achievements: 12,
            students_guided: 45,
            status: 'Excellent'
          },
          { 
            id: 2, 
            name: 'Dr. Priya Sharma', 
            department: 'ECE', 
            designation: 'Professor', 
            experience: 14,
            qualification: 'Ph.D. in Electronics',
            specialization: 'VLSI Design',
            email: 'priya.sharma@example.com',
            phone: '9876543211',
            joining_date: '2009-07-10',
            research_papers: 22,
            achievements: 10,
            students_guided: 38,
            status: 'Excellent'
          },
          { 
            id: 3, 
            name: 'Dr. Suresh Patel', 
            department: 'MECH', 
            designation: 'Professor', 
            experience: 16,
            qualification: 'Ph.D. in Mechanical Engineering',
            specialization: 'Thermal Engineering',
            email: 'suresh.patel@example.com',
            phone: '9876543212',
            joining_date: '2007-05-20',
            research_papers: 28,
            achievements: 15,
            students_guided: 52,
            status: 'Excellent'
          },
          { 
            id: 4, 
            name: 'Dr. Anita Desai', 
            department: 'CIVIL', 
            designation: 'Professor', 
            experience: 13,
            qualification: 'Ph.D. in Civil Engineering',
            specialization: 'Structural Engineering',
            email: 'anita.desai@example.com',
            phone: '9876543213',
            joining_date: '2010-08-15',
            research_papers: 18,
            achievements: 8,
            students_guided: 35,
            status: 'Good'
          },
          { 
            id: 5, 
            name: 'Dr. Vikram Singh', 
            department: 'EEE', 
            designation: 'Professor', 
            experience: 12,
            qualification: 'Ph.D. in Electrical Engineering',
            specialization: 'Power Systems',
            email: 'vikram.singh@example.com',
            phone: '9876543214',
            joining_date: '2011-06-10',
            research_papers: 16,
            achievements: 7,
            students_guided: 30,
            status: 'Good'
          },
          { 
            id: 6, 
            name: 'Dr. Neha Gupta', 
            department: 'IT', 
            designation: 'Associate Professor', 
            experience: 10,
            qualification: 'Ph.D. in Information Technology',
            specialization: 'Database Systems',
            email: 'neha.gupta@example.com',
            phone: '9876543215',
            joining_date: '2013-07-05',
            research_papers: 12,
            achievements: 5,
            students_guided: 25,
            status: 'Good'
          },
          { 
            id: 7, 
            name: 'Dr. Amit Verma', 
            department: 'AIML', 
            designation: 'Associate Professor', 
            experience: 8,
            qualification: 'Ph.D. in Computer Science',
            specialization: 'Machine Learning',
            email: 'amit.verma@example.com',
            phone: '9876543216',
            joining_date: '2015-08-20',
            research_papers: 15,
            achievements: 6,
            students_guided: 20,
            status: 'Good'
          },
          { 
            id: 8, 
            name: 'Dr. Sanjay Mehta', 
            department: 'DS', 
            designation: 'Associate Professor', 
            experience: 7,
            qualification: 'Ph.D. in Statistics',
            specialization: 'Data Mining',
            email: 'sanjay.mehta@example.com',
            phone: '9876543217',
            joining_date: '2016-09-15',
            research_papers: 10,
            achievements: 4,
            students_guided: 15,
            status: 'Good'
          },
          { 
            id: 9, 
            name: 'Dr. Kavita Reddy', 
            department: 'CSE', 
            designation: 'Associate Professor', 
            experience: 9,
            qualification: 'Ph.D. in Computer Science',
            specialization: 'Computer Networks',
            email: 'kavita.reddy@example.com',
            phone: '9876543218',
            joining_date: '2014-06-10',
            research_papers: 14,
            achievements: 6,
            students_guided: 22,
            status: 'Good'
          },
          { 
            id: 10, 
            name: 'Dr. Rahul Sharma', 
            department: 'ECE', 
            designation: 'Assistant Professor', 
            experience: 5,
            qualification: 'Ph.D. in Electronics',
            specialization: 'Communication Systems',
            email: 'rahul.sharma@example.com',
            phone: '9876543219',
            joining_date: '2018-07-15',
            research_papers: 8,
            achievements: 3,
            students_guided: 12,
            status: 'Good'
          },
        ];
        
        // Calculate faculty statistics
        const totalFaculty = mockFaculty.length;
        const professors = mockFaculty.filter(f => f.designation === 'Professor').length;
        const associateProfessors = mockFaculty.filter(f => f.designation === 'Associate Professor').length;
        const assistantProfessors = mockFaculty.filter(f => f.designation === 'Assistant Professor').length;
        const avgExperience = Math.round(mockFaculty.reduce((sum, f) => sum + f.experience, 0) / totalFaculty);
        const researchPapers = mockFaculty.reduce((sum, f) => sum + f.research_papers, 0);
        const achievements = mockFaculty.reduce((sum, f) => sum + f.achievements, 0);
        
        // Calculate department-wise faculty count
        const deptWiseFaculty = mockDepartments.map(dept => {
          const facultyCount = mockFaculty.filter(f => f.department === dept.code).length;
          const researchCount = mockFaculty
            .filter(f => f.department === dept.code)
            .reduce((sum, f) => sum + f.research_papers, 0);
          
          return {
            department: dept.name,
            code: dept.code,
            facultyCount,
            researchCount
          };
        });
        
        setFaculty(mockFaculty);
        setDepartments(mockDepartments);
        setDepartmentWiseFaculty(deptWiseFaculty);
        setFacultyStats({
          totalFaculty,
          professors,
          associateProfessors,
          assistantProfessors,
          avgExperience,
          researchPapers,
          achievements
        });
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setError("Failed to load faculty data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDepartmentFilterChange = (event) => {
    setDepartmentFilter(event.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
  };

  // Filter faculty based on search term and department filter
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter ? f.department === departmentFilter : true;
    
    return matchesSearch && matchesDepartment;
  });

  // Paginate faculty
  const paginatedFaculty = filteredFaculty.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'success';
      case 'Good': return 'primary';
      case 'Average': return 'warning';
      case 'Poor': return 'error';
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
          Faculty Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive view of faculty across all departments
        </Typography>
      </Box>

      {/* Faculty Stats */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Faculty
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {facultyStats.totalFaculty}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +5
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this year
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
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Professors
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {facultyStats.professors}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        {Math.round((facultyStats.professors / facultyStats.totalFaculty) * 100)}% of faculty
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
                    <SchoolIcon color="success" fontSize="large" />
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
                      Research Papers
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {facultyStats.researchPapers}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +12
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this year
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
                    <BarChartIcon sx={{ color: '#ff9800' }} fontSize="large" />
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
                      Avg. Experience
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {facultyStats.avgExperience}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Years in academia
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(33, 150, 243, 0.1)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <EmojiEventsIcon sx={{ color: '#2196f3' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Faculty Tabs */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Faculty List" />
            <Tab label="Department-wise Distribution" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {/* Faculty List Tab */}
            {tabValue === 0 && (
              <Box>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      placeholder="Search by name, specialization, or email"
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
                  
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <TextField
                        select
                        label="Department"
                        value={departmentFilter}
                        onChange={handleDepartmentFilterChange}
                        sx={{ minWidth: 150 }}
                        size="small"
                      >
                        <MenuItem value="">All Departments</MenuItem>
                        {departments.map((dept) => (
                          <MenuItem key={dept.code} value={dept.code}>
                            {dept.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      
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
                
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="faculty table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Specialization</TableCell>
                        <TableCell align="center">Experience</TableCell>
                        <TableCell align="center">Research Papers</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedFaculty.map((faculty) => (
                        <TableRow
                          key={faculty.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                {faculty.name.split(' ')[0][0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body1">
                                  {faculty.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {faculty.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{faculty.department}</TableCell>
                          <TableCell>{faculty.designation}</TableCell>
                          <TableCell>{faculty.specialization}</TableCell>
                          <TableCell align="center">{faculty.experience} years</TableCell>
                          <TableCell align="center">{faculty.research_papers}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={faculty.status} 
                              color={getStatusColor(faculty.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {paginatedFaculty.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                            No faculty found matching the criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredFaculty.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            )}
            
            {/* Department-wise Distribution Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Department-wise Faculty Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Overview of faculty distribution across departments
                </Typography>
                
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell align="center">Faculty Count</TableCell>
                        <TableCell align="center">Research Papers</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departmentWiseFaculty.map((dept) => (
                        <TableRow key={dept.code}>
                          <TableCell component="th" scope="row">
                            {dept.department}
                          </TableCell>
                          <TableCell>{dept.code}</TableCell>
                          <TableCell align="center">{dept.facultyCount}</TableCell>
                          <TableCell align="center">{dept.researchCount}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                            >
                              View Faculty
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    Generate Faculty Report
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>

      {/* Quick Actions */}
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
                <PeopleIcon />
                <Typography>Faculty Directory</Typography>
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
                <BarChartIcon />
                <Typography>Performance Report</Typography>
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
                <SchoolIcon />
                <Typography>Research Output</Typography>
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
                <EmojiEventsIcon />
                <Typography>Faculty Achievements</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default FacultyOverview;