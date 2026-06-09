type Submission = { id: number; file_name?: string; created_at?: string; draft_feedback?: string | null };

export default function SubmissionCard({ submission }: { submission: Submission }) {
  return (
    <div className="card">
      <div className="flex justify-between">
        <h4 className="font-semibold text-white/90">Submission #{submission.id}</h4>
        <span className="text-2xl">📤</span>
      </div>
      <p className="text-sm text-white/60 mt-2">File: {submission.file_name || 'N/A'}</p>
      <p className="text-sm text-white/60">Created: {submission.created_at ? new Date(submission.created_at).toLocaleString() : '-'}</p>
      {submission.draft_feedback && <p className="mt-2 text-sm text-white/70">Draft feedback: {submission.draft_feedback}</p>}
    </div>
  );
}
