"""
Validate and display admin panel data from local storage
Shows what data exists and what will be displayed in the admin panel
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80 + "\n")

def print_section(text):
    """Print a formatted section"""
    print(f"\n{text}")
    print("-" * 80)

def validate_data():
    """Validate and display all admin data"""
    
    print_header("ADMIN PANEL DATA VALIDATION")
    
    # Determine users path - check local first, then Docker
    # Local paths (development)
    if os.path.exists('users'):
        users_path = 'users'
        print("✓ Using local path: users/")
    elif os.path.exists('../users'):
        users_path = '../users'
        print("✓ Using parent path: ../users")
    # Docker path (production)
    elif os.path.exists('/app/users'):
        users_path = '/app/users'
        print("✓ Using Docker path: /app/users")
    # Fallback to absolute path
    else:
        users_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users')
        print(f"✓ Using absolute path: {users_path}")
    
    print(f"  Full path: {os.path.abspath(users_path)}\n")
    
    # Check if users directory exists
    if not os.path.exists(users_path):
        print("❌ ERROR: Users directory not found!")
        print(f"   Expected at: {os.path.abspath(users_path)}")
        return False
    
    print(f"✓ Users directory exists")
    print(f"  Size: {sum(os.path.getsize(os.path.join(dirpath, filename)) for dirpath, dirnames, filenames in os.walk(users_path) for filename in filenames) / (1024*1024):.2f} MB\n")
    
    # ========================================================================
    # SECTION 1: Global Kundli Index
    # ========================================================================
    print_section("1. GLOBAL KUNDLI INDEX (kundli_index.json)")
    
    index_file = os.path.join(users_path, 'kundli_index.json')
    
    if not os.path.exists(index_file):
        print("⚠ kundli_index.json not found")
        print("  This will be created when the first kundli is generated\n")
        kundli_index = {}
    else:
        print(f"✓ Found: {index_file}")
        try:
            with open(index_file, 'r') as f:
                kundli_index = json.load(f)
            print(f"✓ Valid JSON format")
            print(f"✓ Total kundlis: {len(kundli_index)}\n")
            
            # Show sample kundlis
            print("Sample kundlis:")
            for i, (kundli_id, kundli_data) in enumerate(list(kundli_index.items())[:3]):
                print(f"\n  [{i+1}] {kundli_id}")
                print(f"      User: {kundli_data.get('user_name', 'Unknown')}")
                print(f"      Generated: {kundli_data.get('generated_at', 'Unknown')}")
                if 'birth_data' in kundli_data:
                    bd = kundli_data['birth_data']
                    print(f"      Birth: {bd.get('name', '')} - {bd.get('place_name', '')}")
            
            if len(kundli_index) > 3:
                print(f"\n  ... and {len(kundli_index) - 3} more kundlis")
            
        except json.JSONDecodeError as e:
            print(f"❌ ERROR: Invalid JSON format: {e}")
            return False
        except Exception as e:
            print(f"❌ ERROR: {e}")
            return False
    
    # ========================================================================
    # SECTION 2: Extract Users from Index
    # ========================================================================
    print_section("2. UNIQUE USERS (from kundli_index.json)")
    
    users_from_index = {}
    for kundli_id, kundli_data in kundli_index.items():
        user_name = kundli_data.get('user_name', 'Unknown')
        if user_name not in users_from_index:
            users_from_index[user_name] = {
                'kundli_count': 0,
                'first_generated': kundli_data.get('generated_at', ''),
            }
        users_from_index[user_name]['kundli_count'] += 1
    
    print(f"✓ Total unique users: {len(users_from_index)}\n")
    
    if users_from_index:
        print("Users and their kundli counts:")
        for i, (user_name, data) in enumerate(sorted(users_from_index.items())[:10]):
            print(f"  [{i+1}] {user_name}: {data['kundli_count']} kundlis")
        
        if len(users_from_index) > 10:
            print(f"  ... and {len(users_from_index) - 10} more users")
    
    # ========================================================================
    # SECTION 3: User Directories
    # ========================================================================
    print_section("3. USER DIRECTORIES")
    
    user_dirs = [d for d in os.listdir(users_path) if os.path.isdir(os.path.join(users_path, d))]
    print(f"✓ Total user directories: {len(user_dirs)}\n")
    
    if user_dirs:
        print("Sample user directories:")
        for i, user_dir in enumerate(sorted(user_dirs)[:5]):
            user_path = os.path.join(users_path, user_dir)
            
            # Check for user_info.json
            user_info_file = os.path.join(user_path, 'user_info.json')
            has_info = "✓" if os.path.exists(user_info_file) else "✗"
            
            # Count kundlis
            kundli_dir = os.path.join(user_path, 'kundli')
            kundli_count = len(os.listdir(kundli_dir)) if os.path.exists(kundli_dir) else 0
            
            # Count analysis
            analysis_dir = os.path.join(user_path, 'analysis')
            analysis_count = len([f for f in os.listdir(analysis_dir) if f.endswith('_AI_Analysis.txt')]) if os.path.exists(analysis_dir) else 0
            
            print(f"\n  [{i+1}] {user_dir}")
            print(f"      user_info.json: {has_info}")
            print(f"      kundlis: {kundli_count}")
            print(f"      analysis: {analysis_count}")
        
        if len(user_dirs) > 5:
            print(f"\n  ... and {len(user_dirs) - 5} more user directories")
    
    # ========================================================================
    # SECTION 4: Analytics Summary
    # ========================================================================
    print_section("4. ANALYTICS SUMMARY (What Admin Panel Will Show)")
    
    total_users = len(users_from_index)
    total_kundlis = len(kundli_index)
    
    # Count analysis files
    total_analysis = 0
    for user_dir in user_dirs:
        analysis_dir = os.path.join(users_path, user_dir, 'analysis')
        if os.path.exists(analysis_dir):
            total_analysis += len([f for f in os.listdir(analysis_dir) if f.endswith('_AI_Analysis.txt')])
    
    print(f"Total Users:           {total_users}")
    print(f"Total Kundlis:         {total_kundlis}")
    print(f"Kundlis with Analysis: {total_analysis}")
    print(f"Kundlis without Analysis: {total_kundlis - total_analysis}")
    
    if total_users > 0:
        print(f"Avg Kundlis per User:  {total_kundlis / total_users:.2f}")
    
    # ========================================================================
    # SECTION 5: Data Status
    # ========================================================================
    print_section("5. DATA STATUS")
    
    if total_kundlis == 0:
        print("⚠ WARNING: No kundlis found!")
        print("  The admin panel will show zeros until kundlis are generated.")
        print("  Generate a kundli in the main app to populate the data.")
    elif total_kundlis < 10:
        print(f"⚠ WARNING: Only {total_kundlis} kundlis found")
        print("  Consider generating more kundlis for better demo data")
    else:
        print(f"✓ Good: {total_kundlis} kundlis found")
        print("  Admin panel should display real data")
    
    print(f"\n✓ Data validation complete!")
    print(f"  Ready to start admin panel\n")
    
    return True

if __name__ == '__main__':
    try:
        success = validate_data()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
