# Automated Reporting System (ARS)

A comprehensive system for managing student records, achievements, certifications, and generating reports with role-based access control.

## Features

- Role-based dashboards (Faculty, HoD, Principal, Admin)
- Student management
- Achievement and certification tracking
- Academic performance monitoring
- Attendance tracking
- Counseling notes
- Report generation

## Tech Stack

- **Frontend**: React, Material-UI, Chart.js, Framer Motion
- **Backend**: Node.js, Express
- **Database**: MySQL

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

### Database Setup

1. Make the setup script executable:

```bash
chmod +x setup_database.sh
```

2. Run the database setup script:

```bash
./setup_database.sh
```

3. Follow the prompts to enter your MySQL username and password.

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

## Usage

### Login Credentials

- **Faculty**: username: `faculty`, password: `faculty123`
- **HoD**: username: `hod`, password: `hod123`
- **Principal**: username: `principal`, password: `principal123`
- **Admin**: username: `admin`, password: `admin123`

## Database Schema

The system uses the following database tables:

- **faculty**: Stores faculty information and credentials
- **students**: Stores student information with registration_number as unique identifier
- **courses**: Stores course information
- **faculty_student_mapping**: Maps faculty to their assigned students
- **student_summary**: Stores summary of student academic performance
- **grades**: Stores student grades for each course
- **student_semester_results**: Stores semester-wise results
- **achievements**: Stores student achievements
- **certifications**: Stores student certifications
- **attendance**: Stores student attendance records
- **counseling_notes**: Stores faculty counseling notes for students

## Connecting to Real Database

The system is designed to work with a MySQL database. The `setup_database.sh` script creates the necessary tables and populates them with sample data.

If you already have an existing database with student data:
1. Update the `db_setup.sql` file to match your existing schema
2. Make sure the column names match what the application expects (e.g., `registration_number` instead of `registration_no`)
3. Run the setup script to create any missing tables

## Troubleshooting

If you encounter authentication issues:
1. Make sure the backend server is running
2. Check that you're using the correct credentials
3. Verify that the JWT secret keys in the `.env` file match what the application expects

If you see database connection errors:
1. Verify your MySQL credentials in the `.env` file
2. Make sure MySQL is running
3. Check that the database name is correct

## License

This project is licensed under the MIT License.