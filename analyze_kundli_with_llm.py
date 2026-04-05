#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Kundli Analysis with LLM
Loads comprehensive kundli JSON and analyzes with expert Vedic astrology prompt
"""

import json
import os
from typing import Dict, Any

def load_kundli_json(kundli_path: str) -> Dict[str, Any]:
    """Load kundli JSON file"""
    try:
        with open(kundli_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading kundli: {e}")
        return {}

def prepare_analysis_prompt(kundli_data: Dict[str, Any]) -> str:
    """Prepare the complete analysis prompt for LLM"""
    
    # Load the analysis prompt
    prompt_path = os.path.join(os.path.dirname(__file__), 'VEDIC_ASTROLOGY_ANALYSIS_PROMPT.md')
    
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            analysis_prompt = f.read()
    except Exception as e:
        print(f"Error loading analysis prompt: {e}")
        return ""
    
    # Prepare the complete prompt
    complete_prompt = f"""{analysis_prompt}

## Kundli Data to Analyze

Here is the comprehensive kundli JSON data for analysis:

```json
{json.dumps(kundli_data, indent=2, ensure_ascii=False)}
```

Please provide a comprehensive analysis following the instructions above, focusing on the top 10 destined predictions with supporting evidence from multiple charts and astrological factors.
"""
    
    return complete_prompt

def analyze_kundli(kundli_path: str, save_analysis: bool = True) -> str:
    """Analyze kundli with LLM instructions"""
    
    print("Loading kundli data...")
    kundli_data = load_kundli_json(kundli_path)
    
    if not kundli_data:
        print("Failed to load kundli data")
        return ""
    
    print(f"Kundli loaded successfully")
    print(f"   Name: {kundli_data.get('birth_details', {}).get('name', 'Unknown')}")
    print(f"   Birth: {kundli_data.get('birth_details', {}).get('date', 'Unknown')} at {kundli_data.get('birth_details', {}).get('time', 'Unknown')}")
    print(f"   Place: {kundli_data.get('birth_details', {}).get('place', 'Unknown')}")
    
    print("\nPreparing analysis prompt...")
    analysis_prompt = prepare_analysis_prompt(kundli_data)
    
    if save_analysis:
        # Save the complete prompt for LLM
        output_path = kundli_path.replace('.json', '_analysis_prompt.txt')
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(analysis_prompt)
            print(f"Analysis prompt saved to: {output_path}")
        except Exception as e:
            print(f"Error saving analysis prompt: {e}")
    
    return analysis_prompt

def main():
    """Main function to demonstrate usage"""
    
    # Find the latest kundli file
    users_dir = os.path.join(os.path.dirname(__file__), 'users')
    
    if not os.path.exists(users_dir):
        print("Users directory not found")
        return
    
    # Find the most recent kundli file
    latest_kundli = None
    latest_time = 0
    
    for root, dirs, files in os.walk(users_dir):
        for file in files:
            if file.endswith('_Kundli.json'):
                file_path = os.path.join(root, file)
                file_time = os.path.getmtime(file_path)
                if file_time > latest_time:
                    latest_time = file_time
                    latest_kundli = file_path
    
    if not latest_kundli:
        print("No kundli files found")
        return
    
    print(f"Found latest kundli: {os.path.basename(latest_kundli)}")
    
    # Analyze the kundli
    analysis_prompt = analyze_kundli(latest_kundli, save_analysis=True)
    
    print("\n" + "="*80)
    print("ANALYSIS INSTRUCTIONS")
    print("="*80)
    print("\nTo analyze this kundli with an LLM:")
    print("1. Copy the complete prompt from the saved '_analysis_prompt.txt' file")
    print("2. Paste it into your preferred LLM (ChatGPT, Claude, etc.)")
    print("3. Request analysis following the expert Vedic astrology instructions")
    print("4. The LLM will provide:")
    print("   - Executive summary of personality and life themes")
    print("   - Top 10 destined predictions with supporting evidence")
    print("   - Practical guidance and remedial measures")
    print("   - Timing indications for major life events")
    
    # Show a preview of the prompt structure
    if analysis_prompt:
        prompt_preview = analysis_prompt[:500] + "..." if len(analysis_prompt) > 500 else analysis_prompt
        print(f"\nPrompt Preview:")
        print("-" * 40)
        print(prompt_preview)
        print("-" * 40)

if __name__ == "__main__":
    main()
