#!/bin/bash

set -e

echo "================================================================================"
echo "AstroAI Complete Startup (Docker)"
echo "================================================================================"
echo ""

# Create users directory for local Kundli storage if it doesn't exist
if [ ! -d "/app/users" ]; then
    mkdir -p /app/users
    echo "Created users directory for local Kundli storage: /app/users"
fi

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID $ADMIN_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

echo "Starting Backend..."
echo "Command: python backend/main.py"
echo ""

cd /app
python backend/main.py &
BACKEND_PID=$!

echo "Waiting 5 seconds for backend to start..."
sleep 5

echo ""
echo "Starting Frontend..."
echo "Command: python -m http.server 3000 (serving pre-built dist)"
echo ""

cd /app/frontend/dist
python -m http.server 3000 &
FRONTEND_PID=$!

echo "Waiting 2 seconds for frontend to start..."
sleep 2

echo ""
echo "Starting Admin Panel..."
echo "Command: python -m http.server 3001 (serving pre-built dist)"
echo ""

cd /app/admin-panel/dist
python -m http.server 3001 &
ADMIN_PID=$!

echo ""
echo "================================================================================"
echo "Services Starting"
echo "================================================================================"
echo ""
echo "Backend:       http://localhost:8000"
echo "Frontend:      http://localhost:3000"
echo "Admin Panel:   http://localhost:3001"
echo "Domain:        https://kendraa.ai (via Cloudflare Tunnel)"
echo ""
echo "Services are running. Cloudflared tunnel will be managed by docker-compose."
echo "Check logs above for details."
echo ""

wait $BACKEND_PID $FRONTEND_PID $ADMIN_PID
