import os
import time
import json
import base64
import hmac
import hashlib
from urllib.parse import urlencode, quote
from typing import Optional

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

# Load environment variables
load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "opticai_super_secret_jwt_key_2026_production")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

router = APIRouter(prefix="/auth", tags=["Authentication"])

# User info response model
class UserInfo(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None

class AuthResponse(BaseModel):
    authenticated: bool
    user: Optional[UserInfo] = None


# --- Secure Base64URL & JWT Utility Functions ---
def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def _base64url_decode(data: str) -> bytes:
    padding = '=' * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode(data + padding)

def create_jwt_token(payload: dict, expires_in_seconds: int = 7 * 24 * 3600) -> str:
    """Create an HMAC-SHA256 signed JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload_copy = payload.copy()
    payload_copy["exp"] = int(time.time()) + expires_in_seconds
    payload_copy["iat"] = int(time.time())

    header_bytes = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_bytes = json.dumps(payload_copy, separators=(',', ':')).encode('utf-8')

    encoded_header = _base64url_encode(header_bytes)
    encoded_payload = _base64url_encode(payload_bytes)

    signing_input = f"{encoded_header}.{encoded_payload}".encode('utf-8')
    signature = hmac.new(JWT_SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    encoded_signature = _base64url_encode(signature)

    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def verify_jwt_token(token: str) -> Optional[dict]:
    """Verify and decode an HMAC-SHA256 signed JWT token."""
    if not token or not isinstance(token, str):
        return None

    parts = token.strip().split('.')
    if len(parts) != 3:
        return None

    encoded_header, encoded_payload, encoded_signature = parts

    # Verify signature
    signing_input = f"{encoded_header}.{encoded_payload}".encode('utf-8')
    expected_signature = hmac.new(JWT_SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    expected_encoded_signature = _base64url_encode(expected_signature)

    if not hmac.compare_digest(encoded_signature, expected_encoded_signature):
        return None

    # Decode payload
    try:
        payload_bytes = _base64url_decode(encoded_payload)
        payload = json.loads(payload_bytes.decode('utf-8'))

        # Check expiration
        if "exp" in payload and payload["exp"] < time.time():
            return None

        return payload
    except Exception:
        return None


def get_current_user_from_request(request: Request) -> Optional[UserInfo]:
    """Extract authenticated user from Authorization header, cookie, or query param."""
    token = None

    # 1. Check Authorization header (Bearer <token>)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()

    # 2. Check Cookie
    if not token:
        token = request.cookies.get("optic_token")

    # 3. Check Query Param (optional fallback)
    if not token:
        token = request.query_params.get("token")

    if not token:
        return None

    payload = verify_jwt_token(token)
    if not payload or "sub" not in payload:
        return None

    return UserInfo(
        id=payload.get("sub", ""),
        email=payload.get("email", ""),
        name=payload.get("name", "Google User"),
        picture=payload.get("picture")
    )


# --- 1. GET /auth/google/login ---
@router.get("/google/login")
def google_login():
    """Redirect user to Google OAuth2 consent screen."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_ID is not configured in backend environment."
        )

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }

    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=google_auth_url, status_code=307)


# --- 2. GET /auth/google/callback ---
@router.get("/google/callback")
def google_callback(code: Optional[str] = None, error: Optional[str] = None):
    """Receive Google OAuth response, exchange code for user info, generate token, and redirect to frontend."""
    if error:
        error_url = f"{FRONTEND_URL}/?auth_error={quote(error)}"
        return RedirectResponse(url=error_url, status_code=307)

    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code from Google.")

    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google OAuth credentials not configured.")

    # 1. Exchange authorization code for tokens
    token_endpoint = "https://oauth2.googleapis.com/token"
    token_payload = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    try:
        token_response = requests.post(token_endpoint, data=token_payload, timeout=10)
        token_data = token_response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to connect to Google OAuth server: {str(e)}")

    if "error" in token_data or "access_token" not in token_data:
        err_msg = token_data.get("error_description", token_data.get("error", "Token exchange failed"))
        return RedirectResponse(url=f"{FRONTEND_URL}/?auth_error={quote(err_msg)}", status_code=307)

    access_token = token_data["access_token"]

    # 2. Fetch User Profile from Google userinfo API
    userinfo_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"
    try:
        user_response = requests.get(
            userinfo_endpoint,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10
        )
        user_data = user_response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch user info from Google: {str(e)}")

    google_id = user_data.get("sub", "")
    email = user_data.get("email", "")
    name = user_data.get("name", email.split("@")[0] if email else "Google User")
    picture = user_data.get("picture", "")

    # 3. Create signed JWT token
    jwt_payload = {
        "sub": google_id,
        "email": email,
        "name": name,
        "picture": picture
    }
    jwt_token = create_jwt_token(jwt_payload)

    # 4. Redirect user to frontend workspace with token & info
    redirect_target = (
        f"{FRONTEND_URL}/workspace?auth=google"
        f"&token={quote(jwt_token)}"
        f"&name={quote(name)}"
        f"&email={quote(email)}"
        f"&picture={quote(picture)}"
    )

    response = RedirectResponse(url=redirect_target, status_code=307)
    
    # Also set secure cookie
    response.set_cookie(
        key="optic_token",
        value=jwt_token,
        max_age=7 * 24 * 3600,
        httponly=False,  # Allow frontend reading if needed
        samesite="lax",
        secure=False     # Set true in production HTTPS
    )

    return response


# --- 3. GET /auth/me ---
@router.get("/me", response_model=AuthResponse)
def get_current_user(request: Request):
    """Return currently authenticated user information."""
    user = get_current_user_from_request(request)
    if not user:
        return AuthResponse(authenticated=False, user=None)

    return AuthResponse(authenticated=True, user=user)


# --- 4. POST /auth/logout ---
@router.post("/logout")
def logout(response: Response):
    """Log out user by clearing auth cookie."""
    response.delete_cookie("optic_token")
    return {"message": "Successfully logged out.", "authenticated": False}
