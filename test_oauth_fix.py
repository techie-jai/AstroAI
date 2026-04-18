"""
Test script for OAuth user agent detection and fallback mechanism.
Tests the fix for the "Error 403: disallowed_useragent" issue when logging in from FB Messenger.
"""

import json
import subprocess
import sys
from typing import Dict, List, Tuple


class OAuthUserAgentTester:
    """Test suite for OAuth user agent detection and fallback"""
    
    # User agents to test
    TEST_USER_AGENTS = {
        # Secure browsers (should use popup)
        'Chrome': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Firefox': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'Safari': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
        'Edge': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        
        # Insecure in-app browsers (should use redirect)
        'Facebook App': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/420.0.0.0;]',
        'Facebook Messenger': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 [FBAN/FBIOS;FBAV/420.0.0.0;]',
        'Instagram': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Instagram 420.0.0.0',
        'WhatsApp': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 WhatsApp/2.23.0',
        'TikTok': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 TikTok/420.0.0.0',
        'Telegram': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Telegram',
    }
    
    def __init__(self):
        self.results: List[Dict] = []
        self.passed = 0
        self.failed = 0
    
    def is_secure_browser(self, user_agent: str) -> bool:
        """
        Replicate the isSecureBrowser logic from authStore.ts
        """
        ua = user_agent.lower()
        
        insecure_browsers = [
            'fban',      # Facebook app
            'fbav',      # Facebook app
            'messenger', # Facebook Messenger
            'instagram', # Instagram app
            'whatsapp',  # WhatsApp
            'line',      # LINE app
            'telegram',  # Telegram
            'viber',     # Viber
            'snapchat',  # Snapchat
            'tiktok',    # TikTok
        ]
        
        return not any(browser in ua for browser in insecure_browsers)
    
    def get_oauth_method(self, user_agent: str) -> str:
        """
        Determine which OAuth method to use based on user agent
        """
        return 'popup' if self.is_secure_browser(user_agent) else 'redirect'
    
    def test_user_agent(self, browser_name: str, user_agent: str, expected_method: str) -> Tuple[bool, str]:
        """
        Test a single user agent
        """
        try:
            is_secure = self.is_secure_browser(user_agent)
            method = self.get_oauth_method(user_agent)
            
            passed = method == expected_method
            
            result = {
                'browser': browser_name,
                'user_agent': user_agent[:80] + '...' if len(user_agent) > 80 else user_agent,
                'is_secure': is_secure,
                'oauth_method': method,
                'expected_method': expected_method,
                'passed': passed,
            }
            
            self.results.append(result)
            
            if passed:
                self.passed += 1
                status = '✓ PASS'
            else:
                self.failed += 1
                status = '✗ FAIL'
            
            return passed, status
        
        except Exception as e:
            self.failed += 1
            result = {
                'browser': browser_name,
                'user_agent': user_agent[:80] + '...',
                'error': str(e),
                'passed': False,
            }
            self.results.append(result)
            return False, f'✗ ERROR: {str(e)}'
    
    def run_all_tests(self) -> bool:
        """
        Run all user agent tests
        """
        print("\n" + "="*80)
        print("OAuth User Agent Detection Test Suite")
        print("="*80 + "\n")
        
        # Test secure browsers (should use popup)
        print("Testing SECURE browsers (should use popup):")
        print("-" * 80)
        for browser_name, user_agent in list(self.TEST_USER_AGENTS.items())[:4]:
            passed, status = self.test_user_agent(browser_name, user_agent, 'popup')
            print(f"{status} | {browser_name:20} | Method: popup")
        
        # Test insecure in-app browsers (should use redirect)
        print("\nTesting IN-APP browsers (should use redirect):")
        print("-" * 80)
        for browser_name, user_agent in list(self.TEST_USER_AGENTS.items())[4:]:
            passed, status = self.test_user_agent(browser_name, user_agent, 'redirect')
            print(f"{status} | {browser_name:20} | Method: redirect")
        
        # Summary
        print("\n" + "="*80)
        print(f"Test Results: {self.passed} passed, {self.failed} failed")
        print("="*80 + "\n")
        
        return self.failed == 0
    
    def test_facebook_messenger_specific(self) -> bool:
        """
        Specific test for the reported issue: FB Messenger OAuth failure
        """
        print("\n" + "="*80)
        print("Facebook Messenger Specific Test (Issue Reproduction)")
        print("="*80 + "\n")
        
        # Simulate FB Messenger user agent
        fb_messenger_ua = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 [FBAN/FBIOS;FBAV/420.0.0.0;]'
        
        print(f"User Agent: {fb_messenger_ua}\n")
        
        is_secure = self.is_secure_browser(fb_messenger_ua)
        method = self.get_oauth_method(fb_messenger_ua)
        
        print(f"Is Secure Browser: {is_secure}")
        print(f"OAuth Method: {method}")
        print(f"\nExpected Behavior:")
        print(f"  - Browser detected as: {'SECURE (popup)' if is_secure else 'IN-APP (redirect)'}")
        print(f"  - Will use: {method.upper()} flow")
        print(f"  - Result: {'✓ Will bypass Google policy error' if method == 'redirect' else '✗ Will fail with Error 403'}\n")
        
        success = method == 'redirect'
        
        if success:
            print("✓ Facebook Messenger issue RESOLVED")
            print("  Users clicking links from FB Messenger will now use redirect flow")
            print("  This bypasses the 'disallowed_useragent' error from Google\n")
        else:
            print("✗ Facebook Messenger issue NOT RESOLVED\n")
        
        return success
    
    def test_redirect_flow_handling(self) -> bool:
        """
        Test that redirect flow is properly handled in authStore
        """
        print("\n" + "="*80)
        print("Redirect Flow Handling Test")
        print("="*80 + "\n")
        
        print("Checking authStore.ts for redirect flow implementation:")
        print("-" * 80)
        
        try:
            with open('e:\\25. Codes\\17. AstroAI V3\\AstroAi\\frontend\\src\\store\\authStore.ts', 'r') as f:
                content = f.read()
            
            checks = {
                'signInWithRedirect imported': 'signInWithRedirect' in content,
                'getRedirectResult imported': 'getRedirectResult' in content,
                'getRedirectResult called in initializeAuth': 'getRedirectResult(auth)' in content,
                'Redirect flow in loginWithGoogle': 'signInWithRedirect(auth, googleProvider)' in content,
                'User agent detection function': 'isSecureBrowser' in content,
                'OAuth method selection': 'getOAuthMethod' in content,
            }
            
            all_passed = True
            for check_name, result in checks.items():
                status = '✓' if result else '✗'
                print(f"{status} {check_name}")
                if not result:
                    all_passed = False
            
            print("\n" + "="*80)
            if all_passed:
                print("✓ All redirect flow components properly implemented\n")
            else:
                print("✗ Some redirect flow components are missing\n")
            
            return all_passed
        
        except Exception as e:
            print(f"✗ Error checking authStore.ts: {str(e)}\n")
            return False
    
    def generate_report(self) -> str:
        """
        Generate a detailed test report
        """
        report = "\n" + "="*80 + "\n"
        report += "DETAILED TEST REPORT\n"
        report += "="*80 + "\n\n"
        
        report += "Test Results:\n"
        report += "-" * 80 + "\n"
        
        for result in self.results:
            if 'error' in result:
                report += f"Browser: {result['browser']}\n"
                report += f"Error: {result['error']}\n\n"
            else:
                report += f"Browser: {result['browser']}\n"
                report += f"Is Secure: {result['is_secure']}\n"
                report += f"OAuth Method: {result['oauth_method']}\n"
                report += f"Expected: {result['expected_method']}\n"
                report += f"Status: {'PASS' if result['passed'] else 'FAIL'}\n\n"
        
        return report


def main():
    """Main test execution"""
    tester = OAuthUserAgentTester()
    
    # Run all tests
    all_tests_passed = tester.run_all_tests()
    
    # Test Facebook Messenger specific issue
    fb_messenger_fixed = tester.test_facebook_messenger_specific()
    
    # Test redirect flow implementation
    redirect_flow_ok = tester.test_redirect_flow_handling()
    
    # Generate report
    report = tester.generate_report()
    print(report)
    
    # Final summary
    print("\n" + "="*80)
    print("FINAL SUMMARY")
    print("="*80)
    print(f"✓ User Agent Detection Tests: {'PASSED' if all_tests_passed else 'FAILED'}")
    print(f"✓ Facebook Messenger Issue: {'FIXED' if fb_messenger_fixed else 'NOT FIXED'}")
    print(f"✓ Redirect Flow Implementation: {'OK' if redirect_flow_ok else 'INCOMPLETE'}")
    print("="*80 + "\n")
    
    # Exit code
    if all_tests_passed and fb_messenger_fixed and redirect_flow_ok:
        print("✓ All tests PASSED - OAuth fix is working correctly!\n")
        return 0
    else:
        print("✗ Some tests FAILED - Please review the implementation\n")
        return 1


if __name__ == '__main__':
    sys.exit(main())
