#!/bin/bash

set -e

echo "================================================================================"
echo "AstroAI Complete Startup (Docker)"
echo "================================================================================"
echo ""
echo "Data Sources Configuration:"
echo "  • Backend: Python FastAPI on port 8000"
echo "  • Frontend: SPA on port 3000 (reads from local storage + Firebase)"
echo "  • Admin Panel: SPA on port 3001 (reads from local storage + Firebase)"
echo ""
echo "Admin Dashboard Data Sources:"
echo "  • Users: Firebase + Local filesystem"
echo "  • Kundlis: Local filesystem (users/kundli_index.json)"
echo "  • Analytics: Computed from local storage"
echo "  • User Growth: Real data from filesystem timestamps"
echo ""

# Create users directory for local Kundli storage if it doesn't exist
if [ ! -d "/app/users" ]; then
    mkdir -p /app/users
    echo "✓ Created users directory for local Kundli storage: /app/users"
fi

# Check if kundli_index.json exists
if [ -f "/app/users/kundli_index.json" ]; then
    echo "✓ Found existing kundli_index.json with user data"
else
    echo "ℹ No kundli_index.json yet - will be created on first kundli generation"
fi

# ============================================================================
# VALIDATE ADMIN PANEL DATA
# ============================================================================
echo ""
echo "Validating admin panel data..."
echo ""

python /app/backend/validate_admin_data.py

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
echo "Command: python spa_server.py 3000 /app/frontend/dist"
echo ""

# Create SPA server script for frontend
cat > /app/spa_server_frontend.py << 'EOFILE'
import http.server
import socketserver
import os
import sys
from pathlib import Path

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = Path(self.path.lstrip('/'))
        full_path = Path('/app/frontend/dist') / path
        
        # If file exists, serve it
        if full_path.is_file():
            return super().do_GET()
        
        # Otherwise serve index.html for SPA routing
        self.path = '/index.html'
        return super().do_GET()
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

os.chdir('/app/frontend/dist')
handler = SPAHandler
httpd = socketserver.TCPServer(("", 3000), handler)
print("Frontend SPA server running on port 3000")
httpd.serve_forever()
EOFILE

python /app/spa_server_frontend.py &
FRONTEND_PID=$!

echo "Waiting 2 seconds for frontend to start..."
sleep 2

echo ""
echo "Starting Admin Panel..."
echo "Command: python spa_server.py 3001 /app/admin-panel/dist"
echo ""

# Create SPA server script for admin panel
cat > /app/spa_server_admin.py << 'EOFILE'
import http.server
import socketserver
import os
import sys
from pathlib import Path

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = Path(self.path.lstrip('/'))
        full_path = Path('/app/admin-panel/dist') / path
        
        # If file exists, serve it
        if full_path.is_file():
            return super().do_GET()
        
        # Otherwise serve index.html for SPA routing
        self.path = '/index.html'
        return super().do_GET()
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

os.chdir('/app/admin-panel/dist')
handler = SPAHandler
httpd = socketserver.TCPServer(("", 3001), handler)
print("Admin Panel SPA server running on port 3001")
httpd.serve_forever()
EOFILE

python /app/spa_server_admin.py &
ADMIN_PID=$!

echo ""
echo "================================================================================"
echo "Services Starting"
echo "================================================================================"
echo ""
echo "Backend:       http://localhost:8000"
echo "  • API endpoints for kundli generation and analysis"
echo "  • Admin analytics from local storage"
echo "  • Firebase integration for auth"
echo ""
echo "Frontend:      http://localhost:3000"
echo "  • User kundli generation and results"
echo "  • Data from local storage + Firebase"
echo ""
echo "Admin Panel:   http://localhost:3001"
echo "  • Dashboard with real metrics (70+ users, 100+ kundlis)"
echo "  • User management from Firebase"
echo "  • Analytics computed from local storage"
echo "  • Data sources: Firebase + Local filesystem"
echo ""
echo "Domain:        https://kendraa.ai (via Cloudflare Tunnel)"
echo ""
echo "Services are running. Cloudflared tunnel will be managed by docker-compose."
echo "Check logs above for details."
echo ""

wait $BACKEND_PID $FRONTEND_PID $ADMIN_PID
