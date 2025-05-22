import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

const DashboardActions = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleOpen = () => setOpen(true);
  const handleSpeedDialClose = () => setOpen(false);
  
  const actions = [
    { icon: <PeopleIcon />, name: 'Add Student', action: () => navigate('/faculty/students') },
    { icon: <EmojiEventsIcon />, name: 'Record Achievement', action: () => navigate('/faculty/achievements') },
    { icon: <CardMembershipIcon />, name: 'Add Certification', action: () => navigate('/faculty/certifications') },
    { icon: <AssessmentIcon />, name: 'Generate Report', action: () => navigate('/faculty/reports') },
  ];

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <SpeedDial
        ariaLabel="Dashboard Actions"
        icon={<SpeedDialIcon />}
        onClose={handleSpeedDialClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
        sx={{
          '& .MuiFab-primary': {
            background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
            boxShadow: '0 3px 5px 2px rgba(69, 104, 220, .3)',
          }
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.action();
              handleSpeedDialClose();
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default DashboardActions;