import { useState } from 'react';

type GradingResult = {
  total_score: number;
  max_score: number;
  overall_feedback: string;
  model: string;
  criteria?: Array<{ criterion: string; score: number; max_points: number; feedback: string }>;
};

export default function TeacherGrading() {
  const [submissionId, setSubmissionId] = useState(0);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState('');

  async function runGrading() {
    if (submissionId <= 0) {
      setError('Enter a valid submission ID.');
      return;
    }
    setError('');
    const res = await fetch('http://localhost:8000/api/grades/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: submissionId })
    });
    setResult(await res.json());
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">AI Grading Interface</h1>
      <div className="card flex flex-wrap items-center gap-3">
        <input type="number" min={1} value={submissionId || ''} onChange={(e) => setSubmissionId(Number(e.target.value))} className="rounded border px-3 py-2 bg-transparent" placeholder="Submission ID" />
        <button onClick={runGrading} className="rounded bg-brand-600 text-white px-4 py-2">Run AI Grading</button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {result && <pre className="card overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
