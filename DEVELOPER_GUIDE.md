# Developer Guide for Automated Reporting System

This guide provides detailed information for developers working on the Automated Reporting System (ARS) project.

## Architecture Overview

The Automated Reporting System follows a client-server architecture:

1. **Backend**: Flask-based REST API that handles data processing, authentication, and report generation
2. **Frontend**: React application with Material-UI components for the user interface
3. **Database**: MySQL database for storing student data, user information, and system configurations

## Backend Development

### Project Structure

```
/
├── app.py                  # Main Flask application entry point
├── database/               # Database connection and models
│   ├── mysql_data_handler.py  # MySQL connection and data retrieval
│   ├── setup_db.py         # Database setup script
│   └── fetch_data.py       # Data fetching utilities
├── reports/                # Report generation modules
│   ├── generate_pdf.py     # PDF report generation
│   ├── generate_excel.py   # Excel report generation
│   ├── academic_reports.py # Academic report routes
│   └── progress_tracking.py # Progress tracking report routes
├── auth/                   # Authentication system
│   ├── models.py           # User models
│   ├── routes.py           # Auth routes (login, register, etc.)
│   └── decorators.py       # Auth decorators (role_required, etc.)
├── users/                  # User management
│   ├── routes.py           # User CRUD operations
├── achievements/           # Achievements management
│   ├── models.py           # Achievement models
│   └── routes.py           # Achievement routes
├── certifications/         # Certifications management
│   ├── models.py           # Certification models
│   └── routes.py           # Certification routes
└── templates/              # Report templates
    ├── pdf_classic.html    # Classic PDF template
    ├── pdf_modern.html     # Modern PDF template
    └── pdf_minimal.html    # Minimal PDF template
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (development only)
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/refresh` - Refresh access token

#### Users
- `GET /api/users` - Get all users (HoD, Principal)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Principal)
- `PUT /api/users/:id` - Update user (HoD, Principal)
- `PUT /api/users/:id/activate` - Activate user (Principal)
- `PUT /api/users/:id/deactivate` - Deactivate user (Principal)

#### Students
- `GET /api/students` - Get all students (with filters)
- `GET /api/students/:regNo` - Get student by registration number

#### Achievements
- `GET /api/achievements` - Get all achievements (with filters)
- `GET /api/achievements/:id` - Get achievement by ID
- `POST /api/achievements` - Create new achievement
- `PUT /api/achievements/:id` - Update achievement
- `PUT /api/achievements/:id/verify` - Verify achievement (HoD, Principal)
- `DELETE /api/achievements/:id` - Delete achievement
- `GET /api/achievements/stats` - Get achievement statistics

#### Certifications
- `GET /api/certifications` - Get all certifications (with filters)
- `GET /api/certifications/:id` - Get certification by ID
- `POST /api/certifications` - Create new certification
- `PUT /api/certifications/:id` - Update certification
- `PUT /api/certifications/:id/verify` - Verify certification (HoD, Principal)
- `DELETE /api/certifications/:id` - Delete certification
- `GET /api/certifications/stats` - Get certification statistics

#### Reports
- `GET /api/reports/individual/:regNo` - Get individual student report
- `GET /api/reports/preview/:regNo` - Preview individual student report
- `GET /api/reports/pdf/:pdfType` - Get PDF reports (individual or combined)
- `GET /api/reports/excel` - Get Excel report

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/performance` - Get performance data
- `GET /api/dashboard/branch-distribution` - Get branch distribution
- `GET /api/dashboard/recent-reports` - Get recent reports
- `GET /api/dashboard/notifications` - Get notifications

### Authentication & Authorization

The system uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token (1 hour) for API access
2. **Refresh Token**: Long-lived token (30 days) for obtaining new access tokens

Role-based access control is implemented using the `role_required` decorator:

```python
@app.route('/api/users', methods=['GET'])
@jwt_required()
@role_required(['hod', 'principal'])
def get_users():
    # Only HoD and Principal can access this endpoint
    pass
```

### Database Schema

The database schema includes the following main tables:

1. **users**: User accounts with role-based permissions
2. **students**: Student information
3. **courses**: Course details
4. **grades**: Student grades for courses
5. **semester_summary**: Summarized semester performance
6. **achievements**: Student achievements
7. **certifications**: Student certifications
8. **departments**: Department information
9. **faculty_student_mapping**: Mapping between faculty and students
10. **counseling_sessions**: Student counseling records
11. **communications**: System communications and notifications
12. **report_templates**: Report template configurations
13. **scheduled_reports**: Scheduled report configurations
14. **generated_reports**: Record of generated reports

### Adding New Features

To add a new feature to the backend:

1. Create appropriate models in the relevant module
2. Add routes to handle API requests
3. Implement business logic
4. Add appropriate authentication and authorization
5. Update the API documentation

## Frontend Development

### Project Structure

```
frontend/
├── public/                 # Public assets
└── src/
    ├── components/         # Reusable UI components
    │   ├── charts/         # Chart components
    │   ├── reports/        # Report components
    │   ├── sidebars/       # Sidebar components for different roles
    │   └── DashboardHeader.jsx # Common dashboard header
    ├── pages/              # Page components
    │   ├── faculty/        # Faculty-specific pages
    │   ├── hod/            # HoD-specific pages
    │   └── principal/      # Principal-specific pages
    ├── services/           # API services
    │   └── api_enhanced.js # API client
    ├── App.jsx             # Main application component
    └── main.jsx            # Entry point
```

### Component Hierarchy

```
App
├── LoginPage
├── UnauthorizedPage
├── FacultyDashboardLayout
│   ├── FacultySidebar
│   ├── DashboardHeader
│   └── [Faculty Pages]
├── HoDDashboardLayout
│   ├── HoDSidebar
│   ├── DashboardHeader
│   └── [HoD Pages]
└── PrincipalDashboardLayout
    ├── PrincipalSidebar
    ├── DashboardHeader
    └── [Principal Pages]
```

### State Management

The application uses React Context API for state management:

1. **AuthContext**: Manages user authentication state
2. **NotificationContext**: Manages system notifications
3. **ThemeContext**: Manages UI theme preferences

### API Integration

The `api_enhanced.js` service provides a centralized client for API calls:

```javascript
// Example API client usage
import { api } from '../services/api_enhanced';

// In a component
const fetchData = async () => {
  try {
    const response = await api.getStudents({ branch: 'CSE', semester: 6 });
    setStudents(response.data);
  } catch (error) {
    console.error('Error fetching students:', error);
    setError('Failed to load students');
  }
};
```

The API client handles:
- Authentication token management
- Request/response interceptors
- Error handling
- Token refresh

### Adding New Pages

To add a new page to the frontend:

1. Create a new component in the appropriate directory
2. Add the route in `App.jsx`
3. Update the sidebar navigation if needed

## Database Setup and Migration

### Initial Setup

1. Create the database:
   ```sql
   CREATE DATABASE reporting_system;
   ```

2. Run the setup script:
   ```bash
   python setup_database.py
   ```

### Data Migration

For data migration between versions:

1. Create a backup of the current database:
   ```bash
   ./scripts/backup_data.sh
   ```

2. Run the migration script:
   ```bash
   python scripts/migrate_data.py
   ```

## Testing

### Backend Testing

Run backend tests using pytest:
```bash
pytest tests/
```

### Frontend Testing

Run frontend tests using Jest:
```bash
cd frontend
npm test
```

## Deployment

### Development Environment

```bash
# Backend
python app.py

# Frontend
cd frontend
npm run dev
```

### Production Environment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Configure a production WSGI server (e.g., Gunicorn):
   ```bash
   gunicorn -w 4 app:app
   ```

3. Set up a reverse proxy (e.g., Nginx) to serve the frontend and proxy API requests

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database credentials in `.env` file
   - Ensure MySQL server is running
   - Verify database exists and user has appropriate permissions

2. **JWT Authentication Issues**
   - Check JWT secret key in environment variables
   - Verify token expiration times
   - Clear browser storage and try logging in again

3. **PDF Generation Failures**
   - Ensure Playwright is installed correctly
   - Check for missing fonts or template files
   - Verify file permissions in output directory

4. **API Request Failures**
   - Check browser console for CORS errors
   - Verify API endpoint URLs
   - Check authentication token validity

## Performance Optimization

### Backend Optimizations

1. **Database Query Optimization**
   - Use indexes for frequently queried fields
   - Optimize JOIN operations
   - Use pagination for large result sets

2. **Caching**
   - Implement Redis caching for frequently accessed data
   - Cache report templates and generated reports

### Frontend Optimizations

1. **Code Splitting**
   - Use React.lazy for component lazy loading
   - Split bundles by route

2. **Rendering Optimization**
   - Use React.memo for expensive components
   - Optimize re-renders with useMemo and useCallback
   - Virtualize long lists

## Security Considerations

1. **Authentication**
   - Use secure JWT practices
   - Implement proper token storage
   - Add rate limiting for login attempts

2. **Data Protection**
   - Sanitize all user inputs
   - Use prepared statements for database queries
   - Implement proper access controls

3. **Frontend Security**
   - Protect against XSS attacks
   - Implement CSP (Content Security Policy)
   - Use HTTPS for all communications

## Contribution Guidelines

1. Follow the established code style and conventions
2. Write tests for new features
3. Document code and API endpoints
4. Create detailed pull requests with clear descriptions
5. Review code changes thoroughly before merging

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Material-UI Documentation](https://mui.com/getting-started/usage/)
- [JWT Authentication](https://jwt.io/introduction/)
- [MySQL Documentation](https://dev.mysql.com/doc/)