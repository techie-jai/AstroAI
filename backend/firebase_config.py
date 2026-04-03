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
            firebase_admin.initialize_app(cred, {
                'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
            })
            
            cls._db = firestore.client()
            cls._auth = auth
            cls._storage = storage.bucket()
            cls._initialized = True
            
            print("✅ Firebase initialized successfully")
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Firebase: {str(e)}")
    
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
