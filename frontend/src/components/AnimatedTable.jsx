import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

const AnimatedTable = ({ columns, data, selected, handleSelect, handleGenerateReport }) => {
  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 200,
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="body1" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650 }} aria-label="student table">
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            {columns.map((col, index) => (
              <TableCell key={index}>{col}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <motion.tbody
          variants={tableVariants}
          initial="hidden"
          animate="show"
        >
          {Array.isArray(data) && data.map((row) => (
            <motion.tr
              key={row.registered_no}
              variants={rowVariants}
              className="table-row-hover"
              component={TableRow}
              whileHover={{ 
                backgroundColor: "rgba(69, 104, 220, 0.04)",
                transition: { duration: 0.1 }
              }}
            >
              <TableCell>
                <Checkbox
                  checked={selected.includes(row.registered_no)}
                  onChange={() => handleSelect(row.registered_no)}
                  className="checkbox-animation"
                  color="primary"
                />
              </TableCell>
              <TableCell>{row.registered_no}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.branch}</TableCell>
              <TableCell>{row.curr_semester}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Generate Report">
                    <IconButton
                      color="primary"
                      onClick={() => handleGenerateReport(row.registered_no)}
                      className="wave-effect"
                    >
                      <GetAppIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Preview Report">
                    <IconButton
                      color="secondary"
                      onClick={() => handleGenerateReport(row.registered_no, true)}
                      className="wave-effect"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </motion.tr>
          ))}
        </motion.tbody>
      </Table>
    </TableContainer>
  );
};

export default AnimatedTable;