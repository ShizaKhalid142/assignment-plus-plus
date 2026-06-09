from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


class TestHealth:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

    def test_api_docs_accessible(self):
        response = client.get("/docs")
        assert response.status_code == 200

    def test_openapi_schema(self):
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "paths" in schema
        # Verify all route groups exist
        tags = {tag["name"] for tag in schema.get("tags", [])}
        expected = {"auth", "courses", "assignments", "submissions", "grades",
                    "feedback", "notifications", "ai", "plagiarism", "hints",
                    "dashboard", "policies", "export", "peer-reviews", "files",
                    "websocket", "rubrics", "admin"}
        missing = expected - tags
        assert not missing, f"Missing route groups: {missing}"
