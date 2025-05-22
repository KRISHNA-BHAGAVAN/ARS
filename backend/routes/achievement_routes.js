const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [achievements] = await connection.query(`
        SELECT 
          id, 
          registration_number, 
          title, 
          description, 
          DATE_FORMAT(achievement_date, '%Y-%m-%d') as achievement_date, 
          category,
          scope,
          created_at, 
          updated_at 
        FROM achievements 
        ORDER BY achievement_date DESC
      `);
      
      res.json(achievements);
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

// Get achievements for a specific student
router.get('/student/:regNo', async (req, res) => {
  try {
    const { regNo } = req.params;
    const connection = await pool.getConnection();
    
    try {
      const [achievements] = await connection.query(`
        SELECT 
          id, 
          registration_number, 
          title, 
          description, 
          DATE_FORMAT(achievement_date, '%Y-%m-%d') as achievement_date, 
          category,
          scope,
          created_at, 
          updated_at 
        FROM achievements 
        WHERE registration_number = ?
        ORDER BY achievement_date DESC
      `, [regNo]);
      
      res.json(achievements);
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

// Get link status
router.get('/link-status', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Create settings table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS settings (
          key_name VARCHAR(100) PRIMARY KEY,
          value TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      const [rows] = await connection.query(
        "SELECT value FROM settings WHERE key_name = 'achievement_link_active'"
      );
      
      const isActive = rows.length > 0 ? rows[0].value === 'true' : true;
      res.json({ active: isActive });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ message: 'Error fetching link status', error: error.message });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error', error: error.message });
  }
});

// Update link status
router.post('/link-status', async (req, res) => {
  try {
    const { active } = req.body;
    
    if (active === undefined) {
      return res.status(400).json({ message: 'Missing active status' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Create settings table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS settings (
          key_name VARCHAR(100) PRIMARY KEY,
          value TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      await connection.query(
        "INSERT INTO settings (key_name, value) VALUES ('achievement_link_active', ?) " +
        "ON DUPLICATE KEY UPDATE value = ?",
        [active.toString(), active.toString()]
      );
      
      res.json({ message: 'Link status updated', active });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ message: 'Error updating link status', error: error.message });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST a new achievement
router.post('/', async (req, res) => {
  try {
    const { registration_number, title, description, category, achievement_date, scope } = req.body;
    
    // Validate required fields
    if (!registration_number || !title || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.query(`
        INSERT INTO achievements 
        (registration_number, title, description, category, achievement_date, scope)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [registration_number, title, description, category, achievement_date, scope]);
      
      // Get the inserted achievement
      const [achievements] = await connection.query(`
        SELECT 
          id, 
          registration_number, 
          title, 
          description, 
          DATE_FORMAT(achievement_date, '%Y-%m-%d') as achievement_date, 
          category,
          scope,
          created_at, 
          updated_at 
        FROM achievements 
        WHERE id = ?
      `, [result.insertId]);
      
      res.status(201).json(achievements[0]);
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
    console.error('Error creating achievement:', error);
    res.status(500).json({ 
      message: 'Error creating achievement', 
      error: error.message 
    });
  }
});

// Update an achievement
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, achievement_date, scope } = req.body;
    
    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      await connection.query(`
        UPDATE achievements 
        SET title = ?, description = ?, category = ?, achievement_date = ?, scope = ?
        WHERE id = ?
      `, [title, description, category, achievement_date, scope, id]);
      
      // Get the updated achievement
      const [achievements] = await connection.query(`
        SELECT 
          id, 
          registration_number, 
          title, 
          description, 
          DATE_FORMAT(achievement_date, '%Y-%m-%d') as achievement_date, 
          category,
          scope,
          created_at, 
          updated_at 
        FROM achievements 
        WHERE id = ?
      `, [id]);
      
      if (achievements.length === 0) {
        return res.status(404).json({ message: 'Achievement not found' });
      }
      
      res.json(achievements[0]);
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
    console.error('Error updating achievement:', error);
    res.status(500).json({ 
      message: 'Error updating achievement', 
      error: error.message 
    });
  }
});

// Delete an achievement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.query('DELETE FROM achievements WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Achievement not found' });
      }
      
      res.json({ message: 'Achievement deleted successfully' });
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
    console.error('Error deleting achievement:', error);
    res.status(500).json({ 
      message: 'Error deleting achievement', 
      error: error.message 
    });
  }
});

module.exports = router;