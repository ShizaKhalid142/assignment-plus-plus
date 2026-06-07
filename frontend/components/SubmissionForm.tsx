import { FormEvent, useState } from 'react';

export default function SubmissionForm({ assignmentId = 1 }: { assignmentId?: number }) {
  const [studentName, setStudentName] = useState('');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignment_id: assignmentId, student_name: studentName, content, file_name: fileName || null })
    });
    const data = await res.json();
    setMessage(data.message || 'Submitted');
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3">
      <h3 className="font-semibold">Submit Assignment</h3>
      <input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full rounded border px-3 py-2 bg-transparent" placeholder="Your name" required />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full rounded border px-3 py-2 min-h-32 bg-transparent" placeholder="Paste solution or notes" required />
      <input type="file" className="w-full text-sm" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
      <button className="rounded bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 transition">Submit</button>
      {message && <p className="text-sm text-emerald-600">{message}</p>}
    </form>
  );
}
