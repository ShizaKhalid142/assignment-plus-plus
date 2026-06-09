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
        <h3 className="text-lg font-semibold text-white/90">Grade & Feedback</h3>
        <span className="text-3xl">🏅</span>
      </div>
      <p className="mt-2 text-sm text-white/70">Score: <strong>{score ?? 'Pending'}</strong></p>
      <p className="mt-2 text-sm text-white/70">{comments || 'No feedback yet.'}</p>
      <p className="mt-2 text-xs text-white/50">Plagiarism: {plagiarism || 'No report available'}</p>
    </div>
  );
}
