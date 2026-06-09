from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def teacher_token(client: TestClient):
    resp = client.post("/api/auth/login", json={
        "email": "teacher@assignmentpp.com",
        "password": "Teacher123",
    })
    return resp.json()["access_token"]


@pytest.fixture
def student_token(client: TestClient):
    resp = client.post("/api/auth/login", json={
        "email": "student@assignmentpp.com",
        "password": "Student123",
    })
    return resp.json()["access_token"]


@pytest.fixture
def admin_token(client: TestClient):
    resp = client.post("/api/auth/login", json={
        "email": "admin@assignmentpp.com",
        "password": "Admin123",
    })
    return resp.json()["access_token"]
