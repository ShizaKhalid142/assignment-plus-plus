import { FormEvent, useState } from 'react';

import FeedbackCard from '../../components/FeedbackCard';
import { apiFetch } from '../../lib/api';

type Grade = { score: number };
type Feedback = { comments?: string; plagiarism_report?: string | null };

export default function StudentFeedback() {
  const [submissionId, setSubmissionId] = useState(1);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function load(event: FormEvent) {
    event.preventDefault();
    const [gradeData, feedbackData] = await Promise.all([
      apiFetch<Grade>(`/grades/${submissionId}`).catch(() => ({ score: 0 })),
      apiFetch<Feedback>(`/feedback/${submissionId}`).catch(() => ({ comments: 'No feedback yet', plagiarism_report: null }))
    ]);
    setGrade(gradeData);
    setFeedback(feedbackData);
  }

  return (
    <div className="space-y-4">
      <form className="card max-w-sm space-y-3" onSubmit={load}>
        <h1 className="text-xl font-semibold text-navy-900">Feedback View</h1>
        <input className="w-full rounded-xl border px-3 py-2" type="number" min={1} value={submissionId} onChange={(e) => setSubmissionId(Number(e.target.value))} />
        <button className="btn-primary w-full">Load Feedback</button>
      </form>
      <FeedbackCard score={grade?.score} comments={feedback?.comments} plagiarism={feedback?.plagiarism_report} />
    </div>
  );
}
