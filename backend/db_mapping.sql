-- This script helps map faculty to students in your existing database

-- Insert faculty if they don't exist
INSERT IGNORE INTO faculty (name, username, password, email, department, role) VALUES
('Dr. Sharma', 'faculty', 'faculty123', 'sharma@example.com', 'Computer Science', 'faculty'),
('Dr. Patel', 'hod', 'hod123', 'patel@example.com', 'Computer Science', 'hod'),
('Dr. Gupta', 'principal', 'principal123', 'gupta@example.com', 'Administration', 'principal'),
('Admin User', 'admin', 'admin123', 'admin@example.com', 'IT', 'admin');

-- Map faculty to students
-- This will map the faculty user to all students in the database
INSERT IGNORE INTO faculty_student_mapping (faculty_id, student_id)
SELECT 
  (SELECT id FROM faculty WHERE username = 'faculty' LIMIT 1) as faculty_id,
  s.id as student_id
FROM 
  students s
WHERE 
  NOT EXISTS (
    SELECT 1 FROM faculty_student_mapping fsm 
    WHERE fsm.student_id = s.id AND fsm.faculty_id = (SELECT id FROM faculty WHERE username = 'faculty' LIMIT 1)
  );

-- Create student summary data if it doesn't exist
-- This will calculate CGPA and credits from existing grades
INSERT IGNORE INTO student_summary (student_id, cgpa, total_credits, completed_credits)
SELECT 
  s.id,
  AVG(g.grade_points),
  SUM(g.credits_obtained),
  SUM(g.credits_obtained)
FROM 
  students s
JOIN 
  grades g ON s.registration_number = g.registration_number
GROUP BY 
  s.id
ON DUPLICATE KEY UPDATE
  cgpa = VALUES(cgpa),
  total_credits = VALUES(total_credits),
  completed_credits = VALUES(completed_credits);

-- Create semester results if they don't exist
-- Extract semester from month_year field or use a default value
INSERT IGNORE INTO student_semester_results (student_id, semester, sgpa, credits_earned)
SELECT 
  s.id,
  s.current_semester,
  AVG(g.grade_points),
  SUM(g.credits_obtained)
FROM 
  students s
JOIN 
  grades g ON s.registration_number = g.registration_number
GROUP BY 
  s.id, s.current_semester
ON DUPLICATE KEY UPDATE
  sgpa = VALUES(sgpa),
  credits_earned = VALUES(credits_earned);