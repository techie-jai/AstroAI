from typing import Dict, Any, Optional, List
from firebase_config import FirebaseService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class BotFirebaseService:
    """Firebase service for bot user management and session persistence"""
    
    @staticmethod
    def save_bot_user(phone_number: str, platform: str, user_data: Dict[str, Any]) -> str:
        """Save or update bot user profile"""
        try:
            user_doc = {
                'phone_number': phone_number,
                'platform': platform,
                'name': user_data.get('name', ''),
                'created_at': datetime.utcnow().isoformat(),
                'last_activity': datetime.utcnow().isoformat(),
                'status': 'active',
                'metadata': user_data.get('metadata', {})
            }
            
            doc_id = f"{platform}_{phone_number}"
            FirebaseService.db.collection('bot_users').document(doc_id).set(user_doc, merge=True)
            
            logger.info(f"Bot user saved: {doc_id}")
            return doc_id
        except Exception as e:
            logger.error(f"Failed to save bot user: {str(e)}")
            raise
    
    @staticmethod
    def get_bot_user(phone_number: str, platform: str) -> Optional[Dict[str, Any]]:
        """Get bot user profile"""
        try:
            doc_id = f"{platform}_{phone_number}"
            doc = FirebaseService.db.collection('bot_users').document(doc_id).get()
            
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Failed to get bot user: {str(e)}")
            return None
    
    @staticmethod
    def save_bot_session(user_id: str, session_data: Dict[str, Any]) -> str:
        """Save bot conversation session"""
        try:
            session_doc = {
                'user_id': user_id,
                'platform': session_data.get('platform'),
                'state': session_data.get('state'),
                'birth_data': session_data.get('birth_data', {}),
                'kundli_data': session_data.get('kundli_data'),
                'chat_history': session_data.get('chat_history', []),
                'created_at': session_data.get('created_at'),
                'last_activity': session_data.get('last_activity'),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            FirebaseService.db.collection('bot_sessions').document(user_id).set(session_doc, merge=True)
            
            logger.info(f"Bot session saved: {user_id}")
            return user_id
        except Exception as e:
            logger.error(f"Failed to save bot session: {str(e)}")
            raise
    
    @staticmethod
    def get_bot_session(user_id: str) -> Optional[Dict[str, Any]]:
        """Get bot conversation session"""
        try:
            doc = FirebaseService.db.collection('bot_sessions').document(user_id).get()
            
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Failed to get bot session: {str(e)}")
            return None
    
    @staticmethod
    def delete_bot_session(user_id: str) -> bool:
        """Delete bot session (for reset)"""
        try:
            FirebaseService.db.collection('bot_sessions').document(user_id).delete()
            logger.info(f"Bot session deleted: {user_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete bot session: {str(e)}")
            return False
    
    @staticmethod
    def link_bot_user_to_firebase_user(phone_number: str, platform: str, firebase_uid: str) -> bool:
        """Link bot user (phone number) to Firebase user (UID)"""
        try:
            link_doc = {
                'phone_number': phone_number,
                'platform': platform,
                'firebase_uid': firebase_uid,
                'linked_at': datetime.utcnow().isoformat()
            }
            
            doc_id = f"{platform}_{phone_number}"
            FirebaseService.db.collection('bot_user_links').document(doc_id).set(link_doc)
            
            logger.info(f"Bot user linked to Firebase: {doc_id} -> {firebase_uid}")
            return True
        except Exception as e:
            logger.error(f"Failed to link bot user: {str(e)}")
            return False
    
    @staticmethod
    def get_firebase_uid_from_bot_user(phone_number: str, platform: str) -> Optional[str]:
        """Get Firebase UID from bot user (phone number)"""
        try:
            doc_id = f"{platform}_{phone_number}"
            doc = FirebaseService.db.collection('bot_user_links').document(doc_id).get()
            
            if doc.exists:
                return doc.to_dict().get('firebase_uid')
            return None
        except Exception as e:
            logger.error(f"Failed to get Firebase UID: {str(e)}")
            return None
    
    @staticmethod
    def save_bot_message_log(user_id: str, platform: str, message: Dict[str, Any]) -> str:
        """Log bot message for analytics and debugging"""
        try:
            log_doc = {
                'user_id': user_id,
                'platform': platform,
                'role': message.get('role'),
                'content': message.get('content'),
                'timestamp': datetime.utcnow().isoformat()
            }
            
            doc_ref = FirebaseService.db.collection('bot_message_logs').document()
            doc_ref.set(log_doc)
            
            return doc_ref.id
        except Exception as e:
            logger.error(f"Failed to save message log: {str(e)}")
            return ""
    
    @staticmethod
    def get_bot_user_kundlis(phone_number: str, platform: str) -> List[Dict[str, Any]]:
        """Get all kundlis generated by a bot user"""
        try:
            query = FirebaseService.db.collection('bot_kundlis').where(
                'phone_number', '==', phone_number
            ).where(
                'platform', '==', platform
            ).order_by('created_at', direction='DESCENDING')
            
            docs = query.stream()
            kundlis = []
            
            for doc in docs:
                kundlis.append({
                    'id': doc.id,
                    **doc.to_dict()
                })
            
            return kundlis
        except Exception as e:
            logger.error(f"Failed to get bot user kundlis: {str(e)}")
            return []
    
    @staticmethod
    def save_bot_kundli(phone_number: str, platform: str, kundli_data: Dict[str, Any]) -> str:
        """Save kundli generated via bot"""
        try:
            kundli_doc = {
                'phone_number': phone_number,
                'platform': platform,
                'birth_data': kundli_data.get('birth_data', {}),
                'horoscope_info': kundli_data.get('horoscope_info', {}),
                'charts': kundli_data.get('charts', {}),
                'created_at': datetime.utcnow().isoformat()
            }
            
            doc_ref = FirebaseService.db.collection('bot_kundlis').document()
            doc_ref.set(kundli_doc)
            
            logger.info(f"Bot kundli saved: {doc_ref.id}")
            return doc_ref.id
        except Exception as e:
            logger.error(f"Failed to save bot kundli: {str(e)}")
            return ""
    
    @staticmethod
    def get_bot_stats(platform: str = None) -> Dict[str, Any]:
        """Get bot usage statistics"""
        try:
            stats = {
                'total_users': 0,
                'total_sessions': 0,
                'total_kundlis': 0,
                'total_messages': 0,
                'by_platform': {}
            }
            
            platforms = [platform] if platform else ['whatsapp', 'telegram']
            
            for plat in platforms:
                plat_stats = {
                    'users': 0,
                    'sessions': 0,
                    'kundlis': 0,
                    'messages': 0
                }
                
                # Count users
                users_query = FirebaseService.db.collection('bot_users').where(
                    'platform', '==', plat
                )
                plat_stats['users'] = len(list(users_query.stream()))
                
                # Count kundlis
                kundlis_query = FirebaseService.db.collection('bot_kundlis').where(
                    'platform', '==', plat
                )
                plat_stats['kundlis'] = len(list(kundlis_query.stream()))
                
                # Count message logs
                messages_query = FirebaseService.db.collection('bot_message_logs').where(
                    'platform', '==', plat
                )
                plat_stats['messages'] = len(list(messages_query.stream()))
                
                stats['by_platform'][plat] = plat_stats
                stats['total_users'] += plat_stats['users']
                stats['total_kundlis'] += plat_stats['kundlis']
                stats['total_messages'] += plat_stats['messages']
            
            return stats
        except Exception as e:
            logger.error(f"Failed to get bot stats: {str(e)}")
            return {}
    
    @staticmethod
    def verify_phone_number(phone_number: str, platform: str, otp: str) -> bool:
        """Verify phone number with OTP (future enhancement)"""
        try:
            # This is a placeholder for future OTP verification
            # In production, you would:
            # 1. Generate OTP and send via platform
            # 2. Store OTP in temporary collection
            # 3. Verify OTP when user provides it
            
            logger.info(f"Phone verification requested: {platform}_{phone_number}")
            return True
        except Exception as e:
            logger.error(f"Failed to verify phone: {str(e)}")
            return False
