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
  Snackbar,
  Switch,
  FormControlLabel
} from '@mui/material';
import { motion } from 'framer-motion';
// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsIcon from '@mui/icons-material/Sports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';

const AchievementsManagement = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
  const [linkActive, setLinkActive] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [formData, setFormData] = useState({
    registration_number: '',
    title: '',
    description: '',
    category: '',
    achievement_date: '',
    scope: ''
  });
  const [students, setStudents] = useState([]);

  const handleLinkToggle = async (e) => {
    const newStatus = e.target.checked;
    setLinkActive(newStatus);
    
    try {
      await fetch('http://localhost:5000/api/achievements/link-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: newStatus }),
      });
    } catch (error) {
      console.error('Error updating link status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch students data
        const studentsResponse = await fetch('http://localhost:5000/api/students');
        if (!studentsResponse.ok) {
          throw new Error(`HTTP error! Status: ${studentsResponse.status}`);
        }
        const studentsData = await studentsResponse.json();
        
        // Fetch achievements data
        const achievementsResponse = await fetch('http://localhost:5000/api/achievements');
        if (!achievementsResponse.ok) {
          throw new Error(`HTTP error! Status: ${achievementsResponse.status}`);
        }
        const achievementsData = await achievementsResponse.json();
        
        // Fetch link status
        const linkStatusResponse = await fetch('http://localhost:5000/api/achievements/link-status');
        if (linkStatusResponse.ok) {
          const linkStatusData = await linkStatusResponse.json();
          setLinkActive(linkStatusData.active);
        }
        
        // Map student names to achievements
        const achievementsWithStudentNames = achievementsData.map(achievement => {
          const student = studentsData.find(s => s.registration_number === achievement.registration_number);
          return {
            ...achievement,
            student_name: student ? student.name : 'Unknown Student'
          };
        });
        
        setStudents(studentsData);
        setAchievements(achievementsWithStudentNames);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load achievements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      registration_number: '',
      title: '',
      description: '',
      category: '',
      achievement_date: '',
      scope: 'Inside the College'
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (achievement) => {
    setDialogMode('edit');
    setSelectedAchievement(achievement);
    setFormData({
      registration_number: achievement.registration_number,
      title: achievement.title,
      description: achievement.description || '',
      category: achievement.category,
      achievement_date: achievement.achievement_date || '',
      scope: achievement.scope || 'Inside the College'
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
      // Mock adding a new achievement
      const newAchievement = {
        id: achievements.length + 1,
        ...formData,
        student_name: students.find(s => s.registration_number === formData.registration_number)?.name || 'Unknown Student'
      };
      setAchievements(prev => [...prev, newAchievement]);
    } else {
      // Mock updating an achievement
      setAchievements(prev => 
        prev.map(a => a.id === selectedAchievement.id ? { ...a, ...formData } : a)
      );
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // In a real implementation, this would call the API
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  // Filter achievements based on search term
  const filteredAchievements = achievements.filter(achievement => {
    return achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (achievement.category && achievement.category.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Get icon based on achievement type
  const getAchievementIcon = (type) => {
    switch (type) {
      case 'Technical':
        return <CodeIcon />;
      case 'Academic':
        return <SchoolIcon />;
      case 'Sports':
        return <SportsIcon />;
      case 'Cultural':
        return <MusicNoteIcon />;
      default:
        return <EmojiEventsIcon />;
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
          Achievements Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage student achievements
        </Typography>
      </Box>

      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by title or student name"
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
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={linkActive}
                    onChange={handleLinkToggle}
                    color="primary"
                  />
                }
                label={linkActive ? "Link Active" : "Link Inactive"}
              />
              <Button 
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={() => {
                  const url = `${window.location.origin}/student-achievement-form?active=${linkActive}`;
                  navigator.clipboard.writeText(url);
                  setSnackbar({open: true, message: 'Link copied to clipboard!', severity: 'success'});
                }}
                disabled={!linkActive}
              >
                Share Link
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
                sx={{
                  background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                }}
              >
                Add Achievement
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" component="div">
              {filteredAchievements.length} Achievements
            </Typography>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement) => (
                  <Grid item xs={12} md={6} lg={4} key={achievement.id}>
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
                            icon={getAchievementIcon(achievement.category)}
                            label={achievement.category || 'General'}
                            color="primary"
                            size="small"
                          />
                          
                          {achievement.scope && (
                            <Chip 
                              label={achievement.scope}
                              color={achievement.scope === 'Outside the College' ? 'info' : 'default'}
                              size="small"
                            />
                          )}
                        </Box>
                        
                        <Typography variant="h6" component="div" gutterBottom>
                          {achievement.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Student:</strong> {achievement.student_name}
                        </Typography>
                        
                        {achievement.description && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {achievement.description}
                          </Typography>
                        )}
                        
                        {achievement.achievement_date && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Date:</strong> {achievement.achievement_date}
                          </Typography>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenEditDialog(achievement)}
                        >
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(achievement.id)}
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
                      No achievements found matching the criteria
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </motion.div>

      {/* Add/Edit Achievement Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Achievement' : 'Edit Achievement'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Select
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleFormChange}
                  label="Student"
                  required
                >
                  {students.map(student => (
                    <MenuItem key={student.registration_number} value={student.registration_number}>
                      {student.name} ({student.registration_number})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Achievement Type</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Achievement Type"
                  required
                >
                  <MenuItem value="Academic">Academic</MenuItem>
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Cultural">Cultural</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Achievement Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Scope</InputLabel>
                <Select
                  name="scope"
                  value={formData.scope}
                  onChange={handleFormChange}
                  label="Scope"
                  required
                >
                  <MenuItem value="Inside the College">Inside the College</MenuItem>
                  <MenuItem value="Outside the College">Outside the College</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Achievement Date"
                name="achievement_date"
                type="date"
                value={formData.achievement_date}
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
                label="Description"
                name="description"
                value={formData.description}
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
          <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        message={snackbar.message}
      />
    </motion.div>
  );
};

export default AchievementsManagement;