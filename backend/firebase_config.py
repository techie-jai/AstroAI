import os
import json
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
from dotenv import load_dotenv

load_dotenv()


class FirebaseConfig:
    """Firebase configuration and initialization"""
    
    _db = None
    _auth = None
    _storage = None
    _initialized = False
    
    @classmethod
    def initialize(cls):
        """Initialize Firebase Admin SDK"""
        if cls._initialized:
            return
        
        firebase_credentials_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        
        if not firebase_credentials_path:
            raise ValueError(
                "FIREBASE_CREDENTIALS_PATH environment variable not set. "
                "Please provide path to Firebase service account JSON file."
            )
        
        if not os.path.exists(firebase_credentials_path):
            raise FileNotFoundError(
                f"Firebase credentials file not found: {firebase_credentials_path}"
            )
        
        try:
            cred = credentials.Certificate(firebase_credentials_path)
            storage_bucket = os.getenv('FIREBASE_STORAGE_BUCKET')
            
            config = {}
            if storage_bucket:
                config['storageBucket'] = storage_bucket
            
            firebase_admin.initialize_app(cred, config)
            
            cls._db = firestore.client()
            cls._auth = auth
            
            try:
                cls._storage = storage.bucket()
            except Exception as e:
                print(f"⚠️ Firebase Storage not available: {str(e)}")
                cls._storage = None
            
            cls._initialized = True
            
            print("✅ Firebase initialized successfully")
        except Exception as e:
            print(f"⚠️ Firebase initialization warning: Failed to initialize Firebase: {str(e)}")
            cls._initialized = True
    
    @classmethod
    def get_db(cls):
        """Get Firestore database instance"""
        if not cls._initialized:
            cls.initialize()
        return cls._db
    
    @classmethod
    def get_auth(cls):
        """Get Firebase Auth instance"""
        if not cls._initialized:
            cls.initialize()
        return cls._auth
    
    @classmethod
    def get_storage(cls):
        """Get Firebase Storage bucket"""
        if not cls._initialized:
            cls.initialize()
        return cls._storage


class FirebaseService:
    """Service for Firebase operations"""
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """
        Verify Firebase ID token
        
        Args:
            token: Firebase ID token
            
        Returns:
            Decoded token claims or None if invalid
        """
        try:
            auth_client = FirebaseConfig.get_auth()
            decoded_token = auth_client.verify_id_token(token)
            print(f"[TOKEN VERIFIED] UID: {decoded_token.get('uid')}, Email: {decoded_token.get('email')}")
            return decoded_token
        except Exception as e:
            print(f"[TOKEN VERIFICATION FAILED] Error: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    @staticmethod
    def get_user(uid: str) -> Optional[dict]:
        """Get user by UID"""
        try:
            auth_client = FirebaseConfig.get_auth()
            user = auth_client.get_user(uid)
            return {
                'uid': user.uid,
                'email': user.email,
                'display_name': user.display_name,
                'email_verified': user.email_verified
            }
        except Exception as e:
            print(f"Failed to get user: {str(e)}")
            return None
    
    @staticmethod
    def create_user_profile(uid: str, email: str, display_name: str = None) -> bool:
        """Create user profile in Firestore"""
        try:
            db = FirebaseConfig.get_db()
            db.collection('users').document(uid).set({
                'email': email,
                'display_name': display_name or email.split('@')[0],
                'created_at': firestore.SERVER_TIMESTAMP,
                'last_login': firestore.SERVER_TIMESTAMP,
                'subscription_tier': 'free',
                'total_calculations': 0
            })
            return True
        except Exception as e:
            print(f"Failed to create user profile: {str(e)}")
            return False
    
    @staticmethod
    def get_user_profile(uid: str) -> Optional[dict]:
        """Get user profile from Firestore"""
        try:
            db = FirebaseConfig.get_db()
            doc = db.collection('users').document(uid).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Failed to get user profile: {str(e)}")
            return None
    
    @staticmethod
    def update_user_profile(uid: str, data: dict) -> bool:
        """Update user profile"""
        try:
            db = FirebaseConfig.get_db()
            db.collection('users').document(uid).update({
                **data,
                'last_login': firestore.SERVER_TIMESTAMP
            })
            return True
        except Exception as e:
            print(f"Failed to update user profile: {str(e)}")
            return False
    
    @staticmethod
    def save_calculation(uid: str, calculation_data: dict) -> Optional[str]:
        """
        Save calculation to Firestore
        
        Returns:
            Calculation ID or None if failed
        """
        try:
            db = FirebaseConfig.get_db()
            doc_ref = db.collection('calculations').document()
            doc_ref.set({
                'user_id': uid,
                'birth_data': calculation_data.get('birth_data'),
                'chart_types': calculation_data.get('chart_types', []),
                'created_at': firestore.SERVER_TIMESTAMP,
                'status': 'completed',
                'result_summary': calculation_data.get('result_summary')
            })
            return doc_ref.id
        except Exception as e:
            print(f"Failed to save calculation: {str(e)}")
            return None
    
    @staticmethod
    def get_user_calculations(uid: str, limit: int = 20) -> list:
        """Get user's calculation history"""
        try:
            db = FirebaseConfig.get_db()
            docs = db.collection('calculations')\
                .where('user_id', '==', uid)\
                .stream()
            
            calculations = []
            for doc in docs:
                calc = doc.to_dict()
                calc['calculation_id'] = doc.id
                calculations.append(calc)
            
            calculations.sort(key=lambda x: x.get('created_at', ''), reverse=True)
            return calculations[:limit]
        except Exception as e:
            print(f"Failed to get calculations: {str(e)}")
            return []
    
    @staticmethod
    def _convert_keys_to_strings(obj):
        """
        Recursively convert all dictionary keys to strings for Firestore compatibility
        """
        if isinstance(obj, dict):
            return {str(k): FirebaseService._convert_keys_to_strings(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [FirebaseService._convert_keys_to_strings(item) for item in obj]
        else:
            return obj
    
    @staticmethod
    def save_kundli(uid: str, kundli_data: dict) -> Optional[str]:
        """
        Save complete kundli data to Firestore for LLM access
        
        Args:
            uid: User ID
            kundli_data: Complete kundli data including horoscope_info
            
        Returns:
            Kundli ID or None if failed
        """
        try:
            db = FirebaseConfig.get_db()
            doc_ref = db.collection('kundlis').document()
            
            # Ensure all values are properly typed
            kundli_id = str(kundli_data.get('kundli_id', ''))
            unique_id = str(kundli_data.get('unique_id', ''))
            user_folder = str(kundli_data.get('user_folder', ''))
            generated_at = str(kundli_data.get('generated_at', ''))
            
            if not kundli_id or not unique_id:
                print(f"Failed to save kundli: Missing required fields (kundli_id or unique_id)")
                return None
            
            # Flatten horoscope_info to exclude large nested objects (ashtakavarga, dashas)
            # to avoid exceeding Firestore document size limits
            horoscope_info_raw = kundli_data.get('horoscope_info', {})
            horoscope_info_flat = {}
            for key, value in horoscope_info_raw.items():
                # Only include simple types (strings, numbers, booleans)
                # Exclude complex nested structures
                if isinstance(value, (str, int, float, bool, type(None))):
                    horoscope_info_flat[key] = value
            
            print(f"[FIREBASE] Original horoscope_info keys: {len(horoscope_info_raw)}, Flattened keys: {len(horoscope_info_flat)}")
            
            # Convert all dictionary keys to strings for Firestore compatibility
            horoscope_info = FirebaseService._convert_keys_to_strings(horoscope_info_flat)
            charts = FirebaseService._convert_keys_to_strings(kundli_data.get('charts', {}))
            birth_data = FirebaseService._convert_keys_to_strings(kundli_data.get('birth_data', {}))
            
            doc_ref.set({
                'user_id': uid,
                'kundli_id': kundli_id,
                'birth_data': birth_data,
                'horoscope_info': horoscope_info,
                'chart_types': kundli_data.get('chart_types', []),
                'charts': charts,
                'generated_at': generated_at,
                'created_at': firestore.SERVER_TIMESTAMP,
                'user_folder': user_folder,
                'unique_id': unique_id
            })
            print(f"[FIREBASE] Kundli saved successfully: {doc_ref.id}")
            return doc_ref.id
        except Exception as e:
            print(f"Failed to save kundli: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    @staticmethod
    def get_kundli(uid: str, kundli_id: str) -> Optional[dict]:
        """
        Retrieve kundli data from Firestore
        
        Args:
            uid: User ID
            kundli_id: Kundli ID
            
        Returns:
            Kundli data dictionary or None if not found
        """
        try:
            db = FirebaseConfig.get_db()
            # Ensure kundli_id is a string
            kundli_id_str = str(kundli_id)
            
            docs = db.collection('kundlis')\
                .where('user_id', '==', uid)\
                .where('kundli_id', '==', kundli_id_str)\
                .stream()
            
            for doc in docs:
                kundli = doc.to_dict()
                kundli['firebase_id'] = doc.id
                horoscope_info = kundli.get('horoscope_info', {})
                print(f"[GET_KUNDLI] Retrieved horoscope_info with {len(horoscope_info)} keys: {list(horoscope_info.keys())[:10]}")
                return kundli
            
            print(f"[GET_KUNDLI] No kundli found for kundli_id: {kundli_id_str}")
            return None
        except Exception as e:
            print(f"Failed to get kundli: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    @staticmethod
    def get_user_kundlis(uid: str, limit: int = 50) -> list:
        """
        Get all kundlis for a user
        
        Args:
            uid: User ID
            limit: Maximum number of kundlis to return
            
        Returns:
            List of kundli documents
        """
        try:
            db = FirebaseConfig.get_db()
            docs = db.collection('kundlis')\
                .where('user_id', '==', uid)\
                .order_by('created_at', direction=firestore.Query.DESCENDING)\
                .limit(limit)\
                .stream()
            
            kundlis = []
            for doc in docs:
                kundli = doc.to_dict()
                kundli['firebase_id'] = doc.id
                kundlis.append(kundli)
            
            return kundlis
        except Exception as e:
            print(f"Failed to get user kundlis: {str(e)}")
            return []
    
    @staticmethod
    def save_analysis(uid: str, kundli_id: str, analysis_data: dict) -> Optional[str]:
        """
        Save analysis to Firestore
        
        Returns:
            Analysis ID or None if failed
        """
        try:
            db = FirebaseConfig.get_db()
            doc_ref = db.collection('analyses').document()
            doc_ref.set({
                'user_id': uid,
                'kundli_id': kundli_id,
                'analysis_text': analysis_data.get('analysis_text'),
                'analysis_type': analysis_data.get('analysis_type', 'comprehensive'),
                'created_at': firestore.SERVER_TIMESTAMP,
                'pdf_path': analysis_data.get('pdf_path')
            })
            return doc_ref.id
        except Exception as e:
            print(f"Failed to save analysis: {str(e)}")
            return None
    
    @staticmethod
    def upload_file(uid: str, file_path: str, destination_path: str) -> Optional[str]:
        """
        Upload file to Firebase Storage
        
        Args:
            uid: User ID
            file_path: Local file path
            destination_path: Destination path in storage
            
        Returns:
            Public URL or None if failed
        """
        try:
            bucket = FirebaseConfig.get_storage()
            blob = bucket.blob(f"users/{uid}/{destination_path}")
            blob.upload_from_filename(file_path)
            blob.make_public()
            return blob.public_url
        except Exception as e:
            print(f"Failed to upload file: {str(e)}")
            return None
