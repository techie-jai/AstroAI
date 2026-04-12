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
    
    def __init__(self, users_base_path: str = '/app/users'):
        self.users_base_path = users_base_path
    
    def get_all_users_from_filesystem(self) -> List[Dict[str, Any]]:
        """Scan local filesystem and get all users with their kundli data"""
        users = []
        
        if not os.path.exists(self.users_base_path):
            logger.warning(f"Users directory not found: {self.users_base_path}")
            # Create the directory if it doesn't exist
            try:
                os.makedirs(self.users_base_path, exist_ok=True)
                logger.info(f"Created users directory: {self.users_base_path}")
            except Exception as e:
                logger.error(f"Error creating users directory: {str(e)}")
            return users
        
        try:
            for user_dir in os.listdir(self.users_base_path):
                user_path = os.path.join(self.users_base_path, user_dir)
                
                if not os.path.isdir(user_path):
                    continue
                
                # Read user metadata if exists
                metadata_file = os.path.join(user_path, 'metadata.json')
                user_data = {
                    'uid': user_dir,
                    'displayName': user_dir,
                    'email': f'{user_dir}@local.user',
                    'createdAt': datetime.fromtimestamp(os.path.getctime(user_path)),
                    'kundliCount': 0,
                    'analysisCount': 0,
                    'tokenUsage': {'total': 0, 'monthly': 0}
                }
                
                if os.path.exists(metadata_file):
                    try:
                        with open(metadata_file, 'r') as f:
                            metadata = json.load(f)
                            user_data.update(metadata)
                    except Exception as e:
                        logger.error(f"Error reading metadata for {user_dir}: {str(e)}")
                
                # Count kundlis
                kundli_count = self._count_kundlis(user_path)
                analysis_count = self._count_analysis(user_path)
                
                user_data['kundliCount'] = kundli_count
                user_data['analysisCount'] = analysis_count
                user_data['hasAnalysis'] = analysis_count > 0
                
                users.append(user_data)
        
        except Exception as e:
            logger.error(f"Error scanning users directory: {str(e)}")
        
        return users
    
    def _count_kundlis(self, user_path: str) -> int:
        """Count kundli files in user directory"""
        count = 0
        try:
            for item in os.listdir(user_path):
                item_path = os.path.join(user_path, item)
                if os.path.isfile(item_path) and item.endswith('.json') and 'kundli' in item.lower():
                    count += 1
        except Exception as e:
            logger.error(f"Error counting kundlis: {str(e)}")
        return count
    
    def _count_analysis(self, user_path: str) -> int:
        """Count analysis files in user directory"""
        count = 0
        analysis_dir = os.path.join(user_path, 'analysis')
        try:
            if os.path.exists(analysis_dir):
                for item in os.listdir(analysis_dir):
                    if item.endswith('_AI_Analysis.txt'):
                        count += 1
        except Exception as e:
            logger.error(f"Error counting analysis: {str(e)}")
        return count
    
    def get_all_kundlis_from_filesystem(self) -> List[Dict[str, Any]]:
        """Scan filesystem and get all kundlis with metadata"""
        kundlis = []
        
        if not os.path.exists(self.users_base_path):
            return kundlis
        
        try:
            for user_dir in os.listdir(self.users_base_path):
                user_path = os.path.join(self.users_base_path, user_dir)
                
                if not os.path.isdir(user_path):
                    continue
                
                # Read kundli index if exists
                index_file = os.path.join(user_path, 'kundli_index.json')
                if os.path.exists(index_file):
                    try:
                        with open(index_file, 'r') as f:
                            index_data = json.load(f)
                            for kundli_entry in index_data.get('kundlis', []):
                                kundli_entry['userId'] = user_dir
                                kundli_entry['userName'] = user_dir
                                kundli_entry['userEmail'] = f'{user_dir}@local.user'
                                kundlis.append(kundli_entry)
                    except Exception as e:
                        logger.error(f"Error reading kundli index for {user_dir}: {str(e)}")
        
        except Exception as e:
            logger.error(f"Error scanning kundlis: {str(e)}")
        
        return kundlis
    
    def compute_analytics_overview(self) -> Dict[str, Any]:
        """Compute dashboard overview metrics from filesystem"""
        users = self.get_all_users_from_filesystem()
        kundlis = self.get_all_kundlis_from_filesystem()
        
        total_users = len(users)
        active_users = len([u for u in users if (datetime.utcnow() - u.get('createdAt', datetime.utcnow())).days <= 30])
        total_kundlis = len(kundlis)
        total_tokens_used = sum(u.get('tokenUsage', {}).get('total', 0) for u in users)
        with_analysis = len([k for k in kundlis if k.get('hasAnalysis', False)])
        
        return {
            'totalUsers': total_users,
            'activeUsers': active_users,
            'totalKundlis': total_kundlis,
            'totalTokensUsed': total_tokens_used,
            'kundlisWithAnalysis': with_analysis,
            'kundlisWithoutAnalysis': total_kundlis - with_analysis,
            'averageKundlisPerUser': round(total_kundlis / total_users, 2) if total_users > 0 else 0,
            'timestamp': datetime.utcnow().isoformat()
        }
    
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

def get_analytics_service(users_path: str = '/app/users') -> AdminAnalyticsService:
    """Get or create analytics service instance"""
    global _analytics_service
    if _analytics_service is None:
        _analytics_service = AdminAnalyticsService(users_path)
    return _analytics_service
