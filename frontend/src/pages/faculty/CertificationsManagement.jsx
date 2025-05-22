import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
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
  IconButton,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';

import { api } from '../../services/api_enhanced';

const CertificationsManagement = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    certification_type: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    certificate_url: ''
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock students data
        const mockStudents = [
          { id: 1, name: 'Akella Venkata', regNo: '22A91A6101' },
          { id: 2, name: 'Anusuri Bharathi', regNo: '22A91A6102' },
          { id: 3, name: 'Ari Naresh', regNo: '22A91A6103' },
          { id: 4, name: 'Arugollu Lalu Prasad', regNo: '22A91A6104' },
          { id: 5, name: 'Ayushi Singh', regNo: '22A91A6105' },
        ];
        
        // Mock certifications data
        const mockCertifications = [
          { 
            id: 1, 
            student_id: 1, 
            student_name: 'Akella Venkata',
            title: 'AWS Certified Developer', 
            description: 'Associate level certification for AWS development', 
            certification_type: 'technical', 
            issuing_organization: 'Amazon Web Services', 
            issue_date: '2023-11-15', 
            expiry_date: '2026-11-15',
            credential_id: 'AWS-DEV-12345',
            certificate_url: 'https://example.com/cert1',
            verified: true,
            verifier_name: 'Dr. Sharma'
          },
          { 
            id: 2, 
            student_id: 2, 
            student_name: 'Anusuri Bharathi',
            title: 'Machine Learning Specialization', 
            description: 'Comprehensive course on machine learning algorithms', 
            certification_type: 'technical', 
            issuing_organization: 'Coursera', 
            issue_date: '2023-10-05', 
            expiry_date: null,
            credential_id: 'COURSERA-ML-67890',
            certificate_url: 'https://example.com/cert2',
            verified: false
          },
          { 
            id: 3, 
            student_id: 3, 
            student_name: 'Ari Naresh',
            title: 'English Language Proficiency', 
            description: 'Advanced English language certification', 
            certification_type: 'language', 
            issuing_organization: 'British Council', 
            issue_date: '2023-09-20', 
            expiry_date: '2025-09-20',
            credential_id: 'IELTS-78945',
            certificate_url: 'https://example.com/cert3',
            verified: true,
            verifier_name: 'Dr. Patel'
          },
          { 
            id: 4, 
            student_id: 4, 
            student_name: 'Arugollu Lalu Prasad',
            title: 'Project Management Professional', 
            description: 'Professional certification for project management', 
            certification_type: 'professional', 
            issuing_organization: 'PMI', 
            issue_date: '2023-12-10', 
            expiry_date: '2026-12-10',
            credential_id: 'PMP-45678',
            certificate_url: 'https://example.com/cert4',
            verified: false
          },
          { 
            id: 5, 
            student_id: 5, 
            student_name: 'Ayushi Singh',
            title: 'Google Cloud Associate Engineer', 
            description: 'Associate level certification for Google Cloud', 
            certification_type: 'technical', 
            issuing_organization: 'Google', 
            issue_date: '2024-01-15', 
            expiry_date: '2027-01-15',
            credential_id: 'GCP-ACE-98765',
            certificate_url: 'https://example.com/cert5',
            verified: true,
            verifier_name: 'Dr. Sharma'
          },
        ];
        
        setStudents(mockStudents);
        setCertifications(mockCertifications);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load certifications. Please try again later.");
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

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      student_id: '',
      title: '',
      description: '',
      certification_type: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      certificate_url: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (certification) => {
    setDialogMode('edit');
    setSelectedCertification(certification);
    setFormData({
      student_id: certification.student_id,
      title: certification.title,
      description: certification.description || '',
      certification_type: certification.certification_type,
      issuing_organization: certification.issuing_organization,
      issue_date: certification.issue_date || '',
      expiry_date: certification.expiry_date || '',
      credential_id: certification.credential_id || '',
      certificate_url: certification.certificate_url || ''
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
      // Mock adding a new certification
      const newCertification = {
        id: certifications.length + 1,
        ...formData,
        student_name: students.find(s => s.id === parseInt(formData.student_id))?.name || '',
        verified: false
      };
      setCertifications(prev => [...prev, newCertification]);
    } else {
      // Mock updating a certification
      setCertifications(prev => 
        prev.map(c => c.id === selectedCertification.id ? { ...c, ...formData } : c)
      );
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // In a real implementation, this would call the API
    setCertifications(prev => prev.filter(c => c.id !== id));
  };

  // Filter certifications based on search term and tab
  const filteredCertifications = certifications.filter(certification => {
    const matchesSearch = 
      certification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.issuing_organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && certification.verified; // Verified
    if (tabValue === 2) return matchesSearch && !certification.verified; // Pending
    
    return matchesSearch;
  });

  // Get certification type icon
  const getCertificationIcon = (type) => {
    switch (type) {
      case 'technical': return <CodeIcon />;
      case 'language': return <LanguageIcon />;
      case 'professional': return <WorkIcon />;
      default: return <CardMembershipIcon />;
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
          Certifications Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage student certifications
        </Typography>
      </Box>

      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by title, student name, or organization"
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
                Add Certification
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="All Certifications" />
            <Tab label="Verified" />
            <Tab label="Pending Verification" />
          </Tabs>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" component="div">
              {filteredCertifications.length} Certifications
            </Typography>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredCertifications.length > 0 ? (
                filteredCertifications.map((certification) => (
                  <Grid item xs={12} md={6} lg={4} key={certification.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip 
                            icon={getCertificationIcon(certification.certification_type)}
                            label={certification.certification_type.charAt(0).toUpperCase() + certification.certification_type.slice(1)}
                            color="primary"
                            size="small"
                          />
                          
                          {certification.verified ? (
                            <Chip 
                              icon={<VerifiedIcon />}
                              label="Verified"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip 
                              icon={<PendingIcon />}
                              label="Pending"
                              color="warning"
                              size="small"
                            />
                          )}
                        </Box>
                        
                        <Typography variant="h6" component="div" gutterBottom>
                          {certification.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Student:</strong> {certification.student_name}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Organization:</strong> {certification.issuing_organization}
                        </Typography>
                        
                        {certification.description && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {certification.description}
                          </Typography>
                        )}
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Issued:</strong> {certification.issue_date}
                          {certification.expiry_date && ` (Expires: ${certification.expiry_date})`}
                        </Typography>
                        
                        {certification.credential_id && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Credential ID:</strong> {certification.credential_id}
                          </Typography>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenEditDialog(certification)}
                        >
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(certification.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No certifications found matching the criteria
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </motion.div>

      {/* Add/Edit Certification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Certification' : 'Edit Certification'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleFormChange}
                  label="Student"
                  required
                >
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name} ({student.regNo})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Certification Type</InputLabel>
                <Select
                  name="certification_type"
                  value={formData.certification_type}
                  onChange={handleFormChange}
                  label="Certification Type"
                  required
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="language">Language</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="soft_skills">Soft Skills</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certification Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Issuing Organization"
                name="issuing_organization"
                value={formData.issuing_organization}
                onChange={handleFormChange}
                margin="normal"
                required
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
                label="Issue Date"
                name="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={handleFormChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date (if applicable)"
                name="expiry_date"
                type="date"
                value={formData.expiry_date}
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
                label="Credential ID"
                name="credential_id"
                value={formData.credential_id}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certificate URL"
                name="certificate_url"
                value={formData.certificate_url}
                onChange={handleFormChange}
                margin="normal"
                placeholder="https://example.com/certificate"
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
            disabled={!formData.student_id || !formData.title || !formData.certification_type || !formData.issuing_organization || !formData.issue_date}
          >
            {dialogMode === 'add' ? 'Add Certification' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CertificationsManagement;