-- SQL script to set up tables needed for the Faculty Dashboard

-- Create faculty_student_mapping table if it doesn't exist
CREATE TABLE IF NOT EXISTS faculty_student_mapping (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  student_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_mapping (faculty_id, student_id)
);

-- Create student_summary table if it doesn't exist
CREATE TABLE IF NOT EXISTS student_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT UNIQUE NOT NULL,
  cgpa DECIMAL(3,2),
  previous_cgpa DECIMAL(3,2),
  total_credits INT DEFAULT 0,
  completed_credits INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create certifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_number VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_number VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate faculty_student_mapping with sample data if empty
INSERT IGNORE INTO faculty_student_mapping (faculty_id, student_id)
SELECT f.id, s.id
FROM faculty f
CROSS JOIN students s
WHERE f.id = 1 AND s.id <= 50;

-- Populate student_summary with sample data if empty
INSERT IGNORE INTO student_summary (student_id, cgpa, previous_cgpa, total_credits, completed_credits)
SELECT 
  id,
  ROUND(RAND() * 3 + 7, 2), -- Random CGPA between 7.0 and 10.0
  ROUND(RAND() * 3 + 6.5, 2), -- Random previous CGPA between 6.5 and 9.5
  120,
  FLOOR(RAND() * 40 + 80) -- Random completed credits between 80 and 120
FROM students
WHERE id NOT IN (SELECT student_id FROM student_summary);

-- Sample certifications data
INSERT IGNORE INTO certifications (registration_number, title, issuer, issue_date, expiry_date, credential_id)
SELECT 
  s.registration_number,
  CASE FLOOR(RAND() * 10)
    WHEN 0 THEN 'AWS Certified Developer'
    WHEN 1 THEN 'Microsoft Azure Fundamentals'
    WHEN 2 THEN 'Google Cloud Associate Engineer'
    WHEN 3 THEN 'Certified Kubernetes Administrator'
    WHEN 4 THEN 'Oracle Java Certification'
    WHEN 5 THEN 'Cisco CCNA'
    WHEN 6 THEN 'CompTIA Security+'
    WHEN 7 THEN 'MongoDB Certified Developer'
    WHEN 8 THEN 'Salesforce Administrator'
    ELSE 'Certified Ethical Hacker'
  END,
  CASE FLOOR(RAND() * 10)
    WHEN 0 THEN 'Amazon Web Services'
    WHEN 1 THEN 'Microsoft'
    WHEN 2 THEN 'Google'
    WHEN 3 THEN 'Cloud Native Computing Foundation'
    WHEN 4 THEN 'Oracle'
    WHEN 5 THEN 'Cisco'
    WHEN 6 THEN 'CompTIA'
    WHEN 7 THEN 'MongoDB Inc.'
    WHEN 8 THEN 'Salesforce'
    ELSE 'EC-Council'
  END,
  DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 365) DAY),
  DATE_ADD(CURRENT_DATE, INTERVAL FLOOR(RAND() * 365) DAY),
  CONCAT('CERT-', UPPER(SUBSTRING(MD5(RAND()), 1, 8)))
FROM students s
JOIN faculty_student_mapping fsm ON s.id = fsm.student_id
WHERE fsm.faculty_id = 1
LIMIT 30;

-- Sample attendance data for the last 30 days
INSERT IGNORE INTO attendance (registration_number, date, status)
SELECT 
  s.registration_number,
  DATE_SUB(CURRENT_DATE, INTERVAL day_num DAY),
  CASE 
    WHEN RAND() < 0.9 THEN 'present'
    WHEN RAND() < 0.5 THEN 'absent'
    ELSE 'late'
  END
FROM students s
JOIN faculty_student_mapping fsm ON s.id = fsm.student_id
CROSS JOIN (
  SELECT 0 as day_num UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
  UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
  UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
  UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
  UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24
  UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29
) AS days
WHERE fsm.faculty_id = 1
AND DAYOFWEEK(DATE_SUB(CURRENT_DATE, INTERVAL day_num DAY)) NOT IN (1, 7) -- Skip weekends
LIMIT 1000;

-- Make sure we have some at-risk students
UPDATE student_summary
SET cgpa = ROUND(RAND() * 1.5 + 3.5, 2) -- Random CGPA between 3.5 and 5.0
WHERE student_id IN (
  SELECT student_id 
  FROM faculty_student_mapping 
  WHERE faculty_id = 1
  ORDER BY RAND()
  LIMIT 8
);

-- Make sure we have some achievements
INSERT IGNORE INTO achievements (registration_number, title, description, achievement_date, category, scope)
SELECT 
  s.registration_number,
  CASE FLOOR(RAND() * 10)
    WHEN 0 THEN 'Won coding competition'
    WHEN 1 THEN 'Published research paper'
    WHEN 2 THEN 'Completed internship at Google'
    WHEN 3 THEN 'Hackathon winner'
    WHEN 4 THEN 'Best project award'
    WHEN 5 THEN 'Scholarship recipient'
    WHEN 6 THEN 'Sports achievement'
    WHEN 7 THEN 'Cultural event winner'
    WHEN 8 THEN 'Community service award'
    ELSE 'Academic excellence award'
  END,
  CONCAT('Achievement details for ', s.name),
  DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 365) DAY),
  CASE FLOOR(RAND() * 5)
    WHEN 0 THEN 'Academic'
    WHEN 1 THEN 'Technical'
    WHEN 2 THEN 'Sports'
    WHEN 3 THEN 'Cultural'
    ELSE 'Community Service'
  END,
  CASE FLOOR(RAND() * 3)
    WHEN 0 THEN 'Inside the College'
    WHEN 1 THEN 'State Level'
    ELSE 'National Level'
  END
FROM students s
JOIN faculty_student_mapping fsm ON s.id = fsm.student_id
WHERE fsm.faculty_id = 1
LIMIT 45;