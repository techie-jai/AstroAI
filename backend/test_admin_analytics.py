"""
Test script to verify AdminAnalyticsService reads real data correctly
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from admin_analytics_service import AdminAnalyticsService

def test_analytics():
    """Test the analytics service with real data"""
    
    # Initialize with local users directory
    analytics = AdminAnalyticsService('users')
    
    print("=" * 60)
    print("ADMIN ANALYTICS TEST")
    print("=" * 60)
    
    # Test 1: Get all users
    print("\n1. USERS FROM FILESYSTEM:")
    users = analytics.get_all_users_from_filesystem()
    print(f"   Total users found: {len(users)}")
    if users:
        print(f"   First 3 users:")
        for user in users[:3]:
            print(f"     - {user['displayName']}: {user['kundliCount']} kundlis, {user['analysisCount']} analysis")
    
    # Test 2: Get all kundlis
    print("\n2. KUNDLIS FROM FILESYSTEM:")
    kundlis = analytics.get_all_kundlis_from_filesystem()
    print(f"   Total kundlis found: {len(kundlis)}")
    if kundlis:
        print(f"   First 3 kundlis:")
        for kundli in kundlis[:3]:
            print(f"     - {kundli['userName']}: {kundli['id']}")
    
    # Test 3: Compute analytics overview
    print("\n3. ANALYTICS OVERVIEW:")
    overview = analytics.compute_analytics_overview()
    print(f"   Total Users: {overview['totalUsers']}")
    print(f"   Active Users (30d): {overview['activeUsers']}")
    print(f"   Total Kundlis: {overview['totalKundlis']}")
    print(f"   Tokens Used: {overview['totalTokensUsed']}")
    print(f"   With Analysis: {overview['kundlisWithAnalysis']}")
    print(f"   Without Analysis: {overview['kundlisWithoutAnalysis']}")
    print(f"   Avg Kundlis/User: {overview['averageKundlisPerUser']}")
    
    # Test 4: User growth
    print("\n4. USER GROWTH (Last 30 days):")
    growth = analytics.compute_user_growth_analytics(30)
    print(f"   Data points: {len(growth)}")
    if growth:
        print(f"   Latest 3 days:")
        for item in growth[-3:]:
            print(f"     - {item['date']}: {item['newUsers']} new, {item['totalUsers']} total")
    
    # Test 5: Usage analytics
    print("\n5. USAGE ANALYTICS:")
    usage = analytics.compute_usage_analytics()
    print(f"   Kundli Generation: {usage['usage']['kundliGeneration']}")
    print(f"   Analysis: {usage['usage']['analysis']}")
    print(f"   Chat: {usage['usage']['chat']}")
    print(f"   PDF Download: {usage['usage']['pdfDownload']}")
    
    # Test 6: System health
    print("\n6. SYSTEM HEALTH:")
    health = analytics.compute_system_health()
    print(f"   Status: {health['status']}")
    print(f"   Storage Status: {health['metrics']['localStorageStatus']}")
    print(f"   Total Users: {health['metrics']['totalUsers']}")
    print(f"   Total Kundlis: {health['metrics']['totalKundlis']}")
    
    print("\n" + "=" * 60)
    print("✅ TEST COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    test_analytics()
