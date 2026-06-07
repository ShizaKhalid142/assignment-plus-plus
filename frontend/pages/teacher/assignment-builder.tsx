import { FormEvent, useState } from 'react';

export default function AssignmentBuilder() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      description,
      due_date: '2026-06-20',
      rubric: [
        { criterion: 'Correctness', points: 40 },
        { criterion: 'Code Quality', points: 35 },
        { criterion: 'Documentation', points: 25 }
      ]
    };
    const res = await fetch('http://localhost:8000/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setMessage(data.message || 'Created');
  }

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-3">
      <h1 className="text-2xl font-bold">Assignment Builder</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="w-full rounded border px-3 py-2 bg-transparent" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full rounded border px-3 py-2 min-h-28 bg-transparent" required />
      <button className="rounded bg-brand-600 text-white px-4 py-2">Create Assignment</button>
      {message && <p className="text-emerald-600 text-sm">{message}</p>}
    </form>
  );
}
