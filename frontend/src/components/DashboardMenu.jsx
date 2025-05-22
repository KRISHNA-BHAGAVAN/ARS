import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  ButtonBase
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const MenuCard = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  textAlign: 'left',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const DashboardMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      title: 'Students', 
      icon: <PeopleIcon />, 
      color: '#4568dc', 
      path: '/faculty/students',
      description: 'Manage and view student details'
    },
    { 
      title: 'Achievements', 
      icon: <EmojiEventsIcon />, 
      color: '#4caf50', 
      path: '/faculty/achievements',
      description: 'Track student achievements'
    },
    { 
      title: 'Certifications', 
      icon: <CardMembershipIcon />, 
      color: '#b06ab3', 
      path: '/faculty/certifications',
      description: 'Manage student certifications'
    },
    { 
      title: 'Reports', 
      icon: <AssessmentIcon />, 
      color: '#ff9800', 
      path: '/faculty/reports',
      description: 'Generate and view reports'
    },
    { 
      title: 'Counseling', 
      icon: <ChatIcon />, 
      color: '#2196f3', 
      path: '/faculty/counseling',
      description: 'Student counseling notes'
    },
    { 
      title: 'Calendar', 
      icon: <CalendarMonthIcon />, 
      color: '#f44336', 
      path: '/faculty/calendar',
      description: 'View academic calendar'
    }
  ];

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Quick Access
      </Typography>
      
      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MenuCard
                onClick={() => navigate(item.path)}
                component={Card}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: item.color,
                      width: 50,
                      height: 50,
                      mr: 2
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </MenuCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardMenu;