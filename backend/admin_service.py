from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from firebase_admin import firestore
from google.cloud.firestore import FieldFilter
import logging

logger = logging.getLogger(__name__)


class AdminService:
    """Service for admin operations"""

    def __init__(self, db):
        self.db = db

    def get_all_users(self, limit: int = 50, offset: int = 0, search: str = "", filters: Dict = None) -> Dict:
        """Get all users with pagination and filtering"""
        try:
            query = self.db.collection('users')

            if search:
                query = query.where(filter=FieldFilter('displayName', '>=', search))
                query = query.where(filter=FieldFilter('displayName', '<=', search + '\uf8ff'))

            if filters:
                if filters.get('role'):
                    query = query.where(filter=FieldFilter('role', '==', filters['role']))
                if filters.get('isBlocked') is not None:
                    query = query.where(filter=FieldFilter('isBlocked', '==', filters['isBlocked']))

            total = len(query.stream())
            users = []

            for doc in query.offset(offset).limit(limit).stream():
                user_data = doc.to_dict()
                user_data['uid'] = doc.id
                users.append(user_data)

            return {
                'users': users,
                'total': total,
                'limit': limit,
                'offset': offset
            }
        except Exception as e:
            logger.error(f"Error fetching users: {str(e)}")
            raise

    def get_user_detail(self, user_id: str) -> Dict:
        """Get detailed user profile with kundli history"""
        try:
            user_doc = self.db.collection('users').document(user_id).get()
            if not user_doc.exists:
                raise ValueError(f"User {user_id} not found")

            user_data = user_doc.to_dict()
            user_data['uid'] = user_id

            kundlis = self.db.collection('users').document(user_id).collection('calculations').stream()
            kundli_list = []
            for kundli in kundlis:
                kundli_data = kundli.to_dict()
                kundli_data['id'] = kundli.id
                kundli_list.append(kundli_data)

            user_data['kundlis'] = kundli_list
            user_data['kundliCount'] = len(kundli_list)

            return user_data
        except Exception as e:
            logger.error(f"Error fetching user detail: {str(e)}")
            raise

    def update_user(self, user_id: str, updates: Dict) -> Dict:
        """Update user information"""
        try:
            allowed_fields = ['displayName', 'email', 'photoURL', 'subscription']
            filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}

            self.db.collection('users').document(user_id).update(filtered_updates)
            self.log_admin_action('update_user', user_id, {'updates': filtered_updates})

            return self.get_user_detail(user_id)
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            raise

    def block_user(self, user_id: str, block: bool = True) -> Dict:
        """Block or unblock a user"""
        try:
            self.db.collection('users').document(user_id).update({
                'isBlocked': block,
                'blockedAt': datetime.utcnow() if block else None
            })
            self.log_admin_action('block_user' if block else 'unblock_user', user_id, {})

            return {'success': True, 'message': f"User {'blocked' if block else 'unblocked'} successfully"}
        except Exception as e:
            logger.error(f"Error blocking user: {str(e)}")
            raise

    def delete_user(self, user_id: str) -> Dict:
        """Delete user and all associated data"""
        try:
            user_doc = self.db.collection('users').document(user_id).get()
            if not user_doc.exists:
                raise ValueError(f"User {user_id} not found")

            user_data = user_doc.to_dict()

            kundlis = self.db.collection('users').document(user_id).collection('calculations').stream()
            for kundli in kundlis:
                kundli.reference.delete()

            self.db.collection('users').document(user_id).delete()
            self.log_admin_action('delete_user', user_id, {'email': user_data.get('email')})

            return {'success': True, 'message': f"User {user_id} deleted successfully"}
        except Exception as e:
            logger.error(f"Error deleting user: {str(e)}")
            raise

    def reset_user_password(self, user_id: str) -> Dict:
        """Reset user password (requires Firebase Admin SDK)"""
        try:
            from firebase_admin import auth
            user = auth.get_user(user_id)
            auth.set_custom_claims(user_id, {'password_reset_required': True})
            self.log_admin_action('reset_password', user_id, {'email': user.email})

            return {'success': True, 'message': f"Password reset initiated for {user.email}"}
        except Exception as e:
            logger.error(f"Error resetting password: {str(e)}")
            raise

    def get_all_kundlis(self, limit: int = 50, offset: int = 0, filters: Dict = None) -> Dict:
        """Get all kundlis with filtering"""
        try:
            all_kundlis = []
            users = self.db.collection('users').stream()

            for user in users:
                user_id = user.id
                user_data = user.to_dict()
                kundlis = self.db.collection('users').document(user_id).collection('calculations').stream()

                for kundli in kundlis:
                    kundli_data = kundli.to_dict()
                    kundli_data['id'] = kundli.id
                    kundli_data['userId'] = user_id
                    kundli_data['userName'] = user_data.get('displayName', 'Unknown')
                    kundli_data['userEmail'] = user_data.get('email', '')

                    if filters:
                        if filters.get('userId') and filters['userId'] != user_id:
                            continue
                        if filters.get('hasAnalysis') is not None:
                            has_analysis = 'analysis' in kundli_data and kundli_data['analysis'] is not None
                            if filters['hasAnalysis'] != has_analysis:
                                continue

                    all_kundlis.append(kundli_data)

            all_kundlis.sort(key=lambda x: x.get('generatedAt', datetime.utcnow()), reverse=True)
            total = len(all_kundlis)
            paginated = all_kundlis[offset:offset + limit]

            return {
                'kundlis': paginated,
                'total': total,
                'limit': limit,
                'offset': offset
            }
        except Exception as e:
            logger.error(f"Error fetching kundlis: {str(e)}")
            raise

    def get_kundli_detail(self, user_id: str, kundli_id: str) -> Dict:
        """Get detailed kundli information"""
        try:
            kundli_doc = self.db.collection('users').document(user_id).collection('calculations').document(kundli_id).get()
            if not kundli_doc.exists:
                raise ValueError(f"Kundli {kundli_id} not found")

            kundli_data = kundli_doc.to_dict()
            kundli_data['id'] = kundli_id

            user_doc = self.db.collection('users').document(user_id).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                kundli_data['userName'] = user_data.get('displayName', 'Unknown')
                kundli_data['userEmail'] = user_data.get('email', '')

            return kundli_data
        except Exception as e:
            logger.error(f"Error fetching kundli detail: {str(e)}")
            raise

    def delete_kundli(self, user_id: str, kundli_id: str) -> Dict:
        """Delete a kundli"""
        try:
            self.db.collection('users').document(user_id).collection('calculations').document(kundli_id).delete()
            self.log_admin_action('delete_kundli', user_id, {'kundli_id': kundli_id})

            return {'success': True, 'message': f"Kundli {kundli_id} deleted successfully"}
        except Exception as e:
            logger.error(f"Error deleting kundli: {str(e)}")
            raise

    def get_analytics_overview(self) -> Dict:
        """Get dashboard overview metrics"""
        try:
            users = list(self.db.collection('users').stream())
            total_users = len(users)

            active_users_count = 0
            total_kundlis = 0
            total_tokens_used = 0

            for user in users:
                user_data = user.to_dict()
                if user_data.get('lastLogin'):
                    last_login = user_data['lastLogin']
                    if isinstance(last_login, datetime):
                        days_since = (datetime.utcnow() - last_login).days
                        if days_since <= 30:
                            active_users_count += 1

                kundlis = list(self.db.collection('users').document(user.id).collection('calculations').stream())
                total_kundlis += len(kundlis)

                token_usage = user_data.get('tokenUsage', {})
                if isinstance(token_usage, dict):
                    total_tokens_used += token_usage.get('total', 0)

            return {
                'totalUsers': total_users,
                'activeUsers': active_users_count,
                'totalKundlis': total_kundlis,
                'totalTokensUsed': total_tokens_used,
                'averageKundlisPerUser': round(total_kundlis / total_users, 2) if total_users > 0 else 0,
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error fetching analytics overview: {str(e)}")
            raise

    def get_user_growth_analytics(self, days: int = 30) -> List[Dict]:
        """Get user growth data for the last N days"""
        try:
            users = list(self.db.collection('users').stream())
            date_counts = {}

            for user in users:
                user_data = user.to_dict()
                created_at = user_data.get('createdAt')

                if created_at:
                    if isinstance(created_at, datetime):
                        date_key = created_at.date().isoformat()
                    else:
                        date_key = created_at.isoformat()[:10]

                    date_counts[date_key] = date_counts.get(date_key, 0) + 1

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

            return result[-days:] if len(result) > days else result
        except Exception as e:
            logger.error(f"Error fetching user growth analytics: {str(e)}")
            raise

    def get_usage_analytics(self) -> Dict:
        """Get feature usage analytics"""
        try:
            users = list(self.db.collection('users').stream())
            feature_usage = {
                'kundliGeneration': 0,
                'analysis': 0,
                'chat': 0,
                'pdfDownload': 0
            }

            for user in users:
                user_id = user.id
                kundlis = list(self.db.collection('users').document(user_id).collection('calculations').stream())

                for kundli in kundlis:
                    kundli_data = kundli.to_dict()
                    feature_usage['kundliGeneration'] += 1

                    if kundli_data.get('analysis'):
                        feature_usage['analysis'] += 1
                    if kundli_data.get('pdfGenerated'):
                        feature_usage['pdfDownload'] += 1

            total_features = sum(feature_usage.values())
            percentages = {k: round((v / total_features * 100), 2) if total_features > 0 else 0 for k, v in feature_usage.items()}

            return {
                'usage': feature_usage,
                'percentages': percentages,
                'total': total_features
            }
        except Exception as e:
            logger.error(f"Error fetching usage analytics: {str(e)}")
            raise

    def get_token_usage_analytics(self) -> Dict:
        """Get token/credit usage analytics"""
        try:
            users = list(self.db.collection('users').stream())
            total_tokens = 0
            users_by_usage = []

            for user in users:
                user_data = user.to_dict()
                token_usage = user_data.get('tokenUsage', {})

                if isinstance(token_usage, dict):
                    user_tokens = token_usage.get('total', 0)
                    total_tokens += user_tokens
                    users_by_usage.append({
                        'userId': user.id,
                        'userName': user_data.get('displayName', 'Unknown'),
                        'tokensUsed': user_tokens,
                        'monthlyUsage': token_usage.get('monthly', 0)
                    })

            users_by_usage.sort(key=lambda x: x['tokensUsed'], reverse=True)

            return {
                'totalTokensUsed': total_tokens,
                'topUsers': users_by_usage[:10],
                'averagePerUser': round(total_tokens / len(users), 2) if users else 0,
                'allUsers': users_by_usage
            }
        except Exception as e:
            logger.error(f"Error fetching token usage analytics: {str(e)}")
            raise

    def get_system_health(self) -> Dict:
        """Get system health metrics"""
        try:
            users_count = len(list(self.db.collection('users').stream()))
            kundlis_count = 0

            for user in self.db.collection('users').stream():
                kundlis_count += len(list(self.db.collection('users').document(user.id).collection('calculations').stream()))

            return {
                'status': 'healthy',
                'timestamp': datetime.utcnow().isoformat(),
                'metrics': {
                    'totalUsers': users_count,
                    'totalKundlis': kundlis_count,
                    'databaseStatus': 'connected',
                    'apiStatus': 'operational'
                }
            }
        except Exception as e:
            logger.error(f"Error fetching system health: {str(e)}")
            return {
                'status': 'unhealthy',
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e)
            }

    def log_admin_action(self, action: str, target_user_id: str = None, details: Dict = None, admin_id: str = None):
        """Log admin actions for audit trail"""
        try:
            log_entry = {
                'action': action,
                'targetUserId': target_user_id,
                'adminId': admin_id,
                'details': details or {},
                'timestamp': datetime.utcnow(),
                'ipAddress': 'local'
            }

            self.db.collection('admin_logs').add(log_entry)
        except Exception as e:
            logger.error(f"Error logging admin action: {str(e)}")

    def get_admin_logs(self, limit: int = 100, offset: int = 0) -> Dict:
        """Get admin action logs"""
        try:
            logs = list(self.db.collection('admin_logs').order_by('timestamp', direction=firestore.Query.DESCENDING).stream())
            total = len(logs)
            paginated_logs = []

            for log in logs[offset:offset + limit]:
                log_data = log.to_dict()
                log_data['id'] = log.id
                paginated_logs.append(log_data)

            return {
                'logs': paginated_logs,
                'total': total,
                'limit': limit,
                'offset': offset
            }
        except Exception as e:
            logger.error(f"Error fetching admin logs: {str(e)}")
            raise
