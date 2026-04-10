from fastapi import HTTPException, status, Depends
from firebase_admin import auth
import logging

logger = logging.getLogger(__name__)


async def verify_admin_token(token: str) -> dict:
    """Verify Firebase token and check admin role"""
    try:
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token.get('uid')

        # Check for admin claim (can be at top level or in custom_claims)
        is_admin = decoded_token.get('admin', False)
        if not is_admin:
            custom_claims = decoded_token.get('custom_claims', {})
            is_admin = custom_claims.get('admin', False)

        logger.info(f"Token verification - UID: {user_id}, Admin: {is_admin}, Claims: {decoded_token}")

        if not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have admin privileges"
            )

        return {
            'uid': user_id,
            'email': decoded_token.get('email'),
            'is_admin': is_admin
        }
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )


def get_admin_user(authorization: str = None) -> dict:
    """Dependency to get current admin user from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization scheme"
            )
        return token
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
