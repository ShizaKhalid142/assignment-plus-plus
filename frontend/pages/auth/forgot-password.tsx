import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const data = await apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    setMessage(data.message);
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold text-navy-900">Forgot Password</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <button className="btn-primary w-full">Request Reset</button>
      </form>
      {message && <p className="text-sm text-emerald-700 mt-2">{message}</p>}
    </div>
  );
}
