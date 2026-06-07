import { FormEvent, useState } from 'react';

import SubmissionCard from '../../components/SubmissionCard';
import { apiFetch } from '../../lib/api';

type Submission = { id: number; file_name?: string; created_at?: string; draft_feedback?: string };

export default function TeacherSubmissions() {
  const [assignmentId, setAssignmentId] = useState(1);
  const [items, setItems] = useState<Submission[]>([]);

  async function search(event: FormEvent) {
    event.preventDefault();
    const data = await apiFetch<Submission[]>(`/submissions?assignment_id=${assignmentId}`).catch(() => []);
    setItems(data);
  }

  return (
    <div className="space-y-4">
      <form className="card max-w-sm space-y-3" onSubmit={search}>
        <h1 className="text-xl font-semibold text-navy-900">Submissions View</h1>
        <input className="w-full rounded-xl border px-3 py-2" type="number" min={1} value={assignmentId} onChange={(e) => setAssignmentId(Number(e.target.value))} />
        <button className="btn-primary w-full">Search</button>
      </form>
      <div className="grid md:grid-cols-2 gap-4">{items.map((item) => <SubmissionCard key={item.id} submission={item} />)}</div>
    </div>
  );
}
