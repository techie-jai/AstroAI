# Test script to verify Cloudflare Tunnel connectivity (Windows PowerShell)
# Run this after tunnel is active to verify everything works

param(
    [string]$Domain = "yourdomain.com",
    [string]$TunnelName = "astroai"
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

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url
    )
    
    Write-Host -NoNewline "Testing $Name... "
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 301 -or $response.StatusCode -eq 302) {
            Write-Success "OK"
            return $true
        }
    } catch {
        Write-Error "FAILED"
        return $false
    }
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "AstroAI Tunnel Connectivity Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test local services first
Write-Host "=== Local Services ===" -ForegroundColor Cyan
Test-Endpoint "Backend (local)" "http://localhost:8000/health" | Out-Null
Test-Endpoint "Frontend (local)" "http://localhost:3000" | Out-Null
Write-Host ""

# Test tunnel status
Write-Host "=== Tunnel Status ===" -ForegroundColor Cyan
Write-Host -NoNewline "Checking tunnel status... "
$tunnelStatus = cloudflared tunnel list | Select-String $TunnelName
if ($tunnelStatus) {
    Write-Success "Tunnel exists"
    Write-Host $tunnelStatus
} else {
    Write-Error "Tunnel not found"
    exit 1
}
Write-Host ""

# Test remote access
Write-Host "=== Remote Access (via Cloudflare) ===" -ForegroundColor Cyan
Write-Host "Testing HTTPS endpoints (this may take a moment)..."
Write-Host ""

Test-Endpoint "Frontend (remote)" "https://astroai.$Domain" | Out-Null
Test-Endpoint "Backend (remote)" "https://api.astroai.$Domain/health" | Out-Null
Write-Host ""

# Test DNS resolution
Write-Host "=== DNS Resolution ===" -ForegroundColor Cyan
Write-Host -NoNewline "Resolving astroai.$Domain... "
try {
    $dnsResult = [System.Net.Dns]::GetHostAddresses("astroai.$Domain")
    if ($dnsResult) {
        Write-Success "OK"
        Write-Host "  IP: $($dnsResult[0].IPAddressToString)"
    }
} catch {
    Write-Warning "Not resolving"
    Write-Host "  This may be normal if DNS hasn't propagated yet"
}
Write-Host ""

# Test tunnel logs
Write-Host "=== Recent Tunnel Logs ===" -ForegroundColor Cyan
Write-Host "Last 5 log entries:"
cloudflared tunnel logs $TunnelName --num 5
Write-Host ""

Write-Host "================================" -ForegroundColor Green
Write-Host "Test complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:"
Write-Host "  - Local services: Check if running with 'docker-compose ps'"
Write-Host "  - Tunnel status: Should show active connections"
Write-Host "  - Remote access: Should return HTTP 200"
Write-Host "  - DNS: May take 5-10 minutes to propagate"
Write-Host ""
Write-Host "For more details, run:"
Write-Host "  cloudflared tunnel logs $TunnelName --level debug"
