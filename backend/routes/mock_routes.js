const express = require('express');
const router = express.Router();

// Mock students data
const mockStudents = [
  {
    id: 1,
    name: 'Anusuri Bharathi',
    registration_number: '20CS001',
    branch: 'CSE',
    current_semester: 5,
    email: 'bharathi@example.com',
    phone: '9876543210',
    cgpa: 9.2,
    total_credits: 120,
    completed_credits: 100
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    registration_number: '20CS045',
    branch: 'CSE',
    current_semester: 5,
    email: 'rahul@example.com',
    phone: '9876543211',
    cgpa: 8.9,
    total_credits: 120,
    completed_credits: 100
  },
  {
    id: 3,
    name: 'Priya Patel',
    registration_number: '20CS032',
    branch: 'CSE',
    current_semester: 5,
    email: 'priya@example.com',
    phone: '9876543212',
    cgpa: 8.7,
    total_credits: 120,
    completed_credits: 100
  },
  {
    id: 4,
    name: 'Amit Kumar',
    registration_number: '20CS018',
    branch: 'CSE',
    current_semester: 5,
    email: 'amit@example.com',
    phone: '9876543213',
    cgpa: 8.5,
    total_credits: 120,
    completed_credits: 100
  },
  {
    id: 5,
    name: 'Sneha Gupta',
    registration_number: '20CS056',
    branch: 'CSE',
    current_semester: 5,
    email: 'sneha@example.com',
    phone: '9876543214',
    cgpa: 8.3,
    total_credits: 120,
    completed_credits: 100
  }
];

// Mock grades data
const mockGrades = {
  '20CS001': [
    { subject: 'Database Systems', semester: 4, grade: 'A+', grade_point: 10.0, credits: 4 },
    { subject: 'Data Structures', semester: 4, grade: 'A', grade_point: 9.0, credits: 4 },
    { subject: 'Computer Networks', semester: 4, grade: 'A', grade_point: 9.0, credits: 4 },
    { subject: 'Operating Systems', semester: 4, grade: 'A+', grade_point: 10.0, credits: 4 },
    { subject: 'Web Development', semester: 4, grade: 'A+', grade_point: 10.0, credits: 3 }
  ],
  '20CS045': [
    { subject: 'Database Systems', semester: 4, grade: 'A', grade_point: 9.0, credits: 4 },
    { subject: 'Data Structures', semester: 4, grade: 'A', grade_point: 9.0, credits: 4 },
    { subject: 'Computer Networks', semester: 4, grade: 'B+', grade_point: 8.0, credits: 4 },
    { subject: 'Operating Systems', semester: 4, grade: 'A', grade_point: 9.0, credits: 4 },
    { subject: 'Web Development', semester: 4, grade: 'A+', grade_point: 10.0, credits: 3 }
  ]
};

// Mock achievements data
const mockAchievements = {
  '20CS001': [
    { 
      id: 1, 
      title: 'Won national coding competition', 
      description: 'First place in the national coding championship', 
      achievement_date: '2023-10-15', 
      category: 'Academic' 
    },
    { 
      id: 2, 
      title: 'Published research paper', 
      description: 'Published in IEEE conference', 
      achievement_date: '2023-09-20', 
      category: 'Academic' 
    }
  ],
  '20CS045': [
    { 
      id: 3, 
      title: 'Hackathon winner', 
      description: 'Won first place in college hackathon', 
      achievement_date: '2023-08-10', 
      category: 'Academic' 
    }
  ]
};

// Mock certifications data
const mockCertifications = {
  '20CS001': [
    { 
      id: 1, 
      title: 'AWS Certified Solutions Architect', 
      issuing_organization: 'Amazon Web Services', 
      issue_date: '2023-09-10', 
      expiry_date: '2026-09-10', 
      credential_id: 'AWS-123456' 
    },
    { 
      id: 2, 
      title: 'Microsoft Azure Fundamentals', 
      issuing_organization: 'Microsoft', 
      issue_date: '2023-08-15', 
      expiry_date: '2026-08-15', 
      credential_id: 'MS-789012' 
    }
  ],
  '20CS045': [
    { 
      id: 3, 
      title: 'Google Cloud Associate Engineer', 
      issuing_organization: 'Google', 
      issue_date: '2023-07-20', 
      expiry_date: '2026-07-20', 
      credential_id: 'GCP-345678' 
    }
  ]
};

// Get all students
router.get('/students', (req, res) => {
  const { branch, semester, search } = req.query;
  
  let filteredStudents = [...mockStudents];
  
  if (branch) {
    filteredStudents = filteredStudents.filter(student => student.branch === branch);
  }
  
  if (semester) {
    filteredStudents = filteredStudents.filter(student => student.current_semester.toString() === semester);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredStudents = filteredStudents.filter(student => 
      student.name.toLowerCase().includes(searchLower) || 
      student.registration_number.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({ data: filteredStudents });
});

// Get student details by registration number
router.get('/students/:regNo', (req, res) => {
  const { regNo } = req.params;
  
  const student = mockStudents.find(s => s.registration_number === regNo);
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  const grades = mockGrades[regNo] || [];
  const achievements = mockAchievements[regNo] || [];
  const certifications = mockCertifications[regNo] || [];
  
  res.json({
    ...student,
    grades,
    achievements,
    certifications,
    counselingNotes: []
  });
});

module.exports = router;