#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Comprehensive Testing - Test PyJHora Low-Level Functions and API Wrapper
Tests both the wrapper API and PyJHora's core functions directly
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'PyJHora'))

from astro_chart_api import AstroChartAPI
from jhora import utils, const
from jhora.panchanga import drik
from jhora.horoscope.chart import charts
from jhora.horoscope import main

# Initialize language
utils.set_language('en')

def test_all_chart_types():
    """Test generation of ALL divisional charts"""
    print("=" * 80)
    print("TEST 1: Testing ALL Divisional Chart Types")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    # Set test birth data
    api.set_birth_data(
        name="Test Person",
        place_name="Chennai,IN",
        latitude=13.0827,
        longitude=80.2707,
        timezone_offset=5.5,
        year=1990,
        month=6,
        day=15,
        hour=10,
        minute=30
    )
    
    # Test all chart types
    all_chart_types = list(AstroChartAPI.CHART_TYPES.keys())
    
    results = {
        'passed': [],
        'failed': []
    }
    
    for chart_type in all_chart_types:
        try:
            chart = api.get_chart(chart_type)
            
            # Verify essential fields exist
            assert 'chart_type' in chart
            assert 'planets' in chart
            assert 'houses' in chart
            assert 'ascendant' in chart
            assert len(chart['planets']) > 0
            assert len(chart['houses']) == 12
            
            results['passed'].append(chart_type)
            print(f"✓ {chart_type:5s} - {chart['chart_name']:30s} - OK")
            
        except Exception as e:
            results['failed'].append((chart_type, str(e)))
            print(f"✗ {chart_type:5s} - FAILED: {e}")
    
    print(f"\nResults: {len(results['passed'])}/{len(all_chart_types)} charts passed")
    
    if results['failed']:
        print("\nFailed charts:")
        for chart_type, error in results['failed']:
            print(f"  {chart_type}: {error}")
    
    return results


def test_all_api_methods():
    """Test ALL API methods"""
    print("\n" + "=" * 80)
    print("TEST 2: Testing ALL API Methods")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    test_results = []
    
    # Test 1: set_birth_data
    try:
        result = api.set_birth_data(
            name="Method Test",
            place_name="Mumbai,IN",
            latitude=19.0760,
            longitude=72.8777,
            timezone_offset=5.5,
            year=1985,
            month=3,
            day=20,
            hour=14,
            minute=45
        )
        assert result is not None
        assert 'name' in result
        test_results.append(("set_birth_data", "PASS", None))
        print("✓ set_birth_data() - OK")
    except Exception as e:
        test_results.append(("set_birth_data", "FAIL", str(e)))
        print(f"✗ set_birth_data() - FAILED: {e}")
    
    # Test 2: get_chart
    try:
        chart = api.get_chart('D1')
        assert chart is not None
        assert 'planets' in chart
        test_results.append(("get_chart", "PASS", None))
        print("✓ get_chart() - OK")
    except Exception as e:
        test_results.append(("get_chart", "FAIL", str(e)))
        print(f"✗ get_chart() - FAILED: {e}")
    
    # Test 3: get_multiple_charts
    try:
        charts = api.get_multiple_charts(['D1', 'D9', 'D10'])
        assert len(charts) == 3
        assert 'D1' in charts
        assert 'D9' in charts
        assert 'D10' in charts
        test_results.append(("get_multiple_charts", "PASS", None))
        print("✓ get_multiple_charts() - OK")
    except Exception as e:
        test_results.append(("get_multiple_charts", "FAIL", str(e)))
        print(f"✗ get_multiple_charts() - FAILED: {e}")
    
    # Test 4: get_planet_in_house
    try:
        sun = api.get_planet_in_house('D1', 'Sun')
        assert sun is not None
        assert 'house' in sun
        assert 'house_name' in sun
        test_results.append(("get_planet_in_house", "PASS", None))
        print("✓ get_planet_in_house() - OK")
    except Exception as e:
        test_results.append(("get_planet_in_house", "FAIL", str(e)))
        print(f"✗ get_planet_in_house() - FAILED: {e}")
    
    # Test 5: get_planets_in_house
    try:
        planets = api.get_planets_in_house('D1', 1)
        assert isinstance(planets, list)
        test_results.append(("get_planets_in_house", "PASS", None))
        print("✓ get_planets_in_house() - OK")
    except Exception as e:
        test_results.append(("get_planets_in_house", "FAIL", str(e)))
        print(f"✗ get_planets_in_house() - FAILED: {e}")
    
    # Test 6: format_chart_text
    try:
        text = api.format_chart_text('D1')
        assert isinstance(text, str)
        assert len(text) > 0
        test_results.append(("format_chart_text", "PASS", None))
        print("✓ format_chart_text() - OK")
    except Exception as e:
        test_results.append(("format_chart_text", "FAIL", str(e)))
        print(f"✗ format_chart_text() - FAILED: {e}")
    
    # Summary
    passed = sum(1 for _, status, _ in test_results if status == "PASS")
    total = len(test_results)
    print(f"\nResults: {passed}/{total} methods passed")
    
    return test_results


def test_all_planets():
    """Test that all planets are present in charts"""
    print("\n" + "=" * 80)
    print("TEST 3: Testing All Planet Retrieval")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    api.set_birth_data(
        name="Planet Test",
        place_name="Delhi,IN",
        latitude=28.6139,
        longitude=77.2090,
        timezone_offset=5.5,
        year=1995,
        month=12,
        day=10,
        hour=8,
        minute=15
    )
    
    # List of all planets to test (using correct PyJHora names)
    planets_to_test = [
        'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 
        'Venus', 'Saturn', 'Raagu', 'Kethu'
    ]
    
    results = []
    
    for planet_name in planets_to_test:
        try:
            planet = api.get_planet_in_house('D1', planet_name)
            if planet:
                results.append((planet_name, "FOUND", planet['house_name']))
                print(f"✓ {planet_name:10s} - Found in {planet['house_name']}")
            else:
                results.append((planet_name, "NOT FOUND", None))
                print(f"✗ {planet_name:10s} - NOT FOUND")
        except Exception as e:
            results.append((planet_name, "ERROR", str(e)))
            print(f"✗ {planet_name:10s} - ERROR: {e}")
    
    found = sum(1 for _, status, _ in results if status == "FOUND")
    print(f"\nResults: {found}/{len(planets_to_test)} planets found")
    
    return results


def test_chart_data_structure():
    """Test that chart data has correct structure"""
    print("\n" + "=" * 80)
    print("TEST 4: Testing Chart Data Structure")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    api.set_birth_data(
        name="Structure Test",
        place_name="Bangalore,IN",
        latitude=12.9716,
        longitude=77.5946,
        timezone_offset=5.5,
        year=2000,
        month=1,
        day=1,
        hour=12,
        minute=0
    )
    
    chart = api.get_chart('D1')
    
    required_fields = {
        'chart_type': str,
        'divisional_factor': int,
        'chart_name': str,
        'signification': str,
        'planets': list,
        'houses': dict,
        'ascendant': dict,
        'birth_data': dict
    }
    
    results = []
    
    for field, expected_type in required_fields.items():
        try:
            assert field in chart, f"Field '{field}' missing"
            assert isinstance(chart[field], expected_type), f"Field '{field}' has wrong type"
            results.append((field, "PASS", None))
            print(f"✓ {field:20s} - OK ({expected_type.__name__})")
        except AssertionError as e:
            results.append((field, "FAIL", str(e)))
            print(f"✗ {field:20s} - FAILED: {e}")
    
    # Test planet structure
    if chart['planets']:
        planet = chart['planets'][0]
        planet_fields = ['id', 'name', 'short_name', 'house', 'house_name', 'longitude', 'longitude_dms']
        
        print("\nPlanet data structure:")
        for field in planet_fields:
            if field in planet:
                print(f"✓ Planet.{field:15s} - OK")
                results.append((f"planet.{field}", "PASS", None))
            else:
                print(f"✗ Planet.{field:15s} - MISSING")
                results.append((f"planet.{field}", "FAIL", "Missing field"))
    
    passed = sum(1 for _, status, _ in results if status == "PASS")
    print(f"\nResults: {passed}/{len(results)} structure checks passed")
    
    return results


def test_edge_cases():
    """Test edge cases and error handling"""
    print("\n" + "=" * 80)
    print("TEST 5: Testing Edge Cases and Error Handling")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    results = []
    
    # Test 1: Invalid chart type
    try:
        api.set_birth_data(
            name="Edge Test",
            place_name="Chennai,IN",
            latitude=13.0827,
            longitude=80.2707,
            timezone_offset=5.5,
            year=1990,
            month=6,
            day=15,
            hour=10,
            minute=30
        )
        chart = api.get_chart('D99')  # Invalid chart type
        results.append(("Invalid chart type", "FAIL", "Should have raised error"))
        print("✗ Invalid chart type - Should have raised error")
    except ValueError as e:
        results.append(("Invalid chart type", "PASS", "Correctly raised ValueError"))
        print("✓ Invalid chart type - Correctly raised ValueError")
    except Exception as e:
        results.append(("Invalid chart type", "FAIL", f"Wrong error type: {type(e).__name__}"))
        print(f"✗ Invalid chart type - Wrong error: {type(e).__name__}")
    
    # Test 2: Chart without birth data
    try:
        api2 = AstroChartAPI()
        chart = api2.get_chart('D1')  # No birth data set
        results.append(("No birth data", "FAIL", "Should have raised error"))
        print("✗ No birth data - Should have raised error")
    except ValueError as e:
        results.append(("No birth data", "PASS", "Correctly raised ValueError"))
        print("✓ No birth data - Correctly raised ValueError")
    except Exception as e:
        results.append(("No birth data", "FAIL", f"Wrong error type: {type(e).__name__}"))
        print(f"✗ No birth data - Wrong error: {type(e).__name__}")
    
    # Test 3: Invalid house number
    try:
        planets = api.get_planets_in_house('D1', 13)  # Invalid house
        results.append(("Invalid house number", "FAIL", "Should have raised error"))
        print("✗ Invalid house number - Should have raised error")
    except ValueError as e:
        results.append(("Invalid house number", "PASS", "Correctly raised ValueError"))
        print("✓ Invalid house number - Correctly raised ValueError")
    except Exception as e:
        results.append(("Invalid house number", "FAIL", f"Wrong error type: {type(e).__name__}"))
        print(f"✗ Invalid house number - Wrong error: {type(e).__name__}")
    
    # Test 4: Non-existent planet
    try:
        planet = api.get_planet_in_house('D1', 'NonExistentPlanet')
        if planet is None:
            results.append(("Non-existent planet", "PASS", "Correctly returned None"))
            print("✓ Non-existent planet - Correctly returned None")
        else:
            results.append(("Non-existent planet", "FAIL", "Should have returned None"))
            print("✗ Non-existent planet - Should have returned None")
    except Exception as e:
        results.append(("Non-existent planet", "FAIL", f"Raised error: {e}"))
        print(f"✗ Non-existent planet - Raised error: {e}")
    
    passed = sum(1 for _, status, _ in results if status == "PASS")
    print(f"\nResults: {passed}/{len(results)} edge case tests passed")
    
    return results


def test_different_chart_methods():
    """Test different calculation methods for charts that support them"""
    print("\n" + "=" * 80)
    print("TEST 6: Testing Different Chart Calculation Methods")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    api.set_birth_data(
        name="Method Test",
        place_name="Chennai,IN",
        latitude=13.0827,
        longitude=80.2707,
        timezone_offset=5.5,
        year=1990,
        month=6,
        day=15,
        hour=10,
        minute=30
    )
    
    # Test D9 with different methods
    charts_to_test = [
        ('D9', 1, 'Traditional Parasara'),
        ('D9', 2, 'Parasara with even sign reversal'),
        ('D2', 1, 'Parasara with parivritti'),
        ('D2', 2, 'Traditional Parasara'),
    ]
    
    results = []
    
    for chart_type, method, description in charts_to_test:
        try:
            chart = api.get_chart(chart_type, chart_method=method)
            assert chart is not None
            assert len(chart['planets']) > 0
            results.append((f"{chart_type} method {method}", "PASS", description))
            print(f"✓ {chart_type} method {method} ({description}) - OK")
        except Exception as e:
            results.append((f"{chart_type} method {method}", "FAIL", str(e)))
            print(f"✗ {chart_type} method {method} - FAILED: {e}")
    
    passed = sum(1 for _, status, _ in results if status == "PASS")
    print(f"\nResults: {passed}/{len(charts_to_test)} method tests passed")
    
    return results


def test_pyjhora_low_level_drik():
    """Test PyJHora's low-level drik (astronomical calculation) functions"""
    print("\n" + "=" * 80)
    print("TEST 7: Testing PyJHora Low-Level Drik Functions")
    print("=" * 80)
    
    results = []
    
    # Test 1: Date creation
    try:
        birth_date = drik.Date(1990, 6, 15)
        assert birth_date.year == 1990
        assert birth_date.month == 6
        assert birth_date.day == 15
        results.append(("drik.Date creation", "PASS", None))
        print("✓ drik.Date() - OK")
    except Exception as e:
        results.append(("drik.Date creation", "FAIL", str(e)))
        print(f"✗ drik.Date() - FAILED: {e}")
    
    # Test 2: Place creation
    try:
        place = drik.Place("Chennai,IN", 13.0827, 80.2707, 5.5)
        assert place.Place == "Chennai,IN"
        assert place.latitude == 13.0827
        assert place.longitude == 80.2707
        assert place.timezone == 5.5
        results.append(("drik.Place creation", "PASS", None))
        print("✓ drik.Place() - OK")
    except Exception as e:
        results.append(("drik.Place creation", "FAIL", str(e)))
        print(f"✗ drik.Place() - FAILED: {e}")
    
    # Test 3: Julian Day calculation (utils function)
    try:
        jd = utils.julian_day_number(drik.Date(1990, 6, 15), (10, 30, 0))
        assert jd > 0
        assert isinstance(jd, (int, float))
        results.append(("utils.julian_day_number", "PASS", None))
        print("✓ utils.julian_day_number() - OK")
    except Exception as e:
        results.append(("utils.julian_day_number", "FAIL", str(e)))
        print(f"✗ utils.julian_day_number() - FAILED: {e}")
    
    # Test 4: Dhasavarga (divisional chart positions)
    try:
        jd = utils.julian_day_number(drik.Date(1990, 6, 15), (10, 30, 0))
        place = drik.Place("Chennai,IN", 13.0827, 80.2707, 5.5)
        positions = drik.dhasavarga(jd, place, divisional_chart_factor=1)
        assert len(positions) > 0
        assert isinstance(positions, list)
        results.append(("drik.dhasavarga", "PASS", None))
        print("✓ drik.dhasavarga() - OK")
    except Exception as e:
        results.append(("drik.dhasavarga", "FAIL", str(e)))
        print(f"✗ drik.dhasavarga() - FAILED: {e}")
    
    # Test 5: Ascendant calculation
    try:
        jd = utils.julian_day_number(drik.Date(1990, 6, 15), (10, 30, 0))
        place = drik.Place("Chennai,IN", 13.0827, 80.2707, 5.5)
        asc = drik.ascendant(jd, place)
        assert isinstance(asc, tuple)
        assert len(asc) == 2  # (rasi, longitude)
        results.append(("drik.ascendant", "PASS", None))
        print("✓ drik.ascendant() - OK")
    except Exception as e:
        results.append(("drik.ascendant", "FAIL", str(e)))
        print(f"✗ drik.ascendant() - FAILED: {e}")
    
    passed = sum(1 for _, status, _ in results if status == "PASS")
    print(f"\nResults: {passed}/{len(results)} drik functions passed")
    
    return results


def test_pyjhora_low_level_charts():
    """Test PyJHora's low-level chart calculation functions"""
    print("\n" + "=" * 80)
    print("TEST 8: Testing PyJHora Low-Level Chart Functions")
    print("=" * 80)
    
    results = []
    
    # Setup test data
    jd = utils.julian_day_number(drik.Date(1990, 6, 15), (10, 30, 0))
    place = drik.Place("Chennai,IN", 13.0827, 80.2707, 5.5)
    
    # Test 1: Rasi chart (D1)
    try:
        d1 = charts.rasi_chart(jd, place)
        assert len(d1) > 0
        assert d1[0][0] == 'L'  # First element should be Lagna
        results.append(("charts.rasi_chart (D1)", "PASS", None))
        print("✓ charts.rasi_chart() - OK")
    except Exception as e:
        results.append(("charts.rasi_chart (D1)", "FAIL", str(e)))
        print(f"✗ charts.rasi_chart() - FAILED: {e}")
    
    # Test 2: Navamsa chart (D9)
    try:
        d1_positions = charts.rasi_chart(jd, place)
        d9 = charts.navamsa_chart(d1_positions)
        assert len(d9) > 0
        results.append(("charts.navamsa_chart (D9)", "PASS", None))
        print("✓ charts.navamsa_chart() - OK")
    except Exception as e:
        results.append(("charts.navamsa_chart (D9)", "FAIL", str(e)))
        print(f"✗ charts.navamsa_chart() - FAILED: {e}")
    
    # Test 3: Dasamsa chart (D10)
    try:
        d1_positions = charts.rasi_chart(jd, place)
        d10 = charts.dasamsa_chart(d1_positions)
        assert len(d10) > 0
        results.append(("charts.dasamsa_chart (D10)", "PASS", None))
        print("✓ charts.dasamsa_chart() - OK")
    except Exception as e:
        results.append(("charts.dasamsa_chart (D10)", "FAIL", str(e)))
        print(f"✗ charts.dasamsa_chart() - FAILED: {e}")
    
    # Test 4: Generic divisional_chart function
    try:
        for factor in [1, 2, 3, 4, 7, 9, 10, 12]:
            chart = charts.divisional_chart(jd, place, divisional_chart_factor=factor)
            assert len(chart) > 0
        results.append(("charts.divisional_chart (multiple)", "PASS", None))
        print("✓ charts.divisional_chart() - OK (tested D1,D2,D3,D4,D7,D9,D10,D12)")
    except Exception as e:
        results.append(("charts.divisional_chart (multiple)", "FAIL", str(e)))
        print(f"✗ charts.divisional_chart() - FAILED: {e}")
    
    passed = sum(1 for _, status, _ in results if status == "PASS")
    print(f"\nResults: {passed}/{len(results)} chart functions passed")
    
    return results


def test_pyjhora_low_level_utils():
    """Test PyJHora's low-level utility functions"""
    print("\n" + "=" * 80)
    print("TEST 9: Testing PyJHora Low-Level Utils Functions")
    print("=" * 80)
    
    results = []
    
    # Test 1: Julian day number calculation
    try:
        jd = utils.julian_day_number(drik.Date(1990, 6, 15), (10, 30, 0))
        assert jd > 0
        results.append(("utils.julian_day_number", "PASS", None))
        print("✓ utils.julian_day_number() - OK")
    except Exception as e:
        results.append(("utils.julian_day_number", "FAIL", str(e)))
        print(f"✗ utils.julian_day_number() - FAILED: {e}")
    
    # Test 2: DMS conversion
    try:
        dms = utils.to_dms(23.5, as_string=True, is_lat_long='plong')
        assert isinstance(dms, str)
        assert '23' in dms
        results.append(("utils.to_dms", "PASS", None))
        print("✓ utils.to_dms() - OK")
    except Exception as e:
        results.append(("utils.to_dms", "FAIL", str(e)))
        print(f"✗ utils.to_dms() - FAILED: {e}")
    
    # Test 3: From DMS conversion
    try:
        degrees = utils.from_dms(23, 30, 0)
        assert abs(degrees - 23.5) < 0.01
        results.append(("utils.from_dms", "PASS", None))
        print("✓ utils.from_dms() - OK")
    except Exception as e:
        results.append(("utils.from_dms", "FAIL", str(e)))
        print(f"✗ utils.from_dms() - FAILED: {e}")
    
    # Test 4: Language resources loaded
    try:
        assert hasattr(utils, 'RAASI_LIST')
        assert hasattr(utils, 'PLANET_NAMES')
        assert len(utils.RAASI_LIST) == 12
        assert len(utils.PLANET_NAMES) > 0
        results.append(("utils language resources", "PASS", None))
        print("✓ utils language resources - OK")
    except Exception as e:
        results.append(("utils language resources", "FAIL", str(e)))
        print(f"✗ utils language resources - FAILED: {e}")
    
    passed = sum(1 for _, status, _ in results if status == "PASS")
    print(f"\nResults: {passed}/{len(results)} utils functions passed")
    
    return results


def test_pyjhora_horoscope_class():
    """Test PyJHora's Horoscope class"""
    print("\n" + "=" * 80)
    print("TEST 10: Testing PyJHora Horoscope Class")
    print("=" * 80)
    
    results = []
    
    # Test 1: Horoscope instantiation
    try:
        horo = main.Horoscope(
            place_with_country_code="Chennai,IN",
            latitude=13.0827,
            longitude=80.2707,
            timezone_offset=5.5,
            date_in=drik.Date(1990, 6, 15),
            birth_time="10:30:00",
            calculation_type='drik',
            language='en'
        )
        assert horo is not None
        results.append(("Horoscope instantiation", "PASS", None))
        print("✓ Horoscope() instantiation - OK")
    except Exception as e:
        results.append(("Horoscope instantiation", "FAIL", str(e)))
        print(f"✗ Horoscope() instantiation - FAILED: {e}")
        return results  # Can't continue if instantiation fails
    
    # Test 2: Get chart information for D1
    try:
        info, chart_data, asc_house = horo.get_horoscope_information_for_chart(
            chart_index=0,  # D1
            chart_method=1
        )
        assert info is not None
        assert isinstance(asc_house, int)
        results.append(("Horoscope.get_horoscope_information_for_chart D1", "PASS", None))
        print("✓ Horoscope.get_horoscope_information_for_chart(D1) - OK")
    except Exception as e:
        results.append(("Horoscope.get_horoscope_information_for_chart D1", "FAIL", str(e)))
        print(f"✗ Horoscope.get_horoscope_information_for_chart(D1) - FAILED: {e}")
    
    # Test 3: Get chart information for D9
    try:
        info, chart_data, asc_house = horo.get_horoscope_information_for_chart(
            chart_index=8,  # D9 (index 8 in const.division_chart_factors)
            chart_method=1
        )
        assert info is not None
        results.append(("Horoscope.get_horoscope_information_for_chart D9", "PASS", None))
        print("✓ Horoscope.get_horoscope_information_for_chart(D9) - OK")
    except Exception as e:
        results.append(("Horoscope.get_horoscope_information_for_chart D9", "FAIL", str(e)))
        print(f"✗ Horoscope.get_horoscope_information_for_chart(D9) - FAILED: {e}")
    
    passed = sum(1 for _, status, _ in results if status == "PASS")
    print(f"\nResults: {passed}/{len(results)} Horoscope class tests passed")
    
    return results


def run_all_tests():
    """Run all comprehensive tests"""
    print("\n" + "=" * 80)
    print("COMPREHENSIVE TESTING - API WRAPPER + PYJHORA LOW-LEVEL FUNCTIONS")
    print("Testing wrapper API methods AND PyJHora core functions")
    print("=" * 80 + "\n")
    
    all_results = {}
    
    # Run wrapper API test suites
    print("\n" + "=" * 80)
    print("PART A: WRAPPER API TESTS")
    print("=" * 80)
    all_results['chart_types'] = test_all_chart_types()
    all_results['api_methods'] = test_all_api_methods()
    all_results['planets'] = test_all_planets()
    all_results['data_structure'] = test_chart_data_structure()
    all_results['edge_cases'] = test_edge_cases()
    all_results['chart_methods'] = test_different_chart_methods()
    
    # Run PyJHora low-level function tests
    print("\n" + "=" * 80)
    print("PART B: PYJHORA LOW-LEVEL FUNCTION TESTS")
    print("=" * 80)
    all_results['pyjhora_drik'] = test_pyjhora_low_level_drik()
    all_results['pyjhora_charts'] = test_pyjhora_low_level_charts()
    all_results['pyjhora_utils'] = test_pyjhora_low_level_utils()
    all_results['pyjhora_horoscope'] = test_pyjhora_horoscope_class()
    
    # Final summary
    print("\n" + "=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    
    total_tests = 0
    total_passed = 0
    
    print("\nPART A: WRAPPER API TESTS")
    print("-" * 80)
    
    # Chart types
    chart_passed = len(all_results['chart_types']['passed'])
    chart_total = chart_passed + len(all_results['chart_types']['failed'])
    total_tests += chart_total
    total_passed += chart_passed
    print(f"Chart Types:      {chart_passed:2d}/{chart_total:2d} passed")
    
    # API methods
    method_passed = sum(1 for _, status, _ in all_results['api_methods'] if status == "PASS")
    method_total = len(all_results['api_methods'])
    total_tests += method_total
    total_passed += method_passed
    print(f"API Methods:      {method_passed:2d}/{method_total:2d} passed")
    
    # Planets
    planet_passed = sum(1 for _, status, _ in all_results['planets'] if status == "FOUND")
    planet_total = len(all_results['planets'])
    total_tests += planet_total
    total_passed += planet_passed
    print(f"Planet Retrieval: {planet_passed:2d}/{planet_total:2d} passed")
    
    # Data structure
    struct_passed = sum(1 for _, status, _ in all_results['data_structure'] if status == "PASS")
    struct_total = len(all_results['data_structure'])
    total_tests += struct_total
    total_passed += struct_passed
    print(f"Data Structure:   {struct_passed:2d}/{struct_total:2d} passed")
    
    # Edge cases
    edge_passed = sum(1 for _, status, _ in all_results['edge_cases'] if status == "PASS")
    edge_total = len(all_results['edge_cases'])
    total_tests += edge_total
    total_passed += edge_passed
    print(f"Edge Cases:       {edge_passed:2d}/{edge_total:2d} passed")
    
    # Chart methods
    cmethod_passed = sum(1 for _, status, _ in all_results['chart_methods'] if status == "PASS")
    cmethod_total = len(all_results['chart_methods'])
    total_tests += cmethod_total
    total_passed += cmethod_passed
    print(f"Chart Methods:    {cmethod_passed:2d}/{cmethod_total:2d} passed")
    
    print("\nPART B: PYJHORA LOW-LEVEL FUNCTION TESTS")
    print("-" * 80)
    
    # PyJHora drik functions
    drik_passed = sum(1 for _, status, _ in all_results['pyjhora_drik'] if status == "PASS")
    drik_total = len(all_results['pyjhora_drik'])
    total_tests += drik_total
    total_passed += drik_passed
    print(f"Drik Functions:   {drik_passed:2d}/{drik_total:2d} passed")
    
    # PyJHora chart functions
    pcharts_passed = sum(1 for _, status, _ in all_results['pyjhora_charts'] if status == "PASS")
    pcharts_total = len(all_results['pyjhora_charts'])
    total_tests += pcharts_total
    total_passed += pcharts_passed
    print(f"Chart Functions:  {pcharts_passed:2d}/{pcharts_total:2d} passed")
    
    # PyJHora utils functions
    putils_passed = sum(1 for _, status, _ in all_results['pyjhora_utils'] if status == "PASS")
    putils_total = len(all_results['pyjhora_utils'])
    total_tests += putils_total
    total_passed += putils_passed
    print(f"Utils Functions:  {putils_passed:2d}/{putils_total:2d} passed")
    
    # PyJHora Horoscope class
    phoro_passed = sum(1 for _, status, _ in all_results['pyjhora_horoscope'] if status == "PASS")
    phoro_total = len(all_results['pyjhora_horoscope'])
    total_tests += phoro_total
    total_passed += phoro_passed
    print(f"Horoscope Class:  {phoro_passed:2d}/{phoro_total:2d} passed")
    
    print("=" * 80)
    print(f"TOTAL:            {total_passed:2d}/{total_tests:2d} passed ({100*total_passed//total_tests}%)")
    print("=" * 80)
    
    if total_passed == total_tests:
        print("\n🎉 ALL TESTS PASSED! Wrapper API and PyJHora core functions are fully functional.")
    else:
        print(f"\n⚠️  {total_tests - total_passed} test(s) failed. Review output above.")
    
    return all_results


if __name__ == "__main__":
    run_all_tests()
