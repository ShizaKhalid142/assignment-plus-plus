from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def _login(client: TestClient, email: str, password: str) -> str:
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, f"Login failed: {response.json()}"
    return response.json()["access_token"]


class TestAuth:
    def test_register_and_login(self):
        import time
        ts = int(time.time())
        email = f"test_{ts}@example.com"

        # Register
        resp = client.post("/api/auth/register", json={
            "name": "Test User",
            "email": email,
            "password": "TestPass123",
            "role": "student",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["role"] == "student"

        # Login
        resp2 = client.post("/api/auth/login", json={
            "email": email,
            "password": "TestPass123",
        })
        assert resp2.status_code == 200

    def test_login_invalid_credentials(self):
        resp = client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "WrongPassword123",
        })
        assert resp.status_code == 401

    def test_protected_route_without_token(self):
        resp = client.get("/api/courses")
        assert resp.status_code in (401, 403)

    def test_teacher_access_protected(self):
        token = _login(client, "teacher@assignmentpp.com", "Teacher123")
        resp = client.get("/api/courses", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200

    def test_student_cannot_create_course(self):
        token = _login(client, "student@assignmentpp.com", "Student123")
        resp = client.post("/api/courses", json={
            "name": "Hack Course",
            "description": "Should fail",
            "code": "HACK101",
        }, headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 403


class TestCourses:
    def test_list_courses_as_teacher(self):
        token = _login(client, "teacher@assignmentpp.com", "Teacher123")
        resp = client.get("/api/courses", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        courses = resp.json()
        assert isinstance(courses, list)

    def test_create_and_delete_course(self):
        token = _login(client, "teacher@assignmentpp.com", "Teacher123")
        # Create
        resp = client.post("/api/courses", json={
            "name": "Test Course",
            "description": "Testing",
            "code": "TEST101",
        }, headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        course_id = resp.json()["id"]

        # Delete
        resp = client.delete(f"/api/courses/{course_id}", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
