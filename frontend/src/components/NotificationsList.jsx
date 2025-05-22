import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import { motion } from 'framer-motion';

const NotificationsList = ({ notifications = [] }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 200,
        flexDirection: 'column',
        gap: 2
      }}>
        <NotificationsIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          No notifications available
        </Typography>
      </Box>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="error" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'info':
        return <InfoIcon color="primary" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };

  const getAvatarColor = (type) => {
    switch (type) {
      case 'warning':
        return 'error.light';
      case 'success':
        return 'success.light';
      case 'info':
        return 'primary.light';
      default:
        return 'grey.300';
    }
  };

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      <List sx={{ width: '100%' }}>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <motion.div variants={itemVariants}>
              <ListItem alignItems="flex-start" sx={{ px: 1, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: getAvatarColor(notification.type) 
                    }}
                  >
                    {getIcon(notification.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" component="span">
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {notification.details} • {notification.time}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </motion.div>
            {index < notifications.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </motion.div>
  );
};

export default NotificationsList;