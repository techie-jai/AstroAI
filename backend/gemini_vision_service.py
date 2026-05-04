import os
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime
import google.generativeai as genai

logger = logging.getLogger(__name__)


class GeminiVisionService:
    """Service for analyzing palm images using Google Gemini Vision API"""

    def __init__(self):
        """Initialize Gemini client with API key"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            logger.error("GEMINI_API_KEY environment variable not set")
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        logger.info("Configuring Gemini API with provided API key")
        genai.configure(api_key=api_key)
        logger.info("Initializing Gemini model: gemini-2.5-flash")
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        logger.info("Gemini Vision Service initialized successfully")

    def generate_palmistry_prompt(self, handedness: str) -> str:
        """
        Generate expert palmist prompt for Gemini with comprehensive micro-features extraction
        
        Args:
            handedness: User's handedness ('left' or 'right')
            
        Returns:
            Formatted prompt for Gemini
        """
        dominant_hand = "right" if handedness == "right" else "left"
        non_dominant_hand = "left" if handedness == "right" else "right"
        
        prompt = f"""You are an expert Vedic palmist with deep knowledge of palmistry, astrology, and planetary influences on human hands.

Analyze the provided palm images with the following context:
- The user is {handedness}-handed
- DOMINANT HAND ({dominant_hand}): Shows current reality - what the user has done with their gifts and potential
- NON-DOMINANT HAND ({non_dominant_hand}): Shows potential - what the user was born with and innate gifts

CRITICAL INSTRUCTION - NO HALLUCINATION:
If a specific line, symbol, or feature (like Money Triangle, Mystic Cross, Travel Lines, Marriage Lines) is NOT clearly visible in the image, you MUST return null or an empty array. Do NOT guess or hallucinate marks. Better to show missing than to invent features that aren't there. Only include what you can clearly see.

Your analysis must be returned as PURE JSON with NO markdown formatting, NO code blocks, and NO extra text.

Analyze both hands and provide:

1. Hand Type: Classify as Air, Fire, Water, or Earth
2. Elemental Type: Air, Fire, Water, or Earth
3. Palm Shape: Square or Rectangular
4. Finger Length: Long or Short
5. Major Lines Analysis (Heart, Head, Life, Fate, Sun):
   - For each: name, description, meaning, strength (strong/moderate/faint)
   
6. MINOR LINES ANALYSIS (CRITICAL - Look carefully):
   a) Marriage Lines (Affection lines on ulnar edge below Mercury finger):
      - Count: number of lines
      - Depth: deep, moderate, or faint
      - Forks: number of forks
      - Downward curves: number (indicates divorce/heartbreak)
      - Description: detailed description
   b) Children Lines (Vertical lines above marriage lines):
      - Count: number of lines
      - Clarity: clear, faint, or broken
      - Description: detailed description
   c) Travel Lines (Horizontal lines on Mount of Moon):
      - Presence: true/false
      - Depth: deep, moderate, or faint
      - Description: detailed description
   d) Intuition Line (Curve on percussion edge - outer palm edge):
      - Presence: true/false
      - Description: detailed description

7. MONEY TRIANGLE (Formed by Fate, Head, and Mercury lines):
   - Presence: true/false (only if clearly visible)
   - Status: "closed" (wealth retention) or "open" (wealth loss)
   - Description: detailed description

8. AGE MARKERS ON MAJOR LINES (CRITICAL - Estimate ages):
   For Life Line, Fate Line, and Head Line, identify:
   - Breaks: gaps in the line
   - Islands: oval formations on the line
   - Crosses: cross marks on the line
   - Forks: line splits
   For each event, provide:
   - Age range (e.g., "25-28", "35-40") using 0-100 scale on line length
   - Event type: break, island, cross, fork, etc.
   - Meaning: what this event indicates
   Return as: "age_events": {{"life_line": [...], "fate_line": [...], "head_line": [...]}}

9. SPECIAL SYMBOLS (Search for ALL of these - only include if clearly visible):
   - Mystic Cross (between Heart and Head lines)
   - Letter M (formed by major lines)
   - Fish symbol (on Mount of Mercury)
   - Star (on any mount, especially Jupiter/Apollo)
   - Grilles (on any mount)
   - Islands (on any line)
   - Squares (protection marks on any line/mount)
   - Triangle (on any mount)
   - Trident (on any line)
   - Circle (rare, on any mount)
   - Plus/Cross marks (on any location)
   - Chains (on any line)
   - Branches (on any line)
   - Bars (crossing lines)
   - Dots (on any line)
   - Tassels (line endings)
   - Spirals (on any mount)
   - Waves (on any line)
   - Rings (on any finger)
   For each symbol found, provide: symbol name, location, meaning

10. BRACELET LINES (Rascettes - at wrist):
    - Count: number of individual lines (typically 1-4)
    - For each line: line number, clarity (clear/faint/broken), curved (upward/downward), health assessment
    - Overall health assessment based on bracelet lines

11. Planetary Mounts (Jupiter, Saturn, Apollo/Sun, Mercury, Venus, Moon):
    - For each mount: name, planet, description, prominence (prominent/normal/flat)

12. Finger Gaps: Note any significant gaps between fingers

13. Life Areas Scores (0-100):
    - Love & Relationships
    - Career & Ambition
    - Health & Vitality
    - Wealth & Prosperity

14. Dominant Hand Analysis: Summary of current reality

15. Non-Dominant Hand Analysis: Summary of potential

16. Overall Reading: Comprehensive summary combining both hands' insights

17. TOP 20 QUESTIONS ANSWERS (Generate brief answers based on palmistry analysis):
    - marriage_age: When will I get married?
    - marriage_type: Love marriage or arranged?
    - relationships_count: How many serious relationships?
    - divorce_risk: Will I face divorce/heartbreak?
    - children_count: How many children?
    - career_path: Best career path?
    - career_success_age: When will I achieve career success?
    - wealth_potential: Will I be wealthy/millionaire?
    - sudden_wealth: Chances of sudden wealth?
    - bankruptcy_risk: Will I face bankruptcy?
    - foreign_settlement: Will I settle abroad?
    - travel_frequency: Will I travel extensively?
    - property_ownership: Will I own real estate?
    - lifespan: How long is my lifespan?
    - health_issues: Major health issues?
    - mental_health: Mental health and stability?
    - fame_potential: Will I attain fame?
    - special_signs: Lucky/rare signs?
    - legal_troubles: Legal troubles or enemies?
    - intuition_spirituality: Strong intuition/spiritual awakening?

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{{
  "hand_type": "Air (Intellectual, Communicative)",
  "elemental_type": "Air",
  "palm_shape": "Square",
  "finger_length": "Long",
  "major_lines": {{
    "heart_line": {{"name": "Heart Line", "description": "...", "meaning": "...", "strength": "strong"}},
    "head_line": {{"name": "Head Line", "description": "...", "meaning": "...", "strength": "strong"}},
    "life_line": {{"name": "Life Line", "description": "...", "meaning": "...", "strength": "moderate"}},
    "fate_line": {{"name": "Fate Line", "description": "...", "meaning": "...", "strength": "moderate"}},
    "sun_line": {{"name": "Sun Line", "description": "...", "meaning": "...", "strength": "faint"}}
  }},
  "minor_lines": {{
    "marriage_lines": {{"count": 2, "depth": "moderate", "forks": 1, "downward_curves": 0, "description": "..."}},
    "children_lines": {{"count": 3, "clarity": "clear", "description": "..."}},
    "travel_lines": {{"presence": true, "depth": "faint", "description": "..."}},
    "intuition_line": {{"presence": true, "description": "..."}}
  }},
  "money_triangle": {{"presence": true, "status": "closed", "description": "..."}},
  "age_events": {{
    "life_line": [{{"age_range": "25-28", "event_type": "break", "meaning": "..."}}],
    "fate_line": [],
    "head_line": []
  }},
  "special_symbols": [{{"symbol": "Mystic Cross", "location": "Between Heart and Head lines", "meaning": "..."}}],
  "bracelet_lines": [{{"line_number": 1, "clarity": "clear", "curved": false, "health_assessment": "good"}}],
  "mounts": {{
    "jupiter": {{"name": "Mount of Jupiter", "planet": "Jupiter", "description": "...", "prominence": "prominent"}},
    "saturn": {{"name": "Mount of Saturn", "planet": "Saturn", "description": "...", "prominence": "normal"}},
    "apollo": {{"name": "Mount of Apollo", "planet": "Sun", "description": "...", "prominence": "normal"}},
    "mercury": {{"name": "Mount of Mercury", "planet": "Mercury", "description": "...", "prominence": "prominent"}},
    "venus": {{"name": "Mount of Venus", "planet": "Venus", "description": "...", "prominence": "normal"}},
    "moon": {{"name": "Mount of Moon", "planet": "Moon", "description": "...", "prominence": "normal"}}
  }},
  "finger_gaps": "...",
  "life_areas": {{
    "love": {{"title": "Love & Relationships", "score": 85, "description": "..."}},
    "career": {{"title": "Career & Ambition", "score": 78, "description": "..."}},
    "health": {{"title": "Health & Vitality", "score": 72, "description": "..."}},
    "wealth": {{"title": "Wealth & Prosperity", "score": 68, "description": "..."}}
  }},
  "dominant_hand_analysis": {{"description": "Current reality - what you have done with your gifts", "summary": "..."}},
  "non_dominant_hand_analysis": {{"description": "Potential - what you were born with", "summary": "..."}},
  "overall_reading": "...",
  "top_20_answers": {{
    "marriage_age": "Around 28-32 based on marriage lines",
    "marriage_type": "Likely love marriage based on heart line",
    "relationships_count": "2-3 serious relationships",
    "divorce_risk": "Low based on stable marriage lines",
    "children_count": "2-3 children",
    "career_path": "Business or entrepreneurship recommended",
    "career_success_age": "Around 32-35",
    "wealth_potential": "Good potential for prosperity",
    "sudden_wealth": "Possible through inheritance or business",
    "bankruptcy_risk": "Low risk, stable financial indicators",
    "foreign_settlement": "Likely to settle abroad",
    "travel_frequency": "Extensive travel for work and leisure",
    "property_ownership": "Yes, will own real estate",
    "lifespan": "Long and healthy life expected (75-85 years)",
    "health_issues": "Possible minor health concerns around 45-50",
    "mental_health": "Strong mental stability and focus",
    "fame_potential": "Moderate potential for recognition",
    "special_signs": "Mystic Cross present - spiritual awareness",
    "legal_troubles": "Low risk of legal issues",
    "intuition_spirituality": "Strong intuition and spiritual inclination"
  }}
}}

CRITICAL: Return ONLY the JSON object, no markdown, no code blocks, no extra text."""
        
        return prompt

    def analyze_palm_images(self, left_hand_base64: str, right_hand_base64: str, handedness: str) -> Dict[str, Any]:
        """
        Analyze palm images using Gemini Vision API
        
        Args:
            left_hand_base64: Base64 encoded left hand image
            right_hand_base64: Base64 encoded right hand image
            handedness: User's handedness ('left' or 'right')
            
        Returns:
            Parsed JSON response with palmistry analysis
            
        Raises:
            ValueError: If API response is invalid or cannot be parsed
        """
        try:
            prompt = self.generate_palmistry_prompt(handedness)
            
            logger.info(f"Starting palm image analysis for {handedness}-handed user")
            print(f"[GEMINI_VISION] Starting analysis for {handedness}-handed user")
            
            # Log image sizes for verification
            print(f"[GEMINI_VISION] Left hand image size: {len(left_hand_base64)} chars")
            print(f"[GEMINI_VISION] Right hand image size: {len(right_hand_base64)} chars")
            logger.info(f"Left hand image size: {len(left_hand_base64)} chars")
            logger.info(f"Right hand image size: {len(right_hand_base64)} chars")
            
            # Prepare image parts
            left_image_data = left_hand_base64.split(',')[-1] if ',' in left_hand_base64 else left_hand_base64
            right_image_data = right_hand_base64.split(',')[-1] if ',' in right_hand_base64 else right_hand_base64
            
            print(f"[GEMINI_VISION] Cleaned left image size: {len(left_image_data)} chars")
            print(f"[GEMINI_VISION] Cleaned right image size: {len(right_image_data)} chars")
            
            left_image_part = {
                "mime_type": "image/jpeg",
                "data": left_image_data
            }
            
            right_image_part = {
                "mime_type": "image/jpeg",
                "data": right_image_data
            }
            
            logger.info("Calling Gemini Vision API...")
            print(f"[GEMINI_VISION] Calling Gemini Vision API with images...")
            
            # Call Gemini - response_mime_type not supported in this version
            # The prompt itself instructs Gemini to return JSON
            logger.info("Calling Gemini with vision analysis prompt...")
            print(f"[GEMINI_VISION] Sending request to Gemini model: gemini-2.5-flash")
            
            response = self.model.generate_content(
                [
                    "Analyze these two palm images:\n\nLeft Hand:",
                    left_image_part,
                    "\n\nRight Hand:",
                    right_image_part,
                    f"\n\n{prompt}"
                ]
            )
            logger.info("Successfully called Gemini API")
            print(f"[GEMINI_VISION] ✓ Successfully called Gemini API")
            
            if not response:
                raise ValueError("No response from Gemini API")
            
            logger.info(f"Received response from Gemini, length: {len(response.text)}")
            print(f"[GEMINI_VISION] Received response from Gemini, length: {len(response.text)} chars")
            
            # Parse response
            response_text = response.text.strip()
            logger.info(f"Raw response (first 500 chars): {response_text[:500]}")
            print(f"[GEMINI_VISION] Raw response (first 500 chars): {response_text[:500]}")
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            logger.info(f"Cleaned response (first 500 chars): {response_text[:500]}")
            print(f"[GEMINI_VISION] Cleaned response (first 500 chars): {response_text[:500]}")
            
            # Parse JSON
            analysis_data = json.loads(response_text)
            
            logger.info(f"Successfully parsed JSON and analyzed palm images for {handedness}-handed user")
            print(f"[GEMINI_VISION] ✓ Successfully parsed JSON response")
            print(f"[GEMINI_VISION] Response keys: {list(analysis_data.keys())}")
            
            return analysis_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response as JSON: {e}")
            logger.error(f"Response text: {response_text if 'response_text' in locals() else 'N/A'}")
            print(f"[GEMINI_VISION] ❌ JSON Parse Error: {e}")
            print(f"[GEMINI_VISION] Response text: {response_text if 'response_text' in locals() else 'N/A'}")
            raise ValueError(f"Invalid JSON response from Gemini: {str(e)}")
        except Exception as e:
            logger.error(f"Error analyzing palm images: {str(e)}", exc_info=True)
            print(f"[GEMINI_VISION] ❌ Error: {str(e)}")
            import traceback
            print(f"[GEMINI_VISION] Traceback: {traceback.format_exc()}")
            raise ValueError(f"Failed to analyze palm images: {str(e)}")
