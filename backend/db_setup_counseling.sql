-- Create counseling_notes table if it doesn't exist
DROP TABLE IF EXISTS counseling_notes;
CREATE TABLE counseling_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_number VARCHAR(20) NOT NULL,
  faculty_id INT NOT NULL,
  note TEXT NOT NULL,
  counseling_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_number) REFERENCES students(registration_number) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
);

-- Insert sample counseling notes
INSERT INTO counseling_notes (registration_number, faculty_id, note, counseling_date)
SELECT 
  s.registration_number,
  1, -- Faculty ID (assuming faculty with ID 1 exists)
  CASE FLOOR(RAND() * 5)
    WHEN 0 THEN 'Student is performing well in academics but needs to focus more on practical applications.'
    WHEN 1 THEN 'Student is struggling with programming concepts. Recommended additional practice exercises.'
    WHEN 2 THEN 'Discussed career goals and internship opportunities. Student is interested in AI/ML field.'
    WHEN 3 THEN 'Student has shown improvement in recent assessments. Encouraged to maintain the progress.'
    ELSE 'Addressed attendance issues. Student promised to be more regular in classes.'
  END,
  DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 90) DAY)
FROM students s
LIMIT 20;