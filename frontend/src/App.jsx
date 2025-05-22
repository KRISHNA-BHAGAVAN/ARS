import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StudentAchievementForm from './pages/StudentAchievementForm';

// Layouts
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import FacultyDashboardLayout from './components/FacultyDashboardLayout';
import HoDDashboardLayout from './components/HoDDashboardLayout';
import PrincipalDashboardLayout from './components/PrincipalDashboardLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PrivateRoute from './components/PrivateRoute';

// Common Pages
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import ReportingPage from './pages/ReportingPage';
import AcademicReportsPage from './pages/AcademicReportsPage';
import ProgressTrackingPage from './pages/ProgressTrackingPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentManagement from './pages/faculty/StudentManagement';
import StudentDetail from './pages/faculty/StudentDetail';
import AchievementsManagement from './pages/faculty/AchievementsManagement';
import CertificationsManagement from './pages/faculty/CertificationsManagement';
import FacultyReports from './pages/faculty/FacultyReports';
import CounselingNotes from './pages/faculty/CounselingNotes';

// HoD Pages
import HoDDashboard from './pages/hod/HoDDashboard';
import DepartmentOverview from './pages/hod/DepartmentOverview';
import FacultyManagement from './pages/hod/FacultyManagement';
import DepartmentReports from './pages/hod/DepartmentReports';
import CourseAnalytics from './pages/hod/CourseAnalytics';
import ResourceManagement from './pages/hod/ResourceManagement';

// Principal Pages
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import InstitutionOverview from './pages/principal/InstitutionOverview';
import DepartmentManagement from './pages/principal/DepartmentManagement';
import FacultyOverview from './pages/principal/FacultyOverview';
import InstitutionReports from './pages/principal/InstitutionReports';
import StrategicPlanning from './pages/principal/StrategicPlanning';

import './App.css';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4568dc',
    },
    secondary: {
      main: '#b06ab3',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #4568dc 30%, #b06ab3 90%)',
          boxShadow: '0 3px 5px 2px rgba(69, 104, 220, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #3557cb 30%, #9f59a2 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Faculty Routes */}
          <Route path="/faculty" element={
            <PrivateRoute allowedRoles={['faculty']}>
              <FacultyDashboardLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="students/:regNo" element={<StudentDetail />} />
            <Route path="achievements" element={<AchievementsManagement />} />
            <Route path="certifications" element={<CertificationsManagement />} />
            <Route path="reports" element={<FacultyReports />} />
            <Route path="counseling" element={<CounselingNotes />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* HoD Routes */}
          <Route path="/hod" element={
            <PrivateRoute allowedRoles={['hod']}>
              <HoDDashboardLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<HoDDashboard />} />
            <Route path="department" element={<DepartmentOverview />} />
            <Route path="faculty" element={<FacultyManagement />} />
            <Route path="reports" element={<DepartmentReports />} />
            <Route path="courses" element={<CourseAnalytics />} />
            <Route path="resources" element={<ResourceManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* Principal Routes */}
          <Route path="/principal" element={
            <PrivateRoute allowedRoles={['principal']}>
              <PrincipalDashboardLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<PrincipalDashboard />} />
            <Route path="institution" element={<InstitutionOverview />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="faculty" element={<FacultyOverview />} />
            <Route path="reports" element={<InstitutionReports />} />
            <Route path="planning" element={<StrategicPlanning />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* Legacy Routes (will be removed later) */}
          <Route path="/" element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="reporting" element={<ReportingPage />} />
                <Route path="academic-reports" element={<AcademicReportsPage />} />
                <Route path="progress-tracking" element={<ProgressTrackingPage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Routes>
            </Layout>
          } />
          
          {/* Student Achievement Form */}
          <Route path="/student-achievement-form" element={<StudentAchievementForm />} />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;