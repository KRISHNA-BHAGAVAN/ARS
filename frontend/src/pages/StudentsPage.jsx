import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { api } from '../services/api_enhanced';
import AnimatedTable from '../components/AnimatedTable';
import StyledReportDialog from '../components/StyledReportDialog';
import PDFViewer from '../components/PDFViewer';
import CollegeLogo from '../components/CollegeLogo';
import { tableColumns } from '../constants/columns';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedStudentsData, setSelectedStudentsData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  const handlePreview = (regNo) => {
    const url = api.previewIndividualReport(regNo, false, 'modern');
    setViewerUrl(url);
    setViewerOpen(true);
  };

  const handleGenerateReport = (regNo, isPreview = false) => {
    if (isPreview) {
      handlePreview(regNo);
    } else {
      setDialogOpen(true);
      setSelected([regNo]);
    }
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CollegeLogo size="small" showName={false} />
          <Typography variant="h4" component="h1" sx={{ ml: 2, fontWeight: 'bold' }}>
            Students
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AssessmentIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={!selected.length}
          sx={{
            background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
            boxShadow: '0 3px 5px 2px rgba(69, 104, 220, .3)',
          }}
        >
          Generate Report
        </Button>
      </Box>

      <motion.div variants={itemVariants}>
        <Card className="animated-card" sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="600">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon color="primary" />
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
                  {/* Filters component would go here */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary">Apply Filters</Button>
                    <Button variant="outlined">Reset</Button>
                  </Box>
                </Paper>
              </motion.div>
            )}

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
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

      <StyledReportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onGenerate={handleGenerate}
        selected={selected}
      />

      <PDFViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        url={viewerUrl}
      />

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
    </motion.div>
  );
};

export default StudentsPage;