"""
Timeline Engine for Dasha and Transit Analysis

This module analyzes Dasha periods and transits to identify:
- Current Mahadasha and Antardasha periods
- Active challenging periods (Sade Sati, Maraka Dashas, Badhaka Dashas, Rahu/Ketu Mahadashas)
- Exact end dates and countdown timers for all periods
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from models import CurrentDasha, NegativePeriod


class TimelineEngine:
    """
    Analyzes Dasha periods and transits from Kundli data.
    Calculates current periods, negative transits, and provides timeline information.
    """

    def __init__(self):
        """Initialize the timeline engine"""
        self.planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        self.maraka_lords = ["2nd", "7th"]  # Lords of 2nd and 7th houses
        self.badhaka_lords = ["11th"]  # Badhaka house lord
        self.negative_planets = ["Rahu", "Ketu", "Saturn", "Mars"]

    def get_current_dasha(self, kundli_data: Dict, today: datetime) -> Tuple[Optional[CurrentDasha], Optional[CurrentDasha]]:
        """
        Get current Mahadasha and Antardasha based on today's date.
        
        Args:
            kundli_data: Complete kundli data with dasha information
            today: Current date
            
        Returns:
            Tuple of (current_mahadasha, current_antardasha)
        """
        current_mahadasha = None
        current_antardasha = None
        
        try:
            dashas = kundli_data.get("dashas", {}).get("all", {}).get("mahadashas", {})
            
            if not dashas:
                return None, None
            
            # Find current Mahadasha
            for planet_name, mahadasha_data in dashas.items():
                start_date = self.parse_dasha_date(mahadasha_data.get("start", ""))
                end_date = self.parse_dasha_date(mahadasha_data.get("end", ""))
                
                if start_date <= today <= end_date:
                    # Found current Mahadasha
                    duration = self.calculate_duration_years(start_date, end_date)
                    progress = self.calculate_progress_percent(start_date, end_date, today)
                    days_remaining = self.calculate_days_remaining(end_date, today)
                    
                    current_mahadasha = CurrentDasha(
                        planet=planet_name,
                        start_date=start_date.strftime("%Y-%m-%d"),
                        end_date=end_date.strftime("%Y-%m-%d"),
                        duration_years=duration,
                        progress_percent=progress,
                        days_remaining=days_remaining
                    )
                    
                    # Find current Antardasha within this Mahadasha
                    antardashas = mahadasha_data.get("antardashas", {})
                    for antara_planet, antara_data in antardashas.items():
                        antara_start = self.parse_dasha_date(antara_data.get("start", ""))
                        antara_end = self.parse_dasha_date(antara_data.get("end", ""))
                        
                        if antara_start <= today <= antara_end:
                            antara_duration = self.calculate_duration_years(antara_start, antara_end)
                            antara_progress = self.calculate_progress_percent(antara_start, antara_end, today)
                            antara_days_remaining = self.calculate_days_remaining(antara_end, today)
                            
                            current_antardasha = CurrentDasha(
                                planet=antara_planet,
                                start_date=antara_start.strftime("%Y-%m-%d"),
                                end_date=antara_end.strftime("%Y-%m-%d"),
                                duration_years=antara_duration,
                                progress_percent=antara_progress,
                                days_remaining=antara_days_remaining
                            )
                            break
                    
                    break
        
        except Exception as e:
            pass
        
        return current_mahadasha, current_antardasha

    def get_active_negative_periods(self, kundli_data: Dict, today: datetime) -> List[NegativePeriod]:
        """
        Identify all active negative periods.
        
        Args:
            kundli_data: Complete kundli data
            today: Current date
            
        Returns:
            List of active negative periods with end dates and countdowns
        """
        negative_periods = []
        
        try:
            # Check for Sade Sati
            sade_sati = self.calculate_sade_sati(kundli_data.get("birth_data", {}), today)
            if sade_sati:
                negative_periods.append(sade_sati)
            
            # Check for Maraka Dashas
            maraka_periods = self.calculate_maraka_dashas(kundli_data, today)
            negative_periods.extend(maraka_periods)
            
            # Check for Badhaka Dashas
            badhaka_periods = self.calculate_badhaka_dashas(kundli_data, today)
            negative_periods.extend(badhaka_periods)
            
            # Check for Rahu/Ketu Mahadashas
            shadow_periods = self.calculate_rahu_ketu_mahadashas(kundli_data, today)
            negative_periods.extend(shadow_periods)
        
        except Exception as e:
            pass
        
        return negative_periods

    def calculate_sade_sati(self, birth_data: Dict, today: datetime) -> Optional[NegativePeriod]:
        """
        Calculate Sade Sati period (Saturn's 7.5-year transit over natal Moon).
        
        Sade Sati has three phases:
        1. Ascending phase: Saturn transits 12th from Moon
        2. Peak phase: Saturn transits Moon's sign
        3. Descending phase: Saturn transits 2nd from Moon
        
        Args:
            birth_data: Birth data with natal Moon position
            today: Current date
            
        Returns:
            NegativePeriod if Sade Sati is active, None otherwise
        """
        # Note: Sade Sati calculation requires Saturn transit data
        # This is a simplified implementation
        # In a production system, this would use actual transit ephemeris data
        
        # For now, return None as we don't have transit data
        # This would be calculated based on Saturn's current position vs natal Moon position
        return None

    def calculate_maraka_dashas(self, kundli_data: Dict, today: datetime) -> List[NegativePeriod]:
        """
        Calculate Maraka Dashas (periods ruled by lords of 2nd and 7th houses).
        
        These periods are considered challenging for health and relationships.
        
        Args:
            kundli_data: Complete kundli data
            today: Current date
            
        Returns:
            List of active Maraka Dashas
        """
        maraka_periods = []
        
        try:
            dashas = kundli_data.get("dashas", {}).get("all", {}).get("mahadashas", {})
            d1_chart = kundli_data.get("d1Chart", {})
            
            # Identify 2nd and 7th house lords
            maraka_lords = []
            for planet in d1_chart.get("planets", []):
                house = planet.get("house")
                planet_name = planet.get("name", "")
                
                if house in [2, 7]:
                    maraka_lords.append(planet_name)
            
            # Check if any Maraka lord's Mahadasha is currently active
            for planet_name, mahadasha_data in dashas.items():
                # Check if this planet is a Maraka lord
                is_maraka = any(lord in planet_name for lord in maraka_lords)
                
                if is_maraka:
                    start_date = self.parse_dasha_date(mahadasha_data.get("start", ""))
                    end_date = self.parse_dasha_date(mahadasha_data.get("end", ""))
                    
                    if start_date <= today <= end_date:
                        days_remaining = self.calculate_days_remaining(end_date, today)
                        
                        maraka_periods.append(NegativePeriod(
                            type="maraka",
                            start_date=start_date.strftime("%Y-%m-%d"),
                            end_date=end_date.strftime("%Y-%m-%d"),
                            days_remaining=days_remaining,
                            severity="moderate",
                            description=f"{planet_name} Mahadasha (Maraka period) is active. This period requires attention to health and relationships."
                        ))
        
        except Exception as e:
            pass
        
        return maraka_periods

    def calculate_badhaka_dashas(self, kundli_data: Dict, today: datetime) -> List[NegativePeriod]:
        """
        Calculate Badhaka Dashas (periods ruled by 11th house lord).
        
        The 11th house lord is considered the Badhaka (obstacle) planet.
        
        Args:
            kundli_data: Complete kundli data
            today: Current date
            
        Returns:
            List of active Badhaka Dashas
        """
        badhaka_periods = []
        
        try:
            dashas = kundli_data.get("dashas", {}).get("all", {}).get("mahadashas", {})
            d1_chart = kundli_data.get("d1Chart", {})
            
            # Identify 11th house lord
            badhaka_lord = None
            for planet in d1_chart.get("planets", []):
                if planet.get("house") == 11:
                    badhaka_lord = planet.get("name", "")
                    break
            
            if badhaka_lord:
                # Check if Badhaka lord's Mahadasha is currently active
                for planet_name, mahadasha_data in dashas.items():
                    if badhaka_lord in planet_name:
                        start_date = self.parse_dasha_date(mahadasha_data.get("start", ""))
                        end_date = self.parse_dasha_date(mahadasha_data.get("end", ""))
                        
                        if start_date <= today <= end_date:
                            days_remaining = self.calculate_days_remaining(end_date, today)
                            
                            badhaka_periods.append(NegativePeriod(
                                type="badhaka",
                                start_date=start_date.strftime("%Y-%m-%d"),
                                end_date=end_date.strftime("%Y-%m-%d"),
                                days_remaining=days_remaining,
                                severity="moderate",
                                description=f"{planet_name} Mahadasha (Badhaka period) is active. This period may bring obstacles and challenges that require careful navigation."
                            ))
        
        except Exception as e:
            pass
        
        return badhaka_periods

    def calculate_rahu_ketu_mahadashas(self, kundli_data: Dict, today: datetime) -> List[NegativePeriod]:
        """
        Calculate Rahu and Ketu Mahadashas (shadow planet periods).
        
        These periods are generally considered challenging and require careful navigation.
        
        Args:
            kundli_data: Complete kundli data
            today: Current date
            
        Returns:
            List of active Rahu/Ketu Mahadashas
        """
        shadow_periods = []
        
        try:
            dashas = kundli_data.get("dashas", {}).get("all", {}).get("mahadashas", {})
            
            # Check for Rahu and Ketu Mahadashas
            for planet_name, mahadasha_data in dashas.items():
                if "Rahu" in planet_name or "Ketu" in planet_name:
                    start_date = self.parse_dasha_date(mahadasha_data.get("start", ""))
                    end_date = self.parse_dasha_date(mahadasha_data.get("end", ""))
                    
                    if start_date <= today <= end_date:
                        days_remaining = self.calculate_days_remaining(end_date, today)
                        period_type = "rahu_mahadasha" if "Rahu" in planet_name else "ketu_mahadasha"
                        
                        shadow_periods.append(NegativePeriod(
                            type=period_type,
                            start_date=start_date.strftime("%Y-%m-%d"),
                            end_date=end_date.strftime("%Y-%m-%d"),
                            days_remaining=days_remaining,
                            severity="moderate",
                            description=f"{planet_name} Mahadasha is active. This shadow planet period brings transformation and requires spiritual awareness."
                        ))
        
        except Exception as e:
            pass
        
        return shadow_periods

    def parse_dasha_date(self, date_str: str) -> datetime:
        """
        Parse dasha date string to datetime object.
        
        Args:
            date_str: Date string in format "YYYY-MM-DD"
            
        Returns:
            datetime object
        """
        try:
            return datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return datetime.now()

    def calculate_days_remaining(self, end_date: datetime, today: datetime) -> int:
        """
        Calculate days remaining until end date.
        
        Args:
            end_date: End date of period
            today: Current date
            
        Returns:
            Number of days remaining (0 if period has ended)
        """
        if end_date <= today:
            return 0
        return (end_date - today).days

    def calculate_progress_percent(self, start_date: datetime, end_date: datetime, today: datetime) -> float:
        """
        Calculate progress percentage of a period.
        
        Args:
            start_date: Start date of period
            end_date: End date of period
            today: Current date
            
        Returns:
            Progress percentage (0-100)
        """
        if today <= start_date:
            return 0.0
        if today >= end_date:
            return 100.0
        
        total_days = (end_date - start_date).days
        elapsed_days = (today - start_date).days
        
        if total_days == 0:
            return 0.0
        
        return (elapsed_days / total_days) * 100

    def calculate_duration_years(self, start_date: datetime, end_date: datetime) -> float:
        """
        Calculate duration of a period in years.
        
        Args:
            start_date: Start date
            end_date: End date
            
        Returns:
            Duration in years (as float)
        """
        days = (end_date - start_date).days
        return days / 365.25

    def format_countdown(self, days_remaining: int) -> str:
        """
        Format days remaining as human-readable countdown.
        
        Args:
            days_remaining: Number of days
            
        Returns:
            Formatted string like "1 Year, 2 Months, 15 Days"
        """
        if days_remaining <= 0:
            return "Ended"
        
        years = days_remaining // 365
        remaining_days = days_remaining % 365
        months = remaining_days // 30
        days = remaining_days % 30
        
        parts = []
        if years > 0:
            parts.append(f"{years} Year{'s' if years > 1 else ''}")
        if months > 0:
            parts.append(f"{months} Month{'s' if months > 1 else ''}")
        if days > 0:
            parts.append(f"{days} Day{'s' if days > 1 else ''}")
        
        if not parts:
            return "Less than 1 day"
        
        return ", ".join(parts)

    def determine_severity(self, period_type: str, planet: str) -> str:
        """
        Determine severity of a period based on type and ruling planet.
        
        Args:
            period_type: Type of period (sade_sati, maraka, badhaka, etc.)
            planet: Ruling planet
            
        Returns:
            Severity level: "severe", "moderate", or "mild"
        """
        if period_type == "sade_sati":
            return "severe"
        elif period_type in ["maraka", "badhaka"]:
            return "moderate"
        elif planet in ["Rahu", "Ketu"]:
            return "moderate"
        else:
            return "mild"
