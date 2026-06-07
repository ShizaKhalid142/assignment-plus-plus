import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const data = await apiFetch<{ access_token: string; role: 'student' | 'teacher' }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      saveSession(data.access_token, data.role);
      router.push(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to login');
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold text-navy-900">Login</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-xl border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn-primary w-full">Log In</button>
      </form>
      <p className="text-xs text-slate-500 mt-3">Demo teacher: teacher@assignmentpp.com / Teacher123</p>
      <p className="text-xs text-slate-500">Demo student: student@assignmentpp.com / Student123</p>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
