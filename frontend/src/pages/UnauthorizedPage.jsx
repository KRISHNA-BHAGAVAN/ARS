import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { authService } from '../services/auth';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoHome = () => {
    // Redirect based on user role
    if (user) {
      if (user.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else if (user.role === 'hod') {
        navigate('/hod/dashboard');
      } else if (user.role === 'principal') {
        navigate('/principal/dashboard');
      } else if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
  
  return (
    <Container maxWidth="md">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}>
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4,
              flexDirection: 'column'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              </motion.div>
              <Typography variant="h3" component="h1" fontWeight="bold" align="center" gutterBottom>
                Access Denied
              </Typography>
              <Typography variant="h6" color="text.secondary" align="center">
                You don't have permission to access this page
              </Typography>
            </Box>
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="body1" paragraph>
                This area requires specific permissions that your account doesn't have. If you believe this is an error, please contact your administrator.
              </Typography>
              
              {user && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    You are currently logged in as:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.name} ({user.role})
                  </Typography>
                </Box>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                  >
                    Go Back
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<HomeIcon />}
                    onClick={handleGoHome}
                  >
                    Go to Dashboard
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Automated Reporting System
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default UnauthorizedPage;