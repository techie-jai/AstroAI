# Testing Guide - User Folder Structure Redesign

**Phase 7: Testing & Validation**

---

## Testing Overview

This guide provides comprehensive testing procedures to validate the new user folder structure implementation.

## Pre-Testing Checklist

- [ ] All code changes have been deployed
- [ ] Backend services are running
- [ ] Database is accessible
- [ ] Firebase authentication is configured
- [ ] Backup of users/ directory exists

---

## Unit Tests

### FileManager Tests

#### Test 1: User Folder Creation
**Objective:** Verify new folder structure is created correctly

```python
# Test code
from backend.file_manager import FileManager

fm = FileManager(base_dir="test_users")
user_folder, unique_id = fm.create_user_folder(
    user_name="Test User",
    uid="test_uid_123",
    email="test@example.com"
)

# Verify folder structure
assert os.path.exists(os.path.join(user_folder, "Astrology"))
assert os.path.exists(os.path.join(user_folder, "Palmistry"))
assert os.path.exists(os.path.join(user_folder, "Numerology"))
assert os.path.exists(os.path.join(user_folder, "Chats"))
assert "test_uid_123" in user_folder
assert "test@example.com" in user_folder
```

**Expected Result:** ✅ All 4 subfolders created with correct naming

---

#### Test 2: Kundli Subfolder Creation
**Objective:** Verify per-kundli subfolders are created correctly

```python
fm = FileManager(base_dir="test_users")
user_folder, _ = fm.create_user_folder("Test User", uid="uid123", email="test@example.com")

kundli_folder = fm.create_kundli_subfolder(user_folder, "Test-Kundli-1-abc123")

# Verify folder
assert os.path.exists(kundli_folder)
assert "Astrology" in kundli_folder
assert "Test-Kundli-1-abc123" in kundli_folder
```

**Expected Result:** ✅ Kundli subfolder created in Astrology/

---

#### Test 3: Save Comprehensive Kundli (New Structure)
**Objective:** Verify kundli saved to new Astrology structure

```python
fm = FileManager(base_dir="test_users")
user_folder, _ = fm.create_user_folder("Test User", uid="uid123", email="test@example.com")

kundli_data = {"test": "data"}
path = fm.save_comprehensive_kundli(
    user_folder, 
    "Test User", 
    kundli_data, 
    kundli_id="Test-Kundli-1-abc123"
)

# Verify path and file
assert "Astrology" in path
assert "Test-Kundli-1-abc123" in path
assert os.path.exists(path)
assert "comprehensive_kundli.json" in path
```

**Expected Result:** ✅ Kundli saved to `Astrology/{kundli_id}/`

---

#### Test 4: Save Analysis Files (New Structure)
**Objective:** Verify analysis files saved to kundli subfolder

```python
fm = FileManager(base_dir="test_users")
user_folder, _ = fm.create_user_folder("Test User", uid="uid123", email="test@example.com")

# Save analysis text
text_path = fm.save_analysis_text(
    user_folder,
    "Test User",
    "Analysis text content",
    kundli_id="Test-Kundli-1-abc123"
)

# Save analysis PDF
pdf_path = fm.save_analysis_pdf(
    user_folder,
    "Test User",
    b"PDF content",
    kundli_id="Test-Kundli-1-abc123"
)

# Verify paths
assert "Astrology" in text_path
assert "analysis.txt" in text_path
assert "Astrology" in pdf_path
assert "analysis.pdf" in pdf_path
assert os.path.exists(text_path)
assert os.path.exists(pdf_path)
```

**Expected Result:** ✅ Analysis files saved to `Astrology/{kundli_id}/`

---

#### Test 5: Has Analysis (New Structure)
**Objective:** Verify analysis detection works for new structure

```python
fm = FileManager(base_dir="test_users")
user_folder, _ = fm.create_user_folder("Test User", uid="uid123", email="test@example.com")

# Initially no analysis
assert not fm.has_analysis(user_folder, "Test User", kundli_id="Test-Kundli-1-abc123")

# Save analysis
fm.save_analysis_text(
    user_folder,
    "Test User",
    "Analysis content",
    kundli_id="Test-Kundli-1-abc123"
)

# Now should have analysis
assert fm.has_analysis(user_folder, "Test User", kundli_id="Test-Kundli-1-abc123")
```

**Expected Result:** ✅ Analysis detection works correctly

---

#### Test 6: Backward Compatibility
**Objective:** Verify old structure still works

```python
fm = FileManager(base_dir="test_users")
user_folder, _ = fm.create_user_folder("Test User")

# Save using old structure (no kundli_id)
path = fm.save_comprehensive_kundli(user_folder, "Test User", {"test": "data"})

# Verify old path
assert "kundli" in path
assert "Astrology" not in path
assert os.path.exists(path)
```

**Expected Result:** ✅ Old structure still works when kundli_id not provided

---

### ChatHistoryManager Tests

#### Test 7: Chat Directory Path
**Objective:** Verify chat directory uses new structure

```python
from backend.chat_history_manager import ChatHistoryManager

chm = ChatHistoryManager(users_path="test_users")
chat_dir = chm._get_chat_dir("user_folder_123", "kundli_id_456")

# Verify path structure
assert "Chats" in chat_dir
assert "chat_history" in chat_dir
assert "kundli_id_456" in chat_dir
assert "chat_folder_123" not in chat_dir  # Old structure
```

**Expected Result:** ✅ Chat directory uses new `Chats/chat_history/` structure

---

#### Test 8: Chat Message Storage
**Objective:** Verify chat messages saved to new structure

```python
chm = ChatHistoryManager(users_path="test_users")

# Initialize conversation
chm.initialize_conversation("user_folder_123", "kundli_id_456", "user_id_789")

# Add message
message = {
    "role": "user",
    "content": "Test message",
    "timestamp": datetime.now().isoformat()
}
chm.add_message("user_folder_123", "kundli_id_456", message)

# Verify message stored
messages = chm.get_messages("user_folder_123", "kundli_id_456")
assert len(messages) == 1
assert messages[0]["content"] == "Test message"

# Verify file location
chat_dir = chm._get_chat_dir("user_folder_123", "kundli_id_456")
assert os.path.exists(os.path.join(chat_dir, "messages.json"))
```

**Expected Result:** ✅ Chat messages stored in new structure

---

## Integration Tests

### Test 9: Kundli Generation Endpoint
**Objective:** Verify `/api/kundli/generate` uses new structure

**Setup:**
1. Start backend server
2. Authenticate user
3. Prepare birth data

**Test Steps:**
```bash
curl -X POST http://localhost:8000/api/kundli/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "birth_data": {
      "name": "Test Person",
      "date": "1990-01-15",
      "time": "14:30",
      "place": "New York",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'
```

**Verification:**
1. Response contains kundli_id
2. Check file system:
   ```bash
   ls users/{timestamp}_{uid}_{email}/Astrology/{kundli_id}/
   # Should show: comprehensive_kundli.json
   ```
3. Verify file path in response contains "Astrology"
4. Verify user_info.json exists in user folder

**Expected Result:** ✅ Kundli saved to new `Astrology/{kundli_id}/` structure

---

### Test 10: Kundli Retrieval Endpoint
**Objective:** Verify `/api/kundli/{kundli_id}` reads from new structure

**Test Steps:**
```bash
curl -X GET http://localhost:8000/api/kundli/{kundli_id} \
  -H "Authorization: Bearer {token}"
```

**Verification:**
1. Response contains complete kundli data
2. Data matches what was generated
3. No errors in logs
4. Response time < 500ms

**Expected Result:** ✅ Kundli retrieved successfully from new structure

---

### Test 11: Analysis Generation
**Objective:** Verify analysis saved to new structure

**Test Steps:**
1. Generate kundli (Test 9)
2. Call analysis endpoint:
   ```bash
   curl -X POST http://localhost:8000/api/analysis/{kundli_id} \
     -H "Authorization: Bearer {token}"
   ```

**Verification:**
1. Analysis generated successfully
2. Check file system:
   ```bash
   ls users/{timestamp}_{uid}_{email}/Astrology/{kundli_id}/
   # Should show: analysis.txt, analysis.pdf
   ```
3. Files are readable and valid

**Expected Result:** ✅ Analysis saved to `Astrology/{kundli_id}/`

---

### Test 12: Chat Functionality
**Objective:** Verify chat works with new structure

**Test Steps:**
1. Generate kundli (Test 9)
2. Send chat message:
   ```bash
   curl -X POST http://localhost:8000/api/chat/save-message \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{
       "user_folder": "{user_folder}",
       "kundli_id": "{kundli_id}",
       "message": {"role": "user", "content": "Test message"}
     }'
   ```

**Verification:**
1. Message saved successfully
2. Check file system:
   ```bash
   ls users/{timestamp}_{uid}_{email}/Chats/chat_history/{kundli_id}/
   # Should show: messages.json, metadata.json
   ```
3. Retrieve chat history:
   ```bash
   curl -X GET http://localhost:8000/api/chat/history/{kundli_id} \
     -H "Authorization: Bearer {token}"
   ```
4. Message appears in history

**Expected Result:** ✅ Chat works with new `Chats/chat_history/` structure

---

### Test 13: Admin Analytics
**Objective:** Verify admin panel shows correct data

**Test Steps:**
1. Generate multiple kundlis (3-5)
2. Generate analysis for some
3. Access admin dashboard
4. Check metrics

**Verification:**
1. Total users count correct
2. Total kundlis count correct
3. Kundlis with analysis count correct
4. Recent activity shows new kundlis
5. No errors in logs

**Expected Result:** ✅ Admin analytics work with new structure

---

## Migration Tests

### Test 14: Migration Script - Dry Run
**Objective:** Test migration without making changes

**Test Steps:**
```bash
cd backend
python migration_script.py --dry-run
```

**Verification:**
1. Script runs without errors
2. Shows what would be migrated
3. No changes made to file system
4. Log file created

**Expected Result:** ✅ Dry run completes successfully

---

### Test 15: Migration Script - Full Migration
**Objective:** Migrate existing data to new structure

**Prerequisites:**
- Have some existing kundlis in old structure
- Backup created automatically

**Test Steps:**
```bash
cd backend
python migration_script.py
```

**Verification:**
1. Backup created: `users_backup_{timestamp}/`
2. New folder structure created
3. Kundli files moved to `Astrology/{kundli_id}/`
4. Analysis files moved to kundli folders
5. Chat files moved to `Chats/chat_history/`
6. Migration log created
7. No errors in log

**Check File Structure:**
```bash
# Old structure should be gone
ls users/{user_folder}/kundli/  # Should not exist
ls users/{user_folder}/analysis/  # Should not exist
ls users/{user_folder}/chat/  # Should not exist

# New structure should exist
ls users/{user_folder}/Astrology/
ls users/{user_folder}/Palmistry/
ls users/{user_folder}/Numerology/
ls users/{user_folder}/Chats/
```

**Expected Result:** ✅ Migration completes successfully

---

### Test 16: Migration Script - Rollback
**Objective:** Test rollback functionality

**Test Steps:**
```bash
cd backend
python migration_script.py --rollback
```

**Verification:**
1. Rollback completes successfully
2. Old structure restored
3. New structure removed
4. Files match backup

**Expected Result:** ✅ Rollback restores original state

---

## Backward Compatibility Tests

### Test 17: Old Kundli Retrieval
**Objective:** Verify old kundlis still accessible

**Prerequisites:**
- Have kundlis in old structure (before migration)

**Test Steps:**
1. Don't run migration
2. Try to retrieve old kundli:
   ```bash
   curl -X GET http://localhost:8000/api/kundli/{old_kundli_id} \
     -H "Authorization: Bearer {token}"
   ```

**Verification:**
1. Old kundli retrieved successfully
2. Data is complete and correct
3. No errors in logs

**Expected Result:** ✅ Old kundlis still accessible

---

### Test 18: Old Analysis Detection
**Objective:** Verify old analysis files still detected

**Prerequisites:**
- Have analysis in old structure

**Test Steps:**
1. Check admin panel
2. Verify analysis count includes old files
3. Verify `has_analysis()` returns true for old structure

**Verification:**
1. Old analysis files counted
2. Admin metrics include old analysis
3. No errors in logs

**Expected Result:** ✅ Old analysis files detected

---

## Performance Tests

### Test 19: Kundli Generation Performance
**Objective:** Verify no performance regression

**Test Steps:**
1. Generate 10 kundlis
2. Measure time for each
3. Compare with baseline

**Verification:**
1. Average time < 5 seconds per kundli
2. No significant increase from baseline
3. No memory leaks
4. No file handle leaks

**Expected Result:** ✅ Performance maintained

---

### Test 20: Analytics Computation Performance
**Objective:** Verify analytics still fast

**Test Steps:**
1. Compute analytics with 100+ kundlis
2. Measure computation time
3. Compare with baseline

**Verification:**
1. Computation time < 2 seconds
2. No timeouts
3. Accurate results

**Expected Result:** ✅ Analytics performance maintained

---

## Edge Cases & Error Handling

### Test 21: Duplicate Kundli IDs
**Objective:** Verify handling of duplicate IDs

**Test Steps:**
1. Try to create kundli with same ID twice
2. Verify second creation creates new folder

**Expected Result:** ✅ Handled correctly (new folder created)

---

### Test 22: Special Characters in Names
**Objective:** Verify handling of special characters

**Test Steps:**
1. Generate kundli with special characters in name
2. Verify folder structure created correctly
3. Verify files saved and retrieved

**Expected Result:** ✅ Special characters handled correctly

---

### Test 23: Missing User Folder
**Objective:** Verify error handling for missing folders

**Test Steps:**
1. Delete user folder
2. Try to retrieve kundli
3. Verify appropriate error returned

**Expected Result:** ✅ Error handled gracefully

---

## Test Execution Summary

### Quick Test Suite (15 minutes)
```bash
# Run unit tests
pytest backend/tests/test_file_manager.py -v
pytest backend/tests/test_chat_history.py -v

# Run integration tests
pytest backend/tests/test_endpoints.py -v

# Check migration script
python backend/migration_script.py --dry-run
```

### Full Test Suite (1 hour)
- All unit tests
- All integration tests
- Migration tests
- Backward compatibility tests
- Performance tests
- Edge case tests

### Regression Test Suite (30 minutes)
- Test 9-13 (main functionality)
- Test 17-18 (backward compatibility)
- Test 19-20 (performance)

---

## Test Results Template

```
Test Date: _______________
Tester: ___________________
Environment: ______________

UNIT TESTS:
[ ] Test 1: User Folder Creation - PASS/FAIL
[ ] Test 2: Kundli Subfolder Creation - PASS/FAIL
[ ] Test 3: Save Comprehensive Kundli - PASS/FAIL
[ ] Test 4: Save Analysis Files - PASS/FAIL
[ ] Test 5: Has Analysis - PASS/FAIL
[ ] Test 6: Backward Compatibility - PASS/FAIL
[ ] Test 7: Chat Directory Path - PASS/FAIL
[ ] Test 8: Chat Message Storage - PASS/FAIL

INTEGRATION TESTS:
[ ] Test 9: Kundli Generation Endpoint - PASS/FAIL
[ ] Test 10: Kundli Retrieval Endpoint - PASS/FAIL
[ ] Test 11: Analysis Generation - PASS/FAIL
[ ] Test 12: Chat Functionality - PASS/FAIL
[ ] Test 13: Admin Analytics - PASS/FAIL

MIGRATION TESTS:
[ ] Test 14: Migration Script - Dry Run - PASS/FAIL
[ ] Test 15: Migration Script - Full Migration - PASS/FAIL
[ ] Test 16: Migration Script - Rollback - PASS/FAIL

BACKWARD COMPATIBILITY TESTS:
[ ] Test 17: Old Kundli Retrieval - PASS/FAIL
[ ] Test 18: Old Analysis Detection - PASS/FAIL

PERFORMANCE TESTS:
[ ] Test 19: Kundli Generation Performance - PASS/FAIL
[ ] Test 20: Analytics Computation Performance - PASS/FAIL

EDGE CASES:
[ ] Test 21: Duplicate Kundli IDs - PASS/FAIL
[ ] Test 22: Special Characters in Names - PASS/FAIL
[ ] Test 23: Missing User Folder - PASS/FAIL

OVERALL RESULT: PASS/FAIL

Notes:
_________________________________________________________________
_________________________________________________________________
```

---

## Sign-Off Criteria

✅ All unit tests pass  
✅ All integration tests pass  
✅ Migration script works correctly  
✅ Backward compatibility verified  
✅ Performance acceptable  
✅ No data loss  
✅ Admin panel works correctly  
✅ Chat functionality works  
✅ No critical errors in logs  

