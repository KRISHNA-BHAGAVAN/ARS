# Connecting Faculty Dashboard to Existing Database

This guide explains how to connect the Faculty Dashboard to your existing database tables.

## Database Structure

The Faculty Dashboard expects the following tables:

1. `faculty` - Contains faculty information
2. `students` - Contains student information with `registration_number` as identifier
3. `courses` - Contains course information
4. `grades` - Contains student grades for each course
5. `faculty_student_mapping` - Maps faculty to their assigned students
6. `student_summary` - Contains summary of student academic performance
7. `student_semester_results` - Contains semester-wise results
8. `achievements` - Contains student achievements
9. `certifications` - Contains student certifications
10. `attendance` - Contains student attendance records
11. `counseling_notes` - Contains faculty counseling notes for students

## Setup Steps

1. Run the database setup script to create any missing tables:
   ```bash
   ./setup_database.sh
   ```

2. If your existing tables have different column names, you'll need to modify the queries in `backend/routes/faculty_routes.js` to match your schema.

3. Common column name differences to check:
   - `registration_number` vs `registration_no`
   - `course_id` vs `subject_id`
   - `course_name` vs `subject_name`

4. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

5. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. Log in with faculty credentials:
   - Username: `faculty`
   - Password: `faculty123`

## Troubleshooting

If you encounter database errors:

1. Check the console logs for specific SQL errors
2. Verify that your database tables have the expected column names
3. Modify the queries in `backend/routes/faculty_routes.js` to match your schema
4. Make sure the faculty user has the necessary permissions to access the tables

## Mapping Your Existing Data

If you need to map existing faculty to students:

```sql
INSERT INTO faculty_student_mapping (faculty_id, student_id)
SELECT f.id, s.id
FROM faculty f, students s
WHERE f.username = 'faculty'
AND s.registration_number IN ('20CS001', '20CS045', '20CS032', '20CS018', '20CS056');
```

## Creating Student Summary Data

If you need to create summary data from existing grades:

```sql
INSERT INTO student_summary (student_id, cgpa, total_credits, completed_credits)
SELECT 
  s.id,
  AVG(g.grade_point),
  SUM(c.credits),
  SUM(c.credits)
FROM students s
JOIN grades g ON s.id = g.student_id
JOIN courses c ON g.course_id = c.id
GROUP BY s.id;
```