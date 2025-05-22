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
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';

import { api } from '../../services/api_enhanced';

const FacultyManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joining_date: '',
    specialization: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock faculty data
        const mockFaculty = [
          { 
            id: 1, 
            first_name: 'Rajesh', 
            last_name: 'Sharma', 
            email: 'rajesh.sharma@example.com', 
            phone: '9876543210', 
            department: 'AIML', 
            designation: 'Professor', 
            joining_date: '2018-06-15', 
            specialization: 'Machine Learning',
            students_assigned: 45,
            avg_student_cgpa: 8.2,
            achievements_count: 23,
            status: 'Excellent'
          },
          { 
            id: 2, 
            first_name: 'Priya', 
            last_name: 'Patel', 
            email: 'priya.patel@example.com', 
            phone: '9876543211', 
            department: 'AIML', 
            designation: 'Associate Professor', 
            joining_date: '2019-07-10', 
            specialization: 'Deep Learning',
            students_assigned: 38,
            avg_student_cgpa: 7.8,
            achievements_count: 18,
            status: 'Good'
          },
          { 
            id: 3, 
            first_name: 'Amit', 
            last_name: 'Gupta', 
            email: 'amit.gupta@example.com', 
            phone: '9876543212', 
            department: 'AIML', 
            designation: 'Assistant Professor', 
            joining_date: '2020-01-05', 
            specialization: 'Computer Vision',
            students_assigned: 42,
            avg_student_cgpa: 7.5,
            achievements_count: 15,
            status: 'Good'
          },
          { 
            id: 4, 
            first_name: 'Neha', 
            last_name: 'Singh', 
            email: 'neha.singh@example.com', 
            phone: '9876543213', 
            department: 'AIML', 
            designation: 'Assistant Professor', 
            joining_date: '2020-06-20', 
            specialization: 'Natural Language Processing',
            students_assigned: 40,
            avg_student_cgpa: 6.9,
            achievements_count: 12,
            status: 'Average'
          },
          { 
            id: 5, 
            first_name: 'Vikram', 
            last_name: 'Kumar', 
            email: 'vikram.kumar@example.com', 
            phone: '9876543214', 
            department: 'AIML', 
            designation: 'Assistant Professor', 
            joining_date: '2021-01-10', 
            specialization: 'Data Mining',
            students_assigned: 35,
            avg_student_cgpa: 7.1,
            achievements_count: 10,
            status: 'Good'
          },
        ];
        
        setFaculty(mockFaculty);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setError("Failed to load faculty data. Please try again later.");
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
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: 'AIML',
      designation: '',
      joining_date: '',
      specialization: '',
      username: '',
      password: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (faculty) => {
    setDialogMode('edit');
    setSelectedFaculty(faculty);
    setFormData({
      first_name: faculty.first_name,
      last_name: faculty.last_name,
      email: faculty.email,
      phone: faculty.phone,
      department: faculty.department,
      designation: faculty.designation,
      joining_date: faculty.joining_date,
      specialization: faculty.specialization,
      username: '',
      password: ''
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
      // Mock adding a new faculty
      const newFaculty = {
        id: faculty.length + 1,
        ...formData,
        students_assigned: 0,
        avg_student_cgpa: 0,
        achievements_count: 0,
        status: 'New'
      };
      setFaculty(prev => [...prev, newFaculty]);
    } else {
      // Mock updating a faculty
      setFaculty(prev => 
        prev.map(f => f.id === selectedFaculty.id ? { ...f, ...formData } : f)
      );
    }
    
    handleCloseDialog();
  };

  const handleDeleteFaculty = (id) => {
    // In a real implementation, this would call the API
    setFaculty(prev => prev.filter(f => f.id !== id));
  };

  // Filter faculty based on search term
  const filteredFaculty = faculty.filter(f => 
    f.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Faculty Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage faculty members and their assignments
        </Typography>
      </Box>

      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or specialization"
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
                Add Faculty
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" component="div">
              {filteredFaculty.length} Faculty Members
            </Typography>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="faculty table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell align="center">Students</TableCell>
                  <TableCell align="center">Avg. CGPA</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
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
                          {faculty.first_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {faculty.first_name} {faculty.last_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {faculty.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{faculty.designation}</TableCell>
                    <TableCell>{faculty.specialization}</TableCell>
                    <TableCell align="center">{faculty.students_assigned}</TableCell>
                    <TableCell align="center">{faculty.avg_student_cgpa}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={faculty.status} 
                        color={getStatusColor(faculty.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenEditDialog(faculty)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteFaculty(faculty.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                
                {paginatedFaculty.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No faculty members found matching the criteria
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
        </Paper>
      </motion.div>

      {/* Add/Edit Faculty Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Faculty' : 'Edit Faculty'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  label="Department"
                  required
                >
                  <MenuItem value="AIML">Artificial Intelligence & Machine Learning</MenuItem>
                  <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
                  <MenuItem value="IT">Information Technology</MenuItem>
                  <MenuItem value="ECE">Electronics & Communication Engineering</MenuItem>
                  <MenuItem value="EEE">Electrical & Electronics Engineering</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Designation</InputLabel>
                <Select
                  name="designation"
                  value={formData.designation}
                  onChange={handleFormChange}
                  label="Designation"
                  required
                >
                  <MenuItem value="Professor">Professor</MenuItem>
                  <MenuItem value="Associate Professor">Associate Professor</MenuItem>
                  <MenuItem value="Assistant Professor">Assistant Professor</MenuItem>
                  <MenuItem value="Lecturer">Lecturer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joining Date"
                name="joining_date"
                type="date"
                value={formData.joining_date}
                onChange={handleFormChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Login Credentials</Divider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                margin="normal"
                required={dialogMode === 'add'}
                helperText={dialogMode === 'edit' ? "Leave blank to keep unchanged" : ""}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                margin="normal"
                required={dialogMode === 'add'}
                helperText={dialogMode === 'edit' ? "Leave blank to keep unchanged" : ""}
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
            disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.department || !formData.designation || (dialogMode === 'add' && (!formData.username || !formData.password))}
          >
            {dialogMode === 'add' ? 'Add Faculty' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default FacultyManagement;