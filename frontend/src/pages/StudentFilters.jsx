import React, { useState } from "react";
import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Box, 
  Button, 
  Typography,
  Chip
} from "@mui/material";
import { motion } from "framer-motion";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';

const branchMap = {
  AIML: "Artificial Intelligence And Machine Learning",
  CSE: "Computer Science and Engineering",
  IT: "Information Technology",
  ECE: "Electronics and Communication Engineering",
  EEE: "Electrical and Electronics Engineering",
  MECH: "Mechanical Engineering",
  CIVIL: "Civil Engineering",
};

export default function Filters({ onFilterChange }) {
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const handleBranchChange = (event) => {
    const value = event.target.value;
    setBranch(value);
    
    // Update active filters
    if (value) {
      setActiveFilters(prev => {
        const newFilters = prev.filter(f => f.type !== 'branch');
        return [...newFilters, { type: 'branch', value, label: value }];
      });
    } else {
      setActiveFilters(prev => prev.filter(f => f.type !== 'branch'));
    }
    
    onFilterChange({
      branch: value ? branchMap[value] : '',
      semester,
    });
  };

  const handleSemesterChange = (event) => {
    const value = event.target.value;
    setSemester(value);
    
    // Update active filters
    if (value) {
      setActiveFilters(prev => {
        const newFilters = prev.filter(f => f.type !== 'semester');
        return [...newFilters, { type: 'semester', value, label: `Semester ${value}` }];
      });
    } else {
      setActiveFilters(prev => prev.filter(f => f.type !== 'semester'));
    }
    
    onFilterChange({
      branch: branch ? branchMap[branch] : '',
      semester: value,
    });
  };

  const handleClearFilters = () => {
    setBranch("");
    setSemester("");
    setActiveFilters([]);
    onFilterChange({ branch: '', semester: '' });
  };

  const handleRemoveFilter = (filterType) => {
    if (filterType === 'branch') {
      setBranch("");
    } else if (filterType === 'semester') {
      setSemester("");
    }
    
    setActiveFilters(prev => prev.filter(f => f.type !== filterType));
    
    onFilterChange({
      branch: filterType === 'branch' ? '' : (branch ? branchMap[branch] : ''),
      semester: filterType === 'semester' ? '' : semester,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Branch</InputLabel>
          <Select
            value={branch}
            onChange={handleBranchChange}
            label="Branch"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: branch ? 'primary.main' : 'inherit',
              },
            }}
          >
            <MenuItem value=""><em>All Branches</em></MenuItem>
            {Object.keys(branchMap).map((code) => (
              <MenuItem key={code} value={code}>{code}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel>Semester</InputLabel>
          <Select
            value={semester}
            onChange={handleSemesterChange}
            label="Semester"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: semester ? 'primary.main' : 'inherit',
              },
            }}
          >
            <MenuItem value=""><em>All Semesters</em></MenuItem>
            {[...Array(8)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterAltIcon />}
          onClick={() => onFilterChange({
            branch: branch ? branchMap[branch] : '',
            semester,
          })}
          sx={{ 
            minWidth: { xs: '100%', sm: '120px' },
            background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
          }}
        >
          Apply
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          sx={{ minWidth: { xs: '100%', sm: '120px' } }}
        >
          Clear
        </Button>
      </Box>
      
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Active Filters:
            </Typography>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.type}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter.type)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
}