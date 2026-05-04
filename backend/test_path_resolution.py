#!/usr/bin/env python3
"""
Test script to verify path resolution in FileManager
"""
import os
import sys

# Test path normalization
print("=" * 80)
print("PATH RESOLUTION TEST")
print("=" * 80)

# Simulate Docker path
docker_path = "/app/backend/../users"
normalized = os.path.normpath(docker_path)
print(f"\nDocker path (unnormalized): {docker_path}")
print(f"Docker path (normalized):   {normalized}")
print(f"Match expected (/app/users): {normalized == '/app/users'}")

# Simulate local path
local_path = "e:\\25. Codes\\17. AstroAI V3\\AstroAi\\backend\\..\\users"
normalized_local = os.path.normpath(local_path)
print(f"\nLocal path (unnormalized): {local_path}")
print(f"Local path (normalized):   {normalized_local}")
print(f"Contains 'users': {'users' in normalized_local}")

# Test with os.path.abspath
cwd = os.getcwd()
print(f"\nCurrent working directory: {cwd}")

parent_path = os.path.normpath(os.path.abspath(os.path.join("..", "users")))
print(f"Parent path from cwd:      {parent_path}")
print(f"Parent path exists:        {os.path.exists(parent_path)}")

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
