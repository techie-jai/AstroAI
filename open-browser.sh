#!/bin/bash

# Script to open AstroAI services in browser
# This script waits for services to be ready and then opens them in the default browser

echo "Waiting for services to start..."
sleep 10

# Function to check if service is up
check_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: Waiting for $url..."
        sleep 2
        attempt=$((attempt + 1))
    done
    return 1
}

echo "Checking if services are ready..."

# Check backend
if check_service "http://localhost:8000/api/health" || check_service "http://localhost:8000"; then
    echo "✓ Backend is ready"
else
    echo "✗ Backend is not responding"
fi

# Check frontend
if check_service "http://localhost:3000"; then
    echo "✓ Frontend is ready"
else
    echo "✗ Frontend is not responding"
fi

# Check admin panel
if check_service "http://localhost:3001"; then
    echo "✓ Admin Panel is ready"
else
    echo "✗ Admin Panel is not responding"
fi

echo ""
echo "Opening services in browser..."
echo ""

# Detect OS and open browser accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        echo "Opening Admin Panel: http://localhost:3001"
        xdg-open "http://localhost:3001" &
        sleep 2
        echo "Opening Website: http://localhost:3000"
        xdg-open "http://localhost:3000" &
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Opening Admin Panel: http://localhost:3001"
    open "http://localhost:3001" &
    sleep 2
    echo "Opening Website: http://localhost:3000"
    open "http://localhost:3000" &
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "Opening Admin Panel: http://localhost:3001"
    start "http://localhost:3001" &
    sleep 2
    echo "Opening Website: http://localhost:3000"
    start "http://localhost:3000" &
else
    echo "Unable to detect OS. Please open manually:"
    echo "  Admin Panel: http://localhost:3001"
    echo "  Website:     http://localhost:3000"
fi

echo ""
echo "Services are running:"
echo "  Backend:     http://localhost:8000"
echo "  Website:     http://localhost:3000"
echo "  Admin Panel: http://localhost:3001"
echo ""
