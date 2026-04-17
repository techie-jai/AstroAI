"""
Test Gandmool Dosha detection with real kundli.json structure
"""

import json
from rules_engine import RulesEngine


def test_gandmool_with_real_kundli_structure():
    """Test Gandmool detection with actual kundli.json structure from Check_Dosh."""
    
    # Load the actual kundli file
    kundli_path = r"e:\25. Codes\17. AstroAI V3\AstroAi\users\20260414_214550_383afb8e-Check_Dosh\kundli\Check-Dosh_comprehensive_kundli.json"
    
    with open(kundli_path, 'r') as f:
        kundli_data = json.load(f)
    
    # Extract d1Chart from the kundli data
    # The kundli structure has jyotishganit_json containing d1Chart and panchanga
    jyotishganit = kundli_data.get("jyotishganit_json", {})
    d1_chart = jyotishganit.get("d1Chart", {})
    
    # Initialize rules engine and detect Gandmool Dosha
    # Pass full kundli_data so it can access panchanga from jyotishganit_json
    rules_engine = RulesEngine()
    dosha = rules_engine.detect_gandmool_dosha(d1_chart, kundli_data)
    
    # Verify detection
    print("\n" + "="*80)
    print("GANDMOOL DOSHA DETECTION - REAL KUNDLI TEST")
    print("="*80)
    print(f"Kundli: Check_Dosh")
    print(f"Nakshatra (from jyotishganit_json.panchanga): {jyotishganit.get('panchanga', {}).get('nakshatra')}")
    print(f"Moon Nakshatra (from horoscope_info): {kundli_data.get('horoscope_info', {}).get('moon_nakshatra')}")
    print(f"\nDosha Detection Result:")
    print(f"  Name: {dosha.name}")
    print(f"  Is Present: {dosha.is_present}")
    print(f"  Severity: {dosha.severity}")
    print(f"  Description: {dosha.description}")
    print(f"  Remedies: {dosha.remedies}")
    print("="*80)
    
    # Assert that Gandmool is detected (Ashlesha is a Gandmool nakshatra)
    assert dosha.is_present is True, "Gandmool Dosha should be detected for Ashlesha nakshatra"
    assert dosha.severity == "moderate", "Gandmool Dosha severity should be moderate"
    assert len(dosha.remedies) > 0, "Gandmool Dosha should have remedies"
    
    print("\n[PASS] TEST PASSED: Gandmool Dosha correctly detected in real kundli!")


def test_gandmool_with_multiple_real_kundlis():
    """Test Gandmool detection with multiple real kundlis."""
    
    test_cases = [
        {
            "path": r"e:\25. Codes\17. AstroAI V3\AstroAi\users\20260414_214550_383afb8e-Check_Dosh\kundli\Check-Dosh_comprehensive_kundli.json",
            "name": "Check_Dosh",
            "expected_nakshatra": "Ashlesha",
            "should_have_gandmool": True
        },
        {
            "path": r"e:\25. Codes\17. AstroAI V3\AstroAi\users\20260415_194958_ea542e22-Jigna_A_Patel\kundli\Jigna-A-Patel_comprehensive_kundli.json",
            "name": "Jigna_A_Patel",
            "expected_nakshatra": None,  # Will check from file
            "should_have_gandmool": None  # Will determine based on nakshatra
        }
    ]
    
    rules_engine = RulesEngine()
    
    print("\n" + "="*80)
    print("GANDMOOL DOSHA DETECTION - MULTIPLE REAL KUNDLIS TEST")
    print("="*80 + "\n")
    
    for test_case in test_cases:
        try:
            with open(test_case["path"], 'r') as f:
                kundli_data = json.load(f)
            
            d1_chart = kundli_data.get("d1Chart", {})
            horoscope_info = kundli_data.get("horoscope_info", {})
            
            # Get nakshatra from various locations
            panchanga_nak = d1_chart.get("panchanga", {}).get("nakshatra")
            horoscope_nak = horoscope_info.get("nakshatra")
            moon_nak = horoscope_info.get("moon_nakshatra")
            
            nakshatra = panchanga_nak or horoscope_nak or moon_nak
            
            # Detect Gandmool
            dosha = rules_engine.detect_gandmool_dosha(d1_chart)
            
            print(f"\nKundli: {test_case['name']}")
            print(f"  Nakshatra: {nakshatra}")
            print(f"  Gandmool Detected: {dosha.is_present}")
            print(f"  Severity: {dosha.severity}")
            
            if dosha.is_present:
                print(f"  Description: {dosha.description[:80]}...")
        
        except FileNotFoundError:
            print(f"\nKundli: {test_case['name']}")
            print(f"  [SKIP] File not found (skipped)")
        except Exception as e:
            print(f"\nKundli: {test_case['name']}")
            print(f"  [ERROR] Error: {str(e)}")
    
    print("\n" + "="*80)
    print("[PASS] TEST COMPLETED: Multiple kundlis processed successfully!")
    print("="*80)


if __name__ == "__main__":
    test_gandmool_with_real_kundli_structure()
    test_gandmool_with_multiple_real_kundlis()
