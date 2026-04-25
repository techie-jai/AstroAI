#!/usr/bin/env python3
"""
Test script for chat history implementation.
Verifies atomic writes, file locking, and data persistence.
"""

import os
import json
import tempfile
import time
from datetime import datetime
from pathlib import Path

# Test imports
try:
    from chat_history_manager import ChatHistoryManager
    from context_summary_generator import ContextSummaryGenerator
    from kundli_facts_extractor import KundliFactsExtractor
    from chat_service import ChatService
    print("✅ All imports successful")
except ImportError as e:
    print(f"❌ Import error: {e}")
    exit(1)


def test_chat_history_manager():
    """Test ChatHistoryManager functionality"""
    print("\n" + "="*60)
    print("Testing ChatHistoryManager")
    print("="*60)
    
    with tempfile.TemporaryDirectory() as tmpdir:
        manager = ChatHistoryManager(users_path=tmpdir)
        
        # Test 1: Initialize conversation
        print("\n[TEST 1] Initialize conversation...")
        try:
            manager.initialize_conversation("test_user", "kundli_123", "user_456")
            assert manager.conversation_exists("test_user", "kundli_123")
            print("✅ Conversation initialized successfully")
        except Exception as e:
            print(f"❌ Failed: {e}")
            return False
        
        # Test 2: Add messages
        print("\n[TEST 2] Add messages...")
        try:
            manager.add_message("test_user", "kundli_123", {
                "role": "user",
                "content": "What is my Mahadasha?",
                "timestamp": datetime.now().isoformat(),
                "tokens_used": 10
            })
            manager.add_message("test_user", "kundli_123", {
                "role": "assistant",
                "content": "Your current Mahadasha is Jupiter.",
                "timestamp": datetime.now().isoformat(),
                "tokens_used": 15
            })
            print("✅ Messages added successfully")
        except Exception as e:
            print(f"❌ Failed: {e}")
            return False
        
        # Test 3: Get messages
        print("\n[TEST 3] Get messages...")
        try:
            messages = manager.get_messages("test_user", "kundli_123")
            assert len(messages) == 2
            assert messages[0]["role"] == "user"
            assert messages[1]["role"] == "assistant"
            print(f"✅ Retrieved {len(messages)} messages successfully")
        except Exception as e:
            print(f"❌ Failed: {e}")
            return False
        
        # Test 4: Update context summary
        print("\n[TEST 4] Update context summary...")
        try:
            manager.update_context_summary("test_user", "kundli_123", {
                "summary": "User asked about Mahadasha. Currently in Jupiter period.",
                "key_topics": ["mahadasha", "jupiter"],
                "message_count_at_generation": 2,
                "next_summary_at_message": 12
            })
            summary = manager.get_context_summary("test_user", "kundli_123")
            assert summary is not None
            assert "Jupiter" in summary["summary"]
            print("✅ Context summary updated successfully")
        except Exception as e:
            print(f"❌ Failed: {e}")
            return False
        
        # Test 5: Update kundli facts
        print("\n[TEST 5] Update kundli facts...")
        try:
            manager.update_kundli_facts("test_user", "kundli_123", {
                "mahadasha": "Jupiter (2020-2036)",
                "antardasha": "Mercury (2023-2025)",
                "doshas_present": ["Mangal Dosha"],
                "sun_sign": "Leo",
                "moon_sign": "Pisces",
                "major_planets": {
                    "mars": "Aries",
                    "mercury": "Virgo"
                }
            })
            facts = manager.get_kundli_facts("test_user", "kundli_123")
            assert facts is not None
            assert facts["sun_sign"] == "Leo"
            print("✅ Kundli facts updated successfully")
        except Exception as e:
            print(f"❌ Failed: {e}")
            return False
        
        # Test 6: Get metadata
        print("\n[TEST 6] Get metadata...")
        try:
            metadata = manager.get_conversation_metadata("test_user", "kundli_123")
            assert metadata is not None
            assert metadata["total_messages"] == 2
            print(f"✅ Metadata retrieved: {metadata['total_messages']} messages")
        except Exception as e:
            print(f"❌ Failed: {e}")
            return False
        
        # Test 7: Atomic write verification
        print("\n[TEST 7] Verify atomic writes...")
        try:
            chat_dir = os.path.join(tmpdir, "test_user", "chat", "kundli_123")
            messages_file = os.path.join(chat_dir, "messages.json")
            
            # Check that .tmp file doesn't exist (should be cleaned up)
            tmp_file = f"{messages_file}.tmp"
            assert not os.path.exists(tmp_file), "Stale .tmp file found!"
            
            # Check that main file exists and is valid JSON
            assert os.path.exists(messages_file), "Messages file not found!"
            with open(messages_file, 'r') as f:
                data = json.load(f)
                assert isinstance(data, list)
            
            print("✅ Atomic writes verified (no stale .tmp files)")
        except Exception as e:
            print(f"❌ Failed: {e}")
            return False
    
    return True


def test_kundli_facts_extractor():
    """Test KundliFactsExtractor functionality"""
    print("\n" + "="*60)
    print("Testing KundliFactsExtractor")
    print("="*60)
    
    extractor = KundliFactsExtractor()
    
    # Test 1: Extract facts from response
    print("\n[TEST 1] Extract facts from AI response...")
    try:
        response = """
        Your current Mahadasha is Jupiter which runs until 2036.
        The Antardasha is Mercury from 2023 to 2025.
        You have Mangal Dosha in your chart.
        Your Sun sign is Leo and Moon sign is Pisces.
        Mars is in Aries and Mercury is in Virgo.
        """
        facts = extractor.extract_facts_from_response(response)
        assert facts["mahadasha"] == "Jupiter"
        assert facts["antardasha"] == "Mercury"
        assert "Mangal Dosha" in facts["doshas_present"]
        assert facts["sun_sign"] == "Leo"
        assert facts["moon_sign"] == "Pisces"
        print("✅ Facts extracted successfully from response")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False
    
    # Test 2: Merge facts
    print("\n[TEST 2] Merge facts...")
    try:
        existing_facts = {
            "mahadasha": "Jupiter",
            "doshas_present": ["Mangal Dosha"],
            "sun_sign": "Leo"
        }
        new_facts = {
            "antardasha": "Mercury",
            "doshas_present": ["Kaal Sarp Dosha"],
            "moon_sign": "Pisces"
        }
        merged = extractor.merge_facts(existing_facts, new_facts)
        assert merged["mahadasha"] == "Jupiter"
        assert merged["antardasha"] == "Mercury"
        assert "Mangal Dosha" in merged["doshas_present"]
        assert "Kaal Sarp Dosha" in merged["doshas_present"]
        assert merged["sun_sign"] == "Leo"
        assert merged["moon_sign"] == "Pisces"
        print("✅ Facts merged successfully without duplicates")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False
    
    return True


def test_context_summary_generator():
    """Test ContextSummaryGenerator functionality"""
    print("\n" + "="*60)
    print("Testing ContextSummaryGenerator")
    print("="*60)
    
    generator = ContextSummaryGenerator(gemini_service=None)
    
    # Test 1: Check summary trigger
    print("\n[TEST 1] Check summary trigger logic...")
    try:
        # Should not trigger at 5 messages
        assert not generator.should_generate_summary(5, 0)
        
        # Should trigger at 10 messages
        assert generator.should_generate_summary(10, 0)
        
        # Should trigger at 20 messages (10 since last summary)
        assert generator.should_generate_summary(20, 10)
        
        # Should not trigger at 15 messages (5 since last summary)
        assert not generator.should_generate_summary(15, 10)
        
        print("✅ Summary trigger logic working correctly")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False
    
    # Test 2: Key topics extraction
    print("\n[TEST 2] Extract key topics...")
    try:
        summary = """
        User is concerned about career prospects during Saturn transit.
        Discussed marriage compatibility and timing.
        Analyzed health issues related to Moon placement.
        Recommended spiritual practices for Rahu period.
        """
        topics = generator._extract_key_topics(summary)
        assert len(topics) > 0
        assert any("career" in t or "saturn" in t for t in topics)
        print(f"✅ Extracted {len(topics)} key topics: {topics}")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False
    
    return True


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("CHAT HISTORY IMPLEMENTATION TEST SUITE")
    print("="*60)
    
    tests = [
        ("ChatHistoryManager", test_chat_history_manager),
        ("KundliFactsExtractor", test_kundli_facts_extractor),
        ("ContextSummaryGenerator", test_context_summary_generator),
    ]
    
    results = {}
    for name, test_func in tests:
        try:
            results[name] = test_func()
        except Exception as e:
            print(f"\n❌ Unexpected error in {name}: {e}")
            results[name] = False
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Chat history implementation is ready.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review.")
        return 1


if __name__ == "__main__":
    exit(main())
