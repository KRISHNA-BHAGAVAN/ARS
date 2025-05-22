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
  Chip,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import ComputerIcon from '@mui/icons-material/Computer';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

import { api } from '../../services/api_enhanced';

const ResourceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    status: '',
    assigned_to: '',
    acquisition_date: '',
    last_maintenance: '',
    notes: ''
  });
  const [resourceStats, setResourceStats] = useState({
    totalResources: 0,
    availableResources: 0,
    maintenanceNeeded: 0,
    utilizationRate: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock resources data
        const mockResources = [
          { 
            id: 1, 
            name: 'Computer Lab 1', 
            type: 'lab', 
            location: 'Block A, Ground Floor', 
            status: 'available',
            assigned_to: 'Dr. Rajesh Sharma',
            acquisition_date: '2020-01-15',
            last_maintenance: '2023-12-10',
            capacity: 30,
            utilization: 85,
            notes: 'Equipped with 30 computers with latest configuration.'
          },
          { 
            id: 2, 
            name: 'Computer Lab 2', 
            type: 'lab', 
            location: 'Block A, First Floor', 
            status: 'maintenance',
            assigned_to: 'Dr. Priya Patel',
            acquisition_date: '2020-01-15',
            last_maintenance: '2023-10-05',
            capacity: 30,
            utilization: 0,
            notes: 'Under maintenance for hardware upgrades.'
          },
          { 
            id: 3, 
            name: 'AI Research Lab', 
            type: 'lab', 
            location: 'Block B, Second Floor', 
            status: 'available',
            assigned_to: 'Dr. Amit Gupta',
            acquisition_date: '2021-06-20',
            last_maintenance: '2024-01-15',
            capacity: 20,
            utilization: 70,
            notes: 'Specialized lab for AI research with GPU workstations.'
          },
          { 
            id: 4, 
            name: 'NVIDIA DGX Station', 
            type: 'equipment', 
            location: 'AI Research Lab', 
            status: 'available',
            assigned_to: 'Dr. Amit Gupta',
            acquisition_date: '2022-03-10',
            last_maintenance: '2023-11-20',
            capacity: null,
            utilization: 65,
            notes: 'High-performance AI workstation for deep learning research.'
          },
          { 
            id: 5, 
            name: 'Department Library', 
            type: 'facility', 
            location: 'Block C, Ground Floor', 
            status: 'available',
            assigned_to: 'Ms. Kavita Reddy',
            acquisition_date: '2019-05-15',
            last_maintenance: '2023-08-10',
            capacity: 50,
            utilization: 60,
            notes: 'Contains specialized books and journals for AI and ML.'
          },
          { 
            id: 6, 
            name: 'Conference Room', 
            type: 'facility', 
            location: 'Block A, Third Floor', 
            status: 'occupied',
            assigned_to: 'Department Admin',
            acquisition_date: '2019-05-15',
            last_maintenance: '2023-09-15',
            capacity: 25,
            utilization: 100,
            notes: 'Equipped with projector and video conferencing facilities.'
          },
          { 
            id: 7, 
            name: 'Robotics Kit Set', 
            type: 'equipment', 
            location: 'AI Research Lab', 
            status: 'maintenance',
            assigned_to: 'Dr. Neha Singh',
            acquisition_date: '2022-07-20',
            last_maintenance: '2023-12-05',
            capacity: null,
            utilization: 0,
            notes: 'Set of 10 robotics kits for practical sessions.'
          },
          { 
            id: 8, 
            name: 'Server Room', 
            type: 'facility', 
            location: 'Block B, Basement', 
            status: 'available',
            assigned_to: 'IT Department',
            acquisition_date: '2018-03-10',
            last_maintenance: '2024-02-15',
            capacity: null,
            utilization: 75,
            notes: 'Houses department servers and networking equipment.'
          },
        ];
        
        // Calculate resource statistics
        const totalResources = mockResources.length;
        const availableResources = mockResources.filter(resource => resource.status === 'available').length;
        const maintenanceNeeded = mockResources.filter(resource => resource.status === 'maintenance').length;
        
        // Calculate average utilization rate for available resources
        const availableResourcesWithUtilization = mockResources.filter(
          resource => resource.status === 'available' && resource.utilization !== null
        );
        const utilizationRate = Math.round(
          availableResourcesWithUtilization.reduce((sum, resource) => sum + resource.utilization, 0) / 
          (availableResourcesWithUtilization.length || 1)
        );
        
        setResources(mockResources);
        setResourceStats({
          totalResources,
          availableResources,
          maintenanceNeeded,
          utilizationRate
        });
      } catch (error) {
        console.error("Error fetching resource data:", error);
        setError("Failed to load resource data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleResourceTypeFilterChange = (event) => {
    setResourceTypeFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      type: '',
      location: '',
      status: 'available',
      assigned_to: '',
      acquisition_date: '',
      last_maintenance: '',
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (resource) => {
    setDialogMode('edit');
    setSelectedResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      location: resource.location,
      status: resource.status,
      assigned_to: resource.assigned_to,
      acquisition_date: resource.acquisition_date,
      last_maintenance: resource.last_maintenance,
      notes: resource.notes
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
      // Mock adding a new resource
      const newResource = {
        id: resources.length + 1,
        ...formData,
        capacity: null,
        utilization: 0
      };
      setResources(prev => [...prev, newResource]);
    } else {
      // Mock updating a resource
      setResources(prev => 
        prev.map(r => r.id === selectedResource.id ? { ...r, ...formData } : r)
      );
    }
    
    handleCloseDialog();
  };

  const handleDeleteResource = (id) => {
    // In a real implementation, this would call the API
    setResources(prev => prev.filter(r => r.id !== id));
  };

  // Filter resources based on search term, type, and status
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.assigned_to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = resourceTypeFilter ? resource.type === resourceTypeFilter : true;
    const matchesStatus = statusFilter ? resource.status === statusFilter : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get resource type icon
  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'lab': return <ComputerIcon />;
      case 'equipment': return <ScienceIcon />;
      case 'facility': return <InventoryIcon />;
      default: return <InventoryIcon />;
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'primary';
      case 'maintenance': return 'warning';
      case 'unavailable': return 'error';
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
          Resource Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage department resources, labs, and equipment
        </Typography>
      </Box>

      {/* Resource Stats */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Resources
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {resourceStats.totalResources}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Managed by department
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
                    <InventoryIcon color="primary" fontSize="large" />
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
                      Available Resources
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {resourceStats.availableResources}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="success.main">
                        Ready for use
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
                      Maintenance Needed
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {resourceStats.maintenanceNeeded}
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
                      Utilization Rate
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                      {resourceStats.utilizationRate}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="primary.main">
                        Average across resources
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
                    <MenuBookIcon sx={{ color: '#2196f3' }} fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Resource Management Tabs */}
      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="All Resources" />
            <Tab label="Labs" />
            <Tab label="Equipment" />
            <Tab label="Facilities" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search resources..."
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
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={resourceTypeFilter}
                      onChange={handleResourceTypeFilterChange}
                      label="Type"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="lab">Lab</MenuItem>
                      <MenuItem value="equipment">Equipment</MenuItem>
                      <MenuItem value="facility">Facility</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      label="Status"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="occupied">Occupied</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="unavailable">Unavailable</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                  sx={{
                    background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                  }}
                >
                  Add Resource
                </Button>
              </Grid>
            </Grid>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="resources table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Utilization</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow
                      key={resource.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.main'
                          }}>
                            {getResourceTypeIcon(resource.type)}
                          </Box>
                          <Typography variant="body1">
                            {resource.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </TableCell>
                      <TableCell>{resource.location}</TableCell>
                      <TableCell>{resource.assigned_to}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={resource.status.charAt(0).toUpperCase() + resource.status.slice(1)} 
                          color={getStatusColor(resource.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {resource.utilization !== null ? `${resource.utilization}%` : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary"
                          onClick={() => handleOpenEditDialog(resource)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteResource(resource.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredResources.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        No resources found matching the criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </motion.div>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Resource' : 'Edit Resource'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Resource Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Resource Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  label="Resource Type"
                  required
                >
                  <MenuItem value="lab">Lab</MenuItem>
                  <MenuItem value="equipment">Equipment</MenuItem>
                  <MenuItem value="facility">Facility</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  label="Status"
                  required
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="occupied">Occupied</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="unavailable">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assigned To"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Acquisition Date"
                name="acquisition_date"
                type="date"
                value={formData.acquisition_date}
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
                label="Last Maintenance"
                name="last_maintenance"
                type="date"
                value={formData.last_maintenance}
                onChange={handleFormChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                margin="normal"
                multiline
                rows={3}
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
            disabled={!formData.name || !formData.type || !formData.location || !formData.status}
          >
            {dialogMode === 'add' ? 'Add Resource' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ResourceManagement;