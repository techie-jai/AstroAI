# Dependency Mapping - User Folder Structure Redesign

## Phase 1 Analysis Results

### Critical Path Dependencies

#### 1. FileManager (backend/file_manager.py)
**Current Methods Using Paths:**
- `create_user_folder()` - Creates `{timestamp}_{uuid}-{name}` folder with only `kundli/` subfolder
- `save_comprehensive_kundli()` - Saves to `{folder}/kundli/{name}_comprehensive_kundli.json`
- `save_analysis_text()` - Saves to `{folder}/analysis/{name}_analysis_{timestamp}.txt`
- `save_analysis_pdf()` - Saves to `{folder}/analysis/{name}_analysis_{timestamp}.pdf`
- `has_analysis()` - Checks `{folder}/analysis/` for files
- `get_user_folder()` - Searches folders by uid, checks `user_info.json`

**Changes Needed:**
- Update `create_user_folder()` to create 4 subfolders: Astrology, Palmistry, Numerology, Chats
- Add `create_kundli_subfolder(user_folder, kundli_id)` - Creates `Astrology/{kundli_id}/`
- Update `save_comprehensive_kundli()` to use `Astrology/{kundli_id}/`
- Update `save_analysis_text()` to use `Astrology/{kundli_id}/`
- Update `save_analysis_pdf()` to use `Astrology/{kundli_id}/`
- Update `has_analysis()` to check `Astrology/{kundli_id}/`
- Add helper methods: `get_astrology_path()`, `get_palmistry_path()`, `get_chats_path()`

---

#### 2. Main.py (backend/main.py)
**Endpoints Using FileManager:**

**Kundli Generation:**
- `/api/kundli/generate` (lines 555-735)
  - Calls `file_manager.create_user_folder(user_name)` → needs update
  - Calls `file_manager.save_user_info()` → no change needed
  - Calls `file_manager.save_comprehensive_kundli()` → needs update
  - Calls `file_manager.add_to_index()` → needs update (file_path will change)

- `/api/livechat/generate` (lines 2363-2550)
  - Same as above, needs same updates

**Kundli Retrieval:**
- `/api/calculations/history` (lines 995-1050)
  - Reads from `kundli_index.json`
  - Calls `file_manager.has_analysis()` → needs update
  - Returns file paths that will change

- `/api/user/calculations` (lines 1084-1140)
  - Same as above

- `/api/kundlis/list` (lines 1143-1200)
  - Same as above

- `/api/kundli/{kundli_id}` (lines 1203-1260)
  - Reads from index, loads kundli file
  - File path will change

**Analysis Generation:**
- `/api/analysis/{kundli_id}` (lines 1641-1760)
  - Loads kundli from file path in index
  - File path will change

**Chat Endpoints:**
- `/api/chat/history/{kundli_id}` - Uses chat_history_manager
- `/api/chat/save-message` - Uses chat_history_manager
- `/api/chat/context/{kundli_id}` - Uses chat_history_manager

---

#### 3. ChatHistoryManager (backend/chat_history_manager.py)
**Current Path Structure:**
- `_get_chat_dir()` returns `{users_path}/{user_folder}/chat/{kundli_id}`

**Changes Needed:**
- Update to `{users_path}/{user_folder}/Chats/chat_history/{kundli_id}`
- Create `chat_config.json` in `Chats/` folder
- All methods using `_get_chat_dir()` will automatically use new path

**Methods Affected:**
- `initialize_conversation()` - Creates chat directory
- `add_message()` - Saves messages
- `get_messages()` - Reads messages
- `get_context_summary()` - Reads summary
- `update_context_summary()` - Saves summary
- `get_kundli_facts()` - Reads facts
- `update_kundli_facts()` - Saves facts
- `get_conversation_metadata()` - Reads metadata
- `clear_conversation()` - Archives conversation

---

#### 4. ChatService (backend/chat_service.py)
**Uses ChatHistoryManager:**
- All path changes handled by ChatHistoryManager
- No direct path changes needed

---

#### 5. AdminService (backend/admin_service.py)
**Methods Using Paths:**
- `get_all_users_from_filesystem()` - Scans user folders
- `get_all_kundlis_from_filesystem()` - Reads kundli files

**Changes Needed:**
- Update to scan new Astrology subfolder structure
- Update to read from `Astrology/{kundli_id}/` instead of `kundli/`

---

#### 6. AdminAnalyticsService (backend/admin_analytics_service.py)
**Methods Using Paths:**
- `get_all_users_from_filesystem()` - Scans user folders
- `_count_kundlis()` - Counts kundli files
- `_has_kundli_data()` - Checks for kundli_index.json

**Changes Needed:**
- Update to scan new Astrology subfolder structure
- Update analysis counting logic

---

#### 7. PalmistryService (backend/palmistry_service.py)
**Current Path Usage:**
- Needs to save palmistry files to `Palmistry/` folder

**Changes Needed:**
- Add methods to save hand images to `Palmistry/{hand_pair_id}/`
- Add methods to save analysis to `Palmistry/{hand_pair_id}/`

---

#### 8. KundliMatchingService (backend/kundli_matching_service.py)
**Current Path Usage:**
- Reads kundli files from index

**Changes Needed:**
- Update file path reading to work with new structure

---

### Global Index vs Per-User Index

**Current:**
- Single `users/kundli_index.json` contains all kundlis globally

**New Approach:**
- Keep global `users/kundli_index.json` for backward compatibility
- Add per-user `users/{user_folder}/Astrology/kundli_index.json` for new kundlis
- Update `add_to_index()` to write to both indexes

---

### Migration Script Requirements

**Script: backend/migration_script.py**

**Tasks:**
1. Scan existing `users/` directory
2. For each user folder:
   - Create new subfolder structure (Astrology, Palmistry, Numerology, Chats)
   - Move kundli files from `kundli/` to `Astrology/{kundli_id}/`
   - Move analysis files from `analysis/` to `Astrology/{kundli_id}/`
   - Create per-user kundli_index.json
   - Backup original data
3. Validate migration success
4. Create rollback capability

---

### Implementation Order

1. **FileManager** - Foundation (all other services depend on it)
2. **Main.py** - API endpoints (uses FileManager)
3. **ChatHistoryManager** - Chat paths (independent but uses FileManager pattern)
4. **AdminService/AdminAnalyticsService** - Admin operations
5. **PalmistryService** - Palmistry paths
6. **KundliMatchingService** - Matching service
7. **Migration Script** - Data migration utility
8. **Testing** - Comprehensive testing

---

### Files Summary

**Backend Files to Modify:**
1. `backend/file_manager.py` - Core refactoring
2. `backend/main.py` - API endpoints
3. `backend/chat_history_manager.py` - Chat paths
4. `backend/chat_service.py` - May need minor updates
5. `backend/admin_service.py` - Admin operations
6. `backend/admin_analytics_service.py` - Analytics
7. `backend/palmistry_service.py` - Palmistry paths
8. `backend/kundli_matching_service.py` - Matching service
9. `backend/validate_admin_data.py` - Validation

**New Files to Create:**
1. `backend/migration_script.py` - Data migration utility
2. `MIGRATION_GUIDE.md` - Migration documentation

**Frontend Files:**
- `frontend/src/services/api.ts` - May need minor updates if paths are exposed

---

### Path Changes Summary

| Component | Old Path | New Path |
|-----------|----------|----------|
| Kundli JSON | `users/{user_folder}/kundli/{name}.json` | `users/{user_folder}/Astrology/{kundli_id}/{name}.json` |
| Analysis Text | `users/{user_folder}/analysis/{name}_analysis_{ts}.txt` | `users/{user_folder}/Astrology/{kundli_id}/analysis.txt` |
| Analysis PDF | `users/{user_folder}/analysis/{name}_analysis_{ts}.pdf` | `users/{user_folder}/Astrology/{kundli_id}/analysis.pdf` |
| Chat Messages | `users/{user_folder}/chat/{kundli_id}/messages.json` | `users/{user_folder}/Chats/chat_history/{kundli_id}/messages.json` |
| Chat Summary | `users/{user_folder}/chat/{kundli_id}/context_summary.json` | `users/{user_folder}/Chats/chat_history/{kundli_id}/context_summary.json` |
| Palmistry Images | N/A | `users/{user_folder}/Palmistry/{hand_pair_id}/left_hand.jpg` |
| Palmistry Analysis | N/A | `users/{user_folder}/Palmistry/{hand_pair_id}/analysis.pdf` |

