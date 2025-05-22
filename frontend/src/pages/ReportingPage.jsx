import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { motion } from 'framer-motion';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import StyledReportDialog from '../components/StyledReportDialog';

const ReportingPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('pdf');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type) => {
    setReportType(type);
    setDialogOpen(true);
  };

  const handleGenerate = (params) => {
    console.log('Generating report with params:', params);
    // Implementation would be handled by the StyledReportDialog component
    setDialogOpen(false);
  };

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Report Generation
        </Typography>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab label="Standard Reports" />
          <Tab label="Custom Reports" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card className="animated-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      PDF Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Generate comprehensive PDF reports for individual students or combined reports for multiple students.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                      <PictureAsPdfIcon sx={{ fontSize: 60, color: '#f44336' }} />
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={() => handleOpenDialog('pdf')}
                      sx={{
                        background: 'linear-gradient(45deg, #f44336 30%, #ff9800 90%)',
                        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                      }}
                    >
                      Generate PDF Report
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card className="animated-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Excel Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Generate detailed Excel reports with customizable columns for data analysis and record keeping.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                      <TableChartIcon sx={{ fontSize: 60, color: '#4caf50' }} />
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={() => handleOpenDialog('excel')}
                      sx={{
                        background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                      }}
                    >
                      Generate Excel Report
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Custom Report Builder
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This feature will be available in a future update. Stay tuned!
            </Typography>
          </Paper>
        )}
      </motion.div>

      <StyledReportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onGenerate={handleGenerate}
        reportType={reportType}
      />
    </Container>
  );
};

export default ReportingPage;