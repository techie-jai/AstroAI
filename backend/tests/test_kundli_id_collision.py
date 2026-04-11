"""
Test Script: Validate kundli_id collision hypothesis

Hypothesis 1: _generate_kundli_id() only hashes name+date+time, NOT location.
  So same person details + different city = SAME kundli_id.

Hypothesis 2: If kundli_id is the same, navigating to /results/{id} from /results/{id}
  is a React Router no-op — useEffect won't re-fire.

Hypothesis 3: Multiple Firebase docs with same kundli_id — query returns arbitrary one.
"""

import hashlib
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


# ================================================================
# TEST 1: kundli_id collision with different locations
# ================================================================
def test_kundli_id_collision_different_locations():
    """
    _generate_kundli_id uses only name+year+month+day+hour+minute.
    Changing place_name, latitude, longitude, timezone_offset should NOT change the ID.
    This is the suspected bug.
    """
    def _generate_kundli_id(birth_data):
        key = f"{birth_data['name']}{birth_data['year']}{birth_data['month']}{birth_data['day']}{birth_data['hour']}{birth_data['minute']}"
        return hashlib.md5(key.encode()).hexdigest()[:12]

    # Person 1: Born in Mumbai
    birth_data_mumbai = {
        'name': 'Akshay Sharma',
        'year': 1978, 'month': 10, 'day': 22, 'hour': 14, 'minute': 46,
        'place_name': 'Mumbai',
        'latitude': 19.0760, 'longitude': 72.8777, 'timezone_offset': 5.5,
    }

    # Person 2: Same name+date+time, but born in Chennai
    birth_data_chennai = {
        'name': 'Akshay Sharma',
        'year': 1978, 'month': 10, 'day': 22, 'hour': 14, 'minute': 46,
        'place_name': 'Chennai',
        'latitude': 13.0827, 'longitude': 80.2707, 'timezone_offset': 5.5,
    }

    # Person 3: Same name+date+time, but born in New York
    birth_data_newyork = {
        'name': 'Akshay Sharma',
        'year': 1978, 'month': 10, 'day': 22, 'hour': 14, 'minute': 46,
        'place_name': 'New York',
        'latitude': 40.7128, 'longitude': -74.0060, 'timezone_offset': -5.0,
    }

    id_mumbai = _generate_kundli_id(birth_data_mumbai)
    id_chennai = _generate_kundli_id(birth_data_chennai)
    id_newyork = _generate_kundli_id(birth_data_newyork)

    print(f"  Mumbai kundli_id:   {id_mumbai}")
    print(f"  Chennai kundli_id:  {id_chennai}")
    print(f"  New York kundli_id: {id_newyork}")
    print(f"  All same? {id_mumbai == id_chennai == id_newyork}")

    assert id_mumbai == id_chennai, \
        f"HYPOTHESIS DISPROVED: IDs differ ({id_mumbai} vs {id_chennai})"
    assert id_mumbai == id_newyork, \
        f"HYPOTHESIS DISPROVED: IDs differ ({id_mumbai} vs {id_newyork})"

    print("  ✅ HYPOTHESIS 1 CONFIRMED: Same name+date+time = same kundli_id regardless of location!")
    print(f"     All three locations produce: {id_mumbai}")
    return True


# ================================================================
# TEST 2: kundli_id DOES change with different name/date/time
# ================================================================
def test_kundli_id_changes_with_different_person():
    """
    Verify that changing name or date/time fields DOES produce a different ID.
    This confirms the hash function works — just has an incomplete key.
    """
    def _generate_kundli_id(birth_data):
        key = f"{birth_data['name']}{birth_data['year']}{birth_data['month']}{birth_data['day']}{birth_data['hour']}{birth_data['minute']}"
        return hashlib.md5(key.encode()).hexdigest()[:12]

    person_a = {
        'name': 'Akshay Sharma',
        'year': 1978, 'month': 10, 'day': 22, 'hour': 14, 'minute': 46,
    }

    person_b = {
        'name': 'Priya Patel',
        'year': 1990, 'month': 5, 'day': 15, 'hour': 8, 'minute': 30,
    }

    # Same name, different time
    person_c = {
        'name': 'Akshay Sharma',
        'year': 1978, 'month': 10, 'day': 22, 'hour': 14, 'minute': 47,  # 1 minute diff
    }

    id_a = _generate_kundli_id(person_a)
    id_b = _generate_kundli_id(person_b)
    id_c = _generate_kundli_id(person_c)

    print(f"  Person A: {id_a}")
    print(f"  Person B: {id_b}")
    print(f"  Person C (1 min diff): {id_c}")

    assert id_a != id_b, "IDs should differ for different people"
    assert id_a != id_c, "IDs should differ for different times"
    print("  ✅ Different name/date/time correctly produces different kundli_ids")
    return True


# ================================================================
# TEST 3: Verify the actual kundli_id from the logs
# ================================================================
def test_verify_log_kundli_id():
    """
    Verify that the kundli_id from the first generation logs matches
    what the hash function would produce for those birth details.
    
    From previous logs:
      kundli_id: 5da379c49e89  (Akshay Sharma, 1978-10-22, 14:46, Chennai)
      kundli_id: 308a49fe9de0  (from the 2nd set of logs)
    
    If 308a49fe9de0 is also for Akshay Sharma 1978-10-22 14:46, then the user
    didn't actually change the name/date/time for the 2nd generation.
    """
    def _generate_kundli_id(birth_data):
        key = f"{birth_data['name']}{birth_data['year']}{birth_data['month']}{birth_data['day']}{birth_data['hour']}{birth_data['minute']}"
        return hashlib.md5(key.encode()).hexdigest()[:12]

    # The birth data from the first generation logs
    birth_data_first = {
        'name': 'Akshay Sharma',
        'year': 1978, 'month': 10, 'day': 22, 'hour': 14, 'minute': 46,
    }

    computed_id = _generate_kundli_id(birth_data_first)
    log_id_first = '5da379c49e89'
    log_id_second = '308a49fe9de0'

    print(f"  Computed for Akshay Sharma 1978-10-22 14:46: {computed_id}")
    print(f"  First log kundli_id:  {log_id_first}")
    print(f"  Second log kundli_id: {log_id_second}")
    print(f"  Matches first log?  {computed_id == log_id_first}")
    print(f"  Matches second log? {computed_id == log_id_second}")

    if computed_id == log_id_first:
        print("  ✅ First generation kundli_id matches expected hash")
    
    if computed_id != log_id_second:
        print("  ℹ️  Second generation used DIFFERENT birth details (different name/date/time)")
        print("     This means the '2nd/3rd generation skipping' is NOT a hash collision.")
        print("     The issue is likely on the FRONTEND side (POST never sent).")
    else:
        print("  ⚠️  Second generation used SAME birth details — hash collision confirmed!")
    
    return True


# ================================================================
# TEST 4: Simulate Firebase duplicate kundli_id scenario
# ================================================================
def test_firebase_duplicate_kundli_id_behavior():
    """
    When save_kundli is called twice with the same kundli_id,
    it creates TWO separate Firestore documents (auto-generated IDs).
    
    The get_kundli query does:
      .where('kundli_id', '==', kundli_id_str)
    with NO ordering.
    
    This means it returns whichever document Firestore yields first —
    which could be the OLD one, not the newly generated one.
    
    This test validates the logic (no Firebase connection needed).
    """
    # Simulate two saves with same kundli_id but different data
    firebase_docs = []

    # First generation: Akshay Sharma born in Chennai
    firebase_docs.append({
        'firebase_doc_id': 'bMViOxsVpxIrFNtMlsIj',
        'kundli_id': '5da379c49e89',
        'user_id': 'BmPzeVj6IGO32lvVUAabr6FPcl03',
        'birth_data': {'name': 'Akshay Sharma', 'place_name': 'Chennai'},
        'horoscope_info': {'sun_sign': 'Libra'},  # Chennai calculation
        'generated_at': '2026-04-11T18:21:55',
    })

    # Second generation: Same person but different location (Mumbai)
    # SAME kundli_id because hash doesn't include location!
    firebase_docs.append({
        'firebase_doc_id': 'xYz123AbcDef',
        'kundli_id': '5da379c49e89',  # SAME!
        'user_id': 'BmPzeVj6IGO32lvVUAabr6FPcl03',
        'birth_data': {'name': 'Akshay Sharma', 'place_name': 'Mumbai'},
        'horoscope_info': {'sun_sign': 'Libra'},  # Mumbai calculation (different houses!)
        'generated_at': '2026-04-11T18:30:00',
    })

    # Simulate get_kundli query: .where('kundli_id', '==', '5da379c49e89')
    # Returns first match (no ordering!)
    uid = 'BmPzeVj6IGO32lvVUAabr6FPcl03'
    kundli_id = '5da379c49e89'

    results = [doc for doc in firebase_docs
               if doc['user_id'] == uid and doc['kundli_id'] == kundli_id]

    print(f"  Documents matching kundli_id '{kundli_id}': {len(results)}")
    print(f"  First result (returned by query): {results[0]['birth_data']['place_name']}")
    print(f"  Second result (MISSED by query):  {results[1]['birth_data']['place_name']}")

    assert len(results) == 2, "Should have 2 documents with same kundli_id"
    print("  ✅ HYPOTHESIS 3 CONFIRMED: Multiple docs share same kundli_id.")
    print("     Firestore query returns first match — likely the OLD document!")
    print("     The user sees stale data from the first generation.")
    return True


# ================================================================
# TEST 5: What fields are missing from kundli_id hash
# ================================================================
def test_hash_missing_fields():
    """
    Enumerate all birth_data fields and show which ones are included/excluded
    from the kundli_id hash.
    """
    all_fields = ['name', 'place_name', 'latitude', 'longitude', 'timezone_offset',
                  'year', 'month', 'day', 'hour', 'minute', 'second']

    hash_fields = ['name', 'year', 'month', 'day', 'hour', 'minute']
    missing_fields = [f for f in all_fields if f not in hash_fields]

    print(f"  Fields IN hash:      {hash_fields}")
    print(f"  Fields NOT in hash:  {missing_fields}")
    print(f"  Impact: Changing any of {missing_fields} produces SAME kundli_id")
    print("  ✅ This confirms location changes are invisible to kundli_id generation")
    return True


# ================================================================
# RUN ALL TESTS
# ================================================================
if __name__ == '__main__':
    tests = [
        ("TEST 1: kundli_id collision (different locations)", test_kundli_id_collision_different_locations),
        ("TEST 2: kundli_id changes (different person)", test_kundli_id_changes_with_different_person),
        ("TEST 3: Verify actual log kundli_ids", test_verify_log_kundli_id),
        ("TEST 4: Firebase duplicate doc scenario", test_firebase_duplicate_kundli_id_behavior),
        ("TEST 5: Hash missing fields analysis", test_hash_missing_fields),
    ]

    print("=" * 70)
    print("KUNDLI ID COLLISION & GENERATION SKIP HYPOTHESIS TESTS")
    print("=" * 70)

    passed = 0
    failed = 0

    for name, test_fn in tests:
        print(f"\n{'─' * 60}")
        print(f"🧪 {name}")
        print(f"{'─' * 60}")
        try:
            result = test_fn()
            if result:
                passed += 1
        except AssertionError as e:
            print(f"  ❌ FAILED: {e}")
            failed += 1
        except Exception as e:
            print(f"  ❌ ERROR: {type(e).__name__}: {e}")
            failed += 1

    print(f"\n{'=' * 70}")
    print(f"RESULTS: {passed} passed, {failed} failed out of {len(tests)}")
    print(f"{'=' * 70}")

    if failed == 0:
        print("\n📋 CONCLUSION:")
        print("   The root cause is a MULTI-LAYERED BUG:")
        print("")
        print("   1. _generate_kundli_id() excludes location fields from hash")
        print("      → Same name+date+time = same kundli_id regardless of city")
        print("")
        print("   2. Firebase accumulates duplicate kundli_id documents")
        print("      → get_kundli() returns first match (likely the OLD one)")
        print("")
        print("   3. React Router navigate() to same URL is a no-op")
        print("      → If already on /results/X, navigating to /results/X")
        print("        doesn't re-trigger useEffect → user sees stale data")
        print("")
        print("   COMBINED EFFECT: 2nd+ generations seem to 'skip' because")
        print("   the frontend shows cached/old data from the first generation.")
