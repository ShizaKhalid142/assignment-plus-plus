from __future__ import annotations

import re
from difflib import SequenceMatcher

import requests

from app.core.config import get_settings

settings = get_settings()


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def _token_set(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-zA-Z0-9_]+", text.lower()) if len(t) > 2}


def _conceptual_similarity(a: str, b: str) -> float:
    ta, tb = _token_set(a), _token_set(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


def check_plagiarism(submission_text: str, reference_texts: list[str]) -> dict:
    submission = _normalize(submission_text)
    reference_texts = reference_texts or []
    checks = []

    for idx, ref in enumerate(reference_texts):
        normalized_ref = _normalize(ref)
        direct = SequenceMatcher(None, submission, normalized_ref).ratio()
        conceptual = _conceptual_similarity(submission, normalized_ref)
        combined = round((direct * 0.6 + conceptual * 0.4) * 100, 2)
        checks.append(
            {
                "reference_index": idx,
                "direct_similarity": round(direct * 100, 2),
                "conceptual_similarity": round(conceptual * 100, 2),
                "combined_similarity": combined,
            }
        )

    external_result = None
    if settings.plagiarism_api_url:
        try:
            headers = {}
            if settings.plagiarism_api_key:
                headers["X-API-Key"] = settings.plagiarism_api_key
            response = requests.post(
                settings.plagiarism_api_url,
                json={"text": submission_text},
                headers=headers,
                timeout=8,
            )
            response.raise_for_status()
            external_result = response.json()
        except Exception as exc:  # noqa: BLE001
            _ = exc
            external_result = {"warning": "External plagiarism API unavailable."}

    highest = max([c["combined_similarity"] for c in checks], default=0.0)
    external_score = float(external_result.get("similarity", 0)) if isinstance(external_result, dict) else 0.0
    plagiarism_score = round(max(highest, external_score), 2)
    risk = "high" if plagiarism_score >= 70 else "medium" if plagiarism_score >= 40 else "low"

    return {
        "plagiarism_score": plagiarism_score,
        "risk_level": risk,
        "matches": checks,
        "external_check": external_result,
        "summary": f"Plagiarism risk is {risk} with max similarity {plagiarism_score}%.",
    }
