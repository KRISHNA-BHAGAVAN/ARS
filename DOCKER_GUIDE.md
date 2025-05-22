# Docker Guide for Student Reporting System

This guide provides detailed instructions for working with the Student Reporting System using Docker.

## Docker Architecture

The application is containerized using Docker with a multi-container setup managed by Docker Compose:

1. **MySQL Database Container (`db`)**: 
   - Stores all student and academic data
   - Persists data using a named volume

2. **Backend Flask API Container (`backend`)**:
   - Python Flask application serving the REST API
   - Handles report generation (PDF, Excel)
   - Connects to the MySQL database

3. **Frontend React Container (`frontend`)**:
   - React application providing the user interface
   - Communicates with the backend API
   - Served using Vite development server

## Prerequisites

- Docker Engine (20.10.0+)
- Docker Compose (2.0.0+)
- At least 2GB of free RAM
- At least 2GB of free disk space

## Getting Started

### Starting the Application

1. Navigate to the project directory:
   ```bash
   cd student-reporting-system
   ```

2. Start all services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Check the status of the containers:
   ```bash
   docker-compose ps
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Stopping the Application

To stop all services while preserving data:
```bash
docker-compose down
```

To stop all services and remove all data (including the database):
```bash
docker-compose down -v
```

## Working with Containers

### Viewing Logs

To view logs from all containers:
```bash
docker-compose logs
```

To view logs from a specific container:
```bash
docker-compose logs backend
```

To follow logs in real-time:
```bash
docker-compose logs -f
```

### Accessing Containers

To access the shell of a container:
```bash
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec db bash
```

### Database Management

To access the MySQL CLI:
```bash
docker-compose exec db mysql -u root -ppassword StudentReportingDB
```

To import SQL data:
```bash
docker-compose exec -T db mysql -u root -ppassword StudentReportingDB < sql_insert_statements.sql
```

## Customization

### Environment Variables

You can customize the application by modifying environment variables in the `docker-compose.yml` file:

```yaml
backend:
  environment:
    - host=db
    - user=custom_user
    - password=custom_password
    - database=custom_db
```

### Persistent Data

The application uses Docker volumes to persist data:

- `mysql_data`: Stores the MySQL database files
- Mounted directories:
  - `./templates/images`: For header and student images
  - `./output`: For generated reports

### Custom Images

To use custom images in the reports:

1. Place your header image in `./templates/images/header.png`
2. Place student photos in `./templates/images/`

These directories are mounted into the container, so changes are immediately available.

## Development Workflow

### Making Code Changes

1. Frontend changes:
   - Edit files in the `./frontend` directory
   - Changes will be automatically reflected due to volume mounting

2. Backend changes:
   - Edit files in the project directories
   - Rebuild and restart the backend container:
     ```bash
     docker-compose up -d --build backend
     ```

### Adding Dependencies

1. Python dependencies:
   - Add to `requirements.txt`
   - Rebuild the backend container:
     ```bash
     docker-compose up -d --build backend
     ```

2. Node.js dependencies:
   - Add using npm inside the frontend container:
     ```bash
     docker-compose exec frontend npm install new-package
     ```
   - Or update `package.json` and rebuild:
     ```bash
     docker-compose up -d --build frontend
     ```

## Troubleshooting

### Container Fails to Start

1. Check container logs:
   ```bash
   docker-compose logs backend
   ```

2. Verify database connection:
   ```bash
   docker-compose exec backend python -c "import mysql.connector; print(mysql.connector.connect(host='db', user='root', password='password', database='StudentReportingDB'))"
   ```

3. Check if required directories exist:
   ```bash
   docker-compose exec backend ls -la /app/templates/images
   ```

### PDF Generation Issues

1. Verify Playwright installation:
   ```bash
   docker-compose exec backend playwright --version
   ```

2. Check if Ghostscript is working:
   ```bash
   docker-compose exec backend gs --version
   ```

3. Test PDF generation manually:
   ```bash
   docker-compose exec backend python -c "from reports.generate_pdf_with_styles import generate_pdf_report; print(generate_pdf_report(['23A95A6102'], includeCharts=True))"
   ```

### Database Issues

1. Check if database is running:
   ```bash
   docker-compose exec db mysqladmin -u root -ppassword ping
   ```

2. Verify database tables:
   ```bash
   docker-compose exec db mysql -u root -ppassword -e "USE StudentReportingDB; SHOW TABLES;"
   ```

3. Reset database if needed:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

## Production Deployment

For production deployment, consider the following modifications:

1. Use a production-ready web server for the frontend:
   - Build the frontend: `npm run build`
   - Serve using Nginx or similar

2. Configure the Flask application for production:
   - Disable debug mode
   - Use a production WSGI server like Gunicorn

3. Implement proper database credentials and security:
   - Use environment variables for sensitive information
   - Implement database backups

4. Set up proper networking and security:
   - Use a reverse proxy (Nginx, Traefik)
   - Configure HTTPS
   - Implement proper authentication

Example production `docker-compose.yml` modifications:

```yaml
backend:
  environment:
    - FLASK_ENV=production
    - FLASK_DEBUG=0
  command: gunicorn --bind 0.0.0.0:5000 app:app

frontend:
  image: nginx:alpine
  volumes:
    - ./frontend/dist:/usr/share/nginx/html
    - ./nginx.conf:/etc/nginx/conf.d/default.conf
  ports:
    - "80:80"
```