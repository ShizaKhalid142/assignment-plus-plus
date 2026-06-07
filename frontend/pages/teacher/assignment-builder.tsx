import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

export default function AssignmentBuilder() {
  const [courseId, setCourseId] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await apiFetch('/assignments', {
      method: 'POST',
      body: JSON.stringify({
        course_id: courseId,
        title,
        description,
        due_date: dueDate || null,
        rubric: [
          { criterion: 'Correctness', points: 40 },
          { criterion: 'Code Quality', points: 30 },
          { criterion: 'Documentation', points: 30 }
        ]
      })
    });
    setMessage('Assignment created');
  }

  return (
    <div className="card space-y-3 max-w-3xl">
      <h1 className="text-2xl font-bold text-navy-900">Assignment Builder</h1>
      <p className="text-sm text-slate-600">Create or edit assignments with rubric designer defaults.</p>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-xl border px-3 py-2" type="number" min={1} value={courseId} onChange={(e) => setCourseId(Number(e.target.value))} placeholder="Course ID" />
        <input className="w-full rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" required />
        <textarea className="w-full rounded-xl border px-3 py-2 min-h-32" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Assignment description" required />
        <input className="w-full rounded-xl border px-3 py-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button className="btn-primary">Save Assignment</button>
      </form>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
