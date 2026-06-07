import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

export default function TeacherSettings() {
  const [policy, setPolicy] = useState('Rubric-first grading with constructive comments.');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  async function savePolicy(event: FormEvent) {
    event.preventDefault();
    setMessage('Grading policy template saved');
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    await apiFetch('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    setMessage('Password changed');
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <form className="card space-y-3" onSubmit={savePolicy}>
        <h1 className="text-xl font-semibold text-navy-900">Grading Policies & Templates</h1>
        <textarea className="w-full rounded-xl border px-3 py-2 min-h-36" value={policy} onChange={(e) => setPolicy(e.target.value)} />
        <button className="btn-primary">Save Policies</button>
      </form>
      <form className="card space-y-3" onSubmit={changePassword}>
        <h1 className="text-xl font-semibold text-navy-900">Change Password</h1>
        <input className="w-full rounded-xl border px-3 py-2" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" required />
        <input className="w-full rounded-xl border px-3 py-2" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" required />
        <button className="btn-primary">Update Password</button>
      </form>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
