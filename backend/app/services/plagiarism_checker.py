"""Plagiarism scoring service.

TODO: Replace local text similarity with ML/vector and web-scale checks.
"""

from __future__ import annotations

from difflib import SequenceMatcher

from app.models.domain import Submission


class PlagiarismChecker:
    """Compares submission text similarity using difflib as an MVP baseline."""

    def check_submission(self, target: Submission, others: list[Submission]) -> tuple[float, list[int]]:
        """Return highest similarity score and matching submission IDs."""

        if not others:
            return 0.0, []

        highest = 0.0
        matched_ids: list[int] = []

        for other in others:
            if other.submission_id == target.submission_id:
                continue
            ratio = SequenceMatcher(None, target.content, other.content).ratio() * 100
            if ratio > highest:
                highest = ratio
            if ratio >= 70.0:
                matched_ids.append(other.submission_id)

        return round(highest, 2), matched_ids
