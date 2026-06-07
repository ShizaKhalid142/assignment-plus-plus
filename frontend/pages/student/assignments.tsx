import { useEffect, useState } from 'react';

import AssignmentCard from '../../components/AssignmentCard';

type Assignment = { id: number; title: string; description: string; due_date?: string };

export default function StudentAssignments() {
  const [items, setItems] = useState<Assignment[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/assignments')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Available Assignments</h1>
      <div className="grid md:grid-cols-2 gap-4">{items.map((a) => <AssignmentCard key={a.id} title={a.title} description={a.description} dueDate={a.due_date} />)}</div>
    </div>
  );
}
