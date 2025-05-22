const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Apply authentication middleware to all report routes
router.use(authenticateToken);

// Get all reports
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Create reports table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          format VARCHAR(20) NOT NULL,
          created_by INT NOT NULL,
          file_path VARCHAR(255) NOT NULL,
          file_size VARCHAR(20) NOT NULL,
          students JSON,
          parameters JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES faculty(id)
        )
      `);
      
      // Get faculty ID from token or request
      const facultyId = req.user?.id || req.query.faculty_id || 1;
      
      // Get reports for the faculty
      const [reports] = await connection.query(`
        SELECT 
          r.*,
          f.name as faculty_name
        FROM reports r
        JOIN faculty f ON r.created_by = f.id
        WHERE r.created_by = ?
        ORDER BY r.created_at DESC
      `, [facultyId]);
      
      res.json(reports);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        error: 'Database query error',
        details: error.message
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error.message
    });
  }
});

// Generate a new report
router.post('/generate', async (req, res) => {
  try {
    const { 
      name, 
      type, 
      format, 
      students, 
      parameters 
    } = req.body;
    
    if (!name || !type || !format) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Get faculty ID from token
      const facultyId = req.user?.id || 1; // Default to ID 1 if not available
      
      // Generate file path and size (mock values for now)
      const filePath = `/reports/${name.toLowerCase().replace(/\\s+/g, '_')}_${Date.now()}.${format}`;
      const fileSize = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
      
      // Insert report
      const [result] = await connection.query(`
        INSERT INTO reports (name, type, format, created_by, file_path, file_size, students, parameters)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name,
        type,
        format,
        facultyId,
        filePath,
        fileSize,
        JSON.stringify(students || []),
        JSON.stringify(parameters || {})
      ]);
      
      // Get the inserted report
      const [reportRows] = await connection.query(`
        SELECT 
          r.*,
          f.name as faculty_name
        FROM reports r
        JOIN faculty f ON r.created_by = f.id
        WHERE r.id = ?
      `, [result.insertId]);
      
      res.status(201).json({
        message: 'Report generated successfully',
        report: reportRows[0]
      });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        error: 'Database query error',
        details: error.message
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error.message
    });
  }
});

// Schedule a report
router.post('/schedule', async (req, res) => {
  try {
    const { 
      name, 
      type, 
      format, 
      schedule,
      next_run,
      recipients,
      parameters 
    } = req.body;
    
    if (!name || !type || !format || !schedule || !next_run) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Create scheduled_reports table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS scheduled_reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          format VARCHAR(20) NOT NULL,
          schedule VARCHAR(50) NOT NULL,
          next_run DATE NOT NULL,
          created_by INT NOT NULL,
          recipients JSON,
          parameters JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES faculty(id)
        )
      `);
      
      // Get faculty ID from token
      const facultyId = req.user?.id || 1; // Default to ID 1 if not available
      
      // Insert scheduled report
      const [result] = await connection.query(`
        INSERT INTO scheduled_reports (name, type, format, schedule, next_run, created_by, recipients, parameters)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name,
        type,
        format,
        schedule,
        next_run,
        facultyId,
        JSON.stringify(recipients || []),
        JSON.stringify(parameters || {})
      ]);
      
      // Get the inserted scheduled report
      const [reportRows] = await connection.query(`
        SELECT 
          sr.*,
          f.name as faculty_name
        FROM scheduled_reports sr
        JOIN faculty f ON sr.created_by = f.id
        WHERE sr.id = ?
      `, [result.insertId]);
      
      res.status(201).json({
        message: 'Report scheduled successfully',
        report: reportRows[0]
      });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        error: 'Database query error',
        details: error.message
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error.message
    });
  }
});

// Get scheduled reports
router.get('/scheduled', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get faculty ID from token or request
      const facultyId = req.user?.id || req.query.faculty_id || 1;
      
      // Get scheduled reports for the faculty
      const [reports] = await connection.query(`
        SELECT 
          sr.*,
          f.name as faculty_name
        FROM scheduled_reports sr
        JOIN faculty f ON sr.created_by = f.id
        WHERE sr.created_by = ?
        ORDER BY sr.next_run ASC
      `, [facultyId]);
      
      res.json(reports);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        error: 'Database query error',
        details: error.message
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error.message
    });
  }
});

// Delete a report
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    try {
      // Check if report exists
      const [reports] = await connection.query(
        'SELECT * FROM reports WHERE id = ?',
        [id]
      );
      
      if (reports.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      // Delete report
      await connection.query(
        'DELETE FROM reports WHERE id = ?',
        [id]
      );
      
      res.json({ message: 'Report deleted successfully' });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        error: 'Database query error',
        details: error.message
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error.message
    });
  }
});

// Delete a scheduled report
router.delete('/scheduled/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    try {
      // Check if scheduled report exists
      const [reports] = await connection.query(
        'SELECT * FROM scheduled_reports WHERE id = ?',
        [id]
      );
      
      if (reports.length === 0) {
        return res.status(404).json({ message: 'Scheduled report not found' });
      }
      
      // Delete scheduled report
      await connection.query(
        'DELETE FROM scheduled_reports WHERE id = ?',
        [id]
      );
      
      res.json({ message: 'Scheduled report deleted successfully' });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        error: 'Database query error',
        details: error.message
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      details: error.message
    });
  }
});

module.exports = router;