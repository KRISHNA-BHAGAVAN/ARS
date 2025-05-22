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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  TablePagination,
  Chip,
  IconButton,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import { api } from '../../services/api_enhanced';

const DepartmentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hod: '',
    established: '',
    description: '',
    courses_offered: '',
    max_intake: ''
  });
  const [departmentStats, setDepartmentStats] = useState({
    totalDepartments: 0,
    totalStudents: 0,
    totalFaculty: 0,
    avgPerformance: 0
  });

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
          { 
            id: 1, 
            name: 'Computer Science Engineering', 
            code: 'CSE', 
            hod: 'Dr. Rajesh Kumar', 
            established: '1995',
            students: 1245,
            faculty: 68,
            avgCGPA: 7.9,
            passRate: 94,
            courses: 24,
            labs: 8,
            status: 'Excellent',
            description: 'Department of Computer Science Engineering focuses on computer programming and applications.',
            max_intake: 240
          },
          { 
            id: 2, 
            name: 'Electronics & Communication', 
            code: 'ECE', 
            hod: 'Dr. Priya Sharma', 
            established: '1995',
            students: 980,
            faculty: 52,
            avgCGPA: 7.5,
            passRate: 91,
            courses: 22,
            labs: 7,
            status: 'Good',
            description: 'Department of Electronics & Communication Engineering focuses on electronic systems and communication.',
            max_intake: 180
          },
          { 
            id: 3, 
            name: 'Mechanical Engineering', 
            code: 'MECH', 
            hod: 'Dr. Suresh Patel', 
            established: '1995',
            students: 850,
            faculty: 45,
            avgCGPA: 7.3,
            passRate: 89,
            courses: 20,
            labs: 6,
            status: 'Good',
            description: 'Department of Mechanical Engineering focuses on design, manufacturing and maintenance of mechanical systems.',
            max_intake: 180
          },
          { 
            id: 4, 
            name: 'Civil Engineering', 
            code: 'CIVIL', 
            hod: 'Dr. Anita Desai', 
            established: '1995',
            students: 720,
            faculty: 38,
            avgCGPA: 7.4,
            passRate: 90,
            courses: 20,
            labs: 5,
            status: 'Good',
            description: 'Department of Civil Engineering focuses on design, construction and maintenance of physical structures.',
            max_intake: 120
          },
          { 
            id: 5, 
            name: 'Electrical Engineering', 
            code: 'EEE', 
            hod: 'Dr. Vikram Singh', 
            established: '1995',
            students: 680,
            faculty: 36,
            avgCGPA: 7.6,
            passRate: 92,
            courses: 18,
            labs: 5,
            status: 'Good',
            description: 'Department of Electrical Engineering focuses on electrical systems and power generation.',
            max_intake: 120
          },
          { 
            id: 6, 
            name: 'Information Technology', 
            code: 'IT', 
            hod: 'Dr. Neha Gupta', 
            established: '2002',
            students: 420,
            faculty: 22,
            avgCGPA: 7.8,
            passRate: 93,
            courses: 20,
            labs: 6,
            status: 'Excellent',
            description: 'Department of Information Technology focuses on information systems and software applications.',
            max_intake: 120
          },
          { 
            id: 7, 
            name: 'Artificial Intelligence & ML', 
            code: 'AIML', 
            hod: 'Dr. Amit Verma', 
            established: '2018',
            students: 245,
            faculty: 15,
            avgCGPA: 8.1,
            passRate: 95,
            courses: 16,
            labs: 4,
            status: 'Excellent',
            description: 'Department of Artificial Intelligence & Machine Learning focuses on AI algorithms and applications.',
            max_intake: 60
          },
          { 
            id: 8, 
            name: 'Data Science', 
            code: 'DS', 
            hod: 'Dr. Sanjay Mehta', 
            established: '2020',
            students: 100,
            faculty: 8,
            avgCGPA: 8.2,
            passRate: 96,
            courses: 12,
            labs: 3,
            status: 'Excellent',
            description: 'Department of Data Science focuses on data analysis and statistical methods.',
            max_intake: 60
          },
        ];
        
        // Calculate department statistics
        const totalDepartments = mockDepartments.length;
        const totalStudents = mockDepartments.reduce((sum, dept) => sum + dept.students, 0);
        const totalFaculty = mockDepartments.reduce((sum, dept) => sum + dept.faculty, 0);
        const avgPerformance = Math.round(mockDepartments.reduce((sum, dept) => sum + dept.passRate, 0) / totalDepartments);
        
        setDepartments(mockDepartments);
        setDepartmentStats({
          totalDepartments,
          totalStudents,
          totalFaculty,
          avgPerformance
        });
      } catch (error) {
        console.error("Error fetching department data:", error);
        setError("Failed to load department data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      code: '',
      hod: '',
      established: '',
      description: '',
      courses_offered: '',
      max_intake: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (department) => {
    setDialogMode('edit');
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      hod: department.hod,
      established: department.established,
      description: department.description,
      courses_offered: department.courses.toString(),
      max_intake: department.max_intake.toString()
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // In a real implementation, this would call the API
    if (dialogMode === 'add') {
      // Mock adding a new department
      const newDepartment = {
        id: departments.length + 1,
        name: formData.name,
        code: formData.code,
        hod: formData.hod,
        established: formData.established,
        description: formData.description,
        courses: parseInt(formData.courses_offered) || 0,
        max_intake: parseInt(formData.max_intake) || 0,
        students: 0,
        faculty: 0,
        avgCGPA: 0,
        passRate: 0,
        labs: 0,
        status: 'New'
      };
      setDepartments(prev => [...prev, newDepartment]);
    } else {
      // Mock updating a department
      setDepartments(prev => 
        prev.map(dept => dept.id === selectedDepartment.id ? { 
          ...dept, 
          name: formData.name,
          code: formData.code,
          hod: formData.hod,
          established: formData.established,
          description: formData.description,
          courses: parseInt(formData.courses_offered) || dept.courses,
          max_intake: parseInt(formData.max_intake) || dept.max_intake
        } : dept)
      );
    }
    
    handleCloseDialog();
  };

  const handleDeleteDepartment = (id) => {
    // In a real implementation, this would call the API
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.hod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate departments
  const paginatedDepartments = filteredDepartments.slice(
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
      case 'New': return 'info';
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
          Department Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage academic departments and their performance
        </Typography>
      </Box>

      {/* Department Stats */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Departments
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentStats.totalDepartments}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Active departments
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
                    <BusinessIcon color="primary" fontSize="large" />
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
                      Total Students
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentStats.totalStudents}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +240
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        this year
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
                    <PeopleIcon color="success" fontSize="large" />
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
                      Total Faculty
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentStats.totalFaculty}
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
                    <SchoolIcon sx={{ color: '#ff9800' }} fontSize="large" />
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
                      Avg. Performance
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {departmentStats.avgPerformance}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +2%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        vs last year
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
                    <TrendingUpIcon sx={{ color: '#2196f3' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Department Search and Add */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by department name, code, or HoD"
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
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
                sx={{
                  background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                }}
              >
                Add Department
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Department List */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" component="div">
              {filteredDepartments.length} Departments
            </Typography>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="department table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                  <TableCell>Department</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>HoD</TableCell>
                  <TableCell align="center">Students</TableCell>
                  <TableCell align="center">Faculty</TableCell>
                  <TableCell align="center">Avg. CGPA</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDepartments.map((department) => (
                  <TableRow
                    key={department.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {department.code[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {department.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Est. {department.established}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{department.code}</TableCell>
                    <TableCell>{department.hod}</TableCell>
                    <TableCell align="center">{department.students}</TableCell>
                    <TableCell align="center">{department.faculty}</TableCell>
                    <TableCell align="center">{department.avgCGPA}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={department.status} 
                        color={getStatusColor(department.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenEditDialog(department)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteDepartment(department.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                
                {paginatedDepartments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      No departments found matching the criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDepartments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </motion.div>

      {/* Add/Edit Department Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Department' : 'Edit Department'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Code"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Head of Department"
                name="hod"
                value={formData.hod}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Established Year"
                name="established"
                value={formData.established}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Courses Offered"
                name="courses_offered"
                type="number"
                value={formData.courses_offered}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Intake"
                name="max_intake"
                type="number"
                value={formData.max_intake}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            color="primary"
            disabled={!formData.name || !formData.code || !formData.hod}
          >
            {dialogMode === 'add' ? 'Add Department' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default DepartmentManagement;