export default function FeedbackCard({
  score,
  comments,
  plagiarism
}: {
  score?: number;
  comments?: string;
  plagiarism?: string | null;
}) {
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-navy-900">Grade & Feedback</h3>
        <span className="text-3xl">🏅</span>
      </div>
      <p className="mt-2 text-sm">Score: <strong>{score ?? 'Pending'}</strong></p>
      <p className="mt-2 text-sm text-slate-700">{comments || 'No feedback yet.'}</p>
      <p className="mt-2 text-xs text-slate-500">Plagiarism: {plagiarism || 'No report available'}</p>
    </div>
  );
}
