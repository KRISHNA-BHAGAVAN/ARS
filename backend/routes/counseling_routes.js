const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/token-auth');
const pool = require('../config/database');

// Apply authentication middleware to all counseling routes
router.use(authenticateToken);

// Get counseling notes for a student
router.get('/student/:regNo', async (req, res) => {
  try {
    const { regNo } = req.params;
    const connection = await pool.getConnection();
    
    try {
      // Check if student exists
      const [students] = await connection.query(
        'SELECT * FROM students WHERE registration_number = ?',
        [regNo]
      );
      
      if (students.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      // Get counseling notes with faculty information
      const [notes] = await connection.query(`
        SELECT 
          cn.*,
          f.name as faculty_name,
          DATE_FORMAT(cn.counseling_date, '%Y-%m-%d') as formatted_date
        FROM counseling_notes cn
        JOIN faculty f ON cn.faculty_id = f.id
        WHERE cn.registration_number = ?
        ORDER BY cn.counseling_date DESC
      `, [regNo]);
      
      res.json(notes);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        message: 'Database query error', 
        error: error.message 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection error', 
      error: error.message 
    });
  }
});

// Add counseling note for a student
router.post('/student/:regNo', async (req, res) => {
  try {
    const { regNo } = req.params;
    const { note, counseling_date } = req.body;
    
    // Get faculty ID from token or request body
    const facultyId = req.user?.id || req.body.faculty_id || 1;
    
    if (!note || !counseling_date) {
      return res.status(400).json({ message: 'Note and counseling date are required' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Check if student exists
      const [students] = await connection.query(
        'SELECT * FROM students WHERE registration_number = ?',
        [regNo]
      );
      
      if (students.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      // Format date from DD/MM/YYYY to MySQL format (YYYY-MM-DD) if provided
      let formattedDate = counseling_date;
      if (counseling_date && counseling_date.includes('/')) {
        const dateParts = counseling_date.split('/');
        if (dateParts.length === 3) {
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }
      }
      
      // Insert counseling note
      const [result] = await connection.query(
        `INSERT INTO counseling_notes 
         (registration_number, faculty_id, note, counseling_date) 
         VALUES (?, ?, ?, ?)`,
        [regNo, facultyId, note, formattedDate]
      );
      
      // Get the inserted note with faculty information
      const [noteRows] = await connection.query(`
        SELECT 
          cn.*,
          f.name as faculty_name,
          DATE_FORMAT(cn.counseling_date, '%Y-%m-%d') as formatted_date
        FROM counseling_notes cn
        JOIN faculty f ON cn.faculty_id = f.id
        WHERE cn.id = ?
      `, [result.insertId]);
      
      res.status(201).json(noteRows[0]);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        message: 'Database query error', 
        error: error.message 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection error', 
      error: error.message 
    });
  }
});

// Update counseling note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { note, counseling_date } = req.body;
    
    if (!note && !counseling_date) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Check if note exists
      const [notes] = await connection.query(
        'SELECT * FROM counseling_notes WHERE id = ?',
        [id]
      );
      
      if (notes.length === 0) {
        return res.status(404).json({ message: 'Counseling note not found' });
      }
      
      // Format date from DD/MM/YYYY to MySQL format (YYYY-MM-DD) if provided
      let formattedDate = counseling_date;
      if (counseling_date && counseling_date.includes('/')) {
        const dateParts = counseling_date.split('/');
        if (dateParts.length === 3) {
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }
      }
      
      // Update fields that are provided
      const updateFields = [];
      const updateValues = [];
      
      if (note) {
        updateFields.push('note = ?');
        updateValues.push(note);
      }
      
      if (counseling_date) {
        updateFields.push('counseling_date = ?');
        updateValues.push(formattedDate);
      }
      
      // Add id to values array
      updateValues.push(id);
      
      // Update counseling note
      await connection.query(
        `UPDATE counseling_notes 
         SET ${updateFields.join(', ')}
         WHERE id = ?`,
        updateValues
      );
      
      // Get the updated note with faculty information
      const [updatedNote] = await connection.query(`
        SELECT 
          cn.*,
          f.name as faculty_name,
          DATE_FORMAT(cn.counseling_date, '%Y-%m-%d') as formatted_date
        FROM counseling_notes cn
        JOIN faculty f ON cn.faculty_id = f.id
        WHERE cn.id = ?
      `, [id]);
      
      res.json(updatedNote[0]);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        message: 'Database query error', 
        error: error.message 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection error', 
      error: error.message 
    });
  }
});

// Delete counseling note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    try {
      // Check if note exists
      const [notes] = await connection.query(
        'SELECT * FROM counseling_notes WHERE id = ?',
        [id]
      );
      
      if (notes.length === 0) {
        return res.status(404).json({ message: 'Counseling note not found' });
      }
      
      // Delete note
      await connection.query(
        'DELETE FROM counseling_notes WHERE id = ?',
        [id]
      );
      
      res.json({ message: 'Counseling note deleted successfully' });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        message: 'Database query error', 
        error: error.message 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection error', 
      error: error.message 
    });
  }
});

module.exports = router;