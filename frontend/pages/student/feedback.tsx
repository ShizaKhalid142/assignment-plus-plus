import { useEffect, useState } from 'react';

import GradeDisplay from '../../components/GradeDisplay';

type Submission = { id: number; student_name: string; grade: number | null; feedback: string | null };

export default function StudentFeedback() {
  const [items, setItems] = useState<Submission[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/submissions')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Feedback & Grades</h1>
      {items.map((s) => (
        <div key={s.id} className="card">
          <p className="font-medium">Submission #{s.id} - {s.student_name}</p>
          <p>Grade: <GradeDisplay grade={s.grade} /></p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{s.feedback || 'No feedback yet'}</p>
        </div>
      ))}
    </div>
  );
}
