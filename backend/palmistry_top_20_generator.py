import logging
from typing import Dict, Any, Optional
from models import Top20Answers

logger = logging.getLogger(__name__)


class PalmistryTop20Generator:
    """Generate answers to top 20 palmistry questions from extracted palm data"""

    def __init__(self):
        """Initialize the generator"""
        pass

    def generate_top_20_answers(self, gemini_response: Dict[str, Any]) -> Top20Answers:
        """
        Generate answers to all 20 palmistry questions based on Gemini analysis
        
        Args:
            gemini_response: Complete Gemini analysis response with all palm data
            
        Returns:
            Top20Answers object with all 20 questions answered
        """
        try:
            logger.info("Generating top 20 answers from palmistry analysis")
            
            # Extract key data from response
            marriage_lines = gemini_response.get('minor_lines', {}).get('marriage_lines', {})
            children_lines = gemini_response.get('minor_lines', {}).get('children_lines', {})
            travel_lines = gemini_response.get('minor_lines', {}).get('travel_lines', {})
            money_triangle = gemini_response.get('money_triangle', {})
            age_events = gemini_response.get('age_events', {})
            special_symbols = gemini_response.get('special_symbols', [])
            bracelet_lines = gemini_response.get('bracelet_lines', [])
            major_lines = gemini_response.get('major_lines', {})
            mounts = gemini_response.get('mounts', {})
            
            # Generate answers for all 20 questions
            answers = Top20Answers(
                # Q1: When will I get married?
                marriage_age=self._answer_marriage_age(marriage_lines, age_events),
                
                # Q2: Love marriage or arranged?
                marriage_type=self._answer_marriage_type(major_lines, marriage_lines),
                
                # Q3: How many serious relationships?
                relationships_count=self._answer_relationships_count(marriage_lines),
                
                # Q4: Will I face divorce/heartbreak?
                divorce_risk=self._answer_divorce_risk(marriage_lines),
                
                # Q5: How many children?
                children_count=self._answer_children_count(children_lines),
                
                # Q6: Best career path?
                career_path=self._answer_career_path(major_lines, mounts),
                
                # Q7: When will I achieve career success?
                career_success_age=self._answer_career_success_age(age_events, major_lines),
                
                # Q8: Will I be wealthy/millionaire?
                wealth_potential=self._answer_wealth_potential(money_triangle, major_lines, mounts),
                
                # Q9: Chances of sudden wealth?
                sudden_wealth=self._answer_sudden_wealth(money_triangle, special_symbols),
                
                # Q10: Will I face bankruptcy?
                bankruptcy_risk=self._answer_bankruptcy_risk(money_triangle, major_lines),
                
                # Q11: Will I settle abroad?
                foreign_settlement=self._answer_foreign_settlement(travel_lines, age_events),
                
                # Q12: Will I travel extensively?
                travel_frequency=self._answer_travel_frequency(travel_lines),
                
                # Q13: Will I own real estate?
                property_ownership=self._answer_property_ownership(money_triangle, major_lines),
                
                # Q14: How long is my lifespan?
                lifespan=self._answer_lifespan(major_lines, bracelet_lines, age_events),
                
                # Q15: Major health issues?
                health_issues=self._answer_health_issues(age_events, bracelet_lines),
                
                # Q16: Mental health and stability?
                mental_health=self._answer_mental_health(major_lines, mounts),
                
                # Q17: Will I attain fame?
                fame_potential=self._answer_fame_potential(major_lines, mounts, special_symbols),
                
                # Q18: Lucky/rare signs?
                special_signs=self._answer_special_signs(special_symbols),
                
                # Q19: Legal troubles or enemies?
                legal_troubles=self._answer_legal_troubles(major_lines, age_events),
                
                # Q20: Strong intuition/spiritual awakening?
                intuition_spirituality=self._answer_intuition_spirituality(special_symbols, major_lines, mounts)
            )
            
            logger.info("Successfully generated top 20 answers")
            return answers
            
        except Exception as e:
            logger.error(f"Error generating top 20 answers: {str(e)}")
            # Return empty Top20Answers with None values
            return Top20Answers()

    def _answer_marriage_age(self, marriage_lines: Dict, age_events: Dict) -> Optional[str]:
        """Q1: When will I get married?"""
        if not marriage_lines:
            return None
        
        count = marriage_lines.get('count')
        if count and count > 0:
            # Estimate based on marriage line position (typically 25-35)
            return "Around 28-32 based on marriage lines"
        return None

    def _answer_marriage_type(self, major_lines: Dict, marriage_lines: Dict) -> Optional[str]:
        """Q2: Love marriage or arranged?"""
        if not major_lines:
            return None
        
        heart_line = major_lines.get('heart_line', {})
        heart_strength = heart_line.get('strength', '')
        
        if 'strong' in heart_strength.lower():
            return "Likely love marriage based on strong heart line indicating emotional depth"
        elif 'moderate' in heart_strength.lower():
            return "Could be either love or arranged, with good emotional compatibility"
        return None

    def _answer_relationships_count(self, marriage_lines: Dict) -> Optional[str]:
        """Q3: How many serious relationships?"""
        if not marriage_lines:
            return None
        
        count = marriage_lines.get('count')
        if count:
            if count == 1:
                return "1 serious relationship indicated"
            elif count <= 3:
                return f"{count} serious relationships indicated"
            else:
                return f"{count} relationships indicated, suggesting multiple connections"
        return None

    def _answer_divorce_risk(self, marriage_lines: Dict) -> Optional[str]:
        """Q4: Will I face divorce/heartbreak?"""
        if not marriage_lines:
            return None
        
        downward_curves = marriage_lines.get('downward_curves', 0)
        forks = marriage_lines.get('forks', 0)
        
        if downward_curves > 0 or forks > 0:
            return f"Moderate risk indicated by {downward_curves} downward curves and {forks} forks"
        return "Low risk of divorce/heartbreak based on stable marriage lines"

    def _answer_children_count(self, children_lines: Dict) -> Optional[str]:
        """Q5: How many children?"""
        if not children_lines:
            return None
        
        count = children_lines.get('count')
        if count:
            if count == 0:
                return "No children lines visible"
            elif count <= 3:
                return f"{count} children indicated"
            else:
                return f"{count} or more children indicated"
        return None

    def _answer_career_path(self, major_lines: Dict, mounts: Dict) -> Optional[str]:
        """Q6: Best career path?"""
        if not mounts:
            return None
        
        jupiter = mounts.get('jupiter', {})
        saturn = mounts.get('saturn', {})
        mercury = mounts.get('mercury', {})
        apollo = mounts.get('apollo', {})
        
        jupiter_prom = jupiter.get('prominence', '')
        mercury_prom = mercury.get('prominence', '')
        apollo_prom = apollo.get('prominence', '')
        
        if 'prominent' in jupiter_prom.lower():
            return "Leadership, management, or business entrepreneurship recommended"
        elif 'prominent' in mercury_prom.lower():
            return "Communication, business, trading, or technical fields recommended"
        elif 'prominent' in apollo_prom.lower():
            return "Creative, artistic, or public-facing career recommended"
        return "Balanced career potential across multiple fields"

    def _answer_career_success_age(self, age_events: Dict, major_lines: Dict) -> Optional[str]:
        """Q7: When will I achieve career success?"""
        if not age_events:
            return None
        
        fate_events = age_events.get('fate_line', [])
        if fate_events:
            # Look for positive events (not breaks)
            for event in fate_events:
                if 'break' not in event.get('event_type', '').lower():
                    age_range = event.get('age_range', '')
                    return f"Career success likely around {age_range}"
        
        return "Around 32-35 based on career indicators"

    def _answer_wealth_potential(self, money_triangle: Dict, major_lines: Dict, mounts: Dict) -> Optional[str]:
        """Q8: Will I be wealthy/millionaire?"""
        if not money_triangle:
            return None
        
        presence = money_triangle.get('presence')
        status = money_triangle.get('status', '')
        
        if presence and 'closed' in status.lower():
            return "Good wealth potential with strong money triangle indicating wealth retention"
        elif presence and 'open' in status.lower():
            return "Moderate wealth potential but may face challenges in wealth retention"
        return "Moderate wealth potential with consistent effort"

    def _answer_sudden_wealth(self, money_triangle: Dict, special_symbols: list) -> Optional[str]:
        """Q9: Chances of sudden wealth?"""
        if not special_symbols:
            return None
        
        symbols = [s.get('symbol', '').lower() for s in special_symbols]
        
        if 'fish' in symbols or 'star' in symbols:
            return "Good chances of sudden wealth through inheritance, business, or luck"
        return "Low chances of sudden wealth; prosperity through steady effort"

    def _answer_bankruptcy_risk(self, money_triangle: Dict, major_lines: Dict) -> Optional[str]:
        """Q10: Will I face bankruptcy?"""
        if not money_triangle:
            return None
        
        status = money_triangle.get('status', '')
        
        if 'open' in status.lower():
            return "Moderate risk of financial loss; careful financial planning recommended"
        return "Low risk of bankruptcy with stable financial indicators"

    def _answer_foreign_settlement(self, travel_lines: Dict, age_events: Dict) -> Optional[str]:
        """Q11: Will I settle abroad?"""
        if not travel_lines:
            return None
        
        presence = travel_lines.get('presence')
        depth = travel_lines.get('depth', '')
        
        if presence and 'deep' in depth.lower():
            return "High likelihood of settling abroad permanently"
        elif presence and 'moderate' in depth.lower():
            return "Possible foreign settlement for extended periods"
        elif presence:
            return "Likely to spend significant time abroad"
        return "Low likelihood of permanent foreign settlement"

    def _answer_travel_frequency(self, travel_lines: Dict) -> Optional[str]:
        """Q12: Will I travel extensively?"""
        if not travel_lines:
            return None
        
        presence = travel_lines.get('presence')
        depth = travel_lines.get('depth', '')
        
        if presence and 'deep' in depth.lower():
            return "Extensive travel for work and leisure indicated"
        elif presence and 'moderate' in depth.lower():
            return "Moderate travel for work and personal reasons"
        elif presence:
            return "Some travel indicated, but not extensive"
        return "Limited travel indicated"

    def _answer_property_ownership(self, money_triangle: Dict, major_lines: Dict) -> Optional[str]:
        """Q13: Will I own real estate?"""
        if not money_triangle:
            return None
        
        presence = money_triangle.get('presence')
        
        if presence:
            return "Yes, will own real estate and property"
        return "Likely to own property with proper financial planning"

    def _answer_lifespan(self, major_lines: Dict, bracelet_lines: list, age_events: Dict) -> Optional[str]:
        """Q14: How long is my lifespan?"""
        if not major_lines:
            return None
        
        life_line = major_lines.get('life_line', {})
        strength = life_line.get('strength', '')
        
        if 'strong' in strength.lower():
            return "Long and healthy life expected (75-85+ years)"
        elif 'moderate' in strength.lower():
            return "Good lifespan expected (70-80 years)"
        return "Moderate lifespan expected with attention to health"

    def _answer_health_issues(self, age_events: Dict, bracelet_lines: list) -> Optional[str]:
        """Q15: Major health issues?"""
        if not age_events:
            return None
        
        life_events = age_events.get('life_line', [])
        
        if life_events:
            for event in life_events:
                if 'break' in event.get('event_type', '').lower() or 'island' in event.get('event_type', '').lower():
                    age_range = event.get('age_range', '')
                    return f"Possible health concerns around {age_range}; preventive care recommended"
        
        return "No major health issues indicated; maintain good health practices"

    def _answer_mental_health(self, major_lines: Dict, mounts: Dict) -> Optional[str]:
        """Q16: Mental health and stability?"""
        if not major_lines:
            return None
        
        head_line = major_lines.get('head_line', {})
        strength = head_line.get('strength', '')
        
        if 'strong' in strength.lower():
            return "Strong mental stability, focus, and emotional resilience"
        elif 'moderate' in strength.lower():
            return "Good mental health with periods of stress; meditation/mindfulness helpful"
        return "Mental health requires attention and stress management"

    def _answer_fame_potential(self, major_lines: Dict, mounts: Dict, special_symbols: list) -> Optional[str]:
        """Q17: Will I attain fame?"""
        if not major_lines:
            return None
        
        sun_line = major_lines.get('sun_line', {})
        strength = sun_line.get('strength', '')
        apollo = mounts.get('apollo', {})
        apollo_prom = apollo.get('prominence', '')
        
        symbols = [s.get('symbol', '').lower() for s in special_symbols]
        
        if 'strong' in strength.lower() or 'prominent' in apollo_prom.lower():
            return "Good potential for recognition and fame through talent and effort"
        elif 'star' in symbols:
            return "Moderate to good potential for sudden recognition or fame"
        return "Moderate potential for recognition; success through consistent effort"

    def _answer_special_signs(self, special_symbols: list) -> Optional[str]:
        """Q18: Lucky/rare signs?"""
        if not special_symbols:
            return None
        
        if len(special_symbols) == 0:
            return "No special symbols found in this reading"
        
        symbol_names = [s.get('symbol', '') for s in special_symbols]
        
        if len(symbol_names) == 1:
            return f"{symbol_names[0]} present - indicates special spiritual or karmic significance"
        else:
            return f"Multiple special symbols found: {', '.join(symbol_names)} - indicates unique spiritual gifts"

    def _answer_legal_troubles(self, major_lines: Dict, age_events: Dict) -> Optional[str]:
        """Q19: Legal troubles or enemies?"""
        if not age_events:
            return None
        
        head_events = age_events.get('head_line', [])
        
        if head_events:
            for event in head_events:
                if 'cross' in event.get('event_type', '').lower():
                    return "Possible legal or conflict issues; careful decision-making recommended"
        
        return "Low risk of legal troubles or significant enemies"

    def _answer_intuition_spirituality(self, special_symbols: list, major_lines: Dict, mounts: Dict) -> Optional[str]:
        """Q20: Strong intuition/spiritual awakening?"""
        if not special_symbols:
            return None
        
        symbols = [s.get('symbol', '').lower() for s in special_symbols]
        
        if 'mystic cross' in symbols or 'fish' in symbols:
            return "Strong intuition and spiritual awareness; spiritual path indicated"
        
        moon = mounts.get('moon', {})
        moon_prom = moon.get('prominence', '')
        
        if 'prominent' in moon_prom.lower():
            return "Strong intuition and emotional sensitivity; spiritual inclinations present"
        
        return "Moderate intuitive abilities; spiritual growth through practice"
