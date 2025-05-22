import React from 'react';
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const CollegeLogo = ({ size = 'medium', showName = true }) => {
  const logoSize = {
    small: 30,
    medium: 40,
    large: 60
  };
  
  const fontSize = {
    small: '1rem',
    medium: '1.25rem',
    large: '1.5rem'
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: logoSize[size],
          height: logoSize[size],
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
          color: 'white',
          mr: showName ? 1 : 0
        }}
      >
        <SchoolIcon sx={{ fontSize: logoSize[size] * 0.6 }} />
      </Box>
      
      {showName && (
        <Typography
          variant="h6"
          sx={{
            fontSize: fontSize[size],
            fontWeight: 600,
            background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          ARS
        </Typography>
      )}
    </Box>
  );
};

export default CollegeLogo;