const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all students with optional filtering
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      const { branch, semester } = req.query;
      
      // Build query with optional filters
      let query = `
        SELECT 
          s.*,
          AVG(g.grade_points) as cgpa,
          CASE 
            WHEN AVG(g.grade_points) >= 8.5 THEN 'Excellent'
            WHEN AVG(g.grade_points) >= 7.0 THEN 'Good'
            WHEN AVG(g.grade_points) >= 5.0 THEN 'Average'
            ELSE 'At Risk'
          END as status
        FROM students s
        LEFT JOIN grades g ON s.registration_number = g.registration_number
      `;
      
      const queryParams = [];
      const conditions = [];
      
      if (branch) {
        conditions.push('s.branch = ?');
        queryParams.push(branch);
      }
      
      if (semester) {
        conditions.push('s.current_semester = ?');
        queryParams.push(semester);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' GROUP BY s.id';
      
      // Execute query
      const [students] = await connection.query(query, queryParams);
      
      res.json(students);
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

// Get student by registration number
router.get('/:regNo', async (req, res) => {
  try {
    const { regNo } = req.params;
    const connection = await pool.getConnection();
    
    try {
      // Get student details
      const [students] = await connection.query(
        'SELECT * FROM students WHERE registration_number = ?',
        [regNo]
      );
      
      if (students.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      const student = students[0];
      
      // Get grades with course information including semester
      const [gradesRows] = await connection.query(`
        SELECT 
          g.*,
          c.name as course_name,
          c.credits,
          c.semester as course_semester
        FROM grades g
        JOIN courses c ON g.course_code = c.code
        WHERE g.registration_number = ?
        ORDER BY c.semester, g.course_code
      `, [regNo]);
      
      // Get achievements with formatted dates
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
      
      // Get certifications
      let certifications = [];
      try {
        // Check if certifications table exists
        const [tables] = await connection.query("SHOW TABLES LIKE 'certifications'");
        if (tables.length > 0) {
          // Check table structure
          const [columns] = await connection.query("DESCRIBE certifications");
          const columnNames = columns.map(col => col.Field);
          
          // Build query based on available columns
          const selectColumns = ["id", "registration_number", "title"];
          
          if (columnNames.includes("issuing_organization")) 
            selectColumns.push("issuing_organization");
          
          if (columnNames.includes("issue_date")) 
            selectColumns.push("DATE_FORMAT(issue_date, '%Y-%m-%d') as issue_date");
          
          if (columnNames.includes("expiry_date")) 
            selectColumns.push("DATE_FORMAT(expiry_date, '%Y-%m-%d') as expiry_date");
          
          if (columnNames.includes("credential_id")) 
            selectColumns.push("credential_id");
          
          if (columnNames.includes("certificate_url")) 
            selectColumns.push("certificate_url");
          
          if (columnNames.includes("verified")) 
            selectColumns.push("verified");
          
          const query = `
            SELECT ${selectColumns.join(", ")}
            FROM certifications
            WHERE registration_number = ?
            ORDER BY ${columnNames.includes("issue_date") ? "issue_date" : "id"} DESC
          `;
          
          [certifications] = await connection.query(query, [regNo]);
        }
      } catch (error) {
        console.log("Error fetching certifications:", error.message);
        // If there's an error, just return an empty array
        certifications = [];
      }
      
      // Calculate CGPA and status
      let cgpa = 0;
      if (gradesRows.length > 0) {
        cgpa = gradesRows.reduce((sum, grade) => sum + grade.grade_points, 0) / gradesRows.length;
        cgpa = parseFloat(cgpa.toFixed(2));
      }
      
      const status = cgpa >= 8.5 ? 'Excellent' : 
                    cgpa >= 7.0 ? 'Good' : 
                    cgpa >= 5.0 ? 'Average' : 'At Risk';
                    
      // Calculate total and completed credits
      let total_credits = 0;
      let completed_credits = 0;
      
      gradesRows.forEach(grade => {
        if (grade.credits) {
          total_credits += parseInt(grade.credits);
          // Consider a grade as completed if it's a pass (typically grade point >= 4.0)
          if (grade.grade_points >= 4.0) {
            completed_credits += parseInt(grade.credits);
          }
        }
      });
      
      // Calculate semester-wise SGPA
      const semesterGrades = {};
      gradesRows.forEach(grade => {
        const semester = grade.course_semester;
        if (!semesterGrades[semester]) {
          semesterGrades[semester] = [];
        }
        semesterGrades[semester].push(grade);
      });
      
      const sgpaData = Object.keys(semesterGrades).map(semester => {
        const grades = semesterGrades[semester];
        const sgpa = grades.reduce((sum, grade) => sum + grade.grade_points, 0) / grades.length;
        return {
          semester: parseInt(semester),
          sgpa: parseFloat(sgpa.toFixed(2)),
          courses: grades.length
        };
      }).sort((a, b) => a.semester - b.semester);
      
      // Generate attendance data
      const attendanceData = [];
      const currentDate = new Date();
      for (let i = 0; i < 6; i++) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        attendanceData.push({
          date: date.toISOString().split('T')[0],
          attendance_percentage: 85 + Math.floor(Math.random() * 10)
        });
      }
      
      // Return comprehensive student data
      res.json({
        ...student,
        cgpa,
        status,
        total_credits,
        completed_credits,
        grades: gradesRows,
        sgpaData,
        achievements,
        certifications,
        attendance: attendanceData
      });
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

// Add achievement for a student
router.post('/:regNo/achievements', async (req, res) => {
  try {
    const { regNo } = req.params;
    const { title, description, achievement_date, category, scope } = req.body;
    
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
      let formattedDate = null;
      if (achievement_date) {
        // Check if it's in DD/MM/YYYY format
        const dateParts = achievement_date.split('/');
        if (dateParts.length === 3) {
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        } else {
          formattedDate = achievement_date;
        }
      }
      
      // Insert achievement
      const [result] = await connection.query(
        `INSERT INTO achievements 
         (registration_number, title, description, achievement_date, category, scope) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [regNo, title, description, formattedDate, category, scope || 'Inside the College']
      );
      
      // Get the inserted achievement with formatted date
      const [achievementRows] = await connection.query(
        'SELECT id, registration_number, title, description, DATE_FORMAT(achievement_date, "%Y-%m-%d") as achievement_date, category, scope, created_at, updated_at FROM achievements WHERE id = ?',
        [result.insertId]
      );
      
      res.status(201).json(achievementRows[0]);
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

// Update achievement for a student
router.put('/:regNo/achievements/:id', async (req, res) => {
  try {
    const { regNo, id } = req.params;
    const { title, description, achievement_date, category, scope } = req.body;
    
    const connection = await pool.getConnection();
    
    try {
      // Check if achievement exists and belongs to the student
      const [achievements] = await connection.query(
        'SELECT * FROM achievements WHERE id = ? AND registration_number = ?',
        [id, regNo]
      );
      
      if (achievements.length === 0) {
        return res.status(404).json({ message: 'Achievement not found or does not belong to this student' });
      }
      
      // Format date from DD/MM/YYYY to MySQL format (YYYY-MM-DD) if provided
      let formattedDate = null;
      if (achievement_date) {
        // Check if it's in DD/MM/YYYY format
        const dateParts = achievement_date.split('/');
        if (dateParts.length === 3) {
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        } else {
          formattedDate = achievement_date;
        }
      }
      
      // Update achievement
      await connection.query(
        `UPDATE achievements 
         SET title = ?, description = ?, achievement_date = ?, category = ?, scope = ?
         WHERE id = ?`,
        [title, description, formattedDate, category, scope || 'Inside the College', id]
      );
      
      // Get the updated achievement with formatted date
      const [updatedAchievement] = await connection.query(
        'SELECT id, registration_number, title, description, DATE_FORMAT(achievement_date, "%Y-%m-%d") as achievement_date, category, scope, created_at, updated_at FROM achievements WHERE id = ?',
        [id]
      );
      
      res.json(updatedAchievement[0]);
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

// Delete achievement for a student
router.delete('/:regNo/achievements/:id', async (req, res) => {
  try {
    const { regNo, id } = req.params;
    
    const connection = await pool.getConnection();
    
    try {
      // Check if achievement exists and belongs to the student
      const [achievements] = await connection.query(
        'SELECT * FROM achievements WHERE id = ? AND registration_number = ?',
        [id, regNo]
      );
      
      if (achievements.length === 0) {
        return res.status(404).json({ message: 'Achievement not found or does not belong to this student' });
      }
      
      // Delete achievement
      await connection.query(
        'DELETE FROM achievements WHERE id = ?',
        [id]
      );
      
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
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection error', 
      error: error.message 
    });
  }
});

// Add certification for a student
router.post('/:regNo/certifications', async (req, res) => {
  try {
    const { regNo } = req.params;
    const { 
      title, 
      description, 
      issuing_organization, 
      issue_date, 
      expiry_date, 
      credential_id, 
      certificate_url 
    } = req.body;
    
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
      
      // Format dates from DD/MM/YYYY to MySQL format (YYYY-MM-DD) if provided
      let formattedIssueDate = null;
      if (issue_date) {
        const dateParts = issue_date.split('/');
        if (dateParts.length === 3) {
          formattedIssueDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        } else {
          formattedIssueDate = issue_date;
        }
      }
      
      let formattedExpiryDate = null;
      if (expiry_date) {
        const dateParts = expiry_date.split('/');
        if (dateParts.length === 3) {
          formattedExpiryDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        } else {
          formattedExpiryDate = expiry_date;
        }
      }
      
      // Create certifications table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS certifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          registration_number VARCHAR(20) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          issuing_organization VARCHAR(255),
          issue_date DATE,
          expiry_date DATE,
          credential_id VARCHAR(100),
          certificate_url VARCHAR(255),
          verified BOOLEAN DEFAULT FALSE,
          verified_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (registration_number) REFERENCES students(registration_number) ON DELETE CASCADE
        )
      `);
      
      // Insert certification
      const [result] = await connection.query(
        `INSERT INTO certifications 
         (registration_number, title, description, issuing_organization, issue_date, expiry_date, credential_id, certificate_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [regNo, title, description, issuing_organization, formattedIssueDate, formattedExpiryDate, credential_id, certificate_url]
      );
      
      // Get the inserted certification with formatted dates
      const [certificationRows] = await connection.query(
        `SELECT 
          id, 
          registration_number, 
          title, 
          description, 
          issuing_organization,
          DATE_FORMAT(issue_date, '%Y-%m-%d') as issue_date, 
          DATE_FORMAT(expiry_date, '%Y-%m-%d') as expiry_date,
          credential_id,
          certificate_url,
          verified,
          created_at, 
          updated_at 
        FROM certifications 
        WHERE id = ?`,
        [result.insertId]
      );
      
      res.status(201).json(certificationRows[0]);
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