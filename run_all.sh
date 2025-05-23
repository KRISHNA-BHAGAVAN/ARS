#!/bin/bash
echo "Starting Automated Reporting System..."


# Starting Apache and MySQL
echo "Starting Apache and MySQL services..."
sudo systemctl start apache2
sudo systemctl start mysql

# Start backend server
echo "Starting backend server..."
cd backend
npm install &> /dev/null
node index.js &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"
cd ..

# Wait a moment for backend to initialize
sleep 2

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm install &> /dev/null
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo "All servers started successfully!"
echo "Backend running on http://localhost:5000"
echo "Frontend running on http://localhost:5173"
echo ""
echo "Use the following credentials to login:"
echo "Faculty: username: faculty, password: faculty123"
echo ""
echo "To stop all servers, run: ./stop_all.sh"