"""
Quick Palmistry Test - Run this to verify if Gemini is actually analyzing images
"""
import os
import json
import sys

def test_gemini_connection():
    """Test if Gemini API is accessible"""
    print("\n" + "="*80)
    print("TEST 1: GEMINI API CONNECTION")
    print("="*80)
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY not set!")
        print("   Set it with: set GEMINI_API_KEY=your_key")
        return False
    
    print(f"✓ API Key found (length: {len(api_key)})")
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Test with simple text
        response = model.generate_content("Say 'Gemini is working'")
        print(f"✓ Gemini API working: {response.text[:50]}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_image_analysis():
    """Test if Gemini can analyze images"""
    print("\n" + "="*80)
    print("TEST 2: IMAGE ANALYSIS CAPABILITY")
    print("="*80)
    
    try:
        from gemini_vision_service import GeminiVisionService
        import base64
        
        # Create minimal test image
        png_data = (
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
            b'\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01'
            b'\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        )
        test_image = base64.b64encode(png_data).decode('utf-8')
        
        print(f"✓ Test image created ({len(test_image)} chars)")
        
        service = GeminiVisionService()
        print(f"✓ GeminiVisionService initialized")
        
        # Try to analyze
        print("  Sending to Gemini...")
        result = service.analyze_palm_images(test_image, test_image, 'right')
        
        print(f"✓ Analysis succeeded!")
        print(f"  Response keys: {list(result.keys())}")
        print(f"  Hand type: {result.get('hand_type')}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def check_response_similarity():
    """Check if responses are too similar"""
    print("\n" + "="*80)
    print("TEST 3: RESPONSE SIMILARITY CHECK")
    print("="*80)
    
    print("""
To check if responses are too similar:

1. Scan two DIFFERENT hands
2. Check backend logs for:
   [GEMINI_VISION] Raw response (first 500 chars): ...
   
3. Compare the responses:
   - Are hand_type values different?
   - Are overall_reading values different?
   - Are mount descriptions different?
   - Are life_areas scores different?
   
4. If all responses are identical or very similar:
   - Images might not be different
   - Gemini might be using template response
   - Model might not be analyzing images properly
   
5. If responses are different:
   - System is working correctly
   - Differences might be subtle
   - Consider improving image quality
    """)

def main():
    print("\n" + "="*80)
    print("PALMISTRY SYSTEM QUICK TEST")
    print("="*80)
    
    # Test 1: API Connection
    if not test_gemini_connection():
        print("\n❌ Cannot proceed - Gemini API not accessible")
        return
    
    # Test 2: Image Analysis
    if not test_image_analysis():
        print("\n❌ Image analysis failed")
        return
    
    # Test 3: Response Similarity
    check_response_similarity()
    
    print("\n" + "="*80)
    print("NEXT STEPS:")
    print("="*80)
    print("""
1. Run the palmistry scan from the app
2. Watch the backend console for logs like:
   [GEMINI_VISION] Left hand image size: XXXX chars
   [GEMINI_VISION] Right hand image size: XXXX chars
   [GEMINI_VISION] Raw response (first 500 chars): ...

3. Scan two different hands and compare the responses

4. If responses are similar:
   - Check image quality (good lighting, clear palm lines)
   - Try switching to gemini-2.0-pro model
   - Simplify the prompt to be less template-driven

5. If responses are different:
   - System is working correctly
   - Results might just be subtle differences
    """)
    print("="*80)

if __name__ == '__main__':
    main()
