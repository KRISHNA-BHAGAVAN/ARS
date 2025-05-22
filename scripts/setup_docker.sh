#!/bin/bash

# Setup script for Docker environment
echo "Setting up Docker environment for Student Reporting System..."

# Create necessary directories
mkdir -p templates/images output

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create placeholder images if they don't exist
if [ ! -f templates/images/header.png ]; then
    echo "Creating placeholder header image..."
    touch templates/images/header.png
fi

if [ ! -f templates/images/sample_image.png ]; then
    echo "Creating placeholder student image..."
    touch templates/images/sample_image.png
fi

# Build and start the containers
echo "Building and starting Docker containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

echo "✅ Setup complete! The application should now be running at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "You can check the status of the containers with:"
echo "docker-compose ps"
echo ""
echo "To view logs:"
echo "docker-compose logs"
echo ""
echo "To stop the application:"
echo "docker-compose down"