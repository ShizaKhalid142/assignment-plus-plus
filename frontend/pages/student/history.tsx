import { useEffect, useState } from 'react';

import SubmissionCard from '../../components/SubmissionCard';
import { apiFetch } from '../../lib/api';

type Submission = { id: number; file_name?: string; created_at?: string; draft_feedback?: string | null };

export default function StudentHistory() {
  const [items, setItems] = useState<Submission[]>([]);

  useEffect(() => {
    apiFetch<Submission[]>('/submissions').then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-navy-900">Submission History</h1>
      <div className="grid md:grid-cols-2 gap-4">{items.map((item) => <SubmissionCard key={item.id} submission={item} />)}</div>
    </div>
  );
}
