import re
import json
from typing import Dict, List, Optional


class InsightsExtractor:
    """Extract and parse insights from Gemini analysis response"""
    
    @staticmethod
    def extract_insights(analysis_text: str) -> Optional[Dict]:
        """
        Extract KEY INSIGHTS section from analysis text
        
        Args:
            analysis_text: Full analysis text from Gemini
            
        Returns:
            Dictionary with parsed insights or None if not found
        """
        try:
            # Find the KEY INSIGHTS section
            insights_match = re.search(
                r'KEY\s+INSIGHTS\s*:?\s*(.*?)(?=\n\n|\Z)',
                analysis_text,
                re.IGNORECASE | re.DOTALL
            )
            
            if not insights_match:
                return None
            
            insights_text = insights_match.group(1).strip()
            
            # Parse insights into categories
            insights = {
                'health': [],
                'career': [],
                'relationships': [],
                'money': [],
                'all_insights': []
            }
            
            # Split by bullet points or numbered items
            lines = re.split(r'[-•*]\s+|\d+\.\s+', insights_text)
            lines = [line.strip() for line in lines if line.strip()]
            
            for line in lines:
                line_lower = line.lower()
                
                # Categorize insights
                if any(word in line_lower for word in ['health', 'wellness', 'medical', 'disease', 'illness', 'care']):
                    insights['health'].append(line)
                elif any(word in line_lower for word in ['career', 'job', 'profession', 'work', 'business', 'employment']):
                    insights['career'].append(line)
                elif any(word in line_lower for word in ['marriage', 'relationship', 'spouse', 'partner', 'family', 'children', 'kids', 'love']):
                    insights['relationships'].append(line)
                elif any(word in line_lower for word in ['money', 'wealth', 'financial', 'income', 'business', 'profit', 'investment', 'savings']):
                    insights['money'].append(line)
                
                # Add to all insights
                insights['all_insights'].append(line)
            
            return insights
        
        except Exception as e:
            print(f"[INSIGHTS] Error extracting insights: {str(e)}")
            return None
    
    @staticmethod
    def format_insights_for_firebase(insights: Dict) -> Dict:
        """
        Format extracted insights for Firebase storage
        
        Args:
            insights: Dictionary of extracted insights
            
        Returns:
            Formatted dictionary for Firebase
        """
        try:
            return {
                'health_insights': insights.get('health', []),
                'career_insights': insights.get('career', []),
                'relationship_insights': insights.get('relationships', []),
                'money_insights': insights.get('money', []),
                'all_insights': insights.get('all_insights', []),
                'total_insights': len(insights.get('all_insights', []))
            }
        except Exception as e:
            print(f"[INSIGHTS] Error formatting insights: {str(e)}")
            return {}
    
    @staticmethod
    def get_summary_insights(insights: Dict) -> Dict:
        """
        Get a summary of insights for dashboard display
        
        Args:
            insights: Dictionary of extracted insights
            
        Returns:
            Summary dictionary with key insights from each category
        """
        try:
            summary = {
                'important_aspects': '',
                'good_times': '',
                'challenges': '',
                'interesting_facts': ''
            }
            
            # Get first health insight
            if insights.get('health'):
                summary['challenges'] = insights['health'][0]
            
            # Get first career insight
            if insights.get('career'):
                summary['important_aspects'] = insights['career'][0]
            
            # Get first relationship insight
            if insights.get('relationships'):
                summary['interesting_facts'] = insights['relationships'][0]
            
            # Get first money insight
            if insights.get('money'):
                summary['good_times'] = insights['money'][0]
            
            return summary
        
        except Exception as e:
            print(f"[INSIGHTS] Error getting summary insights: {str(e)}")
            return {}
