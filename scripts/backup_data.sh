#!/bin/bash

# Backup script for Student Reporting System
# This script creates a backup of the database and important files

# Set backup directory
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if running in Docker environment
if [ -f "docker-compose.yml" ]; then
    echo "Docker environment detected. Backing up database from Docker container..."
    
    # Create database dump
    echo "Creating database dump..."
    docker-compose exec -T db mysqldump -u root -ppassword StudentReportingDB > "$BACKUP_DIR/database_$TIMESTAMP.sql"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create database dump. Is the Docker container running?"
        exit 1
    fi
else
    echo "Local environment detected. Backing up database..."
    
    # Load environment variables
    if [ -f ".env" ]; then
        source .env
    else
        echo "❌ .env file not found. Please provide database credentials:"
        read -p "Database host: " host
        read -p "Database user: " user
        read -p "Database password: " -s password
        echo ""
        read -p "Database name: " database
    fi
    
    # Create database dump
    echo "Creating database dump..."
    mysqldump -h "${host:-localhost}" -u "${user:-root}" -p"${password}" "${database:-StudentReportingDB}" > "$BACKUP_DIR/database_$TIMESTAMP.sql"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create database dump. Please check your database credentials."
        exit 1
    fi
fi

# Backup important files
echo "Backing up important files..."
tar -czf "$BACKUP_FILE" \
    "$BACKUP_DIR/database_$TIMESTAMP.sql" \
    templates/images \
    .env \
    -C frontend/src . \
    2>/dev/null

# Remove temporary SQL dump
rm "$BACKUP_DIR/database_$TIMESTAMP.sql"

echo "✅ Backup completed successfully: $BACKUP_FILE"
echo "Backup contains:"
echo "- Database dump"
echo "- Template images"
echo "- Environment configuration"
echo "- Frontend source code"