"""
Test Suite for Astrology Normalization and Dosha Detection

Tests the robustness of astrological string normalization and dosha detection
with case-insensitivity, spelling variations, and dictionary payloads.
"""

import pytest
from astro_utils import (
    extract_and_clean_string,
    normalize_nakshatra,
    is_gandmool_nakshatra,
    match_nakshatra,
    normalize_planet,
    is_malefic_planet,
    is_benefic_planet,
    match_planet,
    normalize_rasi,
    match_rasi,
    extract_house_number,
    extract_degree,
    GANDMOOL_NAKSHATRAS
)
from rules_engine import RulesEngine


# ============================================================================
# EXTRACT AND CLEAN STRING TESTS
# ============================================================================

class TestExtractAndCleanString:
    """Test the base string extraction and cleaning function."""
    
    def test_string_input(self):
        """Test with plain string input."""
        assert extract_and_clean_string("Jyeshtha") == "jyeshtha"
        assert extract_and_clean_string("JYESHTHA") == "jyeshtha"
    
    def test_dict_with_name_field(self):
        """Test with dictionary containing 'name' field."""
        assert extract_and_clean_string({"name": "Jyeshtha"}) == "jyeshtha"
        assert extract_and_clean_string({"name": "JYESHTHA"}) == "jyeshtha"
    
    def test_dict_with_value_field(self):
        """Test with dictionary containing 'value' field."""
        assert extract_and_clean_string({"value": "Jyeshtha"}) == "jyeshtha"
    
    def test_whitespace_handling(self):
        """Test whitespace stripping."""
        assert extract_and_clean_string("  Jyeshtha  ") == "jyeshtha"
        assert extract_and_clean_string({"name": "  Jyeshtha  "}) == "jyeshtha"
    
    def test_none_input(self):
        """Test with None input."""
        assert extract_and_clean_string(None) == ""
    
    def test_empty_string(self):
        """Test with empty string."""
        assert extract_and_clean_string("") == ""
    
    def test_list_input(self):
        """Test with list input."""
        assert extract_and_clean_string(["Jyeshtha"]) == "jyeshtha"
        assert extract_and_clean_string([]) == ""


# ============================================================================
# NAKSHATRA NORMALIZATION TESTS
# ============================================================================

class TestNakshatraNormalization:
    """Test nakshatra normalization and matching."""
    
    def test_normalize_jyeshtha_variations(self):
        """Test all Jyeshtha spelling variations."""
        assert normalize_nakshatra("Jyeshtha") == "jyeshtha"
        assert normalize_nakshatra("jyeshtha") == "jyeshtha"
        assert normalize_nakshatra("JYESHTHA") == "jyeshtha"
        assert normalize_nakshatra("Jyestha") == "jyeshtha"
        assert normalize_nakshatra("jyestha") == "jyeshtha"
        assert normalize_nakshatra("Jyeshta") == "jyeshtha"
        assert normalize_nakshatra("jyeshta") == "jyeshtha"
    
    def test_normalize_aslesha_variations(self):
        """Test Aslesha/Ashlesha variations."""
        assert normalize_nakshatra("Aslesha") == "aslesha"
        assert normalize_nakshatra("aslesha") == "aslesha"
        assert normalize_nakshatra("Ashlesha") == "aslesha"
        assert normalize_nakshatra("ashlesha") == "aslesha"
    
    def test_normalize_moola_variations(self):
        """Test Moola/Mool/Mula variations."""
        assert normalize_nakshatra("Moola") == "mula"
        assert normalize_nakshatra("moola") == "mula"
        assert normalize_nakshatra("Mool") == "mula"
        assert normalize_nakshatra("mool") == "mula"
        assert normalize_nakshatra("Mula") == "mula"
        assert normalize_nakshatra("mula") == "mula"
    
    def test_normalize_revati_variations(self):
        """Test Revati/Revti variations."""
        assert normalize_nakshatra("Revati") == "revati"
        assert normalize_nakshatra("revati") == "revati"
        assert normalize_nakshatra("Revti") == "revati"
        assert normalize_nakshatra("revti") == "revati"
    
    def test_normalize_dict_payload(self):
        """Test normalization with dictionary payload."""
        assert normalize_nakshatra({"name": "Jyeshtha"}) == "jyeshtha"
        assert normalize_nakshatra({"name": "JYESHTHA"}) == "jyeshtha"
    
    def test_normalize_with_whitespace(self):
        """Test normalization with whitespace."""
        assert normalize_nakshatra("  Jyeshtha  ") == "jyeshtha"
        assert normalize_nakshatra({"name": "  Jyeshtha  "}) == "jyeshtha"


# ============================================================================
# GANDMOOL NAKSHATRA TESTS
# ============================================================================

class TestGandmoolNakshatra:
    """Test Gandmool nakshatra detection."""
    
    def test_is_gandmool_ashwini(self):
        """Test Ashwini as Gandmool."""
        assert is_gandmool_nakshatra("Ashwini") is True
        assert is_gandmool_nakshatra("ashwini") is True
        assert is_gandmool_nakshatra("ASHWINI") is True
    
    def test_is_gandmool_aslesha(self):
        """Test Aslesha as Gandmool."""
        assert is_gandmool_nakshatra("Aslesha") is True
        assert is_gandmool_nakshatra("Ashlesha") is True
        assert is_gandmool_nakshatra("aslesha") is True
    
    def test_is_gandmool_magha(self):
        """Test Magha as Gandmool."""
        assert is_gandmool_nakshatra("Magha") is True
        assert is_gandmool_nakshatra("magha") is True
    
    def test_is_gandmool_jyeshtha(self):
        """Test Jyeshtha as Gandmool with all variations."""
        assert is_gandmool_nakshatra("Jyeshtha") is True
        assert is_gandmool_nakshatra("jyeshtha") is True
        assert is_gandmool_nakshatra("Jyestha") is True
        assert is_gandmool_nakshatra("Jyeshta") is True
    
    def test_is_gandmool_moola(self):
        """Test Moola as Gandmool with all variations."""
        assert is_gandmool_nakshatra("Moola") is True
        assert is_gandmool_nakshatra("Mool") is True
        assert is_gandmool_nakshatra("Mula") is True
    
    def test_is_gandmool_revati(self):
        """Test Revati as Gandmool."""
        assert is_gandmool_nakshatra("Revati") is True
        assert is_gandmool_nakshatra("Revti") is True
    
    def test_is_not_gandmool(self):
        """Test non-Gandmool nakshatras."""
        assert is_gandmool_nakshatra("Bharani") is False
        assert is_gandmool_nakshatra("Rohini") is False
        assert is_gandmool_nakshatra("Krittika") is False
        assert is_gandmool_nakshatra("Hasta") is False
    
    def test_is_gandmool_dict_payload(self):
        """Test Gandmool detection with dictionary payload."""
        assert is_gandmool_nakshatra({"name": "Jyeshtha"}) is True
        assert is_gandmool_nakshatra({"name": "JYESHTHA"}) is True
    
    def test_is_gandmool_with_whitespace(self):
        """Test Gandmool detection with whitespace."""
        assert is_gandmool_nakshatra("  Jyeshtha  ") is True
        assert is_gandmool_nakshatra({"name": "  Jyeshtha  "}) is True


# ============================================================================
# NAKSHATRA MATCHING TESTS
# ============================================================================

class TestNakshatraMatching:
    """Test nakshatra matching with target lists."""
    
    def test_match_single_nakshatra(self):
        """Test matching single nakshatra."""
        assert match_nakshatra("Jyeshtha", ["Jyeshtha"]) is True
        assert match_nakshatra("jyeshtha", ["Jyeshtha"]) is True
        assert match_nakshatra("Jyestha", ["Jyeshtha"]) is True
    
    def test_match_multiple_nakshatras(self):
        """Test matching against multiple nakshatras."""
        assert match_nakshatra("Jyeshtha", ["Ashwini", "Jyeshtha", "Revati"]) is True
        assert match_nakshatra("Aslesha", ["Ashwini", "Aslesha", "Revati"]) is True
    
    def test_no_match(self):
        """Test non-matching nakshatra."""
        assert match_nakshatra("Bharani", ["Ashwini", "Jyeshtha", "Revati"]) is False
    
    def test_match_with_variations(self):
        """Test matching with spelling variations."""
        assert match_nakshatra("jyestha", ["Jyeshtha"]) is True
        assert match_nakshatra("ashlesha", ["Aslesha"]) is True
        assert match_nakshatra("mool", ["Moola"]) is True


# ============================================================================
# PLANET NORMALIZATION TESTS
# ============================================================================

class TestPlanetNormalization:
    """Test planet normalization and matching."""
    
    def test_normalize_sun(self):
        """Test Sun normalization."""
        assert normalize_planet("Sun") == "sun"
        assert normalize_planet("sun") == "sun"
        assert normalize_planet("SUN") == "sun"
        assert normalize_planet("Surya") == "sun"
    
    def test_normalize_moon(self):
        """Test Moon normalization."""
        assert normalize_planet("Moon") == "moon"
        assert normalize_planet("moon") == "moon"
        assert normalize_planet("Chandra") == "moon"
    
    def test_normalize_mars(self):
        """Test Mars normalization."""
        assert normalize_planet("Mars") == "mars"
        assert normalize_planet("mars") == "mars"
        assert normalize_planet("Mangal") == "mars"
        assert normalize_planet("Kuja") == "mars"
    
    def test_normalize_rahu_aliases(self):
        """Test Rahu/North Node aliases."""
        assert normalize_planet("Rahu") == "rahu"
        assert normalize_planet("rahu") == "rahu"
        assert normalize_planet("North Node") == "rahu"
        assert normalize_planet("north node") == "rahu"
    
    def test_normalize_ketu_aliases(self):
        """Test Ketu/South Node aliases."""
        assert normalize_planet("Ketu") == "ketu"
        assert normalize_planet("ketu") == "ketu"
        assert normalize_planet("South Node") == "ketu"
        assert normalize_planet("south node") == "ketu"
    
    def test_normalize_with_symbols(self):
        """Test symbol removal."""
        assert normalize_planet("Mars ♂") == "mars"
        assert normalize_planet("Venus ♀") == "venus"
        assert normalize_planet("Rahu ☊") == "rahu"
        assert normalize_planet("Ketu ☋") == "ketu"
    
    def test_normalize_dict_payload(self):
        """Test normalization with dictionary payload."""
        assert normalize_planet({"name": "Mars"}) == "mars"
        assert normalize_planet({"name": "North Node"}) == "rahu"


# ============================================================================
# PLANET CLASSIFICATION TESTS
# ============================================================================

class TestPlanetClassification:
    """Test planet classification (malefic, benefic, neutral)."""
    
    def test_is_malefic(self):
        """Test malefic planet detection."""
        assert is_malefic_planet("Mars") is True
        assert is_malefic_planet("mars") is True
        assert is_malefic_planet("Saturn") is True
        assert is_malefic_planet("Rahu") is True
        assert is_malefic_planet("Ketu") is True
    
    def test_is_benefic(self):
        """Test benefic planet detection."""
        assert is_benefic_planet("Jupiter") is True
        assert is_benefic_planet("jupiter") is True
        assert is_benefic_planet("Venus") is True
        assert is_benefic_planet("venus") is True
    
    def test_is_neutral(self):
        """Test neutral planet detection."""
        assert is_benefic_planet("Sun") is False  # Not benefic
        assert is_benefic_planet("Moon") is False  # Not benefic
        assert is_benefic_planet("Mercury") is False  # Not benefic


# ============================================================================
# RASI NORMALIZATION TESTS
# ============================================================================

class TestRasiNormalization:
    """Test Rasi/Zodiac sign normalization."""
    
    def test_normalize_aries(self):
        """Test Aries normalization."""
        assert normalize_rasi("Aries") == "aries"
        assert normalize_rasi("aries") == "aries"
        assert normalize_rasi("Mesha") == "aries"
    
    def test_normalize_cancer(self):
        """Test Cancer normalization."""
        assert normalize_rasi("Cancer") == "cancer"
        assert normalize_rasi("cancer") == "cancer"
        assert normalize_rasi("Karka") == "cancer"
        assert normalize_rasi("Karaka") == "cancer"
    
    def test_normalize_all_signs(self):
        """Test all 12 signs normalize correctly."""
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                 "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        for sign in signs:
            normalized = normalize_rasi(sign)
            assert normalized == sign.lower()


# ============================================================================
# HOUSE EXTRACTION TESTS
# ============================================================================

class TestHouseExtraction:
    """Test house number extraction."""
    
    def test_extract_integer_house(self):
        """Test extraction from integer."""
        assert extract_house_number(1) == 1
        assert extract_house_number(7) == 7
        assert extract_house_number(12) == 12
    
    def test_extract_string_house(self):
        """Test extraction from string."""
        assert extract_house_number("1") == 1
        assert extract_house_number("House 7") == 7
        assert extract_house_number("7th") == 7
    
    def test_extract_dict_house(self):
        """Test extraction from dictionary."""
        assert extract_house_number({"number": 1}) == 1
        assert extract_house_number({"house": 7}) == 7
    
    def test_extract_invalid_house(self):
        """Test invalid house numbers."""
        assert extract_house_number(0) is None
        assert extract_house_number(13) is None
        assert extract_house_number("invalid") is None
    
    def test_extract_none_house(self):
        """Test None input."""
        assert extract_house_number(None) is None


# ============================================================================
# DEGREE EXTRACTION TESTS
# ============================================================================

class TestDegreeExtraction:
    """Test degree value extraction."""
    
    def test_extract_float_degree(self):
        """Test extraction from float."""
        assert extract_degree(15.5) == 15.5
        assert extract_degree(0.0) == 0.0
        assert extract_degree(359.9) == 359.9
    
    def test_extract_string_degree(self):
        """Test extraction from string."""
        assert extract_degree("15.5") == 15.5
        assert extract_degree("15.5°") == 15.5
        assert extract_degree("15°30'") == 15.0
    
    def test_extract_dict_degree(self):
        """Test extraction from dictionary."""
        assert extract_degree({"value": 15.5}) == 15.5
        assert extract_degree({"degree": 15.5}) == 15.5
    
    def test_extract_invalid_degree(self):
        """Test invalid degree values."""
        assert extract_degree(-1) is None
        assert extract_degree(361) is None
        assert extract_degree("invalid") is None
    
    def test_extract_none_degree(self):
        """Test None input."""
        assert extract_degree(None) is None


# ============================================================================
# GANDMOOL DOSHA DETECTION TESTS
# ============================================================================

class TestGandmoolDoshaDetection:
    """Test Gandmool Dosha detection with various data formats."""
    
    def test_gandmool_with_string_nakshatra(self):
        """Test Gandmool detection with string nakshatra."""
        d1_chart = {
            "panchanga": {
                "nakshatra": "Jyeshtha"
            }
        }
        rules_engine = RulesEngine()
        dosha = rules_engine.detect_gandmool_dosha(d1_chart)
        assert dosha.is_present is True
        assert dosha.severity == "moderate"
    
    def test_gandmool_with_lowercase_nakshatra(self):
        """Test Gandmool detection with lowercase nakshatra."""
        d1_chart = {
            "panchanga": {
                "nakshatra": "jyeshtha"
            }
        }
        rules_engine = RulesEngine()
        dosha = rules_engine.detect_gandmool_dosha(d1_chart)
        assert dosha.is_present is True
    
    def test_gandmool_with_dict_nakshatra(self):
        """Test Gandmool detection with dictionary nakshatra."""
        d1_chart = {
            "panchanga": {
                "nakshatra": {"name": "Jyeshtha"}
            }
        }
        rules_engine = RulesEngine()
        dosha = rules_engine.detect_gandmool_dosha(d1_chart)
        assert dosha.is_present is True
    
    def test_gandmool_with_spelling_variation(self):
        """Test Gandmool detection with spelling variation."""
        d1_chart = {
            "panchanga": {
                "nakshatra": "Jyestha"
            }
        }
        rules_engine = RulesEngine()
        dosha = rules_engine.detect_gandmool_dosha(d1_chart)
        assert dosha.is_present is True
    
    def test_gandmool_with_whitespace(self):
        """Test Gandmool detection with whitespace."""
        d1_chart = {
            "panchanga": {
                "nakshatra": "  Jyeshtha  "
            }
        }
        rules_engine = RulesEngine()
        dosha = rules_engine.detect_gandmool_dosha(d1_chart)
        assert dosha.is_present is True
    
    def test_gandmool_all_six_nakshatras(self):
        """Test all six Gandmool nakshatras."""
        gandmool_naks = ["Ashwini", "Aslesha", "Magha", "Jyeshtha", "Moola", "Revati"]
        rules_engine = RulesEngine()
        
        for nak in gandmool_naks:
            d1_chart = {
                "panchanga": {
                    "nakshatra": nak
                }
            }
            dosha = rules_engine.detect_gandmool_dosha(d1_chart)
            assert dosha.is_present is True, f"Failed for {nak}"
    
    def test_non_gandmool_nakshatra(self):
        """Test non-Gandmool nakshatra."""
        d1_chart = {
            "panchanga": {
                "nakshatra": "Bharani"
            }
        }
        rules_engine = RulesEngine()
        dosha = rules_engine.detect_gandmool_dosha(d1_chart)
        assert dosha.is_present is False
    
    def test_gandmool_missing_panchanga(self):
        """Test Gandmool detection with missing panchanga."""
        d1_chart = {}
        rules_engine = RulesEngine()
        dosha = rules_engine.detect_gandmool_dosha(d1_chart)
        assert dosha.is_present is False


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

class TestIntegration:
    """Integration tests for multiple components."""
    
    def test_gandmool_with_all_variations(self):
        """Test Gandmool detection with all variations of Jyeshtha."""
        variations = [
            "Jyeshtha",
            "jyeshtha",
            "JYESHTHA",
            "Jyestha",
            "jyestha",
            "Jyeshta",
            "jyeshta",
            {"name": "Jyeshtha"},
            {"name": "jyeshtha"},
            "  Jyeshtha  ",
            {"name": "  Jyeshtha  "}
        ]
        
        rules_engine = RulesEngine()
        for var in variations:
            d1_chart = {
                "panchanga": {
                    "nakshatra": var
                }
            }
            dosha = rules_engine.detect_gandmool_dosha(d1_chart)
            assert dosha.is_present is True, f"Failed for variation: {var}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
