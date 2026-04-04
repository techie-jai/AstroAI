#!/bin/bash
# Test script to verify Cloudflare Tunnel connectivity
# Run this after tunnel is active to verify everything works

set -e

DOMAIN="${1:-yourdomain.com}"
TUNNEL_NAME="${2:-astroai}"

echo "================================"
echo "AstroAI Tunnel Connectivity Test"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

function test_endpoint() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Test local services first
echo "=== Local Services ==="
test_endpoint "Backend (local)" "http://localhost:8000/health" || echo "  Backend not running locally"
test_endpoint "Frontend (local)" "http://localhost:3000" || echo "  Frontend not running locally"
echo ""

# Test tunnel status
echo "=== Tunnel Status ==="
echo -n "Checking tunnel status... "
if cloudflared tunnel list | grep -q "$TUNNEL_NAME"; then
    echo -e "${GREEN}✓ Tunnel exists${NC}"
    cloudflared tunnel list | grep "$TUNNEL_NAME"
else
    echo -e "${RED}✗ Tunnel not found${NC}"
    exit 1
fi
echo ""

# Test remote access
echo "=== Remote Access (via Cloudflare) ==="
echo "Testing HTTPS endpoints (this may take a moment)..."
echo ""

test_endpoint "Frontend (remote)" "https://astroai.$DOMAIN" || echo "  Check DNS records are configured"
test_endpoint "Backend (remote)" "https://api.astroai.$DOMAIN/health" || echo "  Check DNS records are configured"
echo ""

# Test DNS resolution
echo "=== DNS Resolution ==="
echo -n "Resolving astroai.$DOMAIN... "
if nslookup "astroai.$DOMAIN" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    nslookup "astroai.$DOMAIN" | grep -A1 "Name:"
else
    echo -e "${YELLOW}⚠ Not resolving${NC}"
    echo "  This may be normal if DNS hasn't propagated yet"
fi
echo ""

# Test tunnel logs
echo "=== Recent Tunnel Logs ==="
echo "Last 5 log entries:"
cloudflared tunnel logs "$TUNNEL_NAME" --num 5
echo ""

echo "================================"
echo "Test complete!"
echo "================================"
echo ""
echo "Summary:"
echo "  - Local services: Check if running with 'docker-compose ps'"
echo "  - Tunnel status: Should show active connections"
echo "  - Remote access: Should return HTTP 200"
echo "  - DNS: May take 5-10 minutes to propagate"
echo ""
echo "For more details, run:"
echo "  cloudflared tunnel logs $TUNNEL_NAME --level debug"
