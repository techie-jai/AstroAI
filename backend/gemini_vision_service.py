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
        Generate expert palmist prompt for Gemini
        
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

Your analysis must be returned as PURE JSON with NO markdown formatting, NO code blocks, and NO extra text.

Analyze both hands and provide:

1. Hand Type: Classify as Air (Square palm, long fingers), Fire (Rectangular palm, short fingers), Water (Rectangular palm, long fingers), or Earth (Square palm, short fingers)
2. Elemental Type: Air, Fire, Water, or Earth
3. Palm Shape: Square or Rectangular
4. Finger Length: Long or Short (relative to palm)
5. Major Lines Analysis:
   - Heart Line: description, meaning, strength (strong/moderate/faint)
   - Head Line: description, meaning, strength
   - Life Line: description, meaning, strength
   - Fate Line: description, meaning, strength
   - Sun Line (if present): description, meaning, strength
6. Planetary Mounts (Jupiter, Saturn, Apollo/Sun, Mercury, Venus, Moon):
   - For each mount: name, planet, description, prominence (prominent/normal/flat)
7. Special Marks: List any Mystic Crosses, Tridents, Islands, or other special markings
8. Finger Gaps: Note any significant gaps between fingers
9. Life Areas Scores (0-100):
   - Love & Relationships
   - Career & Ambition
   - Health & Vitality
   - Wealth & Prosperity
10. Dominant Hand Analysis: Summary of what the dominant ({dominant_hand}) hand reveals about current reality
11. Non-Dominant Hand Analysis: Summary of what the non-dominant ({non_dominant_hand}) hand reveals about potential
12. Overall Reading: Comprehensive summary combining both hands' insights

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{{
  "hand_type": "Air (Intellectual, Communicative)",
  "elemental_type": "Air",
  "palm_shape": "Square",
  "finger_length": "Long",
  "major_lines": {{
    "heart_line": {{
      "name": "Heart Line",
      "description": "Long and curved, starting from under the index finger",
      "meaning": "Deep emotional capacity with strong romantic inclinations...",
      "strength": "strong"
    }},
    "head_line": {{
      "name": "Head Line",
      "description": "Straight and clear, extending across the palm",
      "meaning": "Analytical mind with practical thinking abilities...",
      "strength": "strong"
    }},
    "life_line": {{
      "name": "Life Line",
      "description": "Deep and curved, encircling the thumb mount",
      "meaning": "Strong vitality and enthusiasm for life...",
      "strength": "moderate"
    }},
    "fate_line": {{
      "name": "Fate Line",
      "description": "Clear line running from wrist towards middle finger",
      "meaning": "Strong sense of purpose and career direction...",
      "strength": "moderate"
    }},
    "sun_line": {{
      "name": "Sun Line",
      "description": "Faint line running parallel to fate line",
      "meaning": "Potential for recognition and success...",
      "strength": "faint"
    }}
  }},
  "mounts": {{
    "jupiter": {{
      "name": "Mount of Jupiter",
      "planet": "Jupiter",
      "description": "Located under the index finger, well-developed",
      "prominence": "prominent"
    }},
    "saturn": {{
      "name": "Mount of Saturn",
      "planet": "Saturn",
      "description": "Located under the middle finger, moderately developed",
      "prominence": "normal"
    }},
    "apollo": {{
      "name": "Mount of Apollo",
      "planet": "Sun",
      "description": "Located under the ring finger, slightly developed",
      "prominence": "normal"
    }},
    "mercury": {{
      "name": "Mount of Mercury",
      "planet": "Mercury",
      "description": "Located under the pinky finger, well-developed",
      "prominence": "prominent"
    }},
    "venus": {{
      "name": "Mount of Venus",
      "planet": "Venus",
      "description": "Located at base of thumb, moderately developed",
      "prominence": "normal"
    }},
    "moon": {{
      "name": "Mount of Moon",
      "planet": "Moon",
      "description": "Located opposite Venus, slightly developed",
      "prominence": "normal"
    }}
  }},
  "special_marks": ["Mystic Cross"],
  "finger_gaps": "Wide gap between index and middle finger indicating independent thinking",
  "life_areas": {{
    "love": {{
      "title": "Love & Relationships",
      "score": 85,
      "description": "Your palm reveals deep emotional capacity..."
    }},
    "career": {{
      "title": "Career & Ambition",
      "score": 78,
      "description": "Strong career indicators with leadership potential..."
    }},
    "health": {{
      "title": "Health & Vitality",
      "score": 72,
      "description": "Good overall vitality with some periods of stress..."
    }},
    "wealth": {{
      "title": "Wealth & Prosperity",
      "score": 68,
      "description": "Moderate wealth indicators with growth potential..."
    }}
  }},
  "dominant_hand_analysis": {{
    "description": "Current reality - what you have done with your gifts",
    "summary": "Your dominant hand shows..."
  }},
  "non_dominant_hand_analysis": {{
    "description": "Potential - what you were born with",
    "summary": "Your non-dominant hand reveals..."
  }},
  "overall_reading": "Your palm reveals a balanced individual with strong emotional intelligence and analytical capabilities..."
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
            
            # Prepare image parts
            left_image_part = {
                "mime_type": "image/jpeg",
                "data": left_hand_base64.split(',')[-1] if ',' in left_hand_base64 else left_hand_base64
            }
            
            right_image_part = {
                "mime_type": "image/jpeg",
                "data": right_hand_base64.split(',')[-1] if ',' in right_hand_base64 else right_hand_base64
            }
            
            logger.info("Calling Gemini Vision API...")
            
            # Call Gemini - response_mime_type not supported in this version
            # The prompt itself instructs Gemini to return JSON
            logger.info("Calling Gemini with vision analysis prompt...")
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
            
            if not response:
                raise ValueError("No response from Gemini API")
            
            logger.info(f"Received response from Gemini, length: {len(response.text)}")
            
            # Parse response
            response_text = response.text.strip()
            logger.info(f"Raw response (first 500 chars): {response_text[:500]}")
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            logger.info(f"Cleaned response (first 500 chars): {response_text[:500]}")
            
            # Parse JSON
            analysis_data = json.loads(response_text)
            
            logger.info(f"Successfully parsed JSON and analyzed palm images for {handedness}-handed user")
            return analysis_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response as JSON: {e}")
            logger.error(f"Response text: {response_text if 'response_text' in locals() else 'N/A'}")
            raise ValueError(f"Invalid JSON response from Gemini: {str(e)}")
        except Exception as e:
            logger.error(f"Error analyzing palm images: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to analyze palm images: {str(e)}")
