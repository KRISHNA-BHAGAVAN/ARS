import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const StudentAchievementForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [linkActive, setLinkActive] = useState(true);
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    registration_number: '',
    title: '',
    description: '',
    category: '',
    achievement_date: '',
    scope: 'Inside the College'
  });

  useEffect(() => {
    const fetchLinkStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/achievements/link-status');
        if (response.ok) {
          const data = await response.json();
          setLinkActive(data.active);
        }
      } catch (error) {
        console.error('Error fetching link status:', error);
      }
    };
    
    fetchLinkStatus();
    
    // Also check URL parameters
    const params = new URLSearchParams(location.search);
    const active = params.get('active');
    if (active === 'false') {
      setLinkActive(false);
    }
  }, [location]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setSuccess(true);
      setFormData({
        registration_number: '',
        title: '',
        description: '',
        category: '',
        achievement_date: '',
        scope: 'Inside the College'
      });
    } catch (error) {
      console.error('Error submitting achievement:', error);
      setError('Failed to submit achievement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if form is active
  if (!linkActive) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Link Closed
          </Typography>
          <Typography variant="h6" color="error" gutterBottom>
            Internal Error
          </Typography>
          <Alert severity="error" sx={{ mt: 3 }}>
            This submission form is currently inactive. The link has been closed by the faculty.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Student Achievement Submission Form
        </Typography>
        
        <Paper sx={{ p: 4 }}>
          {success ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Your achievement has been submitted successfully!
            </Alert>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : null}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Achievement Title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Achievement Type</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    label="Achievement Type"
                  >
                    <MenuItem value="Academic">Academic</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Cultural">Cultural</MenuItem>
                    <MenuItem value="General">General</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Scope</InputLabel>
                  <Select
                    name="scope"
                    value={formData.scope}
                    onChange={handleFormChange}
                    label="Scope"
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
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  multiline
                  rows={4}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    py: 1.5,
                    background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Achievement'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentAchievementForm;