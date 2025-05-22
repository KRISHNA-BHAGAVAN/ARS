import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Link,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { authService } from '../services/auth';
import SchoolIcon from '@mui/icons-material/School';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(username, password);
      const user = response.user;
      
      // Redirect based on user role
      if (user.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else if (user.role === 'hod') {
        navigate('/hod/dashboard');
      } else if (user.role === 'principal') {
        navigate('/principal/dashboard');
      } else if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate(from);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
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
  
  return (
    <Container maxWidth="sm">
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
                <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              </motion.div>
              <Typography variant="h4" component="h1" fontWeight="bold" align="center">
                Automated Reporting System
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Sign in to access your dashboard
              </Typography>
            </Box>
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <form onSubmit={handleLogin}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
                
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #3557cb 30%, #9f59a2 90%)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </form>
              
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Demo Accounts
                </Typography>
              </Divider>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => {
                      setUsername('faculty');
                      setPassword('faculty123');
                    }}
                  >
                    Faculty
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => {
                      setUsername('hod');
                      setPassword('hod123');
                    }}
                  >
                    HoD
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => {
                      setUsername('principal');
                      setPassword('principal123');
                    }}
                  >
                    Principal
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => {
                      setUsername('admin');
                      setPassword('admin123');
                    }}
                  >
                    Admin
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Ofen.in - All rights reserved.
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default LoginPage;