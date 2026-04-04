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
        print("[AUTH] Missing authorization header")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        print(f"[AUTH] Invalid header format: {authorization[:50]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = parts[1]
    print(f"[AUTH] Verifying token: {token[:20]}...")
    decoded = FirebaseService.verify_token(token)
    
    if not decoded:
        print("[AUTH] Token verification returned None")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"[AUTH] Token verified successfully for user: {decoded.get('uid')}")
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
