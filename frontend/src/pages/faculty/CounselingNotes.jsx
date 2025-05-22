import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  List,
  ListItem,
  IconButton,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// API
import { counselingApi } from '../../services/counseling-api';

const CounselingNotes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [counselingNotes, setCounselingNotes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteData, setNoteData] = useState({
    note: '',
    counseling_date: new Date().toISOString().split('T')[0]
  });
  const [editingNoteId, setEditingNoteId] = useState(null);

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

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Fetch students assigned to the faculty
        const response = await fetch('http://localhost:5000/api/students');
        const data = await response.json();
        
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students. Please try again.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const fetchCounselingNotes = async (regNo) => {
    if (!regNo) return;
    
    setLoading(true);
    try {
      const notes = await counselingApi.getCounselingNotes(regNo);
      setCounselingNotes(notes);
    } catch (error) {
      console.error('Error fetching counseling notes:', error);
      setCounselingNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (event) => {
    const regNo = event.target.value;
    setSelectedStudent(regNo);
    fetchCounselingNotes(regNo);
  };

  const handleOpenDialog = (note = null) => {
    if (note) {
      setNoteData({
        note: note.note,
        counseling_date: note.formatted_date || note.counseling_date.split('T')[0]
      });
      setEditingNoteId(note.id);
    } else {
      setNoteData({
        note: '',
        counseling_date: new Date().toISOString().split('T')[0]
      });
      setEditingNoteId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNoteData({
      note: '',
      counseling_date: new Date().toISOString().split('T')[0]
    });
    setEditingNoteId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteData({
      ...noteData,
      [name]: value
    });
  };

  const handleDateChange = (e) => {
    setNoteData({
      ...noteData,
      counseling_date: e.target.value
    });
  };

  const handleSaveNote = async () => {
    if (!selectedStudent || !noteData.note || !noteData.counseling_date) {
      return;
    }

    try {
      if (editingNoteId) {
        // Update existing note
        await counselingApi.updateCounselingNote(editingNoteId, noteData);
      } else {
        // Add new note
        await counselingApi.addCounselingNote(selectedStudent, noteData);
      }
      
      // Refresh notes
      fetchCounselingNotes(selectedStudent);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving counseling note:', error);
      setError('Failed to save counseling note. Please try again.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this counseling note?')) {
      return;
    }

    try {
      await counselingApi.deleteCounselingNote(id);
      
      // Refresh notes
      fetchCounselingNotes(selectedStudent);
    } catch (error) {
      console.error('Error deleting counseling note:', error);
      setError('Failed to delete counseling note. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Counseling Notes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage counseling sessions and notes for students
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Select Student
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Select
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  label="Student"
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select a student</em>
                  </MenuItem>
                  {students.map((student) => (
                    <MenuItem key={student.registration_number} value={student.registration_number}>
                      {student.name} ({student.registration_number})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedStudent && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    fullWidth
                  >
                    Add New Counseling Note
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 3, minHeight: '60vh' }}>
              <Typography variant="h6" gutterBottom>
                Counseling History
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : !selectedStudent ? (
                <Alert severity="info">
                  Please select a student to view counseling notes
                </Alert>
              ) : counselingNotes.length === 0 ? (
                <Alert severity="info">
                  No counseling notes found for this student
                </Alert>
              ) : (
                <List>
                  {counselingNotes.map((note) => (
                    <React.Fragment key={note.id}>
                      <ListItem alignItems="flex-start">
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {formatDate(note.counseling_date)}
                            </Typography>
                            <Box>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(note)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            By: {note.faculty_name || 'Faculty'}
                          </Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {note.note}
                          </Typography>
                        </Box>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Dialog for adding/editing counseling notes */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNoteId ? 'Edit Counseling Note' : 'Add New Counseling Note'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Counseling Date"
                type="date"
                name="counseling_date"
                value={noteData.counseling_date}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Counseling Note"
                multiline
                rows={6}
                value={noteData.note}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CounselingNotes;