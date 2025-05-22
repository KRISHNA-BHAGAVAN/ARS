import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';

const Header = () => {
  return (
    <Box className="app-header">
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <SchoolIcon sx={{ fontSize: 40 }} />
          </motion.div>
          <Box>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" component="h1" fontWeight="bold">
                Student Reporting System
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography variant="subtitle1">
                Manage student records and generate comprehensive reports
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;