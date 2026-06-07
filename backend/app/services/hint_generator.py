from __future__ import annotations

import google.generativeai as genai

from app.core.config import get_settings

settings = get_settings()


def _template_hint(question: str, context: str | None) -> str:
    base = (
        "Break the problem into smaller parts, identify inputs/outputs, then test one small step at a time. "
        "Try writing pseudocode before finalizing your answer."
    )
    if context:
        return f"Based on your context ('{context[:90]}...'), start with core concepts first. {base}"
    return f"For this question ('{question[:90]}...'), focus on the key concept first. {base}"


def generate_hint(question: str, student_context: str | None = None) -> dict[str, str]:
    if not settings.google_api_key or "dummy" in settings.google_api_key.lower():
        return {"hint": _template_hint(question, student_context), "model": "template-fallback"}

    genai.configure(api_key=settings.google_api_key)
    model = genai.GenerativeModel(settings.gemini_model)
    prompt = (
        "Generate a concise, personalized hint for this assignment question without giving away full solution.\n"
        f"Question: {question}\n"
        f"Student context: {student_context or 'none'}"
    )
    response = model.generate_content(prompt)
    return {"hint": response.text.strip(), "model": settings.gemini_model}
