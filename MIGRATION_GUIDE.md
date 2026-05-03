# User Folder Structure Migration Guide

## Overview

This guide explains how to migrate from the old flat user folder structure to the new organized structure with Astrology, Palmistry, Numerology, and Chats subfolders.

## Old Structure vs New Structure

### Old Structure
```
users/
├── {timestamp}_{uuid}-{name}/
│   ├── kundli/
│   │   └── {name}_comprehensive_kundli.json
│   ├── analysis/
│   │   └── {name}_analysis_{timestamp}.txt
│   ├── chat/
│   │   └── {kundli_id}/
│   │       ├── messages.json
│   │       └── metadata.json
│   └── user_info.json
└── kundli_index.json (global)
```

### New Structure
```
users/
├── {timestamp}_{uid}_{email}/
│   ├── user_info.json
│   ├── Astrology/
│   │   ├── {kundli_id}/
│   │   │   ├── {name}_comprehensive_kundli.json
│   │   │   ├── analysis.txt
│   │   │   └── analysis.pdf
│   │   └── kundli_index.json (per-user)
│   ├── Palmistry/
│   │   ├── {hand_pair_id}/
│   │   │   ├── left_hand.jpg
│   │   │   ├── right_hand.jpg
│   │   │   ├── analysis.pdf
│   │   │   └── metadata.json
│   │   └── ...
│   ├── Numerology/
│   │   └── (empty for now)
│   └── Chats/
│       ├── chat_config.json
│       └── chat_history/
│           ├── {kundli_id}/
│           │   ├── messages.json
│           │   ├── metadata.json
│           │   ├── context_summary.json
│           │   └── kundli_facts.json
│           └── ...
└── kundli_index.json (global, for backward compatibility)
```

## Key Changes

### 1. User Folder Naming
- **Old:** `{timestamp}_{uuid}-{name}` (e.g., `20260502_205235_bb5391ac-Jai_new`)
- **New:** `{timestamp}_{uid}_{email}` (e.g., `20260502_205235_user123_john@example.com`)

### 2. Kundli Storage
- **Old:** `users/{user_folder}/kundli/{name}_comprehensive_kundli.json`
- **New:** `users/{user_folder}/Astrology/{kundli_id}/{name}_comprehensive_kundli.json`

### 3. Analysis Files
- **Old:** `users/{user_folder}/analysis/{name}_analysis_{timestamp}.txt`
- **New:** `users/{user_folder}/Astrology/{kundli_id}/analysis.txt`

### 4. Chat Files
- **Old:** `users/{user_folder}/chat/{kundli_id}/messages.json`
- **New:** `users/{user_folder}/Chats/chat_history/{kundli_id}/messages.json`

## Migration Steps

### Step 1: Backup Your Data

Before running the migration, create a backup:

```bash
# Backup is automatically created by the migration script
# Location: users_backup_{timestamp}/
```

### Step 2: Run the Migration Script

#### Option A: Full Migration (Recommended)

```bash
cd backend
python migration_script.py
```

This will:
1. Create a backup of the entire `users/` directory
2. Scan all user folders
3. Create new folder structure (Astrology, Palmistry, Numerology, Chats)
4. Move kundli files to `Astrology/{kundli_id}/`
5. Move analysis files to respective kundli folders
6. Move chat files to `Chats/chat_history/{kundli_id}/`
7. Create per-user kundli indexes
8. Save migration log

#### Option B: Dry Run (Test First)

```bash
cd backend
python migration_script.py --dry-run
```

This will show what would be migrated without making any changes.

#### Option C: Rollback (If Something Goes Wrong)

```bash
cd backend
python migration_script.py --rollback
```

This will restore the backup created before migration.

### Step 3: Verify Migration

After migration, verify the new structure:

```bash
# Check that new folders exist
ls users/{user_folder}/Astrology/
ls users/{user_folder}/Palmistry/
ls users/{user_folder}/Numerology/
ls users/{user_folder}/Chats/

# Check that old folders are removed
# (should not exist anymore)
ls users/{user_folder}/kundli/  # Should not exist
ls users/{user_folder}/analysis/  # Should not exist
ls users/{user_folder}/chat/  # Should not exist
```

### Step 4: Restart Services

After migration, restart all services:

```bash
# Stop services
# (your stop command here)

# Start services
./start_all.ps1
```

## Code Changes Summary

### FileManager Updates
- `create_user_folder()` - Now creates 4 subfolders automatically
- `save_comprehensive_kundli()` - Saves to `Astrology/{kundli_id}/`
- `save_analysis_text()` - Saves to `Astrology/{kundli_id}/`
- `save_analysis_pdf()` - Saves to `Astrology/{kundli_id}/`
- `has_analysis()` - Checks new structure first, then old for compatibility
- New helper methods: `get_astrology_path()`, `get_palmistry_path()`, `get_chats_path()`

### ChatHistoryManager Updates
- `_get_chat_dir()` - Now uses `Chats/chat_history/{kundli_id}/`

### Main.py Updates
- Kundli generation endpoints pass `uid` and `email` to `create_user_folder()`
- `save_comprehensive_kundli()` calls pass `kundli_id` parameter

## Backward Compatibility

The system maintains backward compatibility with old kundlis:

1. **Old kundlis can still be read** - FileManager checks both old and new paths
2. **Analysis checking** - `has_analysis()` checks new structure first, then old
3. **Global index** - Kept for backward compatibility, per-user indexes added

## Troubleshooting

### Migration Failed

If migration fails:

1. Check the migration log: `migration_log_{timestamp}.txt`
2. Review errors in the log
3. Restore from backup: `python migration_script.py --rollback`
4. Fix the issue and try again

### Some Files Not Migrated

Check the migration log for details:
- Files may not have been migrated if they don't match expected patterns
- Manually move any remaining files to correct locations
- Verify file permissions

### Old Kundlis Not Loading

If old kundlis aren't loading after migration:

1. Check that files exist in new location
2. Verify file paths in `kundli_index.json`
3. Check file permissions (should be readable by backend process)

## Performance Considerations

- **Migration Time:** Depends on number of users and kundlis
  - 100 users: ~5-10 seconds
  - 1000 users: ~30-60 seconds
  - 10000 users: ~5-10 minutes

- **Disk Space:** Requires ~2x disk space during migration (original + backup)
  - After successful migration, you can delete the backup

## Rollback Procedure

If you need to rollback:

```bash
cd backend
python migration_script.py --rollback
```

This will:
1. Remove the new migrated structure
2. Restore from the backup created before migration
3. Return to the old folder structure

**Note:** Rollback only works if the backup still exists. Keep the backup until you're confident the migration was successful.

## Post-Migration Cleanup

After successful migration and verification:

1. Delete the backup directory (optional, but frees disk space)
2. Delete old `kundli_index.json` if all kundlis are migrated
3. Monitor logs for any issues

## Support

If you encounter issues during migration:

1. Check the migration log for detailed error messages
2. Review the DEPENDENCY_MAPPING.md for code changes
3. Verify file permissions and disk space
4. Use `--dry-run` to test before actual migration

## Timeline

- **Backup Creation:** 1-2 minutes (depending on data size)
- **Migration:** 5-10 minutes for typical setup
- **Verification:** 2-5 minutes
- **Total:** 10-20 minutes

## Next Steps

After successful migration:

1. Monitor application for any issues
2. Verify all kundlis load correctly
3. Test chat functionality
4. Test analysis generation
5. Update documentation as needed

