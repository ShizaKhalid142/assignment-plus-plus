import { FormEvent, useState } from 'react';

import FileUpload from '../../components/FileUpload';
import { apiFetch } from '../../lib/api';

export default function StudentSubmit() {
  const [content, setContent] = useState('');
  const [assignmentId, setAssignmentId] = useState(1);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await apiFetch<{ id: number; message: string }>('/submissions', {
      method: 'POST',
      body: JSON.stringify({ assignment_id: assignmentId, content, file_name: fileName || null })
    });
    setMessage(`${response.message} (#${response.id})`);
  }

  return (
    <div className="card max-w-3xl">
      <h1 className="text-2xl font-bold text-navy-900">Submission Page</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-xl border px-3 py-2" type="number" min={1} value={assignmentId} onChange={(e) => setAssignmentId(Number(e.target.value))} placeholder="Assignment ID" />
        <textarea className="w-full rounded-xl border px-3 py-2 min-h-32" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your draft or final response" required />
        <FileUpload onFileSelect={setFileName} />
        <button className="btn-primary">Submit Assignment</button>
      </form>
      {message && <p className="text-sm text-emerald-700 mt-3">{message}</p>}
    </div>
  );
}
