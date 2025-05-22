import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

const HoDSidebar = ({ open, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { first_name: 'HoD', last_name: 'User', department: 'Department' };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', path: '/hod/dashboard', icon: <DashboardIcon /> },
    { text: 'Department Overview', path: '/hod/department', icon: <BusinessIcon /> },
    { text: 'Faculty Management', path: '/hod/faculty', icon: <GroupIcon /> },
    { text: 'Student Analytics', path: '/hod/students', icon: <BarChartIcon /> },
    { text: 'Course Analytics', path: '/hod/courses', icon: <SchoolIcon /> },
    { text: 'Reports', path: '/hod/reports', icon: <AssessmentIcon /> },
    { text: 'Resource Management', path: '/hod/resources', icon: <InventoryIcon /> },
    { text: 'Calendar', path: '/hod/calendar', icon: <CalendarMonthIcon /> },
  ];

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            bgcolor: 'white',
            color: 'primary.main',
            fontSize: '2rem',
          }}
        >
          {user.first_name ? user.first_name[0] : 'H'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Head of Department
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {user.department}
        </Typography>
      </Box>

      <Divider />

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                py: 1.5,
                px: 3,
                backgroundColor: location.pathname === item.path ? 'rgba(69, 104, 220, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(69, 104, 220, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#4568dc' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: location.pathname === item.path ? '#4568dc' : 'inherit',
                    }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto' }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ py: 1.5, px: 3 }}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body2" color="error">
                  Logout
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobile && open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: open ? '4px 0 8px rgba(0, 0, 0, 0.05)' : 'none',
            transform: open ? 'translateX(0)' : 'translateX(-100%)',
            transition: theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default HoDSidebar;