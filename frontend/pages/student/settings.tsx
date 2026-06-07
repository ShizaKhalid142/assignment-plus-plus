import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

export default function StudentSettings() {
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onUpdateProfile(event: FormEvent) {
    event.preventDefault();
    await apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify({ name }) });
    setMessage('Profile updated');
  }

  async function onChangePassword(event: FormEvent) {
    event.preventDefault();
    await apiFetch('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    setMessage('Password changed');
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <form className="card space-y-3" onSubmit={onUpdateProfile}>
        <h1 className="text-xl font-semibold text-navy-900">Update Profile</h1>
        <input className="w-full rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="New username" />
        <button className="btn-primary">Save Profile</button>
      </form>
      <form className="card space-y-3" onSubmit={onChangePassword}>
        <h1 className="text-xl font-semibold text-navy-900">Change Password</h1>
        <input className="w-full rounded-xl border px-3 py-2" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" required />
        <input className="w-full rounded-xl border px-3 py-2" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" required />
        <button className="btn-primary">Change Password</button>
      </form>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
