# Cloudflare Service Installation Script
# Run this as Administrator

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "=== Cloudflare Tunnel Service Installation ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify cloudflared is installed
Write-Host "Step 1: Verifying cloudflared installation..." -ForegroundColor Green
try {
    $version = cloudflared --version
    Write-Host "✓ cloudflared is installed: $version" -ForegroundColor Green
} catch {
    Write-Host "✗ cloudflared is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Install service
Write-Host "Step 2: Installing Cloudflare service..." -ForegroundColor Green
$token = "eyJhIjoiOTQ0ZGE0Y2E4ZDAxNjBiOTAzZjk1MjU5NDVhMTg2ZTAiLCJ0IjoiODZhZTA2NWUtNmZjNS00MzdiLWJlNzMtYjMwNTEwYTQ0M2MxIiwicyI6Ik5UUXhaRGswTVRZdFlUSXlZUzAwTnpVeExUa3pZemd0TVRrd05HWXlNbVV5T1dVeSJ9"

try {
    cloudflared.exe service install $token
    Write-Host "✓ Service installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install service: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Start the service
Write-Host "Step 3: Starting Cloudflare service..." -ForegroundColor Green
try {
    Start-Service cloudflared
    Start-Sleep -Seconds 2
    Write-Host "✓ Service started" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to start service: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Verify service is running
Write-Host "Step 4: Verifying service status..." -ForegroundColor Green
$service = Get-Service cloudflared -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "✓ Service status: $($service.Status)" -ForegroundColor Green
    if ($service.Status -eq "Running") {
        Write-Host "✓ Cloudflare tunnel is active and running" -ForegroundColor Green
    } else {
        Write-Host "⚠ Service is installed but not running" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Service not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 5: Verify local services
Write-Host "Step 5: Checking local services..." -ForegroundColor Green

Write-Host "  Checking backend (port 8000)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Backend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ Backend is not responding (make sure Docker is running)" -ForegroundColor Yellow
}

Write-Host "  Checking frontend (port 3000)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Frontend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ Frontend is not responding (make sure Docker is running)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Cloudflare tunnel is now running as a Windows service." -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  Get-Service cloudflared              # Check service status"
Write-Host "  Start-Service cloudflared            # Start service"
Write-Host "  Stop-Service cloudflared             # Stop service"
Write-Host "  cloudflared tunnel list              # List tunnels"
Write-Host "  cloudflared tunnel logs astroai      # View tunnel logs"
Write-Host ""
