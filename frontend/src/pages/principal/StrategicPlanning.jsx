import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { motion } from 'framer-motion';

const StrategicPlanning = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          Strategic Planning
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Plan and track institutional strategic initiatives
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Vision & Mission" />
          <Tab label="Strategic Goals" />
          <Tab label="Action Plans" />
          <Tab label="Progress Tracking" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <motion.div variants={itemVariants}>
              <Typography variant="h6" gutterBottom>
                Vision & Mission
              </Typography>
              <Typography variant="body1" paragraph>
                Our vision is to become a premier educational institution recognized globally for excellence in education, research, and innovation.
              </Typography>
              <Typography variant="body1" paragraph>
                Our mission is to provide quality education that empowers students with knowledge and skills to excel in their careers and contribute to society.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary">
                  Edit Vision & Mission
                </Button>
              </Box>
            </motion.div>
          )}
          
          {tabValue === 1 && (
            <motion.div variants={itemVariants}>
              <Typography variant="h6" gutterBottom>
                Strategic Goals
              </Typography>
              <Typography variant="body1" paragraph>
                Strategic goals section will be implemented soon.
              </Typography>
            </motion.div>
          )}
          
          {tabValue === 2 && (
            <motion.div variants={itemVariants}>
              <Typography variant="h6" gutterBottom>
                Action Plans
              </Typography>
              <Typography variant="body1" paragraph>
                Action plans section will be implemented soon.
              </Typography>
            </motion.div>
          )}
          
          {tabValue === 3 && (
            <motion.div variants={itemVariants}>
              <Typography variant="h6" gutterBottom>
                Progress Tracking
              </Typography>
              <Typography variant="body1" paragraph>
                Progress tracking section will be implemented soon.
              </Typography>
            </motion.div>
          )}
        </Box>
      </Paper>

      <motion.div variants={itemVariants}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" paragraph>
            The Strategic Planning module is under development. More features will be added soon.
          </Typography>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default StrategicPlanning;