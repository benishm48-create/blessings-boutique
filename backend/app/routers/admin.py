from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from .. import schemas
from ..security import (
    bearer_scheme,
    create_admin_token,
    require_admin_token,
    verify_admin_credentials,
)

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.post(
    "/login",
    response_model=schemas.AdminToken,
)
def admin_login(payload: schemas.AdminLogin):
    if not verify_admin_credentials(
        payload.username,
        payload.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = create_admin_token(payload.username)

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me")
def admin_me(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
):
    username = require_admin_token(credentials)

    return {
        "username": username,
        "role": "admin",
    }