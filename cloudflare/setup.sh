#!/bin/bash
# Cloudflare Tunnel Setup Script for Linux/macOS
# This script automates the Cloudflare Tunnel setup process

set -e

echo "================================"
echo "AstroAI Cloudflare Tunnel Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}Error: cloudflared is not installed${NC}"
    echo "Install it with:"
    echo "  macOS: brew install cloudflare/cloudflare/cloudflared"
    echo "  Linux: curl -L --output cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.tgz && tar -xzf cloudflared.tgz && sudo mv cloudflared /usr/local/bin/"
    exit 1
fi

echo -e "${GREEN}✓ cloudflared is installed${NC}"
cloudflared --version
echo ""

# Step 1: Authenticate
echo -e "${YELLOW}Step 1: Authenticate with Cloudflare${NC}"
echo "This will open a browser window for authentication..."
cloudflared tunnel login
echo -e "${GREEN}✓ Authentication complete${NC}"
echo ""

# Step 2: Create tunnel
echo -e "${YELLOW}Step 2: Create tunnel${NC}"
read -p "Enter tunnel name (default: astroai): " TUNNEL_NAME
TUNNEL_NAME=${TUNNEL_NAME:-astroai}

if cloudflared tunnel list | grep -q "$TUNNEL_NAME"; then
    echo -e "${YELLOW}Tunnel '$TUNNEL_NAME' already exists${NC}"
    TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
else
    echo "Creating tunnel '$TUNNEL_NAME'..."
    cloudflared tunnel create "$TUNNEL_NAME"
    TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
fi

echo -e "${GREEN}✓ Tunnel created/found${NC}"
echo "Tunnel ID: $TUNNEL_ID"
echo ""

# Step 3: Configure DNS
echo -e "${YELLOW}Step 3: Configure DNS records${NC}"
read -p "Enter your domain (e.g., yourdomain.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: Domain is required${NC}"
    exit 1
fi

echo "Creating DNS records..."
cloudflared tunnel route dns "$TUNNEL_NAME" "astroai.$DOMAIN"
cloudflared tunnel route dns "$TUNNEL_NAME" "api.astroai.$DOMAIN"
echo -e "${GREEN}✓ DNS records created${NC}"
echo ""

# Step 4: Copy config file
echo -e "${YELLOW}Step 4: Copy configuration file${NC}"
CLOUDFLARED_DIR="$HOME/.cloudflared"
CONFIG_FILE="$CLOUDFLARED_DIR/config.yml"

if [ -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}Config file already exists at $CONFIG_FILE${NC}"
    read -p "Overwrite? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping config file copy"
    else
        cp config.yml "$CONFIG_FILE"
        sed -i "s/yourdomain.com/$DOMAIN/g" "$CONFIG_FILE"
        echo -e "${GREEN}✓ Config file updated${NC}"
    fi
else
    cp config.yml "$CONFIG_FILE"
    sed -i "s/yourdomain.com/$DOMAIN/g" "$CONFIG_FILE"
    echo -e "${GREEN}✓ Config file copied${NC}"
fi
echo ""

# Step 5: Verify services
echo -e "${YELLOW}Step 5: Verify local services${NC}"
echo "Checking backend (port 8000)..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${YELLOW}⚠ Backend is not responding${NC}"
    echo "  Make sure Docker services are running: docker-compose up -d"
fi

echo "Checking frontend (port 3000)..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is not responding${NC}"
    echo "  Make sure Docker services are running: docker-compose up -d"
fi
echo ""

# Step 6: Start tunnel
echo -e "${YELLOW}Step 6: Start tunnel${NC}"
read -p "Start tunnel now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting tunnel..."
    echo "Press Ctrl+C to stop"
    echo ""
    cloudflared tunnel run "$TUNNEL_NAME"
else
    echo "To start tunnel manually, run:"
    echo "  cloudflared tunnel run $TUNNEL_NAME"
fi
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Your AstroAI instance is now accessible at:"
echo "  Frontend: https://astroai.$DOMAIN"
echo "  Backend:  https://api.astroai.$DOMAIN"
echo ""
echo "To run tunnel as a service:"
echo "  sudo cloudflared service install"
echo "  sudo systemctl start cloudflared"
