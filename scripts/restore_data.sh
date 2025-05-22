#!/bin/bash

# Restore script for Student Reporting System
# This script restores a backup of the database and important files

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "❌ No backup file specified."
    echo "Usage: $0 <backup_file.tar.gz>"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Extracting backup to temporary directory..."
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Find the SQL dump file
SQL_DUMP=$(find "$TEMP_DIR" -name "*.sql" | head -n 1)

if [ -z "$SQL_DUMP" ]; then
    echo "❌ No SQL dump found in the backup."
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Check if running in Docker environment
if [ -f "docker-compose.yml" ]; then
    echo "Docker environment detected. Restoring database to Docker container..."
    
    # Restore database
    echo "Restoring database..."
    cat "$SQL_DUMP" | docker-compose exec -T db mysql -u root -ppassword StudentReportingDB
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to restore database. Is the Docker container running?"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
else
    echo "Local environment detected. Restoring database..."
    
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
    
    # Restore database
    echo "Restoring database..."
    mysql -h "${host:-localhost}" -u "${user:-root}" -p"${password}" "${database:-StudentReportingDB}" < "$SQL_DUMP"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to restore database. Please check your database credentials."
        rm -rf "$TEMP_DIR"
        exit 1
    fi
fi

# Restore template images
if [ -d "$TEMP_DIR/templates/images" ]; then
    echo "Restoring template images..."
    mkdir -p templates/images
    cp -r "$TEMP_DIR/templates/images/"* templates/images/
fi

# Restore environment configuration
if [ -f "$TEMP_DIR/.env" ]; then
    echo "Restoring environment configuration..."
    cp "$TEMP_DIR/.env" .env
fi

# Restore frontend source code
if [ -d "$TEMP_DIR/frontend/src" ]; then
    echo "Restoring frontend source code..."
    mkdir -p frontend/src
    cp -r "$TEMP_DIR/frontend/src/"* frontend/src/
fi

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ Restore completed successfully!"
echo "You may need to restart the application for changes to take effect."
if [ -f "docker-compose.yml" ]; then
    echo "Run: docker-compose restart"
fi