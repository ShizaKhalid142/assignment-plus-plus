from __future__ import annotations

from fastapi.testclient import TestClient

from backend.main import app


def login_as(client: TestClient, role: str) -> str:
    credentials = {
        "teacher": ("teacher@assignmentpp.com", "Teacher123"),
        "student": ("student@assignmentpp.com", "Student123"),
        "admin": ("admin@assignmentpp.com", "Admin123"),
    }
    email, password = credentials[role]
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200, f"Login failed as {role}"
    return resp.json()["access_token"]


def test_plagiarism_self_check():
    client = TestClient(app)
    token = login_as(client, "student")
    resp = client.post("/api/submissions/self-check", json={
        "content": "This is a test submission with original content for checking.",
        "assignment_id": 1,
    }, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert "plagiarism_score" in data
    assert "risk_level" in data


def test_rubric_template_crud():
    client = TestClient(app)
    token = login_as(client, "teacher")

    # Create
    resp = client.post("/api/rubrics", json={
        "title": "Test Rubric",
        "criteria": [
            {"criterion": "Quality", "points": 50, "notes": "How good"},
            {"criterion": "Speed", "points": 50, "notes": "How fast"},
        ],
    }, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    rubric_id = resp.json()["id"]

    # List
    resp = client.get("/api/rubrics", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    rubrics = resp.json()
    assert any(r["id"] == rubric_id for r in rubrics)

    # Get
    resp = client.get(f"/api/rubrics/{rubric_id}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["title"] == "Test Rubric"

    # Delete
    resp = client.delete(f"/api/rubrics/{rubric_id}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200


def test_policy_endpoints():
    client = TestClient(app)
    token = login_as(client, "teacher")

    # Create submission policy
    resp = client.post("/api/policies/submission", json={
        "assignment_id": 1,
        "allowed_resources": "Course notes only",
        "hint_only_mode": True,
        "citation_required": True,
    }, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code in (200, 400)  # 400 if already exists

    # Get policy
    resp = client.get("/api/policies/submission/1", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200

    # List grading policies
    resp = client.get("/api/policies/grading", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_peer_review_flow():
    client = TestClient(app)
    token = login_as(client, "student")

    # List reviews for a submission
    resp = client.get("/api/peer-reviews/1", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200

    # Get stats
    resp = client.get("/api/peer-reviews/1/stats", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert "review_count" in data


def test_export_endpoint():
    client = TestClient(app)
    token = login_as(client, "teacher")
    resp = client.post("/api/export", json={
        "course_id": 1,
        "format": "json",
    }, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code in (200, 404)  # 404 if course_id 1 not owned
