import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import Filters from './StudentFilters';
import PdfViewer from './PdfViewer';
import Header from '../components/Header';
import AnimatedTable from '../components/AnimatedTable';
import StyledReportDialog from '../components/StyledReportDialog';
import { tableColumns } from '../constants/columns';

export default function StudentRecords() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);             // registered_no array
  const [selectedStudentsData, setSelectedStudentsData] = useState([]); // full objects
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // PDF Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');

  useEffect(() => {
    setLoading(true);
    api.fetchStudents()
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Failed to load student data',
          severity: 'error'
        });
      });
  }, []);

  const handleSelect = regNo => {
    const student = students.find(s => s.registered_no === regNo);
    setSelected(prev =>
      prev.includes(regNo) ? prev.filter(id => id !== regNo) : [...prev, regNo]
    );
    setSelectedStudentsData(prev =>
      prev.some(s => s.registered_no === regNo)
        ? prev.filter(s => s.registered_no !== regNo)
        : [...prev, student]
    );
  };

  const handleClearSelection = () => {
    setSelected([]);
    setSelectedStudentsData([]);
  };

  const handleFilterChange = ({ branch, semester }) => {
    setLoading(true);
    api.fetchStudents(branch, semester)
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Failed to apply filters',
          severity: 'error'
        });
      });
  };

  const handleGenerate = (params) => {
    if (params.reportType === 'pdf') {
      const url = api.downloadBulkReport({
        selected: params.selected,
        reportType: params.reportType,
        pdfType: params.pdfType,
        includeCharts: params.includeCharts,
        templateStyle: params.templateStyle
      });
      
      const link = document.createElement('a');
      link.href = url;
      link.download = params.pdfType === 'individual' ? 'Student_Reports.zip' : 'Combined_Student_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSnackbar({
        open: true,
        message: 'PDF report generated successfully',
        severity: 'success'
      });
    } else if (params.reportType === 'excel') {
      const url = api.downloadBulkReport({
        selected: params.selected,
        reportType: params.reportType,
        selected_columns: params.selected_columns
      });
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Student_Report.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSnackbar({
        open: true,
        message: 'Excel report generated successfully',
        severity: 'success'
      });
    }
  };

undefined

  const displayedStudents = showSelectedOnly
    ? students.filter(s => selected.includes(s.registered_no))
    : students;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="animated-card" sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2" fontWeight="600">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon color="primary" />
                      Student Records
                    </Box>
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    Filters
                  </Button>
                </Box>
                
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                      <Filters onFilterChange={handleFilterChange} />
                    </Paper>
                  </motion.div>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  <Card sx={{ bgcolor: 'primary.main', color: 'white', flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Total Students</Typography>
                      <Typography variant="h3">{students.length}</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: 'secondary.main', color: 'white', flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Selected</Typography>
                      <Typography variant="h3">{selected.length}</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: '#4caf50', color: 'white', flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Branches</Typography>
                      <Typography variant="h3">
                        {new Set(students.map(s => s.branch)).size}
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={handleClearSelection}
                    className="hover-effect"
                  >
                    Clear Selection
                  </Button>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showSelectedOnly}
                        onChange={() => setShowSelectedOnly(v => !v)}
                      />
                    }
                    label="Show Selected Only"
                  />
                  
                  {selected.length > 0 && (
                    <Chip 
                      label={`${selected.length} students selected`} 
                      color="primary" 
                      variant="outlined" 
                    />
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {loading ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <div className="shimmer" style={{ width: '100%', height: '400px', borderRadius: '8px' }}></div>
                  </Box>
                ) : displayedStudents.length > 0 ? (
                  <AnimatedTable
                    columns={tableColumns}
                    data={displayedStudents}
                    selected={selected}
                    handleSelect={handleSelect}
                    handleGenerateReport={handleGenerateReport}
                  />
                ) : (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    No students found matching the current filters.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AssignmentIcon />}
                disabled={!selected.length}
                onClick={() => setDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(69, 104, 220, .3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px 2px rgba(69, 104, 220, .3)',
                  }
                }}
                className={selected.length ? "pulse-button" : ""}
              >
                Generate Report for Selected Students
              </Button>
            </Box>
          </motion.div>
        </motion.div>

        <StyledReportDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onGenerate={handleGenerate}
          selected={selected}
        />

        {/* PDF Preview Dialog */}
        <Dialog
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            style: { borderRadius: 16 }
          }}
        >
          <DialogTitle>
            PDF Preview
            <IconButton
              aria-label="close"
              onClick={() => setViewerOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {viewerUrl ? (
              <PdfViewer src={viewerUrl} />
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            variant="filled"
            className="toast-notification"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}