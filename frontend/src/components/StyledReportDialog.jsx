import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Chip,
  IconButton,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { api } from '../services/api';

const StyledReportDialog = ({ open, onClose, onGenerate, reportType = 'pdf', selected = [] }) => {
  const [pdfType, setPdfType] = useState('individual');
  const [includeCharts, setIncludeCharts] = useState(false);
  const [templateStyle, setTemplateStyle] = useState('classic');
  const [selectedColumns, setSelectedColumns] = useState([
    'registered_no', 'name', 'branch', 'curr_semester', 'sgpa'
  ]);
  const [selectedStudents, setSelectedStudents] = useState(selected);
  const [studentInput, setStudentInput] = useState('');

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedStudents(selected);
    }
  }, [open, selected]);

  const handleAddStudent = () => {
    if (studentInput && !selectedStudents.includes(studentInput)) {
      setSelectedStudents([...selectedStudents, studentInput]);
      setStudentInput('');
    }
  };

  const handleRemoveStudent = (student) => {
    setSelectedStudents(selectedStudents.filter(s => s !== student));
  };

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleGenerate = () => {
    onGenerate({
      reportType,
      pdfType: reportType === 'pdf' ? pdfType : null,
      includeCharts: reportType === 'pdf' ? includeCharts : false,
      templateStyle: reportType === 'pdf' ? templateStyle : null,
      selected: selectedStudents,
      selected_columns: reportType === 'excel' ? selectedColumns : null
    });
  };

  const availableColumns = [
    { value: 'registered_no', label: 'Registration Number' },
    { value: 'name', label: 'Name' },
    { value: 'branch', label: 'Branch' },
    { value: 'curr_semester', label: 'Current Semester' },
    { value: 'sgpa', label: 'SGPA' },
    { value: 'cgpa', label: 'CGPA' },
    { value: 'address', label: 'Address' },
    { value: 'father_name', label: 'Father Name' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: reportType === 'pdf' ? '#f44336' : '#4caf50', color: 'white' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {reportType === 'pdf' ? (
              <PictureAsPdfIcon sx={{ mr: 1 }} />
            ) : (
              <TableChartIcon sx={{ mr: 1 }} />
            )}
            <Typography variant="h6">
              {reportType === 'pdf' ? 'Generate PDF Report' : 'Generate Excel Report'}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Select Students
            </Typography>
            
            <Box sx={{ mb: 2, display: 'flex' }}>
              <TextField
                label="Registration Number"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                size="small"
                fullWidth
              />
              <Button 
                variant="contained" 
                onClick={handleAddStudent}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              {selectedStudents.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedStudents.map((student) => (
                    <Chip
                      key={student}
                      label={student}
                      onDelete={() => handleRemoveStudent(student)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No students selected. Please add at least one student.
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {reportType === 'pdf' ? (
              <>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  PDF Options
                </Typography>
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={pdfType}
                    onChange={(e) => setPdfType(e.target.value)}
                    label="Report Type"
                  >
                    <MenuItem value="individual">Individual Reports (One per student)</MenuItem>
                    <MenuItem value="combined">Combined Report (All students)</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Template Style</InputLabel>
                  <Select
                    value={templateStyle}
                    onChange={(e) => setTemplateStyle(e.target.value)}
                    label="Template Style"
                  >
                    <MenuItem value="classic">Classic</MenuItem>
                    <MenuItem value="modern">Modern</MenuItem>
                    <MenuItem value="minimal">Minimal</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={includeCharts} 
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                    />
                  }
                  label="Include Performance Charts"
                />
              </>
            ) : (
              <>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Excel Options
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  Select columns to include:
                </Typography>
                
                <List dense>
                  {availableColumns.map((column) => (
                    <ListItem 
                      key={column.value}
                      dense
                      button
                      onClick={() => handleColumnToggle(column.value)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedColumns.includes(column.value)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={column.label} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate}
          variant="contained"
          disabled={selectedStudents.length === 0}
          startIcon={reportType === 'pdf' ? <PictureAsPdfIcon /> : <TableChartIcon />}
          sx={{
            bgcolor: reportType === 'pdf' ? '#f44336' : '#4caf50',
            '&:hover': {
              bgcolor: reportType === 'pdf' ? '#d32f2f' : '#388e3c',
            }
          }}
        >
          Generate {reportType === 'pdf' ? 'PDF' : 'Excel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StyledReportDialog;