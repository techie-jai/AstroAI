# Cloudflare Tunnel Setup Script for Windows PowerShell
# This script automates the Cloudflare Tunnel setup process

param(
    [string]$TunnelName = "astroai",
    [string]$Domain = ""
)

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "=== $Message ===" -ForegroundColor Cyan
}

# Check if cloudflared is installed
Write-Step "Checking cloudflared installation"
try {
    $version = cloudflared --version
    Write-Success "cloudflared is installed"
    Write-Host $version
} catch {
    Write-Error "cloudflared is not installed"
    Write-Host "Install it with: choco install cloudflare-warp"
    exit 1
}

# Step 1: Authenticate
Write-Step "Step 1: Authenticate with Cloudflare"
Write-Host "This will open a browser window for authentication..."
cloudflared tunnel login
Write-Success "Authentication complete"

# Step 2: Create tunnel
Write-Step "Step 2: Create tunnel"
if ([string]::IsNullOrEmpty($TunnelName)) {
    $TunnelName = Read-Host "Enter tunnel name (default: astroai)"
    if ([string]::IsNullOrEmpty($TunnelName)) {
        $TunnelName = "astroai"
    }
}

$tunnelExists = cloudflared tunnel list | Select-String $TunnelName
if ($tunnelExists) {
    Write-Warning "Tunnel '$TunnelName' already exists"
    $tunnelId = ($tunnelExists -split '\s+')[0]
} else {
    Write-Host "Creating tunnel '$TunnelName'..."
    cloudflared tunnel create $TunnelName
    $tunnelId = (cloudflared tunnel list | Select-String $TunnelName | Select-Object -First 1) -split '\s+' | Select-Object -First 1
}

Write-Success "Tunnel created/found"
Write-Host "Tunnel ID: $tunnelId"

# Step 3: Configure DNS
Write-Step "Step 3: Configure DNS records"
if ([string]::IsNullOrEmpty($Domain)) {
    $Domain = Read-Host "Enter your domain (e.g., yourdomain.com)"
}

if ([string]::IsNullOrEmpty($Domain)) {
    Write-Error "Domain is required"
    exit 1
}

Write-Host "Creating DNS records..."
cloudflared tunnel route dns $TunnelName "astroai.$Domain"
cloudflared tunnel route dns $TunnelName "api.astroai.$Domain"
Write-Success "DNS records created"

# Step 4: Copy config file
Write-Step "Step 4: Copy configuration file"
$cloudflaredDir = "$env:USERPROFILE\.cloudflared"
$configFile = "$cloudflaredDir\config.yml"

if (Test-Path $configFile) {
    Write-Warning "Config file already exists at $configFile"
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -eq "y") {
        Copy-Item "config.yml" $configFile -Force
        (Get-Content $configFile) -replace "yourdomain.com", $Domain | Set-Content $configFile
        Write-Success "Config file updated"
    } else {
        Write-Host "Skipping config file copy"
    }
} else {
    Copy-Item "config.yml" $configFile -Force
    (Get-Content $configFile) -replace "yourdomain.com", $Domain | Set-Content $configFile
    Write-Success "Config file copied"
}

# Step 5: Verify services
Write-Step "Step 5: Verify local services"
Write-Host "Checking backend (port 8000)..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        Write-Success "Backend is running"
    }
} catch {
    Write-Warning "Backend is not responding"
    Write-Host "  Make sure Docker services are running: docker-compose up -d"
}

Write-Host "Checking frontend (port 3000)..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        Write-Success "Frontend is running"
    }
} catch {
    Write-Warning "Frontend is not responding"
    Write-Host "  Make sure Docker services are running: docker-compose up -d"
}

# Step 6: Start tunnel
Write-Step "Step 6: Start tunnel"
$startTunnel = Read-Host "Start tunnel now? (y/n)"
if ($startTunnel -eq "y") {
    Write-Host "Starting tunnel..."
    Write-Host "Press Ctrl+C to stop"
    Write-Host ""
    cloudflared tunnel run $TunnelName
} else {
    Write-Host "To start tunnel manually, run:"
    Write-Host "  cloudflared tunnel run $TunnelName"
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your AstroAI instance is now accessible at:"
Write-Host "  Frontend: https://astroai.$Domain"
Write-Host "  Backend:  https://api.astroai.$Domain"
Write-Host ""
Write-Host "To run tunnel as a service:"
Write-Host "  cloudflared service install"
Write-Host "  Start-Service cloudflared"
