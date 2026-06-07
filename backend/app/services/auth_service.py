"""Authentication service skeleton.

TODO: Implement JWT/OAuth2 and password hashing with secure storage.
"""

from __future__ import annotations


class AuthenticationService:
    """Very small token utility for local demos and development."""

    def create_demo_token(self, user_id: int, role: str) -> str:
        """Create a human-readable demo token.

        WARNING: This is not secure and exists only as a placeholder.
        """

        return f"demo-token:user={user_id}:role={role}"

    def validate_demo_token(self, token: str) -> bool:
        """Validate placeholder token format."""

        return token.startswith("demo-token:")
