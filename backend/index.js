const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const host = '0.0.0.0';
// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'lucky',
  password: process.env.DB_PASSWORD || '#Db@1234',
  database: process.env.DB_NAME || 'reporting_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Import routes
const facultyRoutes = require('./routes/faculty_routes');
const studentRoutes = require('./routes/student_routes');
const achievementRoutes = require('./routes/achievement_routes');
const reportRoutes = require('./routes/report_routes');
const counselingRoutes = require('./routes/counseling_routes');

// Apply routes
app.use('/api/faculty', facultyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/counseling', counselingRoutes);

// Mock login route for testing
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Mock user data
  const users = {
    faculty: {
      id: 1,
      username: 'faculty',
      name: 'Faculty User',
      role: 'faculty',
      department: 'Computer Science'
    },
    hod: {
      id: 2,
      username: 'hod',
      name: 'HoD User',
      role: 'hod',
      department: 'Computer Science'
    },
    principal: {
      id: 3,
      username: 'principal',
      name: 'Principal User',
      role: 'principal'
    },
    admin: {
      id: 4,
      username: 'admin',
      name: 'Admin User',
      role: 'admin'
    }
  };
  
  // Check credentials
  if (users[username] && password === `${username}123`) {
    const user = users[username];
    
    // Generate JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key', { expiresIn: '7d' });
    
    res.json({
      message: 'Login successful',
      access_token: token,
      refresh_token: refreshToken,
      user
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Mock refresh token route
app.post('/api/auth/refresh', (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }
  
  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
    
    // Mock user lookup
    const users = {
      1: { id: 1, username: 'faculty', name: 'Faculty User', role: 'faculty', department: 'Computer Science' },
      2: { id: 2, username: 'hod', name: 'HoD User', role: 'hod', department: 'Computer Science' },
      3: { id: 3, username: 'principal', name: 'Principal User', role: 'principal' },
      4: { id: 4, username: 'admin', name: 'Admin User', role: 'admin' }
    };
    
    const user = users[decoded.id];
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new access token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    
    res.json({
      message: 'Token refreshed successfully',
      access_token: token
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Start server
app.listen(PORT, host,() => {
  console.log(`Server running on http://${host}:${PORT}`);
});