#!/bin/bash

set -e

echo "================================================================================"
echo "AstroAI Complete Startup (Docker)"
echo "================================================================================"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
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
echo "Command: npm run dev"
echo ""

# Create .env.local file for Vite with environment variables
cat > /app/frontend/.env.local << EOF
VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
VITE_API_BASE_URL=${VITE_API_BASE_URL}
EOF

echo "Created /app/frontend/.env.local with Firebase configuration"

cd /app/frontend
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

echo ""
echo "================================================================================"
echo "Services Starting"
echo "================================================================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Domain:   http://kendraa.ai"
echo ""
echo "Both services are running. Check logs above for details."
echo ""

wait $BACKEND_PID $FRONTEND_PID
