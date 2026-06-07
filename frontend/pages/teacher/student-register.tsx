import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

export default function TeacherStudentRegister() {
  const [courseId, setCourseId] = useState(1);
  const [idNumber, setIdNumber] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const data = await apiFetch<{ message: string }>(`/courses/${courseId}/register-student`, {
      method: 'POST',
      body: JSON.stringify({ id_number: idNumber })
    });
    setMessage(data.message);
  }

  return (
    <form className="card max-w-md space-y-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-navy-900">Register Student by ID</h1>
      <input className="w-full rounded-xl border px-3 py-2" type="number" min={1} value={courseId} onChange={(e) => setCourseId(Number(e.target.value))} />
      <input className="w-full rounded-xl border px-3 py-2" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Student ID Number" required />
      <button className="btn-primary w-full">Register Student</button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </form>
  );
}
