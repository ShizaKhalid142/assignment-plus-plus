import { useEffect, useState } from 'react';

import AssignmentCard from '../../components/AssignmentCard';
import { apiFetch } from '../../lib/api';

type Assignment = { id: number; title: string; description: string; due_date?: string };

export default function StudentAssignments() {
  const [items, setItems] = useState<Assignment[]>([]);

  useEffect(() => {
    apiFetch<Assignment[]>('/assignments').then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-navy-900">Course Assignments</h1>
      <div className="grid md:grid-cols-2 gap-4">{items.map((a) => <AssignmentCard key={a.id} title={a.title} description={a.description} dueDate={a.due_date} />)}</div>
    </div>
  );
}
