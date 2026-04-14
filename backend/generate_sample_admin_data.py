"""
Generate sample admin data for testing the admin dashboard
Creates realistic user and kundli data in the local filesystem
"""

import os
import json
from datetime import datetime, timedelta
import random
import uuid

def generate_sample_data():
    """Generate sample user and kundli data"""
    
    users_base_path = '/app/users'
    os.makedirs(users_base_path, exist_ok=True)
    
    # Sample user data
    sample_users = [
        {'name': 'Shreya Rao', 'email': 'shreya@example.com'},
        {'name': 'Pooja Bhat', 'email': 'pooja@example.com'},
        {'name': 'Arjun Kumar', 'email': 'arjun@example.com'},
        {'name': 'Priya Singh', 'email': 'priya@example.com'},
        {'name': 'Vikram Patel', 'email': 'vikram@example.com'},
    ]
    
    kundli_types = ['D1 (Birth)', 'D9 (Navamsa)', 'D10 (Dasamsa)', 'D27 (Naksatra)']
    
    all_kundlis = {}
    
    # Create user directories and kundlis
    for user_idx, user in enumerate(sample_users):
        user_uid = f"user_{user_idx + 1}"
        user_path = os.path.join(users_base_path, user_uid)
        os.makedirs(user_path, exist_ok=True)
        
        # Create user metadata
        metadata = {
            'uid': user_uid,
            'displayName': user['name'],
            'email': user['email'],
            'createdAt': (datetime.utcnow() - timedelta(days=random.randint(1, 60))).isoformat(),
            'tokenUsage': {
                'total': random.randint(100, 5000),
                'monthly': random.randint(50, 2000)
            }
        }
        
        metadata_file = os.path.join(user_path, 'metadata.json')
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # Create kundli index for this user
        user_kundlis = []
        num_kundlis = random.randint(2, 8)
        
        for k_idx in range(num_kundlis):
            kundli_id = str(uuid.uuid4())
            kundli_type = random.choice(kundli_types)
            
            kundli_entry = {
                'id': kundli_id,
                'uid': user_uid,
                'type': kundli_type,
                'name': f"{user['name']} - {kundli_type}",
                'generatedAt': (datetime.utcnow() - timedelta(days=random.randint(0, 30))).isoformat(),
                'hasAnalysis': random.choice([True, False, False]),  # 33% have analysis
                'pdfGenerated': random.choice([True, False]),
                'chatHistory': [{'role': 'user', 'content': 'Tell me about my kundli'}] if random.choice([True, False]) else []
            }
            
            user_kundlis.append(kundli_entry)
            all_kundlis[kundli_id] = kundli_entry
        
        # Save kundli index
        kundli_index_file = os.path.join(user_path, 'kundli_index.json')
        with open(kundli_index_file, 'w') as f:
            json.dump({'kundlis': user_kundlis}, f, indent=2)
        
        # Create analysis directory
        analysis_dir = os.path.join(user_path, 'analysis')
        os.makedirs(analysis_dir, exist_ok=True)
        
        # Create some analysis files
        for kundli in user_kundlis:
            if kundli['hasAnalysis']:
                analysis_file = os.path.join(analysis_dir, f"{user['name']}_AI_Analysis.txt")
                with open(analysis_file, 'w') as f:
                    f.write(f"""
AI Analysis for {user['name']}
Generated: {datetime.utcnow().isoformat()}

Personality Traits:
- You are a natural leader with strong communication skills
- Your intuition is your greatest strength
- You have a creative mind and innovative thinking

Career Prospects:
- Excellent opportunities in management and leadership roles
- Your analytical skills will help you succeed in technical fields
- Financial growth is expected in the coming years

Relationships:
- You value deep, meaningful connections
- Your loyalty is unmatched
- You are a supportive partner and friend

Health:
- Maintain regular exercise for optimal health
- Focus on mental well-being and meditation
- Your energy levels are generally high

Lucky Elements:
- Lucky Number: {random.randint(1, 9)}
- Lucky Color: {random.choice(['Blue', 'Green', 'Yellow', 'Red'])}
- Lucky Day: {random.choice(['Monday', 'Wednesday', 'Friday'])}
""")
    
    # Create global kundli index
    global_index_file = os.path.join(users_base_path, 'kundli_index.json')
    with open(global_index_file, 'w') as f:
        json.dump(all_kundlis, f, indent=2)
    
    print(f"✅ Generated sample data for {len(sample_users)} users")
    print(f"✅ Created {len(all_kundlis)} kundlis")
    print(f"✅ Data saved to: {users_base_path}")
    
    return {
        'users_count': len(sample_users),
        'kundlis_count': len(all_kundlis),
        'users_path': users_base_path
    }

if __name__ == '__main__':
    result = generate_sample_data()
    print(f"\nSummary:")
    print(f"  Total Users: {result['users_count']}")
    print(f"  Total Kundlis: {result['kundlis_count']}")
    print(f"  Data Location: {result['users_path']}")
