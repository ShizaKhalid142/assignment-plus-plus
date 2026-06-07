"""Rubric-based grading service.

TODO: Integrate an LLM grader and model-based rubric interpretation.
"""

from __future__ import annotations

from app.models.domain import Rubric, Submission


class GradingEngine:
    """Computes scores from rubric criteria using simple deterministic rules."""

    def grade_submission(self, submission: Submission, rubric: Rubric) -> tuple[float, dict[str, float], str]:
        """Grade a submission and return total score, criterion scores, and feedback text."""

        content = submission.content.lower()
        scores: dict[str, float] = {}

        if not rubric.criteria:
            # If no criteria are defined, give full credit as a temporary safe default.
            return rubric.total_points, {"overall": rubric.total_points}, "No rubric criteria provided."

        for criterion in rubric.criteria:
            # Beginner-friendly heuristic: award full points when criterion name appears in text,
            # otherwise partial credit for having substantial submission content.
            name_in_text = criterion.name.lower() in content
            substantial_text = len(content.split()) > 40
            earned = criterion.max_points if name_in_text else (criterion.max_points * 0.5 if substantial_text else criterion.max_points * 0.2)
            scores[criterion.name] = round(earned, 2)

        total_earned = min(sum(scores.values()), rubric.total_points)
        comments = (
            "Automated rubric draft completed. "
            "TODO: Replace with AI-assisted explanation and richer formative feedback."
        )
        return round(total_earned, 2), scores, comments
