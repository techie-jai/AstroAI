from fastapi import Depends, HTTPException, status, Header
from firebase_config import FirebaseService
from typing import Optional


async def verify_token(authorization: Optional[str] = Header(None)):
    """
    Verify Firebase token from Authorization header
    
    Args:
        authorization: Authorization header value
        
    Returns:
        Decoded token claims
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = parts[1]
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
