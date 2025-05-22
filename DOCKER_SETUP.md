# Docker Setup Guide

This guide provides step-by-step instructions for setting up the Student Reporting System using Docker.

## Prerequisites

- Docker Engine (20.10.0+)
- Docker Compose (2.0.0+)
- Git (for cloning the repository)

## Quick Setup

For a quick setup, use the provided setup script:

```bash
./scripts/setup_docker.sh
```

This script will:
1. Check if Docker and Docker Compose are installed
2. Create necessary directories
3. Create placeholder images
4. Build and start the Docker containers

## Manual Setup

If you prefer to set up manually, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd student-reporting-system
```

### 2. Create Necessary Directories

```bash
mkdir -p templates/images output
```

### 3. Create Placeholder Images

```bash
touch templates/images/header.png
touch templates/images/sample_image.png
```

### 4. Build and Start the Containers

```bash
docker-compose up -d --build
```

### 5. Verify the Setup

```bash
docker-compose ps
```

All services should be in the "running" state.

## Customizing the Setup

### Database Configuration

You can customize the database configuration by modifying the environment variables in the `docker-compose.yml` file:

```yaml
db:
  environment:
    MYSQL_ROOT_PASSWORD: your_password
    MYSQL_DATABASE: your_database_name
```

### Port Configuration

If you need to change the default ports, modify the port mappings in the `docker-compose.yml` file:

```yaml
backend:
  ports:
    - "8080:5000"  # Change 8080 to your desired port

frontend:
  ports:
    - "8081:3000"  # Change 8081 to your desired port
```

### Volume Configuration

The application uses Docker volumes to persist data:

- `mysql_data`: Stores the MySQL database files
- Mounted directories:
  - `./templates/images`: For header and student images
  - `./output`: For generated reports

You can modify these in the `docker-compose.yml` file if needed.

## Adding Custom Images

### Header Image

Replace the placeholder header image with your institution's logo:

```bash
cp your_logo.png templates/images/header.png
```

### Student Photos

Replace the placeholder student photo with an actual photo:

```bash
cp student_photo.png templates/images/sample_image.png
```

## Troubleshooting

### Container Fails to Start

Check the container logs:

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Database Connection Issues

Verify that the database container is running:

```bash
docker-compose ps db
```

Check if the database is accessible:

```bash
docker-compose exec db mysql -u root -ppassword -e "SHOW DATABASES;"
```

### Frontend Cannot Connect to Backend

Check if the backend API is accessible:

```bash
curl http://localhost:5000/api/students
```

Verify that the Vite configuration has the correct proxy settings.

## Maintenance

### Backing Up Data

Use the provided backup script:

```bash
./scripts/backup_data.sh
```

This will create a backup of the database and important files in the `backups` directory.

### Restoring Data

Use the provided restore script:

```bash
./scripts/restore_data.sh backups/backup_20230101_120000.tar.gz
```

### Updating the Application

To update the application:

1. Pull the latest changes:
   ```bash
   git pull
   ```

2. Rebuild and restart the containers:
   ```bash
   docker-compose up -d --build
   ```

### Stopping the Application

To stop all services while preserving data:
```bash
docker-compose down
```

To stop all services and remove all data (including the database):
```bash
docker-compose down -v
```

## Next Steps

After setting up the application, you can:

1. Access the frontend at http://localhost:3000
2. Access the backend API at http://localhost:5000
3. Insert sample data using the provided script:
   ```bash
   docker-compose exec backend python -c "from utils.insert_sample_data import insert_sample_data; insert_sample_data()"
   ```
4. Start using the application as described in the User Guide