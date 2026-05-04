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
    # SECTION 1: User Directories (New Structure)
    # ========================================================================
    print_section("1. USER DIRECTORIES (New Per-User Structure)")
    
    user_dirs = [d for d in os.listdir(users_path) if os.path.isdir(os.path.join(users_path, d)) and d.startswith('user_')]
    print(f"✓ Total user directories: {len(user_dirs)}\n")
    
    # ========================================================================
    # SECTION 2: Aggregate Data from All User Folders
    # ========================================================================
    print_section("2. AGGREGATED DATA (from per-user kundli_index.json files)")
    
    all_kundlis = {}
    total_astrology = 0
    total_palmistry = 0
    total_numerology = 0
    total_chats = 0
    total_analysis = 0
    
    for user_dir in sorted(user_dirs):
        user_path = os.path.join(users_path, user_dir)
        
        # Read per-user kundli_index.json
        user_index_file = os.path.join(user_path, 'kundli_index.json')
        if os.path.exists(user_index_file):
            try:
                with open(user_index_file, 'r') as f:
                    user_kundlis = json.load(f)
                    all_kundlis.update(user_kundlis)
            except Exception as e:
                print(f"⚠ Warning: Could not read {user_index_file}: {e}")
        
        # Count Astrology kundlis
        astrology_dir = os.path.join(user_path, 'Astrology')
        if os.path.exists(astrology_dir):
            astrology_count = len([d for d in os.listdir(astrology_dir) if os.path.isdir(os.path.join(astrology_dir, d))])
            total_astrology += astrology_count
            
            # Count analysis files in Astrology
            for kundli_folder in os.listdir(astrology_dir):
                kundli_path = os.path.join(astrology_dir, kundli_folder)
                if os.path.isdir(kundli_path):
                    if os.path.exists(os.path.join(kundli_path, 'analysis.pdf')):
                        total_analysis += 1
        
        # Count Palmistry
        palmistry_dir = os.path.join(user_path, 'Palmistry')
        if os.path.exists(palmistry_dir):
            palmistry_count = len([d for d in os.listdir(palmistry_dir) if os.path.isdir(os.path.join(palmistry_dir, d))])
            total_palmistry += palmistry_count
        
        # Count Numerology
        numerology_dir = os.path.join(user_path, 'Numerology')
        if os.path.exists(numerology_dir):
            numerology_count = len([d for d in os.listdir(numerology_dir) if os.path.isdir(os.path.join(numerology_dir, d))])
            total_numerology += numerology_count
        
        # Count Chats (in Chats/chat_history/{kundli_id}/)
        chat_history_dir = os.path.join(user_path, 'Chats', 'chat_history')
        if os.path.exists(chat_history_dir):
            # Count kundli folders with messages.json
            for kundli_folder in os.listdir(chat_history_dir):
                kundli_chat_path = os.path.join(chat_history_dir, kundli_folder)
                if os.path.isdir(kundli_chat_path):
                    if os.path.exists(os.path.join(kundli_chat_path, 'messages.json')):
                        total_chats += 1
    
    # Total registered users = number of user folders
    total_registered_users = len(user_dirs)
    
    print(f"✓ Total registered users: {total_registered_users}")
    print(f"✓ Total kundlis: {len(all_kundlis)}")
    print(f"✓ Total Astrology readings: {total_astrology}")
    print(f"✓ Total Palmistry readings: {total_palmistry}")
    print(f"✓ Total Numerology readings: {total_numerology}")
    print(f"✓ Total Chat sessions: {total_chats}")
    print(f"✓ Total Analysis PDFs: {total_analysis}\n")
    
    # ========================================================================
    # SECTION 3: Sample User Data
    # ========================================================================
    print_section("3. SAMPLE USER DIRECTORIES")
    
    if user_dirs:
        print("User directories and their data:")
        for i, user_dir in enumerate(sorted(user_dirs)[:5]):
            user_path = os.path.join(users_path, user_dir)
            
            # Count items in each category
            astrology_dir = os.path.join(user_path, 'Astrology')
            astrology_count = len([d for d in os.listdir(astrology_dir) if os.path.isdir(os.path.join(astrology_dir, d))]) if os.path.exists(astrology_dir) else 0
            
            palmistry_dir = os.path.join(user_path, 'Palmistry')
            palmistry_count = len([d for d in os.listdir(palmistry_dir) if os.path.isdir(os.path.join(palmistry_dir, d))]) if os.path.exists(palmistry_dir) else 0
            
            numerology_dir = os.path.join(user_path, 'Numerology')
            numerology_count = len([d for d in os.listdir(numerology_dir) if os.path.isdir(os.path.join(numerology_dir, d))]) if os.path.exists(numerology_dir) else 0
            
            # Count chats in Chats/chat_history/{kundli_id}/
            chats_count = 0
            chat_history_dir = os.path.join(user_path, 'Chats', 'chat_history')
            if os.path.exists(chat_history_dir):
                for kundli_folder in os.listdir(chat_history_dir):
                    kundli_chat_path = os.path.join(chat_history_dir, kundli_folder)
                    if os.path.isdir(kundli_chat_path):
                        if os.path.exists(os.path.join(kundli_chat_path, 'messages.json')):
                            chats_count += 1
            
            print(f"\n  [{i+1}] {user_dir}")
            print(f"      Astrology: {astrology_count} kundlis")
            print(f"      Palmistry: {palmistry_count} readings")
            print(f"      Numerology: {numerology_count} readings")
            print(f"      Chats: {chats_count} sessions")
        
        if len(user_dirs) > 5:
            print(f"\n  ... and {len(user_dirs) - 5} more user directories")
    
    # ========================================================================
    # SECTION 4: Sample Kundlis
    # ========================================================================
    print_section("4. SAMPLE KUNDLIS (from per-user indexes)")
    
    if all_kundlis:
        print(f"Sample kundlis (showing first 3 of {len(all_kundlis)}):")
        for i, (kundli_id, kundli_data) in enumerate(list(all_kundlis.items())[:3]):
            print(f"\n  [{i+1}] {kundli_id}")
            print(f"      User: {kundli_data.get('user_name', 'Unknown')}")
            print(f"      Generated: {kundli_data.get('generated_at', 'Unknown')}")
            if 'birth_data' in kundli_data:
                bd = kundli_data['birth_data']
                print(f"      Birth: {bd.get('name', '')} - {bd.get('place_name', '')}")
        
        if len(all_kundlis) > 3:
            print(f"\n  ... and {len(all_kundlis) - 3} more kundlis")
    
    # ========================================================================
    # SECTION 5: Analytics Summary
    # ========================================================================
    print_section("5. ANALYTICS SUMMARY (What Admin Panel Will Show)")
    
    print(f"Total Registered Users:     {total_registered_users}")
    print(f"Total Kundlis:              {len(all_kundlis)}")
    print(f"Total Astrology Readings:   {total_astrology}")
    print(f"Total Palmistry Readings:   {total_palmistry}")
    print(f"Total Numerology Readings:  {total_numerology}")
    print(f"Total Chat Sessions:        {total_chats}")
    print(f"Kundlis with Analysis:      {total_analysis}")
    print(f"Kundlis without Analysis:   {len(all_kundlis) - total_analysis}")
    
    if total_registered_users > 0:
        print(f"Avg Kundlis per User:       {len(all_kundlis) / total_registered_users:.2f}")
    
    # ========================================================================
    # SECTION 6: Data Status
    # ========================================================================
    print_section("6. DATA STATUS")
    
    if len(all_kundlis) == 0:
        print("⚠ WARNING: No kundlis found!")
        print("  The admin panel will show zeros until kundlis are generated.")
        print("  Generate a kundli in the main app to populate the data.")
    elif len(all_kundlis) < 10:
        print(f"⚠ WARNING: Only {len(all_kundlis)} kundlis found")
        print("  Consider generating more kundlis for better demo data")
    else:
        print(f"✓ Good: {len(all_kundlis)} kundlis found")
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
