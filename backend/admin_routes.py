from fastapi import APIRouter, HTTPException, status, Header, Query
from typing import Optional, Dict
import logging
from admin_service import AdminService
from admin_auth import verify_admin_token
from firebase_config import FirebaseConfig

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])


def get_admin_service():
    """Get admin service instance"""
    return AdminService(FirebaseConfig.get_db())


@router.post("/auth/verify")
async def verify_admin(authorization: str = Header(None)):
    """Verify admin token"""
    try:
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing"
            )

        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)
        return {"success": True, "user": admin_user}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Admin verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Verification failed"
        )


@router.get("/users")
async def get_users(
    authorization: str = Header(None),
    limit: int = Query(50),
    offset: int = Query(0),
    search: str = Query(""),
    role: Optional[str] = Query(None),
    isBlocked: Optional[bool] = Query(None)
):
    """Get all users with pagination and filtering"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        filters = {}
        if role:
            filters['role'] = role
        if isBlocked is not None:
            filters['isBlocked'] = isBlocked

        result = service.get_all_users(limit=limit, offset=offset, search=search, filters=filters)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/users/{user_id}")
async def get_user_detail(
    user_id: str,
    authorization: str = Header(None)
):
    """Get detailed user profile"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        user = service.get_user_detail(user_id)
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user detail: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put("/users/{user_id}")
async def update_user(
    user_id: str,
    updates: Dict,
    authorization: str = Header(None)
):
    """Update user information"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        result = service.update_user(user_id, updates)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/users/{user_id}/block")
async def block_user(
    user_id: str,
    block: bool = True,
    authorization: str = Header(None)
):
    """Block or unblock a user"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        result = service.block_user(user_id, block)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error blocking user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    authorization: str = Header(None)
):
    """Delete user and all associated data"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        result = service.delete_user(user_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/users/{user_id}/reset-password")
async def reset_password(
    user_id: str,
    authorization: str = Header(None)
):
    """Reset user password"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        result = service.reset_user_password(user_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/kundlis")
async def get_kundlis(
    authorization: str = Header(None),
    limit: int = Query(50),
    offset: int = Query(0),
    user_id: Optional[str] = Query(None),
    hasAnalysis: Optional[bool] = Query(None)
):
    """Get all kundlis with filtering"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        filters = {}
        if user_id:
            filters['userId'] = user_id
        if hasAnalysis is not None:
            filters['hasAnalysis'] = hasAnalysis

        result = service.get_all_kundlis(limit=limit, offset=offset, filters=filters)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching kundlis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/kundlis/{user_id}/{kundli_id}")
async def get_kundli_detail(
    user_id: str,
    kundli_id: str,
    authorization: str = Header(None)
):
    """Get detailed kundli information"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        kundli = service.get_kundli_detail(user_id, kundli_id)
        return kundli
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching kundli detail: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/kundlis/{user_id}/{kundli_id}")
async def delete_kundli(
    user_id: str,
    kundli_id: str,
    authorization: str = Header(None)
):
    """Delete a kundli"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        result = service.delete_kundli(user_id, kundli_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting kundli: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/analytics/overview")
async def get_analytics_overview(authorization: str = Header(None)):
    """Get dashboard overview metrics"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        analytics = service.get_analytics_overview()
        return analytics
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching analytics overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/analytics/user-growth")
async def get_user_growth(
    authorization: str = Header(None),
    days: int = Query(30)
):
    """Get user growth analytics"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        analytics = service.get_user_growth_analytics(days)
        return {'data': analytics}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user growth analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/analytics/usage")
async def get_usage_analytics(authorization: str = Header(None)):
    """Get feature usage analytics"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        analytics = service.get_usage_analytics()
        return analytics
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching usage analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/analytics/tokens")
async def get_token_analytics(authorization: str = Header(None)):
    """Get token usage analytics"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        analytics = service.get_token_usage_analytics()
        return analytics
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching token analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/system/health")
async def get_system_health(authorization: str = Header(None)):
    """Get system health metrics"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        health = service.get_system_health()
        return health
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching system health: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/logs")
async def get_admin_logs(
    authorization: str = Header(None),
    limit: int = Query(100),
    offset: int = Query(0)
):
    """Get admin action logs"""
    try:
        token = authorization.replace("Bearer ", "")
        admin_user = await verify_admin_token(token)

        service = get_admin_service()
        logs = service.get_admin_logs(limit, offset)
        return logs
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching admin logs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
