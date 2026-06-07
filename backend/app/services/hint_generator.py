"""Hint generation service.

TODO: Replace template hints with context-aware LLM tutoring prompts.
"""

from __future__ import annotations


class HintGeneratorBot:
    """Produces safe, non-answer-revealing hints from draft content."""

    def generate_hint(self, assignment_title: str, student_draft: str) -> str:
        """Generate a beginner-friendly hint for a student's draft."""

        word_count = len(student_draft.split())

        if word_count < 30:
            return (
                f"Start by outlining your approach for '{assignment_title}'. "
                "Explain your assumptions before writing final details."
            )

        if "example" not in student_draft.lower():
            return "Add at least one concrete example to support your explanation."

        return "Review your conclusion and explicitly connect it back to the assignment requirements."
