#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Comprehensive API Testing - Test ALL available methods and chart types
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'PyJHora'))

from astro_chart_api import AstroChartAPI
from jhora import utils

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


def run_all_tests():
    """Run all comprehensive tests"""
    print("\n" + "=" * 80)
    print("COMPREHENSIVE API TESTING")
    print("Testing ALL methods, ALL chart types, and edge cases")
    print("=" * 80 + "\n")
    
    all_results = {}
    
    # Run all test suites
    all_results['chart_types'] = test_all_chart_types()
    all_results['api_methods'] = test_all_api_methods()
    all_results['planets'] = test_all_planets()
    all_results['data_structure'] = test_chart_data_structure()
    all_results['edge_cases'] = test_edge_cases()
    all_results['chart_methods'] = test_different_chart_methods()
    
    # Final summary
    print("\n" + "=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    
    total_tests = 0
    total_passed = 0
    
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
    
    print("-" * 80)
    print(f"TOTAL:            {total_passed:2d}/{total_tests:2d} passed ({100*total_passed//total_tests}%)")
    print("=" * 80)
    
    if total_passed == total_tests:
        print("\n🎉 ALL TESTS PASSED! API is fully functional.")
    else:
        print(f"\n⚠️  {total_tests - total_passed} test(s) failed. Review output above.")
    
    return all_results


if __name__ == "__main__":
    run_all_tests()
