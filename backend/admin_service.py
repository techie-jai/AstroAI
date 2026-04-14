from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from firebase_admin import firestore
from google.cloud.firestore import FieldFilter
import logging
from admin_analytics_service import get_analytics_service

logger = logging.getLogger(__name__)


class AdminService:
    """Service for admin operations"""

    def __init__(self, db):
        self.db = db
        self.analytics_service = get_analytics_service()

    def get_all_users(self, limit: int = 50, offset: int = 0, search: str = "", filters: Dict = None) -> Dict:
        """Get all users with pagination and filtering from Firebase"""
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

            # Convert stream to list to get total count
            all_docs = list(query.stream())
            total = len(all_docs)
            users = []

            # Apply pagination manually
            for doc in all_docs[offset:offset + limit]:
                user_data = doc.to_dict()
                user_data['uid'] = doc.id
                
                # Add kundli count from filesystem if available
                try:
                    kundli_count = self.analytics_service._count_kundlis(doc.id)
                    user_data['kundliCount'] = kundli_count
                except Exception as e:
                    logger.warning(f"Could not get kundli count for user {doc.id}: {str(e)}")
                    user_data['kundliCount'] = 0
                
                users.append(user_data)

            return {
                'users': users,
                'total': total,
                'limit': limit,
                'offset': offset
            }
        except Exception as e:
            logger.error(f"Error fetching users: {str(e)}")
            # Return empty list instead of raising
            return {
                'users': [],
                'total': 0,
                'limit': limit,
                'offset': offset
            }

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
        """Get dashboard overview metrics from local filesystem"""
        try:
            return self.analytics_service.compute_analytics_overview()
        except Exception as e:
            logger.error(f"Error fetching analytics overview: {str(e)}")
            raise

    def get_user_growth_analytics(self, days: int = 30) -> List[Dict]:
        """Get user growth data for the last N days from local filesystem"""
        try:
            return self.analytics_service.compute_user_growth_analytics(days)
        except Exception as e:
            logger.error(f"Error fetching user growth analytics: {str(e)}")
            raise

    def get_usage_analytics(self) -> Dict:
        """Get feature usage analytics from local filesystem"""
        try:
            return self.analytics_service.compute_usage_analytics()
        except Exception as e:
            logger.error(f"Error fetching usage analytics: {str(e)}")
            raise

    def get_token_usage_analytics(self) -> Dict:
        """Get token/credit usage analytics from local filesystem"""
        try:
            return self.analytics_service.compute_token_usage_analytics()
        except Exception as e:
            logger.error(f"Error fetching token usage analytics: {str(e)}")
            raise

    def get_system_health(self) -> Dict:
        """Get system health metrics from local filesystem"""
        try:
            return self.analytics_service.compute_system_health()
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
