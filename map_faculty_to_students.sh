#!/bin/bash

echo "Mapping faculty to students in the database..."

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Ask for MySQL credentials
read -p "Enter MySQL username: " DB_USER
read -s -p "Enter MySQL password: " DB_PASSWORD
echo ""

# Run the mapping script
echo "Running mapping script..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" reporting_system < backend/db_mapping.sql

if [ $? -eq 0 ]; then
    echo "✅ Faculty-student mapping completed successfully!"
    echo ""
    echo "You can now start the backend server with: cd backend && npm start"
    echo "And the frontend with: cd frontend && npm run dev"
else
    echo "❌ Mapping failed. Please check your MySQL credentials and try again."
fi