#!/bin/bash
echo "Stopping Automated Reporting System..."
# Ports to check
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

echo "All servers stopped."