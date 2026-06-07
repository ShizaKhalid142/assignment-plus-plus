from __future__ import annotations

import json
from typing import Any

from openai import OpenAI

from app.core.config import get_settings

settings = get_settings()


def _heuristic_grade(submission_text: str, rubric: list[dict[str, Any]]) -> dict[str, Any]:
    total = sum(float(item.get("points", 0)) for item in rubric) or 100
    length_factor = min(len(submission_text.strip()) / 800, 1)
    score = round(total * (0.55 + (0.45 * length_factor)), 2)
    return {
        "total_score": score,
        "max_score": total,
        "criteria": [
            {
                "criterion": item.get("criterion", "General"),
                "score": round(float(item.get("points", 0)) * (0.55 + 0.45 * length_factor), 2),
                "max_points": float(item.get("points", 0)),
                "feedback": "Fallback heuristic applied because OpenAI API key is dummy/missing.",
            }
            for item in rubric
        ],
        "overall_feedback": "Good attempt. Add clearer structure and examples to improve score.",
        "model": "heuristic-fallback",
    }


def grade_submission_with_ai(submission_text: str, rubric: list[dict[str, Any]]) -> dict[str, Any]:
    if not settings.openai_api_key or "dummy" in settings.openai_api_key.lower():
        return _heuristic_grade(submission_text, rubric)

    client = OpenAI(api_key=settings.openai_api_key)
    prompt = {
        "task": "Grade this student submission using the rubric.",
        "rubric": rubric,
        "submission": submission_text,
        "output_format": {
            "total_score": "number",
            "max_score": "number",
            "criteria": [
                {
                    "criterion": "string",
                    "score": "number",
                    "max_points": "number",
                    "feedback": "string",
                }
            ],
            "overall_feedback": "string",
        },
    }

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a strict but fair grading assistant."},
            {"role": "user", "content": json.dumps(prompt)},
        ],
    )
    content = completion.choices[0].message.content or "{}"
    parsed = json.loads(content)
    parsed["model"] = "gpt-4o-mini"
    return parsed
