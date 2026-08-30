import hmac
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import settings


bearer_scheme = HTTPBearer(auto_error=False)


# -------------------------------------------------
# Existing API-key protection
# -------------------------------------------------
def require_admin_key(
    x_admin_key: str | None = Header(
        default=None,
        alias="X-Admin-Key",
    ),
) -> None:
    if not settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin API is not configured",
        )

    if not x_admin_key or not hmac.compare_digest(
        x_admin_key,
        settings.ADMIN_API_KEY,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
        )


# -------------------------------------------------
# Admin username/password verification
# -------------------------------------------------
def verify_admin_credentials(
    username: str,
    password: str,
) -> bool:
    if not settings.ADMIN_PASSWORD_HASH:
        return False

    username_valid = hmac.compare_digest(
        username,
        settings.ADMIN_USERNAME,
    )

    try:
        password_valid = bcrypt.checkpw(
            password.encode("utf-8"),
            settings.ADMIN_PASSWORD_HASH.encode("utf-8"),
        )
    except (ValueError, TypeError):
        password_valid = False

    return username_valid and password_valid


# -------------------------------------------------
# Create JWT token
# -------------------------------------------------
def create_admin_token(username: str) -> str:
    if not settings.JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="JWT authentication is not configured",
        )

    now = datetime.now(timezone.utc)

    payload = {
        "sub": username,
        "role": "admin",
        "iat": now,
        "exp": now
        + timedelta(
            minutes=settings.JWT_EXPIRE_MINUTES
        ),
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


# -------------------------------------------------
# Verify JWT token
# -------------------------------------------------
def require_admin_token(
    credentials: HTTPAuthorizationCredentials | None,
) -> str:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin login required",
        )

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication type",
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin session expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )

    username = payload.get("sub")
    role = payload.get("role")

    if (
        username != settings.ADMIN_USERNAME
        or role != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )

    return username

def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
) -> str:
    return require_admin_token(credentials)