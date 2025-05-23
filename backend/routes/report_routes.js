const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const archiver = require('archiver');
const ExcelJS = require('exceljs');

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
      format, // 'pdf' or 'excel'
      student_ids, // Array of student registration numbers or IDs
      pdf_options, // e.g., { type: 'individual' | 'combined' }
      excel_options, // e.g., { columns: ['name', 'reg_no', 'cgpa', ...] }
      parameters // Existing general parameters
    } = req.body;

    if (!name || !type || !format || !student_ids || student_ids.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: name, type, format, and at least one student_id are required.' });
    }

    const connection = await pool.getConnection();

    try {
      // Get faculty ID from token
      const facultyId = req.user?.id; 
      if (!facultyId) {
        connection.release();
        return res.status(401).json({ error: 'Unauthorized: Faculty ID missing from token.' });
      }

      // Security Check: Ensure faculty is authorized for all requested students
      if (student_ids && student_ids.length > 0) {
        const uniqueStudentIds = [...new Set(student_ids)]; // Ensure unique IDs for comparison
        
        // This query assumes student_ids from the request are registration_numbers
        const securitySql = `
          SELECT COUNT(DISTINCT s.registration_number) as authorized_count 
          FROM faculty_student_mapping fsm
          JOIN students s ON fsm.student_id = s.id
          WHERE fsm.faculty_id = ? AND s.registration_number IN (?);
        `;
        
        const [securityRows] = await connection.query(securitySql, [facultyId, uniqueStudentIds]);
        const authorizedCount = securityRows[0]?.authorized_count || 0;

        if (authorizedCount !== uniqueStudentIds.length) {
          connection.release();
          return res.status(403).json({ error: 'Forbidden: You are not authorized to access reports for one or more of the selected students.' });
        }
      } else { // student_ids is empty or not provided, which is already caught by the initial check.
          // This block is technically redundant due to the check at the start of the route,
          // but kept for logical completeness in case that initial check is modified.
          connection.release();
          return res.status(400).json({ error: 'No student IDs provided for the report.' });
      }

      // File path and size will be updated later after actual generation
      const filePath = 'N/A'; // Placeholder
      const fileSize = 'N/A'; // Placeholder

      // Insert report metadata
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
        JSON.stringify(student_ids), // Storing student_ids, was 'students'
        JSON.stringify(parameters || {})
      ]);

      const reportId = result.insertId;

      // Actual report generation logic
      if (format === 'pdf') {
        await generatePdfReport(reportId, student_ids, pdf_options, pool, res, name); // Pass report name for filename
        return; // generatePdfReport handles the response
      } else if (format === 'excel') {
        await generateExcelReport(reportId, student_ids, excel_options, pool, res, name);
        return; // generateExcelReport handles the response
      } else {
        // This case should ideally be caught by initial validation, but as a fallback:
        connection.release();
        return res.status(400).json({ error: 'Unsupported report format' });
      }
      
      // Get the inserted report metadata (without waiting for file generation)
      const [reportRows] = await connection.query(`
        SELECT 
          r.*,
          f.name as faculty_name
        FROM reports r
        JOIN faculty f ON r.created_by = f.id
        WHERE r.id = ?
      `, [reportId]);

      res.status(202).json({ // 202 Accepted: request is accepted for processing
        message: 'Report generation initiated. Metadata saved.',
        report_metadata: reportRows[0]
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

// Helper function to get comprehensive student data
async function getComprehensiveStudentData(studentIds, pool) {
  const results = [];
  const gradeToPoint = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'P': 4,
    'F': 0,
    'ABSENT': 0,
    'COMPLE': 10, // Assuming 'COMPLE' for completed/pass for non-credit courses if any
  };

  const getGradePoint = (grade) => gradeToPoint[grade.toUpperCase()] ?? 0;
  const getStatus = (grade) => (grade.toUpperCase() === 'F' || grade.toUpperCase() === 'ABSENT') ? 'Fail' : 'Pass';

  let connection;
  try {
    connection = await pool.getConnection();

    for (const studentId of studentIds) {
      // 1. Fetch Basic Student Details
      const [studentRows] = await connection.query(
        `SELECT s.registration_number, s.name, s.address, b.name as branch_name, s.current_semester 
         FROM students s
         LEFT JOIN branches b ON s.branch_id = b.id
         WHERE s.registration_number = ?`,
        [studentId]
      );

      if (studentRows.length === 0) {
        console.warn(`Student with ID ${studentId} not found.`);
        results.push({ studentDetails: { registration_number: studentId, name: "N/A" }, semesterRecords: [], overallCGPA: 0, error: "Student not found" });
        continue;
      }
      const studentData = studentRows[0];

      // 2. Fetch Semester-wise Records & 3. Fetch Semester Summaries
      const [gradeRows] = await connection.query(
        `SELECT 
            g.semester, 
            c.course_code, 
            c.name AS course_name, 
            g.grade, 
            c.credits
         FROM grades g
         JOIN courses c ON g.course_code = c.course_code 
         WHERE g.registration_number = ?
         ORDER BY g.semester, c.course_code`,
        [studentId]
      );

      const semesterRecords = [];
      const semestersMap = new Map();

      for (const row of gradeRows) {
        if (!semestersMap.has(row.semester)) {
          semestersMap.set(row.semester, {
            semesterNumber: row.semester,
            subjects: [],
            summary: { sgpa: 0, credits_obtained: 0, total_credits: 0, total_grade_points: 0 }
          });
        }
        
        const semesterObj = semestersMap.get(row.semester);
        const gradePoint = getGradePoint(row.grade);
        const status = getStatus(row.grade);

        semesterObj.subjects.push({
          course_code: row.course_code,
          course_name: row.course_name,
          grade: row.grade,
          credits: row.credits,
          status: status
        });

        semesterObj.summary.total_credits += row.credits;
        if (status === 'Pass') {
          semesterObj.summary.credits_obtained += row.credits;
        }
        semesterObj.summary.total_grade_points += gradePoint * row.credits;
      }

      let overallTotalCredits = 0;
      let overallTotalGradePoints = 0;

      semestersMap.forEach(semesterObj => {
        if (semesterObj.summary.total_credits > 0) {
          semesterObj.summary.sgpa = parseFloat((semesterObj.summary.total_grade_points / semesterObj.summary.total_credits).toFixed(2));
        } else {
          semesterObj.summary.sgpa = 0;
        }
        overallTotalCredits += semesterObj.summary.total_credits;
        overallTotalGradePoints += semesterObj.summary.total_grade_points;
        semesterRecords.push(semesterObj);
      });
      
      semesterRecords.sort((a,b) => a.semesterNumber - b.semesterNumber); // Ensure sorted by semester

      const overallCGPA = overallTotalCredits > 0 ? parseFloat((overallTotalGradePoints / overallTotalCredits).toFixed(2)) : 0;

      results.push({
        studentDetails: {
          registration_number: studentData.registration_number,
          name: studentData.name,
          address: studentData.address || 'N/A',
          branch: studentData.branch_name || 'N/A',
          current_semester: studentData.current_semester
        },
        semesterRecords: semesterRecords,
        overallCGPA: overallCGPA
      });
    }
  } catch (error) {
    console.error('Error in getComprehensiveStudentData:', error);
    // For a general error, we might want to throw or return an error state
    // For now, just logging and returning whatever has been processed.
    // Depending on requirements, might push an error object for each studentId that failed.
    throw error; // Re-throw to be caught by the caller if needed
  } finally {
    if (connection) {
      connection.release();
    }
  }
  return results;
}

// Helper function to generate HTML content for a single student
function generateStudentHtmlContent(studentData) {
  if (!studentData || !studentData.studentDetails) {
    console.error("Invalid studentData provided to generateStudentHtmlContent");
    return ""; // Return empty string or handle error as appropriate
  }
  const { studentDetails, semesterRecords, overallCGPA } = studentData;

  return `
    <div class="student-report-container" style="page-break-after: always;">
      <div class="header">
        <h1>Academic Report</h1>
        <p>Your Institution Name</p>
      </div>
      <div class="student-details">
        <h2>Student Information</h2>
        <div class="grid-container">
          <div class="grid-item">
            <p><strong>Name:</strong> ${studentDetails.name}</p>
            <p><strong>Registration No:</strong> ${studentDetails.registration_number}</p>
          </div>
          <div class="grid-item">
            <p><strong>Branch:</strong> ${studentDetails.branch || 'N/A'}</p>
            <p><strong>Current Semester:</strong> ${studentDetails.current_semester || 'N/A'}</p>
          </div>
        </div>
        ${studentDetails.address ? `<p><strong>Address:</strong> ${studentDetails.address}</p>` : ''}
      </div>
      ${semesterRecords.map(semester => `
        <div class="semester-details">
          <h3>Semester ${semester.semesterNumber}</h3>
          <table>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Grade</th>
                <th>Credits</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${semester.subjects.map(subject => `
                <tr>
                  <td>${subject.course_code}</td>
                  <td>${subject.course_name}</td>
                  <td>${subject.grade}</td>
                  <td>${subject.credits}</td>
                  <td>${subject.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <table class="semester-summary-table">
            <tr><td><strong>SGPA:</strong></td><td>${semester.summary.sgpa.toFixed(2)}</td></tr>
            <tr><td><strong>Credits Obtained:</strong></td><td>${semester.summary.credits_obtained} / ${semester.summary.total_credits}</td></tr>
          </table>
        </div>
      `).join('')}
      <div class="overall-summary">
        <h3>Overall Summary</h3>
        <p><strong>Overall CGPA:</strong> ${overallCGPA !== undefined ? overallCGPA.toFixed(2) : 'N/A'}</p>
      </div>
      <div class="footer">
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <p>&copy; Your Institution Name. This is a system-generated report.</p>
      </div>
    </div>
  `;
}

async function generateSingleStudentPdf(studentData) {
  if (!studentData || !studentData.studentDetails) {
    console.error("Invalid studentData provided to generateSingleStudentPdf");
    return null;
  }
  const htmlContent = generateStudentHtmlContent(studentData);
  if (!htmlContent) return null;

  const fullHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; font-size: 10px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 18px; }
          .header p { margin: 0; font-size: 14px; }
          .student-details, .semester-details, .overall-summary { margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px;}
          .student-details h2, .semester-details h3, .overall-summary h3 { margin-top: 0; font-size: 14px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;}
          .student-details p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
          th { background-color: #f2f2f2; font-size: 11px;}
          .semester-summary-table { margin-top: 10px; width: auto; }
          .semester-summary-table td { border: none; padding: 3px 8px; }
          .overall-summary p { font-size: 12px; font-weight: bold; }
          .footer { text-align: center; font-size: 9px; color: #777; margin-top: 30px; }
          .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .grid-item { }
          .student-report-container:last-child { page-break-after: auto; } /* Avoid page break after the last student in combined PDF */
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>`;

  let browser;
  try {
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        headless: "new"
    });
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.75in', right: '0.75in', bottom: '0.75in', left: '0.75in' }
    });
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating single PDF:', error);
    if (browser) await browser.close();
    throw error;
  }
}

async function generateExcelReport(reportId, studentIds, excelOptions, pool, res, reportName = 'student_data') {
  try {
    const allStudentData = await getComprehensiveStudentData(studentIds, pool);
    const validStudentData = allStudentData.filter(sd => sd && !sd.error);

    if (validStudentData.length === 0) {
      return res.status(404).json({ error: 'No valid student data found for the given IDs.' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Data');

    // Define all possible columns faculty might select
    const columnDefinitions = {
      'reg_no': { header: 'Registration No.', accessor: (sd) => sd.studentDetails?.registration_number || 'N/A' },
      'name': { header: 'Name', accessor: (sd) => sd.studentDetails?.name || 'N/A' },
      'branch': { header: 'Branch', accessor: (sd) => sd.studentDetails?.branch || 'N/A' }, // Ensure 'branch' is populated in studentDetails
      'current_semester': { header: 'Current Semester', accessor: (sd) => sd.studentDetails?.current_semester || 'N/A' },
      'address': { header: 'Address', accessor: (sd) => sd.studentDetails?.address || 'N/A' },
      'cgpa': { header: 'Overall CGPA', accessor: (sd) => sd.overallCGPA !== undefined ? sd.overallCGPA.toFixed(2) : 'N/A' },
    };

    const maxSemestersToDisplay = 10; // Max semesters to generate columns for (e.g., up to semester 10)
    for (let i = 1; i <= maxSemestersToDisplay; i++) {
      columnDefinitions[`semester${i}_sgpa`] = {
        header: `Semester ${i} SGPA`,
        accessor: (sd) => sd.semesterRecords?.find(s => s.semesterNumber === i)?.summary.sgpa?.toFixed(2) || 'N/A'
      };
      columnDefinitions[`semester${i}_credits_obtained`] = {
        header: `Semester ${i} Credits Obtained`,
        accessor: (sd) => {
          const sem = sd.semesterRecords?.find(s => s.semesterNumber === i);
          return sem ? `${sem.summary.credits_obtained} / ${sem.summary.total_credits}` : 'N/A';
        }
      };
       columnDefinitions[`semester${i}_total_credits`] = {
        header: `Semester ${i} Total Credits`,
        accessor: (sd) => sd.semesterRecords?.find(s => s.semesterNumber === i)?.summary.total_credits || 'N/A'
      };
    }
    
    // Determine active columns based on excelOptions.columns
    const activeColumns = (excelOptions?.columns && excelOptions.columns.length > 0) 
      ? excelOptions.columns.map(key => columnDefinitions[key]).filter(Boolean)
      : Object.values(columnDefinitions); // Default to all defined columns if none specified

    if (activeColumns.length === 0) {
        return res.status(400).json({ error: 'No columns selected or invalid column keys provided for the Excel report.' });
    }

    worksheet.columns = activeColumns.map(colDef => ({ header: colDef.header, key: colDef.header, width: 20 })); // Use header as key for simplicity

    validStudentData.forEach(studentData => {
      const row = {};
      activeColumns.forEach(colDef => {
        row[colDef.header] = colDef.accessor(studentData);
      });
      worksheet.addRow(row);
    });
    
    const excelFileName = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${excelFileName}"`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error in generateExcelReport:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate Excel report.', details: error.message });
    }
  }
}

async function generatePdfReport(reportId, studentIds, pdfOptions, pool, res, reportName = 'student_reports') {
  try {
    const allStudentData = await getComprehensiveStudentData(studentIds, pool);
    const validStudentData = allStudentData.filter(sd => sd && !sd.error);

    if (validStudentData.length === 0) {
      return res.status(404).json({ error: 'No valid student data found for the given IDs.' });
    }
    
    const reportFileNameBase = reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase();


    if (pdfOptions && pdfOptions.type === 'individual') {
      const zipFileName = `${reportFileNameBase}_individual_${Date.now()}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('Archiver warning: ', err);
        } else {
          throw err;
        }
      });
      archive.on('error', (err) => {
        throw err;
      });
      archive.pipe(res);

      for (const studentData of validStudentData) {
        if (studentData.studentDetails && studentData.studentDetails.registration_number) {
          const pdfBuffer = await generateSingleStudentPdf(studentData);
          if (pdfBuffer) {
            archive.append(pdfBuffer, { name: `report_${studentData.studentDetails.registration_number}.pdf` });
          } else {
            console.warn(`Failed to generate PDF for student ${studentData.studentDetails.registration_number}`);
          }
        }
      }
      await archive.finalize();

    } else { // Default to combined PDF
      const combinedPdfFileName = `${reportFileNameBase}_combined_${Date.now()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${combinedPdfFileName}"`);

      let combinedHtml = validStudentData.map(studentData => generateStudentHtmlContent(studentData)).join('');
      
      const fullHtml = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; font-size: 10px; } /* Margin 0 for body, actual margin in @page */
              @page { margin: 0.75in; } /* Define page margins */
              .header { text-align: center; margin-bottom: 20px; }
              .header h1 { margin: 0; font-size: 18px; }
              .header p { margin: 0; font-size: 14px; }
              .student-details, .semester-details, .overall-summary { margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px;}
              .student-details h2, .semester-details h3, .overall-summary h3 { margin-top: 0; font-size: 14px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;}
              .student-details p { margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
              th { background-color: #f2f2f2; font-size: 11px;}
              .semester-summary-table { margin-top: 10px; width: auto; }
              .semester-summary-table td { border: none; padding: 3px 8px; }
              .overall-summary p { font-size: 12px; font-weight: bold; }
              .footer { text-align: center; font-size: 9px; color: #777; margin-top: 30px; }
              .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              .grid-item { }
              .student-report-container { page-break-inside: avoid; } /* Try to avoid breaking a student's report across pages */
              .student-report-container:last-child { page-break-after: auto; } /* Ensure no extra page break after the last student */
            </style>
          </head>
          <body>
            ${combinedHtml}
          </body>
        </html>`;

      let browser;
      try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            headless: "new"
        });
        const page = await browser.newPage();
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true
          // Margins are now handled by @page CSS
        });
        await browser.close();
        res.send(pdfBuffer);
      } catch (puppeteerError) {
        console.error('Error generating combined PDF with Puppeteer:', puppeteerError);
        if (browser) await browser.close();
        throw puppeteerError; // Propagate to outer catch
      }
    }
  } catch (error) {
    console.error('Error in generatePdfReport:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate PDF report.', details: error.message });
    }
  }
}

module.exports = router;