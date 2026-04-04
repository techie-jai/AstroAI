# AstroAI Complete Shutdown Script (PowerShell)
# Stops and terminates backend and frontend processes

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "AstroAI Complete Shutdown" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Terminating services..." -ForegroundColor Cyan
Write-Host ""

# Stop backend (port 8000)
Write-Host "Stopping Backend (Python) on port 8000..." -ForegroundColor Yellow
try {
    $netstatLines = netstat -ano | Select-String "LISTENING" | Select-String ":8000"
    if ($netstatLines) {
        $netstatLine = $netstatLines[0] -as [string]
        $parts = $netstatLine -split '\s+' | Where-Object { $_ -ne '' }
        if ($parts.Count -gt 0) {
            $processId = [int]$parts[-1]
            if ($processId -gt 0) {
                Write-Host "Found process with PID: $processId" -ForegroundColor Cyan
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "✓ Terminated Backend (PID: $processId)" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠ No process found on port 8000" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error stopping Backend: $_" -ForegroundColor Red
}

Write-Host ""

# Stop frontend (port 3000)
Write-Host "Stopping Frontend (React) on port 3000..." -ForegroundColor Yellow
try {
    $netstatLines = netstat -ano | Select-String "LISTENING" | Select-String ":3000"
    if ($netstatLines) {
        $netstatLine = $netstatLines[0] -as [string]
        $parts = $netstatLine -split '\s+' | Where-Object { $_ -ne '' }
        if ($parts.Count -gt 0) {
            $processId = [int]$parts[-1]
            if ($processId -gt 0) {
                Write-Host "Found process with PID: $processId" -ForegroundColor Cyan
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "✓ Terminated Frontend (PID: $processId)" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠ No process found on port 3000" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error stopping Frontend: $_" -ForegroundColor Red
}

Write-Host ""

# Clean up Node processes
Write-Host "Cleaning up Node processes..." -ForegroundColor Yellow
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        foreach ($proc in $nodeProcesses) {
            $procId = $proc.Id
            Write-Host "Found Node process (PID: $procId)" -ForegroundColor Cyan
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "✓ Terminated Node process (PID: $procId)" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠ No Node processes found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error stopping Node processes: $_" -ForegroundColor Red
}

Write-Host ""

# Clean up Python processes
Write-Host "Cleaning up Python processes..." -ForegroundColor Yellow
try {
    $pythonProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue
    if ($pythonProcesses) {
        foreach ($proc in $pythonProcesses) {
            $procId = $proc.Id
            Write-Host "Found Python process (PID: $procId)" -ForegroundColor Cyan
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "✓ Terminated Python process (PID: $procId)" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠ No Python processes found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error stopping Python processes: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "Shutdown Complete" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All services have been terminated." -ForegroundColor Green
Write-Host ""
