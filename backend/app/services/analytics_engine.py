"""Analytics and reporting helper service.

TODO: Add trend analysis, cohort benchmarking, and predictive insights.
"""

from __future__ import annotations

from app.core.state import InMemoryStore


class AnalyticsEngine:
    """Computes summary metrics from the current in-memory dataset."""

    def build_dashboard(self, store: InMemoryStore) -> dict[str, int]:
        """Return simple counts for dashboard widgets."""

        graded = sum(1 for submission in store.submissions.values() if submission.grade is not None)
        return {
            "courses": len(store.courses),
            "assignments": len(store.assignments),
            "submissions": len(store.submissions),
            "graded_submissions": graded,
        }
