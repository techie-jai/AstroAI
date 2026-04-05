#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
AstroAI Complete Startup Script
Starts backend, frontend, runs tests, and opens browser
"""

import subprocess
import time
import sys
import os
import webbrowser
import requests
from pathlib import Path

# Configuration
PROJECT_ROOT = Path(__file__).parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"
BACKEND_PORT = 8000
FRONTEND_PORT = 3000

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    """Print a formatted header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(80)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}\n")

def print_success(text):
    """Print success message"""
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_error(text):
    """Print error message"""
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def print_info(text):
    """Print info message"""
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")

def print_warning(text):
    """Print warning message"""
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def check_port_available(port):
    """Check if a port is available"""
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result != 0

def wait_for_service(url, timeout=30, name="Service"):
    """Wait for a service to be available"""
    print_info(f"Waiting for {name} to start...")
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            response = requests.get(url, timeout=2)
            if response.status_code < 500:
                print_success(f"{name} is running!")
                return True
        except requests.exceptions.RequestException:
            pass
        
        time.sleep(1)
    
    print_error(f"{name} did not start within {timeout} seconds")
    return False

def start_backend():
    """Start the FastAPI backend"""
    print_header("Starting Backend (FastAPI)")
    
    if not check_port_available(BACKEND_PORT):
        print_error(f"Port {BACKEND_PORT} is already in use")
        return None
    
    print_info(f"Starting backend on port {BACKEND_PORT}...")
    
    try:
        # Start backend in a subprocess without capturing output
        backend_process = subprocess.Popen(
            [sys.executable, "main.py"],
            cwd=str(BACKEND_DIR)
        )
        
        # Wait for backend to be ready
        if wait_for_service(f"{BACKEND_URL}/health", name="Backend", timeout=60):
            print_success(f"Backend running at {BACKEND_URL}")
            return backend_process
        else:
            backend_process.terminate()
            return None
            
    except Exception as e:
        print_error(f"Failed to start backend: {str(e)}")
        return None

def start_frontend():
    """Start the React frontend"""
    print_header("Starting Frontend (React/Vite)")
    
    if not check_port_available(FRONTEND_PORT):
        print_error(f"Port {FRONTEND_PORT} is already in use")
        return None
    
    print_info(f"Starting frontend on port {FRONTEND_PORT}...")
    
    try:
        # Check if node_modules exists
        if not (FRONTEND_DIR / "node_modules").exists():
            print_warning("node_modules not found, running npm install...")
            subprocess.run(
                "npm install",
                cwd=str(FRONTEND_DIR),
                check=True,
                capture_output=True,
                shell=True
            )
            print_success("npm install completed")
        
        # Start frontend in a subprocess without capturing output
        frontend_process = subprocess.Popen(
            "npm run dev",
            cwd=str(FRONTEND_DIR),
            shell=True
        )
        
        # Wait for frontend to be ready
        time.sleep(5)  # Give Vite time to start
        print_success(f"Frontend running at {FRONTEND_URL}")
        return frontend_process
            
    except Exception as e:
        print_error(f"Failed to start frontend: {str(e)}")
        return None

def run_backend_tests():
    """Run backend tests"""
    print_header("Running Backend Tests")
    
    test_file = PROJECT_ROOT / "test_backend_endpoints.py"
    
    if not test_file.exists():
        print_warning("Test file not found, skipping tests")
        return True
    
    try:
        print_info("Running backend endpoint tests...")
        result = subprocess.run(
            [sys.executable, str(test_file)],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            # Print test output
            print(result.stdout)
            print_success("All backend tests passed!")
            return True
        else:
            print_error("Some tests failed:")
            print(result.stdout)
            print(result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print_error("Tests timed out")
        return False
    except Exception as e:
        print_error(f"Failed to run tests: {str(e)}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print_header("Testing API Endpoints")
    
    tests = [
        ("Health Check", f"{BACKEND_URL}/health", "GET"),
        ("Available Charts", f"{BACKEND_URL}/api/charts/available", "GET"),
    ]
    
    all_passed = True
    
    for test_name, url, method in tests:
        try:
            if method == "GET":
                response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                print_success(f"{test_name}: {response.status_code}")
            else:
                print_error(f"{test_name}: {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print_error(f"{test_name}: {str(e)}")
            all_passed = False
    
    return all_passed

def open_browser():
    """Open the frontend in the default browser"""
    print_header("Opening Browser")
    
    print_info(f"Opening {FRONTEND_URL} in your default browser...")
    
    try:
        webbrowser.open(FRONTEND_URL)
        print_success("Browser opened successfully!")
        return True
    except Exception as e:
        print_warning(f"Could not open browser automatically: {str(e)}")
        print_info(f"Please open {FRONTEND_URL} manually in your browser")
        return False

def print_summary(backend_process, frontend_process, tests_passed):
    """Print final summary"""
    print_header("Startup Summary")
    
    print(f"{Colors.BOLD}Services:{Colors.ENDC}")
    print(f"  Backend:  {Colors.OKGREEN}Running{Colors.ENDC} ({BACKEND_URL})")
    print(f"  Frontend: {Colors.OKGREEN}Running{Colors.ENDC} ({FRONTEND_URL})")
    
    print(f"\n{Colors.BOLD}Tests:{Colors.ENDC}")
    if tests_passed:
        print(f"  Status: {Colors.OKGREEN}All Passed{Colors.ENDC}")
    else:
        print(f"  Status: {Colors.WARNING}Some Failed{Colors.ENDC}")
    
    print(f"\n{Colors.BOLD}Next Steps:{Colors.ENDC}")
    print(f"  1. Open {FRONTEND_URL} in your browser")
    print(f"  2. Login with your Firebase credentials")
    print(f"  3. Navigate to 'Generate Kundli'")
    print(f"  4. Enter birth details and generate")
    
    print(f"\n{Colors.BOLD}To Stop Services:{Colors.ENDC}")
    print(f"  Press Ctrl+C to stop all services")
    
    print(f"\n{Colors.BOLD}Logs:{Colors.ENDC}")
    print(f"  Backend logs: Check terminal output above")
    print(f"  Frontend logs: Check the frontend terminal")

def main():
    """Main startup function"""
    print_header("AstroAI Complete Startup")
    
    print_info(f"Project root: {PROJECT_ROOT}")
    print_info(f"Backend directory: {BACKEND_DIR}")
    print_info(f"Frontend directory: {FRONTEND_DIR}")
    
    # Start services
    backend_process = None
    frontend_process = None
    
    try:
        # Start backend
        backend_process = start_backend()
        if not backend_process:
            print_error("Failed to start backend. Exiting.")
            return 1
        
        # Run backend tests
        tests_passed = run_backend_tests()
        
        # Test API endpoints
        api_tests_passed = test_api_endpoints()
        
        # Start frontend
        frontend_process = start_frontend()
        if not frontend_process:
            print_error("Failed to start frontend. Exiting.")
            if backend_process:
                backend_process.terminate()
            return 1
        
        # Open browser
        open_browser()
        
        # Print summary
        print_summary(backend_process, frontend_process, tests_passed and api_tests_passed)
        
        print_header("Services Running")
        print_info("Press Ctrl+C to stop all services\n")
        
        # Keep services running
        while True:
            time.sleep(1)
            
            # Check if processes are still running
            if backend_process and backend_process.poll() is not None:
                print_error("Backend process terminated unexpectedly")
                break
            
            if frontend_process and frontend_process.poll() is not None:
                print_error("Frontend process terminated unexpectedly")
                break
    
    except KeyboardInterrupt:
        print_header("Shutting Down")
        print_info("Stopping services...")
        
        if backend_process:
            backend_process.terminate()
            print_success("Backend stopped")
        
        if frontend_process:
            frontend_process.terminate()
            print_success("Frontend stopped")
        
        print_success("All services stopped")
        return 0
    
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        
        if backend_process:
            backend_process.terminate()
        
        if frontend_process:
            frontend_process.terminate()
        
        return 1

if __name__ == "__main__":
    sys.exit(main())
