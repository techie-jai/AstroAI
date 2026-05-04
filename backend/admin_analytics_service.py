"""
Admin Analytics Service - Computes real analytics from local file system
Reads kundli data from local user directories and generates dashboard metrics
"""

import os
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class AdminAnalyticsService:
    """Service to compute analytics from local file system storage"""
    
    def __init__(self, users_base_path: str = None):
        # Support both Docker (/app/users) and local development (users/)
        if users_base_path is None:
            # Try relative path first (local development)
            if os.path.exists('users') and self._has_kundli_data('users'):
                users_base_path = 'users'
            # Try parent directory (in case running from backend/)
            elif os.path.exists('../users') and self._has_kundli_data('../users'):
                users_base_path = '../users'
            # Try absolute path from project root
            elif os.path.exists(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users')):
                users_base_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users')
            # Finally try Docker path
            elif os.path.exists('/app/users') and self._has_kundli_data('/app/users'):
                users_base_path = '/app/users'
            else:
                # Default fallback
                users_base_path = 'users'
        
        self.users_base_path = users_base_path
        logger.info(f"AdminAnalyticsService initialized with path: {self.users_base_path}")
    
    def _has_kundli_data(self, path: str) -> bool:
        """Check if a path has kundli data (kundli_index.json)"""
        try:
            index_file = os.path.join(path, 'kundli_index.json')
            if os.path.exists(index_file):
                with open(index_file, 'r') as f:
                    data = json.load(f)
                    return len(data) > 0
        except Exception as e:
            logger.debug(f"Error checking kundli data in {path}: {str(e)}")
        return False
    
    def get_all_users_from_filesystem(self) -> List[Dict[str, Any]]:
        """Scan local filesystem and get all users with their kundli data"""
        users_dict = {}
        
        logger.info(f"Scanning users from: {self.users_base_path}")
        logger.info(f"Path exists: {os.path.exists(self.users_base_path)}")
        logger.info(f"Absolute path: {os.path.abspath(self.users_base_path)}")
        
        if not os.path.exists(self.users_base_path):
            logger.error(f"❌ Users directory not found: {self.users_base_path}")
            logger.error(f"Current working directory: {os.getcwd()}")
            return []
        
        try:
            # First, read the global kundli index to get user names
            index_file = os.path.join(self.users_base_path, 'kundli_index.json')
            logger.info(f"Looking for index file: {index_file}")
            if os.path.exists(index_file):
                logger.info(f"✓ Found index file: {index_file}")
                with open(index_file, 'r') as f:
                    kundli_index = json.load(f)
                    logger.info(f"✓ Loaded {len(kundli_index)} kundlis from index")
                    # Extract unique users from kundli index
                    for kundli_id, kundli_data in kundli_index.items():
                        if isinstance(kundli_data, dict):
                            user_name = kundli_data.get('user_name', 'Unknown')
                            if user_name not in users_dict:
                                users_dict[user_name] = {
                                    'uid': user_name,
                                    'displayName': user_name,
                                    'email': f'{user_name.lower().replace(" ", ".")}@local.user',
                                    'createdAt': datetime.fromisoformat(kundli_data.get('generated_at', datetime.utcnow().isoformat())),
                                    'kundliCount': 0,
                                    'analysisCount': 0,
                                    'tokenUsage': {'total': 0, 'monthly': 0}
                                }
                            users_dict[user_name]['kundliCount'] += 1
            
            # Now scan user directories for additional info
            for user_dir in os.listdir(self.users_base_path):
                user_path = os.path.join(self.users_base_path, user_dir)
                
                if not os.path.isdir(user_path):
                    continue
                
                # Read user_info.json if exists
                user_info_file = os.path.join(user_path, 'user_info.json')
                if os.path.exists(user_info_file):
                    try:
                        with open(user_info_file, 'r') as f:
                            user_info = json.load(f)
                            user_name = user_info.get('name', user_dir)
                            
                            if user_name not in users_dict:
                                users_dict[user_name] = {
                                    'uid': user_name,
                                    'displayName': user_name,
                                    'email': f'{user_name.lower().replace(" ", ".")}@local.user',
                                    'createdAt': datetime.fromtimestamp(os.path.getctime(user_path)),
                                    'kundliCount': self._count_kundlis(user_name),
                                    'analysisCount': 0,
                                    'tokenUsage': {'total': 0, 'monthly': 0}
                                }
                    except Exception as e:
                        logger.error(f"Error reading user_info for {user_dir}: {str(e)}")
                
                # Count analysis files (support both old and new naming conventions)
                analysis_dir = os.path.join(user_path, 'analysis')
                if os.path.isdir(analysis_dir):
                    analysis_count = len([f for f in os.listdir(analysis_dir) if f.endswith('.txt') and ('_analysis_' in f or f.endswith('_AI_Analysis.txt'))])
                    # Update analysis count for matching user
                    for user_name in users_dict:
                        if user_name.lower().replace(' ', '_') in user_dir.lower():
                            users_dict[user_name]['analysisCount'] = analysis_count
                            users_dict[user_name]['hasAnalysis'] = analysis_count > 0
                            break
        
        except Exception as e:
            logger.error(f"Error scanning users directory: {str(e)}")
        
        result = list(users_dict.values())
        logger.info(f"✓ Found {len(result)} unique users from filesystem")
        return result
    
    def _count_kundlis(self, user_name: str) -> int:
        """Count kundlis for a specific user from the global index"""
        count = 0
        try:
            global_index_file = os.path.join(self.users_base_path, 'kundli_index.json')
            if os.path.exists(global_index_file):
                with open(global_index_file, 'r') as f:
                    index = json.load(f)
                    # Count kundlis where user_name matches
                    for kundli_id, metadata in index.items():
                        if isinstance(metadata, dict) and metadata.get('user_name') == user_name:
                            count += 1
        except Exception as e:
            logger.error(f"Error counting kundlis for {user_name}: {str(e)}")
        return count
    
    def _count_analysis(self, user_path: str) -> int:
        """Count analysis files in user directory (supports both old and new structure)"""
        count = 0
        
        # Check new structure first (Astrology/{kundli_id}/analysis.txt)
        astrology_dir = os.path.join(user_path, 'Astrology')
        if os.path.isdir(astrology_dir):
            try:
                for kundli_folder in os.listdir(astrology_dir):
                    kundli_path = os.path.join(astrology_dir, kundli_folder)
                    if os.path.isdir(kundli_path):
                        # Check for analysis.txt or analysis.pdf
                        if os.path.exists(os.path.join(kundli_path, 'analysis.txt')):
                            count += 1
                        elif os.path.exists(os.path.join(kundli_path, 'analysis.pdf')):
                            count += 1
            except Exception as e:
                logger.debug(f"Error counting analysis in Astrology: {str(e)}")
        
        # Check old structure for backward compatibility
        analysis_dir = os.path.join(user_path, 'analysis')
        try:
            if os.path.exists(analysis_dir):
                for item in os.listdir(analysis_dir):
                    if item.endswith('.txt') and ('_analysis_' in item or item.endswith('_AI_Analysis.txt')):
                        count += 1
        except Exception as e:
            logger.debug(f"Error counting analysis in old structure: {str(e)}")
        
        return count
    
    def get_all_kundlis_from_filesystem(self) -> List[Dict[str, Any]]:
        """Scan filesystem and get all kundlis with metadata"""
        kundlis = []
        
        if not os.path.exists(self.users_base_path):
            return kundlis
        
        try:
            # Read global kundli index
            index_file = os.path.join(self.users_base_path, 'kundli_index.json')
            if os.path.exists(index_file):
                with open(index_file, 'r') as f:
                    kundli_index = json.load(f)
                    for kundli_id, kundli_data in kundli_index.items():
                        if isinstance(kundli_data, dict):
                            kundli_entry = {
                                'id': kundli_id,
                                'userId': kundli_data.get('user_name', 'Unknown'),
                                'userName': kundli_data.get('user_name', 'Unknown'),
                                'userEmail': f'{kundli_data.get("user_name", "unknown").lower().replace(" ", ".")}@local.user',
                                'type': 'D1 (Birth)',  # Default type
                                'generatedAt': kundli_data.get('generated_at', datetime.utcnow().isoformat()),
                                'hasAnalysis': False,  # Will be updated below
                                'birthData': kundli_data.get('birth_data', {})
                            }
                            kundlis.append(kundli_entry)
            
            # Check for analysis files to update hasAnalysis flag (supports both old and new structure)
            for user_dir in os.listdir(self.users_base_path):
                user_path = os.path.join(self.users_base_path, user_dir)
                
                if not os.path.isdir(user_path):
                    continue
                
                # Get user name
                user_name = None
                user_info_file = os.path.join(user_path, 'user_info.json')
                if os.path.exists(user_info_file):
                    try:
                        with open(user_info_file, 'r') as f:
                            user_info = json.load(f)
                            user_name = user_info.get('name')
                    except:
                        pass
                
                # Check new structure (Astrology/{kundli_id}/analysis.txt)
                astrology_dir = os.path.join(user_path, 'Astrology')
                if os.path.isdir(astrology_dir):
                    for kundli_folder in os.listdir(astrology_dir):
                        kundli_path = os.path.join(astrology_dir, kundli_folder)
                        if os.path.isdir(kundli_path):
                            if os.path.exists(os.path.join(kundli_path, 'analysis.txt')) or os.path.exists(os.path.join(kundli_path, 'analysis.pdf')):
                                if user_name:
                                    for kundli in kundlis:
                                        if kundli['userName'] == user_name:
                                            kundli['hasAnalysis'] = True
                
                # Check old structure for backward compatibility
                analysis_dir = os.path.join(user_path, 'analysis')
                if os.path.isdir(analysis_dir):
                    analysis_files = [f for f in os.listdir(analysis_dir) if f.endswith('.txt') and ('_analysis_' in f or f.endswith('_AI_Analysis.txt'))]
                    if analysis_files and user_name:
                        # Mark kundlis for this user as having analysis
                        for kundli in kundlis:
                            if kundli['userName'] == user_name:
                                kundli['hasAnalysis'] = True
        
        except Exception as e:
            logger.error(f"Error scanning kundlis: {str(e)}")
        
        return kundlis
    
    def compute_analytics_overview(self) -> Dict[str, Any]:
        """Compute dashboard overview metrics from filesystem"""
        logger.info(f"Computing analytics overview from path: {self.users_base_path}")
        
        users = self.get_all_users_from_filesystem()
        kundlis = self.get_all_kundlis_from_filesystem()
        
        logger.info(f"Found {len(users)} users and {len(kundlis)} kundlis")
        
        total_users = len(users)
        active_users = len([u for u in users if (datetime.utcnow() - u.get('createdAt', datetime.utcnow())).days <= 30])
        total_kundlis = len(kundlis)
        total_tokens_used = sum(u.get('tokenUsage', {}).get('total', 0) for u in users)
        with_analysis = len([k for k in kundlis if k.get('hasAnalysis', False)])
        
        result = {
            'totalUsers': total_users,
            'activeUsers': active_users,
            'totalKundlis': total_kundlis,
            'totalTokensUsed': total_tokens_used,
            'kundlisWithAnalysis': with_analysis,
            'kundlisWithoutAnalysis': total_kundlis - with_analysis,
            'averageKundlisPerUser': round(total_kundlis / total_users, 2) if total_users > 0 else 0,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        logger.info(f"Analytics result: {result}")
        return result
    
    def compute_user_growth_analytics(self, days: int = 30) -> List[Dict[str, Any]]:
        """Compute user growth data from filesystem"""
        users = self.get_all_users_from_filesystem()
        
        # Group users by creation date
        date_counts = {}
        for user in users:
            created_at = user.get('createdAt')
            if isinstance(created_at, datetime):
                date_key = created_at.date().isoformat()
            else:
                date_key = str(created_at)[:10]
            
            date_counts[date_key] = date_counts.get(date_key, 0) + 1
        
        # Calculate cumulative growth
        sorted_dates = sorted(date_counts.keys())
        cumulative = 0
        result = []
        
        for date_str in sorted_dates:
            cumulative += date_counts[date_str]
            result.append({
                'date': date_str,
                'newUsers': date_counts[date_str],
                'totalUsers': cumulative
            })
        
        # Return last N days
        return result[-days:] if len(result) > days else result
    
    def compute_usage_analytics(self) -> Dict[str, Any]:
        """Compute feature usage analytics from filesystem"""
        kundlis = self.get_all_kundlis_from_filesystem()
        
        feature_usage = {
            'kundliGeneration': len(kundlis),
            'analysis': len([k for k in kundlis if k.get('hasAnalysis', False)]),
            'chat': len([k for k in kundlis if k.get('chatHistory', [])]),
            'pdfDownload': len([k for k in kundlis if k.get('pdfGenerated', False)])
        }
        
        total_features = sum(feature_usage.values())
        percentages = {
            k: round((v / total_features * 100), 2) if total_features > 0 else 0 
            for k, v in feature_usage.items()
        }
        
        return {
            'usage': feature_usage,
            'percentages': percentages,
            'total': total_features
        }
    
    def compute_token_usage_analytics(self) -> Dict[str, Any]:
        """Compute token/credit usage analytics from filesystem"""
        users = self.get_all_users_from_filesystem()
        
        total_tokens = 0
        users_by_usage = []
        
        for user in users:
            token_usage = user.get('tokenUsage', {})
            user_tokens = token_usage.get('total', 0) if isinstance(token_usage, dict) else 0
            total_tokens += user_tokens
            
            users_by_usage.append({
                'userId': user['uid'],
                'userName': user['displayName'],
                'tokensUsed': user_tokens,
                'monthlyUsage': token_usage.get('monthly', 0) if isinstance(token_usage, dict) else 0,
                'kundlis': user.get('kundliCount', 0)
            })
        
        users_by_usage.sort(key=lambda x: x['tokensUsed'], reverse=True)
        
        return {
            'totalTokensUsed': total_tokens,
            'topUsers': users_by_usage[:10],
            'averagePerUser': round(total_tokens / len(users), 2) if users else 0,
            'allUsers': users_by_usage
        }
    
    def compute_system_health(self) -> Dict[str, Any]:
        """Compute system health metrics"""
        users = self.get_all_users_from_filesystem()
        kundlis = self.get_all_kundlis_from_filesystem()
        
        # Check if users directory is accessible
        users_dir_exists = os.path.exists(self.users_base_path)
        
        return {
            'status': 'healthy' if users_dir_exists else 'degraded',
            'timestamp': datetime.utcnow().isoformat(),
            'metrics': {
                'totalUsers': len(users),
                'totalKundlis': len(kundlis),
                'localStorageStatus': 'connected' if users_dir_exists else 'disconnected',
                'apiStatus': 'operational',
                'storageUsage': self._calculate_storage_usage()
            }
        }
    
    def _calculate_storage_usage(self) -> Dict[str, Any]:
        """Calculate storage usage statistics"""
        try:
            total_size = 0
            file_count = 0
            
            for root, dirs, files in os.walk(self.users_base_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    total_size += os.path.getsize(file_path)
                    file_count += 1
            
            return {
                'totalSize': f"{total_size / (1024*1024):.2f} MB",
                'fileCount': file_count,
                'status': 'healthy'
            }
        except Exception as e:
            logger.error(f"Error calculating storage usage: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def get_kundli_distribution(self) -> Dict[str, int]:
        """Get distribution of kundli types"""
        kundlis = self.get_all_kundlis_from_filesystem()
        
        distribution = {
            'D1 (Birth)': 0,
            'D9 (Navamsa)': 0,
            'D10 (Dasamsa)': 0,
            'D27 (Naksatra)': 0,
            'Other': 0
        }
        
        for kundli in kundlis:
            kundli_type = kundli.get('type', 'Other')
            if kundli_type in distribution:
                distribution[kundli_type] += 1
            else:
                distribution['Other'] += 1
        
        return distribution
    
    def get_recent_activity(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent kundli generation activity"""
        kundlis = self.get_all_kundlis_from_filesystem()
        
        # Sort by generated date
        sorted_kundlis = sorted(
            kundlis,
            key=lambda x: x.get('generatedAt', ''),
            reverse=True
        )
        
        activities = []
        for kundli in sorted_kundlis[:limit]:
            activities.append({
                'id': kundli.get('id', 'unknown'),
                'user': kundli.get('userName', 'Unknown'),
                'email': kundli.get('userEmail', 'unknown@local'),
                'action': f"Generated {kundli.get('type', 'Kundli')}",
                'timestamp': kundli.get('generatedAt', datetime.utcnow().isoformat())
            })
        
        return activities

# Create singleton instance
_analytics_service = None

def get_analytics_service(users_path: str = None) -> AdminAnalyticsService:
    """Get or create analytics service instance"""
    global _analytics_service
    if _analytics_service is None:
        _analytics_service = AdminAnalyticsService(users_path)
    return _analytics_service
