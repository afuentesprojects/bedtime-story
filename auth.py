"""
Authentication utilities for Bedtime Story Generator

Handles password hashing and session token generation.
Uses werkzeug (included with Flask) for secure password hashing.
"""

import secrets
from werkzeug.security import generate_password_hash, check_password_hash


def hash_password(password: str) -> str:
    """Hash a password for secure storage."""
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash."""
    return check_password_hash(password_hash, password)


def generate_token() -> str:
    """Generate a secure random session token."""
    return secrets.token_hex(32)  # 64 character hex string
