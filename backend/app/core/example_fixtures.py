"""Example fixture data for demos and manual testing.

This module is intentionally simple so beginners can see expected payload shapes.
"""

EXAMPLE_COURSE = {
    "title": "Intro to Programming",
    "teacher_id": 1,
}

EXAMPLE_ASSIGNMENT = {
    "course_id": 1,
    "title": "Write a Sorting Explanation",
    "description": "Explain how merge sort works in your own words.",
    "due_date": "2026-06-30T23:59:59",
    "rubric": {
        "title": "Concept Rubric",
        "total_points": 100,
        "criteria": [
            {"name": "Correctness", "max_points": 50, "description": "Accurate algorithm explanation"},
            {"name": "Clarity", "max_points": 50, "description": "Readable and structured answer"}
        ]
    }
}
