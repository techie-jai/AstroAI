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
echo "Command: npm run dev"
echo ""

# Create .env.local file for Vite with environment variables
# Use Docker service name for internal communication
API_BASE_URL=${VITE_API_BASE_URL:-http://astroai:8000/api}
cat > /app/frontend/.env.local << EOF
VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
VITE_API_BASE_URL=${API_BASE_URL}
EOF

echo "Created /app/frontend/.env.local with Firebase configuration"

cd /app/frontend
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

echo "Waiting 3 seconds for frontend to start..."
sleep 3

echo ""
echo "Starting Admin Panel..."
echo "Command: npm run dev with environment variables"
echo ""

cd /app/admin-panel

# Create .env.local file for Admin Panel with environment variables
cat > /app/admin-panel/.env.local << EOF
VITE_ADMIN_API_URL=http://astroai:8000
VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
VITE_ADMIN_INACTIVITY_TIMEOUT=1800000
EOF

echo "Created /app/admin-panel/.env.local with Firebase configuration"
echo "Firebase Config:"
echo "  Project ID: ${VITE_FIREBASE_PROJECT_ID}"
echo "  Auth Domain: ${VITE_FIREBASE_AUTH_DOMAIN}"
echo "  API Key: ${VITE_FIREBASE_API_KEY:0:10}..."

# Run dev server with environment variables
VITE_ADMIN_API_URL=http://astroai:8000 \
VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID} \
VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY} \
VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN} \
VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET} \
VITE_ADMIN_INACTIVITY_TIMEOUT=1800000 \
npm run dev -- --host 0.0.0.0 &
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
