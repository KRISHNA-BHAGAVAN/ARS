#!/bin/bash
echo "Stopping Automated Reporting System..."

# Stop Apache and MySQL
echo "Stopping Apache and MySQL services..."
sudo systemctl stop apache2
sudo systemctl stop mysql

# Ports to check (your app ports)
PORTS=(5000 5173)

for PORT in "${PORTS[@]}"; do
  # Get PID using lsof
  PID=$(lsof -ti tcp:$PORT)

  if [ -n "$PID" ]; then
    echo "Killing process on port $PORT with PID $PID"
    kill -9 $PID
  else
    echo "No process is using port $PORT"
  fi
done

echo "All services and project servers stopped."
