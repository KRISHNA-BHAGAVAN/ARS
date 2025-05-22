import React, { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Mock notifications - in a real app, fetch from API
    const mockNotifications = [
      {
        id: 1,
        type: 'warning',
        message: '5 students have CGPA below 5.0',
        details: 'Action required',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'success',
        message: 'Semester reports generated successfully',
        details: 'System notification',
        time: 'Yesterday',
        read: false
      },
      {
        id: 3,
        type: 'info',
        message: 'New academic calendar published',
        details: 'Admin notification',
        time: '2 days ago',
        read: true
      },
      {
        id: 4,
        type: 'event',
        message: 'Faculty meeting scheduled',
        details: 'Tomorrow at 10:00 AM',
        time: '3 days ago',
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };
  
  const handleNotificationClick = (id) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };
  
  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;
  
  const getFilteredNotifications = () => {
    if (tabValue === 0) return notifications;
    
    const types = ['all', 'warning', 'success', 'info', 'event'];
    return notifications.filter(n => n.type === types[tabValue]);
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'info':
        return <InfoIcon sx={{ color: 'info.main' }} />;
      case 'event':
        return <EventIcon sx={{ color: 'secondary.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        color="inherit"
      >
        <StyledBadge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </StyledBadge>
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 320, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
        </Box>
        
        <Divider />
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label="Alerts" />
          <Tab label="Updates" />
          <Tab label="Info" />
          <Tab label="Events" />
        </Tabs>
        
        <List sx={{ p: 0 }}>
          {getFilteredNotifications().length > 0 ? (
            getFilteredNotifications().map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  alignItems="flex-start" 
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{ 
                    bgcolor: notification.read ? 'inherit' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.message}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.details}
                        </Typography>
                        {` — ${notification.time}`}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText 
                primary="No notifications" 
                secondary="You're all caught up!" 
                sx={{ textAlign: 'center' }}
              />
            </ListItem>
          )}
        </List>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Button size="small" fullWidth>
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;