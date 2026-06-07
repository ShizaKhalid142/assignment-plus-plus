import { useEffect, useState } from 'react';

import RubricDisplay from '../../components/RubricDisplay';
import { apiFetch } from '../../lib/api';

type Assignment = {
  id: number;
  title: string;
  description: string;
  due_date?: string;
  resources?: string;
  rubric: { criterion: string; points: number; notes?: string }[];
};

export default function StudentAssignmentDetail() {
  const [item, setItem] = useState<Assignment | null>(null);

  useEffect(() => {
    apiFetch<Assignment[]>('/assignments').then((data) => setItem(data[0] || null)).catch(() => setItem(null));
  }, []);

  if (!item) return <div className="card">No assignment selected.</div>;

  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-2xl font-bold text-navy-900">{item.title}</h1>
        <p className="text-sm text-slate-700 mt-2">{item.description}</p>
        <p className="text-sm text-navy-900 mt-2">Due Date: {item.due_date || 'TBD'}</p>
        <p className="text-sm text-slate-700 mt-2">Allowed Resources: {item.resources || 'Course notes and official docs only'}</p>
      </div>
      <RubricDisplay rubric={item.rubric || []} />
    </div>
  );
}
