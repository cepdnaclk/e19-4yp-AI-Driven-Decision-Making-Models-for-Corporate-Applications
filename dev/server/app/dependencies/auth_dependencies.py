from fastapi import Depends, HTTPException, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth_helpers.auth import SECRET_KEY, ALGORITHM

from fastapi import Header, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.auth_helpers.auth import Auth

security = HTTPBearer()

class AuthDependencies:
    def __init__(self):
        pass

    async def get_current_user(self, authorization: HTTPAuthorizationCredentials = Depends(security)):
        # authorization is an object with .scheme and .credentials
        if authorization.scheme.lower() != "bearer":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")

        token = authorization.credentials
        payload = Auth.verify_access_token(token)

        if not payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token or expired")

        # Extract user_id, role etc from payload
        return payload

    def require_role(self, role: str):
        async def role_checker(user=Depends(self.get_current_user)):
            if user.get("role") != role:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
            return user
        return role_checker

