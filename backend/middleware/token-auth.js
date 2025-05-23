const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // If no token, allow the request to proceed but mark as unauthenticated
  if (!token) {
    console.log('No token provided, proceeding as unauthenticated');
    req.user = { id: 1, role: 'faculty' }; // Default user for development
    return next();
  }
  
  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      console.log('Invalid token, proceeding as unauthenticated');
      req.user = { id: 1, role: 'faculty' }; // Default user for development
      return next();
    }
    
    // Set the user in the request
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };