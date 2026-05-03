"""
Test palmistry with real hand images - Compare left and right hands
"""
import os
import json
import base64
from pathlib import Path
from gemini_vision_service import GeminiVisionService

def load_image(image_path):
    """Load and encode image to base64"""
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return None
    
    file_size = os.path.getsize(image_path)
    print(f"✓ Found image: {os.path.basename(image_path)} ({file_size} bytes)")
    
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    print(f"  Encoded to base64: {len(image_data)} chars")
    return image_data

def analyze_hand(service, left_image, right_image, handedness, label):
    """Analyze a hand pair"""
    print(f"\n{'='*80}")
    print(f"ANALYZING: {label}")
    print(f"{'='*80}")
    
    try:
        print(f"\n[1] Sending images to Gemini...")
        print(f"    Left image: {len(left_image)} chars")
        print(f"    Right image: {len(right_image)} chars")
        print(f"    Handedness: {handedness}")
        
        result = service.analyze_palm_images(left_image, right_image, handedness)
        
        print(f"\n[2] ✓ Analysis complete!")
        print(f"    Response size: {len(json.dumps(result))} chars")
        
        # Display results
        print(f"\n[3] Results:")
        print(f"    Hand Type: {result.get('hand_type')}")
        print(f"    Elemental Type: {result.get('elemental_type')}")
        print(f"    Palm Shape: {result.get('palm_shape')}")
        print(f"    Finger Length: {result.get('finger_length')}")
        
        print(f"\n    Overall Reading:")
        overall = result.get('overall_reading', '')
        print(f"    {overall[:300]}...")
        
        print(f"\n    Life Areas Scores:")
        for area, data in result.get('life_areas', {}).items():
            score = data.get('score', 0)
            title = data.get('title', area)
            print(f"      {title}: {score}/100")
        
        print(f"\n    Major Lines:")
        for line_name, line_data in result.get('major_lines', {}).items():
            strength = line_data.get('strength', 'unknown')
            desc = line_data.get('description', '')[:60]
            print(f"      {line_name}: {strength} - {desc}...")
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def compare_results(result1, result2, label1, label2):
    """Compare two analysis results"""
    print(f"\n{'='*80}")
    print(f"COMPARISON: {label1} vs {label2}")
    print(f"{'='*80}")
    
    if not result1 or not result2:
        print("❌ Cannot compare - one or both results are missing")
        return
    
    differences = []
    similarities = []
    
    # Compare hand types
    hand_type_1 = result1.get('hand_type', '')
    hand_type_2 = result2.get('hand_type', '')
    if hand_type_1 != hand_type_2:
        differences.append(f"Hand Type: '{hand_type_1}' vs '{hand_type_2}'")
    else:
        similarities.append(f"Hand Type: Both '{hand_type_1}'")
    
    # Compare elemental types
    elem_1 = result1.get('elemental_type', '')
    elem_2 = result2.get('elemental_type', '')
    if elem_1 != elem_2:
        differences.append(f"Elemental Type: '{elem_1}' vs '{elem_2}'")
    else:
        similarities.append(f"Elemental Type: Both '{elem_1}'")
    
    # Compare palm shapes
    shape_1 = result1.get('palm_shape', '')
    shape_2 = result2.get('palm_shape', '')
    if shape_1 != shape_2:
        differences.append(f"Palm Shape: '{shape_1}' vs '{shape_2}'")
    else:
        similarities.append(f"Palm Shape: Both '{shape_1}'")
    
    # Compare finger lengths
    finger_1 = result1.get('finger_length', '')
    finger_2 = result2.get('finger_length', '')
    if finger_1 != finger_2:
        differences.append(f"Finger Length: '{finger_1}' vs '{finger_2}'")
    else:
        similarities.append(f"Finger Length: Both '{finger_1}'")
    
    # Compare life areas scores
    areas_1 = result1.get('life_areas', {})
    areas_2 = result2.get('life_areas', {})
    score_diffs = []
    for area in ['love', 'career', 'health', 'wealth']:
        score1 = areas_1.get(area, {}).get('score', 0)
        score2 = areas_2.get(area, {}).get('score', 0)
        if score1 != score2:
            score_diffs.append(f"{area}: {score1} vs {score2}")
    
    if score_diffs:
        differences.append(f"Life Areas Scores:\n      " + "\n      ".join(score_diffs))
    
    # Compare overall readings
    overall_1 = result1.get('overall_reading', '')[:100]
    overall_2 = result2.get('overall_reading', '')[:100]
    if overall_1 != overall_2:
        differences.append(f"Overall Reading: Different")
    else:
        similarities.append(f"Overall Reading: Same")
    
    # Print results
    print(f"\n✓ DIFFERENCES FOUND:")
    if differences:
        for diff in differences:
            print(f"  • {diff}")
    else:
        print(f"  None - Results are identical")
    
    print(f"\n✓ SIMILARITIES:")
    if similarities:
        for sim in similarities:
            print(f"  • {sim}")
    else:
        print(f"  None - Results are completely different")
    
    # Verdict
    print(f"\n{'='*80}")
    if differences:
        print("✅ VERDICT: Images ARE being analyzed differently by Gemini")
        print("   The system is working correctly!")
    else:
        print("⚠️  VERDICT: Results are too similar")
        print("   Possible issues:")
        print("   - Images might be very similar")
        print("   - Gemini might not be analyzing images properly")
        print("   - Image quality might be too low")
    print(f"{'='*80}")

def main():
    print("\n" + "="*80)
    print("PALMISTRY TEST WITH REAL HAND IMAGES")
    print("="*80)
    
    # Find hand images
    print("\n[STEP 1] Looking for hand images...")
    
    # Try to find images in the backend directory
    image_dir = Path("e:\\25. Codes\\17. AstroAI V3\\AstroAi\\backend\\users\\BmPzeVj6IGO32lvVUAabr6FPcl03\\palmistry\\palmistry-1777758770")
    
    if not image_dir.exists():
        print(f"❌ Image directory not found: {image_dir}")
        print("\nPlease provide the path to your hand images")
        return
    
    left_hand_path = image_dir / "left_hand.jpg"
    right_hand_path = image_dir / "right_hand.jpg"
    
    # Load images
    print("\n[STEP 2] Loading images...")
    left_image = load_image(str(left_hand_path))
    right_image = load_image(str(right_hand_path))
    
    if not left_image or not right_image:
        print("❌ Failed to load images")
        return
    
    # Initialize service
    print("\n[STEP 3] Initializing Gemini Vision Service...")
    try:
        service = GeminiVisionService()
        print("✓ Service initialized")
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Analyze right-handed person (right hand is dominant)
    print("\n[STEP 4] Analyzing as right-handed person...")
    result_right = analyze_hand(service, left_image, right_image, 'right', "Right-Handed Person")
    
    # Analyze left-handed person (left hand is dominant)
    print("\n[STEP 5] Analyzing as left-handed person...")
    result_left = analyze_hand(service, left_image, right_image, 'left', "Left-Handed Person")
    
    # Compare results
    if result_right and result_left:
        compare_results(result_right, result_left, "Right-Handed Analysis", "Left-Handed Analysis")
    
    print("\n" + "="*80)
    print("TEST COMPLETE")
    print("="*80)

if __name__ == '__main__':
    main()
