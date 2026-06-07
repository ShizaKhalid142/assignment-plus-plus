import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

export default function TeacherGradingQueue() {
  const [submissionId, setSubmissionId] = useState(1);
  const [draft, setDraft] = useState<any>(null);
  const [score, setScore] = useState(80);
  const [message, setMessage] = useState('');

  async function loadDraft(event: FormEvent) {
    event.preventDefault();
    const data = await apiFetch('/ai/grade-draft', { method: 'POST', body: JSON.stringify({ submission_id: submissionId }) });
    setDraft(data);
  }

  async function saveGrade() {
    await apiFetch('/grades', { method: 'POST', body: JSON.stringify({ submission_id: submissionId, score, status: 'final' }) });
    setMessage('Grade saved');
  }

  return (
    <div className="space-y-4">
      <form className="card max-w-md space-y-3" onSubmit={loadDraft}>
        <h1 className="text-xl font-semibold text-navy-900">Grading Queue</h1>
        <input className="w-full rounded-xl border px-3 py-2" type="number" min={1} value={submissionId} onChange={(e) => setSubmissionId(Number(e.target.value))} />
        <button className="btn-primary w-full">Load AI Draft</button>
      </form>
      {draft && (
        <div className="card space-y-2">
          <p className="text-sm text-slate-700">AI Draft Score: {draft.total_score ?? 'N/A'}</p>
          <p className="text-sm text-slate-700">AI Feedback: {draft.overall_feedback || 'No feedback'}</p>
          <input className="rounded-xl border px-3 py-2" type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} />
          <button className="btn-primary" onClick={saveGrade} type="button">Accept / Override Grade</button>
          {message && <p className="text-sm text-emerald-700">{message}</p>}
        </div>
      )}
    </div>
  );
}
