from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from firebase_config import FirebaseService

security = HTTPBearer()


async def verify_token(credentials: HTTPAuthCredentials = Depends(security)):
    """
    Verify Firebase token from Authorization header
    
    Args:
        credentials: HTTP Bearer credentials
        
    Returns:
        Decoded token claims
    """
    token = credentials.credentials
    decoded = FirebaseService.verify_token(token)
    
    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return decoded


async def get_current_user(decoded_token: dict = Depends(verify_token)):
    """
    Get current authenticated user
    
    Args:
        decoded_token: Decoded Firebase token
        
    Returns:
        User information dictionary
    """
    uid = decoded_token.get('uid')
    email = decoded_token.get('email')
    
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing uid"
        )
    
    return {
        'uid': uid,
        'email': email,
        'token': decoded_token
    }
