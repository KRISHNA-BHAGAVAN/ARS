-- Create student_summary table if it doesn't exist
CREATE TABLE IF NOT EXISTS student_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT UNIQUE NOT NULL,
  cgpa DECIMAL(3,2),
  previous_cgpa DECIMAL(3,2),
  total_credits INT DEFAULT 0,
  completed_credits INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insert sample data for existing students
INSERT IGNORE INTO student_summary (student_id, cgpa, previous_cgpa, total_credits, completed_credits)
SELECT 
  id,
  ROUND(RAND() * 3 + 7, 2), -- Random CGPA between 7.0 and 10.0
  ROUND(RAND() * 3 + 6.5, 2), -- Random previous CGPA between 6.5 and 9.5
  120,
  100
FROM students;